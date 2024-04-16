import {
  GuideFormFactor,
  GuidePageTargetingType,
  GuideTypeEnum,
  Theme,
} from 'bento-common/types';
import { DEFAULT_PRIORITY_RANKING } from 'bento-common/utils/constants';

import { applyFinalCleanupHook } from 'src/data/datatests';
import {
  fakeModule,
  fakeStepPrototypeTaggedElement,
} from 'src/testUtils/dummyDataHelpers';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { StepPrototypeTaggedElement } from 'src/data/models/StepPrototypeTaggedElement.model';
import { Template } from 'src/data/models/Template.model';
import { TemplateModule } from 'src/data/models/TemplateModule.model';
import { TemplateInput } from 'src/graphql/Template/mutations/createTemplate';
import { createTemplateForTest } from 'src/graphql/Template/testHelpers';
import { setupGraphQLTestServer } from 'src/graphql/testHelpers';
import deletePrototypeTaggedElement from './deletePrototypeTaggedElement';
import upsertPrototypeTaggedElement from './upsertPrototypeTaggedElement';

const { executeAdminQuery, getEmbedContext } = setupGraphQLTestServer('bento');

applyFinalCleanupHook();

const createTemplate = async (data?: Partial<TemplateInput>) => {
  const {
    template: { entityId },
  } = await createTemplateForTest(
    executeAdminQuery,
    getEmbedContext(),
    {
      formFactor: GuideFormFactor.legacy,
      isSideQuest: false,
      theme: Theme.nested,
      type: GuideTypeEnum.user,
      modules: fakeModule() as unknown as any,
      ...data,
    },
    false,
    DEFAULT_PRIORITY_RANKING
  );

  return Template.scope(['withTemplateModules']).findOne({
    where: {
      entityId,
    },
  });
};

describe('deletePrototypeTaggedElement', () => {
  test('can remove guide-level tag prototype', async () => {
    const template = await createTemplate({
      pageTargetingType: GuidePageTargetingType.visualTag,
    });

    // create guide-level tag
    await upsertPrototypeTaggedElement({
      organization: template!.organizationId,
      template: template!.id,
      input: fakeStepPrototypeTaggedElement(),
    });

    const [firstStepPrototypesOfTemplate] = (
      await TemplateModule.scope([
        { method: ['withModule', true] },
        'byOrderIndex',
      ]).findAll({
        where: { templateId: template!.id },
      })
    ).flatMap<StepPrototype>((tm) =>
      tm.module.moduleStepPrototypes.map((msp) => msp.stepPrototype)
    );

    // create step-level tag
    await upsertPrototypeTaggedElement({
      organization: template!.organizationId,
      template: template!.id,
      stepPrototype: firstStepPrototypesOfTemplate,
      input: fakeStepPrototypeTaggedElement(),
    });

    // delete ONLY the guide-level tag
    const affectedRows = await deletePrototypeTaggedElement({
      organization: template!.organizationId,
      template: template!.id,
    });

    const [prototypeOfGuide, prototypeOfStep] = await Promise.all([
      await StepPrototypeTaggedElement.findOne({
        where: {
          organizationId: template!.organizationId,
          templateId: template!.id,
          stepPrototypeId: null,
        },
      }),
      await StepPrototypeTaggedElement.findOne({
        where: {
          organizationId: template!.organizationId,
          templateId: template!.id,
          stepPrototypeId: firstStepPrototypesOfTemplate!.id,
        },
      }),
    ]);

    expect(affectedRows).toEqual(1);
    expect(prototypeOfGuide).toBeNull();
    expect(prototypeOfStep).not.toBeNull();
  });

  test('can remove the step-level tag prototype', async () => {
    const template = await createTemplate({
      pageTargetingType: GuidePageTargetingType.visualTag,
    });

    // create guide-level tag
    await upsertPrototypeTaggedElement({
      organization: template!.organizationId,
      template: template!.id,
      input: fakeStepPrototypeTaggedElement(),
    });

    const [firstStepPrototypesOfTemplate] = (
      await TemplateModule.scope([
        { method: ['withModule', true] },
        'byOrderIndex',
      ]).findAll({
        where: { templateId: template!.id },
      })
    ).flatMap<StepPrototype>((tm) =>
      tm.module.moduleStepPrototypes.map((msp) => msp.stepPrototype)
    );

    // create step-level tag
    await upsertPrototypeTaggedElement({
      organization: template!.organizationId,
      template: template!.id,
      stepPrototype: firstStepPrototypesOfTemplate,
      input: fakeStepPrototypeTaggedElement(),
    });

    // delete ONLY the guide-level tag
    const affectedRows = await deletePrototypeTaggedElement({
      organization: template!.organizationId,
      template: template!.id,
      stepPrototype: firstStepPrototypesOfTemplate!.id,
    });

    const [prototypeOfGuide, prototypeOfStep] = await Promise.all([
      await StepPrototypeTaggedElement.findOne({
        where: {
          organizationId: template!.organizationId,
          templateId: template!.id,
          stepPrototypeId: null,
        },
      }),
      await StepPrototypeTaggedElement.findOne({
        where: {
          organizationId: template!.organizationId,
          templateId: template!.id,
          stepPrototypeId: firstStepPrototypesOfTemplate!.id,
        },
      }),
    ]);

    expect(affectedRows).toEqual(1);
    expect(prototypeOfGuide).not.toBeNull();
    expect(prototypeOfStep).toBeNull();
  });
});
