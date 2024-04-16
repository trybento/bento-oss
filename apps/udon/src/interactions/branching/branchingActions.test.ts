import { pick } from 'lodash';
import {
  BranchingEntityType,
  GuideTypeEnum,
  StepType,
} from 'bento-common/types';

import promises from 'src/utils/promises';
import testUtils from 'src/testUtils/test.util';
import {
  createDummyAccountUsers,
  makeTemplateBranching,
  launchDefaultTemplate,
} from 'src/testUtils/dummyDataHelpers';
import { Guide } from 'src/data/models/Guide.model';
import { Template } from 'src/data/models/Template.model';
import { BranchingPath } from 'src/data/models/BranchingPath.model';
import { Organization } from 'src/data/models/Organization.model';
import { Account } from 'src/data/models/Account.model';
import { Module } from 'src/data/models/Module.model';
import { setupGraphQLTestServer } from 'src/graphql/testHelpers';
import {
  GuideModuleBase,
  GuideModuleBaseModelScope,
} from 'src/data/models/GuideModuleBase.model';
import {
  GuideModule,
  GuideModuleModelScope,
  GuideModuleWithBase,
} from 'src/data/models/GuideModule.model';
import { MAX_RETRY_TIMES } from 'src/data/datatests';
import { TriggeredBranchingPath } from 'src/data/models/TriggeredBranchingPath.model';
import selectBranchingPath from './selectBranchingPath';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { addModuleToGuideBase } from './addModuleToGuideBase';
import { resetStepBranchingPaths } from './resetStepBranchingPaths';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';

const { getEmbedContext, executeAdminQuery } = setupGraphQLTestServer('bento');

jest.retryTimes(MAX_RETRY_TIMES);

/**
 * Providing a module will make this into a module branching type.
 * @todo accept array of inputs and create n number of paths based on array
 */
const makeTemplateBranchingAndAddPath = async ({
  templates,
  account,
  organization,
  module,
}: {
  organization: Organization;
  account: Account;
  templates: Template[];
  module?: Module;
}) => {
  const spEntityId = await makeTemplateBranching(templates[0].id);
  const gb = await launchDefaultTemplate({
    organization,
    account,
    templateId: templates[0].id,
  });

  await BranchingPath.create({
    branchingKey: spEntityId,
    choiceKey: 'a',
    organizationId: organization.id,
    actionType: 'create',
    orderIndex: 0,
    ...(module
      ? { entityType: BranchingEntityType.Module, moduleId: module.id }
      : {
          entityType: BranchingEntityType.Guide,
          templateId: templates[1].id,
        }),
  });

  return { guideBase: gb, spEntityId };
};

describe('guide branching', () => {
  test('triggers a template spawn', async () => {
    const { account, organization, accountUser } = getEmbedContext();
    const templates = await Template.findAll({
      where: { organizationId: organization.id },
    });

    await makeTemplateBranchingAndAddPath({ templates, account, organization });

    const { guide: branchingGuide } = await testUtils.guides.createGuideForUser(
      templates[0].entityId,
      organization,
      account,
      accountUser
    );

    const branchingStep = (
      await branchingGuide.$get('steps', {
        include: [StepPrototype],
      })
    )?.find((s) => s.createdFromStepPrototype.stepType === StepType.branching);

    await selectBranchingPath(
      {
        stepEntityId: branchingStep!.entityId,
        shouldCompleteStep: true,
        choiceKeys: ['a'],
        choiceLabels: ['a'],
      },
      {
        account,
        accountUser,
        organization,
      }
    );

    const triggeredPath = await TriggeredBranchingPath.findOne({
      where: {
        triggeredFromStepId: branchingStep?.id || 0,
      },
    });

    const hasBeenAddedToTriggeredGuide = !!(await accountUser.$count(
      'guideParticipants',
      {
        where: {
          guideId: triggeredPath?.createdGuideId || 0,
        },
      }
    ));

    expect(hasBeenAddedToTriggeredGuide).toBeTruthy();
  });

  test('should not spawn more account guides than needed', async () => {
    const { account, organization } = getEmbedContext();
    const templates = await Template.findAll({
      where: { organizationId: organization.id },
    });

    /* Make sure they're account-scoped guides */
    for (const template of templates) {
      await template.update({ type: GuideTypeEnum.account });
    }

    await makeTemplateBranchingAndAddPath({ templates, account, organization });

    const accountUsers = await createDummyAccountUsers(
      organization,
      account,
      2
    );

    /* But we should also check to catch we don't over-create */
    for (const accountUser of accountUsers) {
      const { guide: branchingGuide } =
        await testUtils.guides.createGuideForUser(
          templates[0].entityId, // the branching origin
          organization,
          account,
          accountUser
        );

      const branchingStep = (
        await branchingGuide.$get('steps', {
          include: [StepPrototype],
        })
      )?.find(
        (s) => s.createdFromStepPrototype.stepType === StepType.branching
      );

      await selectBranchingPath(
        {
          stepEntityId: branchingStep!.entityId,
          shouldCompleteStep: true,
          choiceKeys: ['a'],
          choiceLabels: ['a'],
        },
        {
          account,
          accountUser,
          organization,
        }
      );
    }

    const createdGuides = await Guide.findAll({
      where: {
        createdFromTemplateId: templates[1].id,
      },
    });

    expect(createdGuides.length).toBe(1);
  });

  test('should not spawn more user guides than needed', async () => {
    const { account, organization } = getEmbedContext();
    const templates = await Template.findAll({
      where: { organizationId: organization.id },
    });

    /* Make sure they're user-scoped guides */
    await promises.map(templates, async (template) => {
      await template.update({ type: GuideTypeEnum.user });
    });

    await makeTemplateBranchingAndAddPath({
      templates,
      account,
      organization,
    });

    const accountUsers = await createDummyAccountUsers(
      organization,
      account,
      2
    );

    await promises.mapSeries(accountUsers, async (accountUser) => {
      const { guide: branchingGuide } =
        await testUtils.guides.createGuideForUser(
          templates[0].entityId, // the branching origin
          organization,
          account,
          accountUser
        );

      const branchingStep = (
        await branchingGuide.$get('steps', {
          include: [StepPrototype],
        })
      )?.find(
        (s) => s.createdFromStepPrototype.stepType === StepType.branching
      );

      await selectBranchingPath(
        {
          stepEntityId: branchingStep!.entityId,
          shouldCompleteStep: true,
          choiceKeys: ['a'],
          choiceLabels: ['a'],
        },
        {
          account,
          accountUser,
          organization,
        }
      );
    });

    const createdGuides = await Guide.findAll({
      where: {
        createdFromTemplateId: templates[1].id,
      },
    });

    expect(createdGuides.length).toBe(2);
  });
});

describe('step group branching', () => {
  test('preserves branching path order', async () => {
    const { account, accountUser, organization } = getEmbedContext();
    const templates = await Template.findAll({
      where: { organizationId: organization.id },
    });

    const modules = await Module.findAll({
      where: {
        organizationId: organization.id,
      },
    });

    if (modules.length < 2) {
      throw new Error('Test requires 2+ modules');
    }

    await makeTemplateBranchingAndAddPath({
      templates,
      account,
      organization,
      module: modules[0],
    });

    const { guide: branchingGuide } = await testUtils.guides.createGuideForUser(
      templates[0].entityId,
      organization,
      account,
      accountUser
    );

    const branchingStep = (
      await branchingGuide.$get('steps', {
        include: [StepPrototype],
      })
    )?.find((s) => s.createdFromStepPrototype.stepType === StepType.branching);

    await BranchingPath.create({
      branchingKey: branchingStep?.createdFromStepPrototype.entityId,
      choiceKey: 'b',
      organizationId: organization.id,
      actionType: 'create',
      orderIndex: 1,
      entityType: BranchingEntityType.Module,
      moduleId: modules[1].id,
    });

    await selectBranchingPath(
      {
        stepEntityId: branchingStep!.entityId,
        shouldCompleteStep: true,
        choiceKeys: ['a', 'b'],
        choiceLabels: ['a', 'b'],
      },
      {
        account,
        accountUser,
        organization,
      }
    );

    const triggeredBranchingPaths = await TriggeredBranchingPath.findAll({
      where: {
        triggeredFromStepId: branchingStep?.id || 0,
      },
      include: [GuideModule, BranchingPath],
    });

    triggeredBranchingPaths.forEach((tbp) => {
      const a = tbp.branchingPath!.orderIndex;
      const b = tbp.createdGuideModule!.orderIndex;
      expect(a).toEqual(b);
    });
  });

  test.each([0, 1])(
    'adds a new module in the correct position to both the guide base and guide (after index: %d)',
    async (afterIndex) => {
      const { account, organization } = getEmbedContext();
      const template = (await Template.scope('withTemplateModules').findOne({
        where: { organizationId: organization.id },
      }))!;

      const guideBase = await launchDefaultTemplate({
        organization,
        account,
        templateId: template.id,
      });

      const guide = (await Guide.findOne({
        where: { createdFromGuideBaseId: guideBase.id },
      }))!;

      // for some reason using these scopes in an `include` parameter in the
      // query above wasn't honoring the sorting (`byOrderIndex`) so this makes
      // an extra query... it's just a test though so it should be fine
      let guideModules = await GuideModule.scope([
        GuideModuleModelScope.withBase,
        GuideModuleModelScope.withSteps,
      ]).findAll({ where: { guideId: guide.id } });

      const createdModule = await testUtils.modules.createModule(
        executeAdminQuery,
        2
      );

      const module = (await Module.findOne({
        where: { entityId: createdModule.entityId },
      }))!;

      await addModuleToGuideBase({
        guideBase,
        module,
        guide,
        step: guideModules[afterIndex].steps[0],
        shouldOnlyAddToNewGuidesDynamically: true,
      });

      const guideModuleBases = await GuideModuleBase.scope(
        GuideModuleBaseModelScope.byOrderIndex
      ).findAll({ where: { guideBaseId: guideBase.id } });
      guideModules = await GuideModule.scope([
        GuideModuleModelScope.withBase,
        GuideModuleModelScope.withSteps,
      ]).findAll({ where: { guideId: guide.id } });

      expect(guideModules.length).toBe(template.templateModules.length + 1);
      expect(guideModuleBases[afterIndex + 1]).toMatchObject({
        orderIndex: afterIndex + 1,
      });
      expect(guideModules[afterIndex + 1]).not.toBeUndefined();

      for (const [i, _tm] of template.templateModules.entries()) {
        const orderIndex = i <= afterIndex ? i : i + 1;
        expect(guideModuleBases[orderIndex]).toMatchObject({
          orderIndex,
        });
        expect(guideModules[orderIndex]).not.toBeUndefined();
      }
    }
  );

  test('correctly rebuilds GuideModule/Base order indexes', async () => {
    const { account, accountUser, organization } = getEmbedContext();

    const template = (await Template.scope('withTemplateModules').findOne({
      where: { organizationId: organization.id },
    }))!;

    const createdModule = await testUtils.modules.createModule(
      executeAdminQuery
    );

    const module = (await Module.findOne({
      where: {
        entityId: createdModule.entityId,
      },
    }))!;

    await makeTemplateBranchingAndAddPath({
      templates: [template],
      account,
      organization,
      module,
    });

    const { guide } = await testUtils.guides.createGuideForUser(
      template.entityId,
      organization,
      account,
      accountUser
    );

    const branchingStep = (
      await guide.$get('steps', {
        include: [StepPrototype],
      })
    )?.find((s) => s.createdFromStepPrototype.stepType === StepType.branching);

    const reducer = (
      acc: Record<
        number,
        {
          id: number;
          orderIndex: number;
          base: { id: number; orderIndex: number };
        }
      >,
      gm: GuideModuleWithBase
    ) => {
      acc[gm.id] = {
        ...pick(gm, ['id', 'orderIndex']),
        base: pick(gm.createdFromGuideModuleBase, ['id', 'orderIndex']),
      };
      return acc;
    };

    const guideModulesBefore = (await guide.$get('guideModules', {
      scope: GuideModuleModelScope.withBase,
    })) as GuideModuleWithBase[];

    const before = guideModulesBefore.reduce(reducer, {});

    // updates each guide gm/base order index multiplying by 10 to change it without affecting the order of things
    for (const [i, gm] of guideModulesBefore.entries()) {
      await gm.update({ orderIndex: i * 10 });
      await gm.createdFromGuideModuleBase.update({ orderIndex: i * 10 });
    }

    await selectBranchingPath(
      {
        stepEntityId: branchingStep!.entityId,
        shouldCompleteStep: true,
        choiceKeys: ['a'],
        choiceLabels: ['a'],
      },
      {
        account,
        accountUser,
        organization,
      }
    );

    const guideModulesAfter = (await guide.$get('guideModules', {
      scope: GuideModuleModelScope.withBase,
    })) as GuideModuleWithBase[];

    const after = guideModulesAfter.slice(0, 2).reduce(reducer, {});

    expect(before).toEqual(after);
  });

  test('can reset', async () => {
    const { account, accountUser, organization } = getEmbedContext();

    const template = (await Template.scope('withTemplateModules').findOne({
      where: { organizationId: organization.id },
    }))!;

    const createdModule = await testUtils.modules.createModule(
      executeAdminQuery
    );

    const module = (await Module.findOne({
      where: {
        entityId: createdModule.entityId,
      },
    }))!;

    await makeTemplateBranchingAndAddPath({
      templates: [template],
      account,
      organization,
      module,
    });

    const { guide } = await testUtils.guides.createGuideForUser(
      template.entityId,
      organization,
      account,
      accountUser
    );

    const branchingStep = (
      await guide.$get('steps', {
        include: [StepPrototype],
      })
    )?.find((s) => s.createdFromStepPrototype.stepType === StepType.branching);

    // counter
    const counter = (): Promise<
      [guideModules: number, triggeredBranchingPaths: number]
    > => {
      return Promise.all([
        GuideModule.count({
          where: {
            guideId: guide.id,
          },
        }),
        TriggeredBranchingPath.count({
          where: {
            triggeredFromStepId: branchingStep?.id || 0,
          },
        }),
      ]);
    };

    // select a path
    await selectBranchingPath(
      {
        stepEntityId: branchingStep!.entityId,
        shouldCompleteStep: true,
        choiceKeys: ['a'],
        choiceLabels: ['a'],
      },
      {
        account,
        accountUser,
        organization,
      }
    );

    const before = await counter();

    // expect a single triggered path
    expect(before).toEqual([expect.any(Number), 1]);

    // reset
    await resetStepBranchingPaths({ accountUser, step: branchingStep! });

    // confirm module and triggered path were removed
    expect(await counter()).toEqual([before[0] - 1, 0]);
  });
});
