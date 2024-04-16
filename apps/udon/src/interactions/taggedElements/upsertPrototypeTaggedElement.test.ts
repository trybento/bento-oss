import {
  GuideFormFactor,
  GuidePageTargetingType,
  GuideTypeEnum,
  Theme,
  TooltipShowOn,
  TooltipStyle,
  VisualTagHighlightType,
} from 'bento-common/types';
import { DEFAULT_PRIORITY_RANKING } from 'bento-common/utils/constants';

import { applyFinalCleanupHook } from 'src/data/datatests';
import {
  fakeModule,
  fakeStepPrototypeTaggedElement,
} from 'src/testUtils/dummyDataHelpers';
import { Template } from 'src/data/models/Template.model';
import { TemplateInput } from 'src/graphql/Template/mutations/createTemplate';
import { createTemplateForTest } from 'src/graphql/Template/testHelpers';
import { setupGraphQLTestServer } from 'src/graphql/testHelpers';
import upsertPrototypeTaggedElement from './upsertPrototypeTaggedElement';
import { queueJob } from 'src/jobsBull/queues';
import { StepPrototypeTaggedElement } from 'src/data/models/StepPrototypeTaggedElement.model';
import { Op } from 'sequelize';
import { TemplateModule } from 'src/data/models/TemplateModule.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { JobType } from 'src/jobsBull/job';

jest.mock('src/jobsBull/queues', () => ({
  ...jest.requireActual('src/jobsBull/queues'),
  queueJob: jest.fn(),
  __esModule: true,
}));

const { executeAdminQuery, getEmbedContext } = setupGraphQLTestServer('bento');

applyFinalCleanupHook();

afterEach(() => {
  jest.restoreAllMocks();
});

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

describe('upsertPrototypeTaggedElement', () => {
  test('can create new guide-level tag', async () => {
    const template = await createTemplate({
      pageTargetingType: GuidePageTargetingType.visualTag,
    });

    const tagInput = fakeStepPrototypeTaggedElement();
    const prototype = await upsertPrototypeTaggedElement({
      organization: template!.organizationId,
      template: template!.id,
      input: tagInput,
    });

    expect(prototype).not.toBeUndefined();
    expect(prototype?.toJSON()).toMatchObject({
      templateId: template?.id,
      stepPrototypeId: null,
      ...tagInput,
    });
    expect(queueJob).toHaveBeenCalledWith({
      jobType: JobType.SyncTemplateChanges,
      type: 'template',
      templateId: template?.id,
      organizationId: template?.organizationId,
    });
  });

  test('can update existing guide-level tag', async () => {
    const template = await createTemplate({
      pageTargetingType: GuidePageTargetingType.visualTag,
    });

    const originalTagInput = fakeStepPrototypeTaggedElement({
      elementSelector: '#old-selector',
      xOffset: 0,
      yOffset: 0,
    });

    const original = await upsertPrototypeTaggedElement({
      organization: template!.organizationId,
      template: template!.id,
      input: originalTagInput,
    });

    const updatedTagInput = {
      ...originalTagInput,
      elementSelector: '#new-selector',
      xOffset: 10,
      yOffset: 20,
    };

    const updated = await upsertPrototypeTaggedElement({
      organization: template!.organizationId,
      template: template!.id,
      input: updatedTagInput,
    });

    const duplicates = await StepPrototypeTaggedElement.count({
      where: {
        templateId: template?.id,
        stepPrototypeId: null,
        id: {
          [Op.ne]: original?.id,
        },
      },
    });

    expect(duplicates).toEqual(0);
    expect(original?.id).toEqual(updated?.id);
    expect(updated?.toJSON()).toMatchObject({
      templateId: template?.id,
      stepPrototypeId: null,
      ...updatedTagInput,
    });
    expect(queueJob).toHaveBeenCalledWith({
      jobType: JobType.SyncTemplateChanges,
      type: 'template',
      templateId: template?.id,
      organizationId: template?.organizationId,
    });
  });

  test('template (tooltip) is set to show on load when tag is of overlay style', async () => {
    const template = await createTemplate({
      formFactor: GuideFormFactor.tooltip,
      pageTargetingType: GuidePageTargetingType.visualTag,
      modules: [], // tooltips wont allow user-created modules
    });

    await template?.update({
      formFactorStyle: {
        tooltipShowOn: TooltipShowOn.hover,
      } as TooltipStyle,
    });

    const tagInput = fakeStepPrototypeTaggedElement({
      // @ts-ignore
      style: {
        type: VisualTagHighlightType.overlay,
      },
    });

    const prototype = await upsertPrototypeTaggedElement({
      organization: template!.organizationId,
      template: template!.id,
      input: tagInput,
    });

    await template?.reload();

    expect((template?.formFactorStyle as TooltipStyle)?.tooltipShowOn).toEqual(
      TooltipShowOn.load
    );

    expect(prototype).not.toBeUndefined();
    expect(prototype?.toJSON()).toMatchObject({
      templateId: template?.id,
      stepPrototypeId: null,
      ...tagInput,
    });
    expect(queueJob).toHaveBeenCalledWith({
      jobType: JobType.SyncTemplateChanges,
      type: 'template',
      templateId: template?.id,
      organizationId: template?.organizationId,
    });
  });

  test('can create new step-level tag', async () => {
    const template = await createTemplate({
      pageTargetingType: GuidePageTargetingType.visualTag,
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

    const tagInput = fakeStepPrototypeTaggedElement();
    const prototype = await upsertPrototypeTaggedElement({
      organization: template!.organizationId,
      template: template!.id,
      stepPrototype: firstStepPrototypesOfTemplate,
      input: tagInput,
    });

    expect(prototype).not.toBeUndefined();
    expect(prototype?.toJSON()).toMatchObject({
      templateId: template?.id,
      stepPrototypeId: firstStepPrototypesOfTemplate.id,
      ...tagInput,
    });
    expect(queueJob).toHaveBeenCalledWith({
      jobType: JobType.SyncTemplateChanges,
      type: 'template',
      templateId: template?.id,
      organizationId: template?.organizationId,
    });
  });

  test('can update existing step-level tag', async () => {
    const template = await createTemplate({
      pageTargetingType: GuidePageTargetingType.visualTag,
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

    const originalTagInput = fakeStepPrototypeTaggedElement({
      elementSelector: '#old-selector',
      xOffset: 0,
      yOffset: 0,
    });

    const original = await upsertPrototypeTaggedElement({
      organization: template!.organizationId,
      template: template!.id,
      stepPrototype: firstStepPrototypesOfTemplate,
      input: originalTagInput,
    });

    const updatedTagInput = {
      ...originalTagInput,
      elementSelector: '#new-selector',
      xOffset: 10,
      yOffset: 20,
    };

    const updated = await upsertPrototypeTaggedElement({
      organization: template!.organizationId,
      template: template!.id,
      stepPrototype: firstStepPrototypesOfTemplate,
      input: updatedTagInput,
    });

    const duplicates = await StepPrototypeTaggedElement.count({
      where: {
        templateId: template?.id,
        stepPrototypeId: firstStepPrototypesOfTemplate.id,
        id: {
          [Op.ne]: original?.id,
        },
      },
    });

    expect(duplicates).toEqual(0);
    expect(original?.id).toEqual(updated?.id);
    expect(updated?.toJSON()).toMatchObject({
      templateId: template?.id,
      stepPrototypeId: firstStepPrototypesOfTemplate.id,
      ...updatedTagInput,
    });
    expect(queueJob).toHaveBeenCalledWith({
      jobType: JobType.SyncTemplateChanges,
      type: 'template',
      templateId: template?.id,
      organizationId: template?.organizationId,
    });
  });
});
