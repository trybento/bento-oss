import { applyFinalCleanupHook } from 'src/data/datatests';
import { SlateBodyElement } from 'bento-common/types/slate';
import { StepType } from 'bento-common/types';
import { FullGuide as EmbedFullGuide } from 'bento-common/types/globalShoyuState';

import {
  completeGuide,
  createGuides,
  getDummyString,
} from 'src/testUtils/dummyDataHelpers';
import { Guide } from 'src/data/models/Guide.model';
import { Step } from 'src/data/models/Step.model';
import { Template } from 'src/data/models/Template.model';

import { setupGraphQLTestServer } from 'src/graphql/testHelpers';
import { propagateTemplateChangesInPlace } from 'src/testUtils/tests.helpers';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Module } from 'src/data/models/Module.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { ModuleStepPrototype } from 'src/data/models/ModuleStepPrototype.model';

applyFinalCleanupHook();

const graphqlTestHelpers = setupGraphQLTestServer('bento');
const { getEmbedContext, executeAdminQuery, executeEmbedQuery } =
  graphqlTestHelpers;

/**
 * Test query used within these tests.
 *
 * To be used in conjunction with {@link EmbedQueryReturnType}
 */
const testQuery = `
  query EmbedQueryTest($guideEntityId: EntityId!) {
    guide(guideEntityId: $guideEntityId) {
      steps {
				name
        entityId
				bodySlate
				isComplete
				completedAt
      }
    }
  }
`;

type EmbedQueryReturnType = {
  data: {
    guide: {
      steps: Pick<
        EmbedFullGuide['steps'][number],
        'name' | 'entityId' | 'bodySlate' | 'isComplete' | 'completedAt'
      >[];
    };
  };
};

const getNewBodySlate = (text: string): SlateBodyElement[] => [
  {
    text,
    children: [],
  },
];

/**
 * @returns EntityId of the step we modified
 */
const modifyTemplate = async (
  guideEntityId: string,
  bodySlate: SlateBodyElement[]
) => {
  const guideObject = await Guide.findOne({
    where: {
      entityId: guideEntityId,
    },
    include: [
      { model: Step, order: [['orderIndex', 'ASC']] },
      { model: Template },
    ],
  });

  const [step] = guideObject?.steps || [];
  const template = guideObject?.createdFromTemplate;

  if (!step) throw new Error('No step');
  if (!template) throw new Error('No template');

  const stepPrototype = await step.$get('createdFromStepPrototype');

  if (!stepPrototype) throw new Error('No step prototypes');

  await stepPrototype.update({ bodySlate });

  await propagateTemplateChangesInPlace(template);

  return step.entityId;
};

const modifyGuideBase = async (
  guideEntityId: string,
  bodySlate: SlateBodyElement[]
) => {
  const guideObject = await Guide.findOne({
    where: {
      entityId: guideEntityId,
    },
    include: [
      { model: Step, order: [['orderIndex', 'ASC']] },
      { model: GuideBase },
      { model: Template },
    ],
  });

  const [step] = guideObject?.steps || [];
  const guideBase = guideObject?.createdFromGuideBase;
  const template = guideObject?.createdFromTemplate;

  if (!step) throw new Error('No step');
  if (!guideBase) throw new Error('No guide base');
  if (!template) throw new Error('No template');

  const guideStepBase = await step.$get('createdFromGuideStepBase');

  await guideStepBase?.update({ bodySlate });
  await guideBase.update({ isModifiedFromTemplate: true });

  await propagateTemplateChangesInPlace(template);

  return step.entityId;
};

describe('sync changes - step content', () => {
  test('guides can see new content', async () => {
    const embedContext = getEmbedContext();
    const {
      mainQuestGuides: [expectedGuide],
    } = await createGuides({
      executeAdminQuery,
      embedContext,
    });

    const text = getDummyString();

    const modifiedStepEntityId = await modifyTemplate(
      expectedGuide.entityId,
      getNewBodySlate(text)
    );

    const {
      data: { guide },
    } = await executeEmbedQuery<EmbedQueryReturnType>({
      query: testQuery,
      variables: { guideEntityId: expectedGuide.entityId },
    });

    const step = guide.steps.find((s) => s.entityId === modifiedStepEntityId);

    if (!step) throw new Error('Found no step in embed query');
    const bodySlateText = (step.bodySlate as any)?.[0]?.text;

    expect(bodySlateText).toEqual(text);
  });

  test('modified guide bases should not see new content', async () => {
    const embedContext = getEmbedContext();
    const {
      mainQuestGuides: [expectedGuide],
    } = await createGuides({
      executeAdminQuery,
      embedContext,
    });

    await modifyGuideBase(expectedGuide.entityId, getNewBodySlate('lame'));

    const text = getDummyString();

    const modifiedStepEntityId = await modifyTemplate(
      expectedGuide.entityId,
      getNewBodySlate(text)
    );

    const {
      data: { guide },
    } = await executeEmbedQuery<EmbedQueryReturnType>({
      query: testQuery,
      variables: { guideEntityId: expectedGuide.entityId },
    });

    const step = guide.steps.find((s) => s.entityId === modifiedStepEntityId);

    if (!step) throw new Error('Found no step in embed query');
    const bodySlateText = (step.bodySlate as any)?.[0]?.text;

    expect(bodySlateText).not.toEqual(text);
  });

  test('step should see content of modified guide base step', async () => {
    const embedContext = getEmbedContext();
    const {
      mainQuestGuides: [expectedGuide],
    } = await createGuides({
      executeAdminQuery,
      embedContext,
    });

    const text = getDummyString();
    const modifiedStepEntityId = await modifyGuideBase(
      expectedGuide.entityId,
      getNewBodySlate(text)
    );

    const {
      data: { guide },
    } = await executeEmbedQuery<EmbedQueryReturnType>({
      query: testQuery,
      variables: { guideEntityId: expectedGuide.entityId },
    });

    const step = guide.steps.find((s) => s.entityId === modifiedStepEntityId);

    if (!step) throw new Error('Found no step in embed query');
    const bodySlateText = (step.bodySlate as any)?.[0]?.text;

    expect(bodySlateText).toEqual(text);
  });

  test('should see modified guide base after template propagations', async () => {
    const embedContext = getEmbedContext();
    const {
      mainQuestGuides: [expectedGuide],
    } = await createGuides({
      executeAdminQuery,
      embedContext,
    });

    const text = getDummyString();
    const modifiedStepEntityId = await modifyGuideBase(
      expectedGuide.entityId,
      getNewBodySlate(text)
    );

    const templateText = getDummyString();
    await modifyTemplate(expectedGuide.entityId, getNewBodySlate(templateText));

    const {
      data: { guide },
    } = await executeEmbedQuery<EmbedQueryReturnType>({
      query: testQuery,
      variables: { guideEntityId: expectedGuide.entityId },
    });

    const step = guide.steps.find((s) => s.entityId === modifiedStepEntityId);

    if (!step) throw new Error('Found no step in embed query');
    const bodySlateText = (step.bodySlate as any)?.[0]?.text;

    expect(bodySlateText).toEqual(text);
  });

  test('preserves non-content data', async () => {
    const embedContext = getEmbedContext();
    const {
      mainQuestGuides: [expectedGuide],
    } = await createGuides({
      executeAdminQuery,
      embedContext,
    });

    const text = getDummyString();

    const guideObj = await Guide.findOne({
      where: {
        entityId: expectedGuide.entityId,
      },
    });

    if (!guideObj) throw new Error('No guide found');

    await completeGuide(guideObj, embedContext.accountUser);

    const modifiedStepEntityId = await modifyTemplate(
      expectedGuide.entityId,
      getNewBodySlate(text)
    );

    const {
      data: { guide },
    } = await executeEmbedQuery<EmbedQueryReturnType>({
      query: testQuery,
      variables: { guideEntityId: expectedGuide.entityId },
    });

    const step = guide.steps.find((s) => s.entityId === modifiedStepEntityId);

    if (!step) throw new Error('Found no step in embed query');
    const bodySlateText = (step.bodySlate as any)?.[0]?.text;

    expect(bodySlateText).toEqual(text);
    expect(step.isComplete).toBeTruthy();
  });

  test('can create new steps with content', async () => {
    const embedContext = getEmbedContext();
    const {
      mainQuestGuides: [expectedGuide],
    } = await createGuides({
      executeAdminQuery,
      embedContext,
    });

    const template = await Template.findOne({
      where: {
        id: expectedGuide.createdFromTemplateId,
      },
      include: [{ model: Module }],
    });

    if (!template) throw new Error('No template');

    const newStepText = getDummyString();
    const newStepName = 'Latest and Not Greatest (see: buggiest)';

    /* Create a new step proto and add it to the template */
    const newStepProto = await StepPrototype.create({
      organizationId: template?.organizationId,
      name: newStepName,
      bodySlate: getNewBodySlate(newStepText),
      branchingMultiple: false,
      stepType: StepType.optional,
    });

    const firstModule = template.modules[0];

    expect(firstModule).toBeTruthy();

    await ModuleStepPrototype.create({
      moduleId: firstModule.id,
      stepPrototypeId: newStepProto.id,
      organizationId: template.organizationId,
      orderIndex: 100,
    });

    await propagateTemplateChangesInPlace(template);

    const {
      data: { guide },
    } = await executeEmbedQuery<EmbedQueryReturnType>({
      query: testQuery,
      variables: { guideEntityId: expectedGuide.entityId },
    });

    const theNewOne = guide.steps.find((s) => s.name === newStepName);
    expect(theNewOne).toBeTruthy();
  });

  test('can remove step and propagate', async () => {
    const embedContext = getEmbedContext();
    const {
      mainQuestGuides: [expectedGuide],
    } = await createGuides({
      executeAdminQuery,
      embedContext,
    });

    const template = await Template.findOne({
      where: {
        id: expectedGuide.createdFromTemplateId,
      },
      include: [{ model: Module }],
    });

    if (!template) throw new Error('No template');

    const firstModule = template.modules[0];

    expect(firstModule).toBeTruthy();

    let oldStepCount = 0;

    {
      const {
        data: { guide },
      } = await executeEmbedQuery<EmbedQueryReturnType>({
        query: testQuery,
        variables: { guideEntityId: expectedGuide.entityId },
      });

      oldStepCount = guide.steps.length;
    }

    await ModuleStepPrototype.destroy({
      where: {
        moduleId: firstModule.id,
      },
      limit: 1,
    });

    await propagateTemplateChangesInPlace(template);

    const {
      data: { guide },
    } = await executeEmbedQuery<EmbedQueryReturnType>({
      query: testQuery,
      variables: { guideEntityId: expectedGuide.entityId },
    });

    expect(guide.steps.length).toBeLessThan(oldStepCount);
  });
});
