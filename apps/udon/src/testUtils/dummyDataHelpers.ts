import { merge } from 'lodash';
import promises from 'src/utils/promises';
import { faker } from '@faker-js/faker';
import {
  AtLeast,
  BranchingEntityType,
  GuideFormFactor,
  GuideTypeEnum,
  RecursivePartial,
  ReturnPromiseType,
  StepAutoCompleteInteractionType,
  StepType,
  TagInput,
  TemplateState,
  VisualTagHighlightType,
} from 'bento-common/types';
import {
  ContextTagAlignment,
  ContextTagTooltipAlignment,
  ContextTagType,
} from 'bento-common/types/globalShoyuState';

import { queryRunner } from '../data';
import { createGuideBase } from 'src/interactions/createGuideBase';
import { launchGuideBase } from 'src/interactions/launching/launchGuideBase';
import { randomInt, withRetries } from 'src/utils/helpers';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Guide } from '../data/models/Guide.model';
import { GuideModule } from '../data/models/GuideModule.model';
import { Step, StepCompletedByType } from '../data/models/Step.model';
import {
  createModuleForTest,
  createTemplateForTest,
} from 'src/graphql/Template/testHelpers';
import { setStepCompletion } from 'src/interactions/setStepCompletion';
import { GraphQLTestHelpers } from 'src/graphql/testHelpers';
import { AccountUser } from '../data/models/AccountUser.model';
import { EmbedRequestUser } from 'src/graphql/types';
import recordGuideView from 'src/interactions/recordEvents/recordGuideView';
import genLoaders from '../data/loaders';
import { Account } from '../data/models/Account.model';
import { Template } from '../data/models/Template.model';
import { Organization } from '../data/models/Organization.model';
import { Module } from '../data/models/Module.model';
import { StepPrototype } from '../data/models/StepPrototype.model';
import { TemplateInput } from 'src/graphql/Template/mutations/createTemplate';
import { BentoApiKeyType } from '../data/models/SegmentApiKey.model';
import {
  GroupTargeting,
  GroupTargetingSegment,
  TargetingType,
} from 'bento-common/types/targeting';
import { emptyTargeting } from 'bento-common/utils/targeting';
import { setAccountTargetsForTemplate } from 'src/interactions/targeting/setAccountTargetsForTemplate';
import { setAccountUserTargetsForTemplate } from 'src/interactions/targeting/setAccountUserTargetsForTemplate';
import { checkAndAutoLaunchGuideBaseFromTemplates } from 'src/interactions/targeting/checkAndAutoLaunchGuideBaseFromTemplates';
import { recheckTemplateTargetingForExistingAccounts } from 'src/interactions/targeting/recheckTemplateTargetingForExistingAccounts';
import { autoLaunchGuidesForAccountIfAny } from 'src/interactions/autoLaunchGuidesForAccountIfAny';
import createIndividualGuidesForCreatedAccountUser from 'src/interactions/launching/createIndividualGuidesForCreatedAccountUser';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';
import duplicateTemplate from 'src/interactions/library/duplicateTemplate';
import { TemplateAutoLaunchRule } from 'src/data/models/TemplateAutoLaunchRule.model';
import { TemplateTarget } from 'src/data/models/TemplateTarget.model';
import createTemplateSplitTargets from 'src/interactions/library/createTemplateSplitTargets';
import { Audience } from 'src/data/models/Audience.model';
import { targetingSegmentToLegacy } from 'src/interactions/targeting/targeting.helpers';

export const getDummyOrganization = () => {
  const name = faker.company.name();
  const slug = name.toLowerCase().replace(/\W/g, '');
  return {
    name,
    slug,
    domain: `${slug}.co`,
  };
};

export const getDummyAccountUser = (
  organization: Organization,
  account: AtLeast<Account, 'id'>
) => {
  const fname = faker.person.firstName();
  return {
    organizationId: organization.id,
    accountId: account.id,
    externalId: faker.string.uuid(),
    fullName: `${fname} ${faker.person.lastName()}`,
    email: `${fname}@$clientsclient.co`,
    attributes: {},
  };
};

export const getDummyAccount = (organization: Organization) => ({
  organizationId: organization.id,
  name: faker.company.name(),
  externalId: faker.company.name(),
  attributes: {},
});

export const getDummyUser = (organization: Organization) => {
  const fname = faker.person.firstName();
  return {
    organizationId: organization.id,
    fullName: `${fname} ${faker.person.lastName()}`,
    email: `${fname}@${organization.slug}.co`,
  };
};

/** Format as it would an incoming Identify request */
export const getDummySegmentUser = () => {
  const fname = faker.person.firstName();
  return {
    avatar: `${fname}.webp`,
    email: `${fname}@$clientsclient.co`,
    company: faker.company.name(),
    name: fname,
    createdAt: '2050-06-01',
  };
};

export const createDummyAccounts = async (
  organization: Organization,
  count = 1
) => {
  if (count < 1) return [];

  const data = [...Array(count)].map((_) => getDummyAccount(organization));
  return withRetries(() => Account.bulkCreate(data), { max: 3 });
};

export const createDummyAccountUsers = async (
  organization: Organization,
  account: Account,
  count = 1
) => {
  if (count < 1) return [];

  const data = [...Array(count)].map((_) =>
    getDummyAccountUser(organization, account)
  );

  return AccountUser.bulkCreate(data);
};

export const createDummyAccountUsersForAccounts = async (
  organization: Organization,
  accounts: Array<Account>,
  countPerAccount = 1
) =>
  promises.reduce(
    accounts,
    async (result, account) => {
      const created = await createDummyAccountUsers(
        organization,
        account,
        countPerAccount
      );
      return [...result, ...created];
    },
    [] as Array<AccountUser>
  );

export const getDefaultTemplate = async (org: Organization) => {
  return await Template.findOne({
    where: {
      organizationId: org.id,
    },
  });
};

/** Create and launch a guide for a chosen account */
export const launchDefaultTemplate = async ({
  organization,
  account,
  userTemplate = false,
  templateId,
  targets,
}: {
  organization: Organization;
  account: Account;
  userTemplate?: boolean;
  /** Launch a specific template instead of "default" */
  templateId?: number;
  targets?: GroupTargeting;
}): Promise<GuideBase> => {
  const template = await Template.findOne({
    where: templateId
      ? { id: templateId }
      : { organizationId: organization.id },
  });

  if (userTemplate && template)
    await template.update({ type: GuideTypeEnum.user });

  if (!template) throw 'Cannot launch null template';

  if (targets) {
    const isAutoLaunchEnabled = true;

    await setAccountTargetsForTemplate({
      template,
      isAutoLaunchEnabled,
      targeting: targets.account,
      onlySetAutolaunchState: false,
    });

    await setAccountUserTargetsForTemplate({
      template,
      targeting: targets.accountUser,
    });
  }

  const guideBase = await createGuideBase({
    account,
    templateEntityId: template.entityId,
  });

  await launchGuideBase({ guideBase });

  return guideBase;
};

export const getDummyString = () => faker.hacker.phrase();

export const getDummyUuid = () => faker.string.uuid();

export const arrayOfRandomLength = (min: number, max: number) =>
  [...new Array(randomInt(min, max))].map((_, i) => i);

export const fakeStepAutoCompleteInteraction = () => {
  const url = faker.internet.url();
  const text = faker.lorem.sentence();
  return {
    url,
    wildcardUrl: url,
    type: StepAutoCompleteInteractionType.click,
    elementSelector: `#${faker.lorem.slug()} .${faker.hacker.adjective}`,
    elementText: text,
    elementHtml: `<div>${text}</div>`,
  };
};

export const fakeStepPrototype = () => ({
  body: '',
  bodySlate: [],
  branchingEntityType: 'module' as BranchingEntityType,
  branchingFormFactor: 'dropdown',
  branchingMultiple: false,
  branchingDismissDisabled: false,
  branchingPathData: [],
  branchingQuestion: '',
  manualCompletionDisabled: false,
  entityId: faker.string.uuid(),
  name: faker.company.catchPhraseNoun(),
  eventMappings: [],
  stepType: 'fyi',
});

export const fakeModule = () => ({
  description: '',
  displayTitle: faker.company.buzzVerb(),
  entityId: faker.string.uuid(),
  name: faker.company.buzzNoun(),
  stepPrototypes: arrayOfRandomLength(1, 2).map((_) => fakeStepPrototype()),
});

export const moduleToTemplateInputModule = ({
  stepPrototypes,
  moduleStepPrototypes,
  entityId,
  name,
}: Module) => ({
  stepPrototypes: (
    stepPrototypes || moduleStepPrototypes.map((msp) => msp.stepPrototype)
  ).map((sp) => ({
    body: null,
    bodySlate: null,
    branchingEntityType: 'module' as BranchingEntityType,
    branchingFormFactor: 'dropdown',
    manualCompletionDisabled: false,
    branchingMultiple: false,
    branchingDismissDisabled: false,
    branchingPathData: [],
    branchingQuestion: '',
    entityId: sp.entityId,
    name: sp.name,
    stepEventMappingRules: [],
    stepType: sp.stepType,
  })),
  entityId,
  name,
});

/**
 * Make the last step proto in template branching, then return it
 * @returns step prototype id of branching step
 */
export const makeTemplateBranching = async (templateId: number) => {
  const stepPrototypeIds = (await queryRunner({
    sql: `
			SELECT sp.entity_id FROM core.step_prototypes sp
			JOIN core.modules_step_prototypes msp ON msp.step_prototype_id = sp.id
			JOIN core.templates_modules tm ON tm.module_id = msp.module_id
			JOIN core.templates t ON tm.template_id = t.id
			WHERE t.id = :templateId
			ORDER BY tm.order_index, msp.order_index;
		`,
    replacements: {
      templateId: templateId,
    },
  })) as { entity_id: string }[];

  const spId = stepPrototypeIds[stepPrototypeIds.length - 1].entity_id;

  await StepPrototype.update(
    {
      branchingChoices: [
        { label: 'a', choiceKey: 'a' },
        { label: 'b', choiceKey: 'b' },
      ],
      branchingFormFactor: 'cards',
      branchingQuestion: '?',
      stepType: StepType.branching,
    },
    {
      where: {
        entityId: spId,
      },
    }
  );

  return spId;
};

type GetGuideReturnType = Guide & {
  createdFromTemplate: Template;
  // createdFromGuideBase: GuideBase & {
  //   createdFromTemplate: Template;
  // };
  // guideModules: (GuideModule & {
  //   steps: Step[];
  // })[];
};

export async function getGuide(guideEntityId: string) {
  const guide = (await Guide.findOne({
    where: { entityId: guideEntityId },
    include: [
      { model: Template },
      { model: GuideModule, include: [Step] },
      { model: GuideBase, include: [Template] },
    ],
  })) as null | GetGuideReturnType;

  return guide;
}

export async function completeGuide(guide: Guide, accountUser: AccountUser) {
  await recordGuideView({ entityId: guide.entityId, accountUser });

  const steps = await genLoaders().stepsOfGuideLoader.load(guide.id);
  for (const step of steps) {
    await setStepCompletion({
      step,
      isComplete: true,
      completedByType: StepCompletedByType.AccountUser,
      accountUser: accountUser,
    });
  }
}

export async function completeFirstStepOfGuide(
  guide: Guide,
  accountUser: AccountUser
) {
  await recordGuideView({ entityId: guide.entityId, accountUser });
  const steps = await genLoaders().stepsOfGuideLoader.load(guide.id);
  if (steps.length > 0) {
    await setStepCompletion({
      step: steps[0],
      isComplete: true,
      completedByType: StepCompletedByType.AccountUser,
      accountUser: accountUser,
    });
  }
}

export async function createGuides({
  executeAdminQuery,
  embedContext,
  mainQuestGuidesCount = 1,
  sideQuestGuidesCount = 0,
  modalCount = 0,
  bannerCount = 0,
  contextGuideCount = 0,
  incompletedMainQuestGuidesCount = 1,
  completeFirstStepOfFirstIncompleteMainQuest = true,
  priorityRanking,
  additionalData,
}: {
  executeAdminQuery: GraphQLTestHelpers['executeAdminQuery'];
  embedContext: EmbedRequestUser;
  mainQuestGuidesCount?: number;
  sideQuestGuidesCount?: number;
  modalCount?: number;
  bannerCount?: number;
  contextGuideCount?: number;
  /**
   * Determines the number of incomplete mainQuest guides.
   * Incomplete guides will be last within 'mainQuestGuides' array
   *
   * @default 1
   **/
  incompletedMainQuestGuidesCount?: number;
  completeFirstStepOfFirstIncompleteMainQuest?: boolean;
  /** Determines a specific priority ranking for each guide, goes from mainQuests to sideQuests */
  priorityRanking?: number[];
  /** Determines additional data for each template */
  additionalData?: Partial<TemplateInput>[];
}): Promise<{
  mainQuestGuides: NonNullable<ReturnPromiseType<typeof getGuide>>[];
  sideQuestGuides: NonNullable<ReturnPromiseType<typeof getGuide>>[];
}> {
  const mainQuestGuides: NonNullable<ReturnPromiseType<typeof getGuide>>[] = [];
  const sideQuestGuides: NonNullable<ReturnPromiseType<typeof getGuide>>[] = [];

  if (
    priorityRanking &&
    priorityRanking.length !== mainQuestGuidesCount + sideQuestGuidesCount
  ) {
    throw new Error(
      `'priorityRanking' definitions should match total number of guides`
    );
  }

  if (incompletedMainQuestGuidesCount > mainQuestGuidesCount) {
    throw new Error(
      `'incompletedMainQuestGuidesCount' cannot be greater than the number of main quests`
    );
  }

  let accIndexOrRank = 0;

  for (const [i] of [...Array(mainQuestGuidesCount)].entries()) {
    const expectedModule = await createModuleForTest(executeAdminQuery, 3);
    const { guide: createdGuide } = await createTemplateForTest(
      executeAdminQuery,
      embedContext,
      {
        formFactor: GuideFormFactor.legacy,
        ...(additionalData && additionalData[i]),
        modules: [expectedModule],
      },
      true,
      priorityRanking ? priorityRanking[accIndexOrRank++] : accIndexOrRank++
    );

    const guide = await getGuide(createdGuide.entityId);
    if (i < mainQuestGuidesCount - incompletedMainQuestGuidesCount) {
      await completeGuide(guide!, embedContext.accountUser);
    } else if (
      completeFirstStepOfFirstIncompleteMainQuest &&
      i === mainQuestGuidesCount - incompletedMainQuestGuidesCount
    ) {
      await completeFirstStepOfGuide(guide!, embedContext.accountUser);
    }
    mainQuestGuides.push(guide!);
  }

  const sideQuestTypes = [
    ...Array(
      modalCount || sideQuestGuidesCount - bannerCount - contextGuideCount
    ).fill(GuideFormFactor.modal),
    ...Array(
      bannerCount || sideQuestGuidesCount - modalCount - contextGuideCount
    ).fill(GuideFormFactor.banner),
    ...Array(
      contextGuideCount || sideQuestGuidesCount - modalCount - bannerCount
    ).fill(GuideFormFactor.sidebar),
  ];

  for (const [i] of [...Array(sideQuestGuidesCount)].entries()) {
    const { guide: createdGuide } = await createTemplateForTest(
      executeAdminQuery,
      embedContext,
      {
        name: `template-of-side-quest-${i}`,
        ...(additionalData && additionalData[i]),
        isSideQuest: true,
        formFactor: sideQuestTypes[i],
      },
      true,
      priorityRanking ? priorityRanking[accIndexOrRank++] : accIndexOrRank++
    );

    const expectedGuide = await getGuide(createdGuide.entityId);
    sideQuestGuides.push(expectedGuide!);
  }
  return { mainQuestGuides, sideQuestGuides };
}

export const fakeStepPrototypeTaggedElement = (
  overrides?: RecursivePartial<TagInput>
): TagInput => {
  const url = faker.internet.url({ appendSlash: false });
  return merge(
    {
      alignment: faker.helpers.enumValue(ContextTagAlignment),
      elementHtml: null,
      elementSelector: `#${faker.lorem.slug()} .${faker.hacker.adjective}`,
      // elementText: faker.lorem.sentence(),
      relativeToText: faker.datatype.boolean(),
      tooltipAlignment: faker.helpers.enumValue(ContextTagTooltipAlignment),
      type: faker.helpers.enumValue(ContextTagType),
      url,
      wildcardUrl: `${url}/accounts/*/history`,
      xOffset: faker.number.int({ max: 100 }),
      yOffset: faker.number.int({ max: 100 }),
      style: {
        type: faker.helpers.enumValue(VisualTagHighlightType),
        pulse: faker.datatype.boolean(),
        color: faker.color.rgb(),
        thickness: faker.number.int({ max: 5 }),
        padding: faker.number.int({ max: 20 }),
        radius: faker.number.int({ max: 10 }),
        opacity: faker.number.int({ max: 30 }),
      },
    },
    overrides
  );
};

/** Create guide bases for accounts based on rules */
export const autoLaunchTemplateForAccounts = async (
  template: Template,
  accounts: Array<Account>
) => {
  await promises.map(accounts, (account) =>
    checkAndAutoLaunchGuideBaseFromTemplates({
      templatesAndAccounts: [
        {
          templateId: template.id,
          account,
        },
      ],
      organizationId: template.organizationId,
    })
  );

  return await recheckTemplateTargetingForExistingAccounts({ template });
};

/** Apply autolaunch/target rules to a template */
export const configureAutolaunchForTemplateTest = async ({
  template,
  accountTargeting = { type: TargetingType.all },
  accountUserTargeting = { type: TargetingType.all },
}: {
  template: Template;
  accountTargeting?: GroupTargetingSegment;
  accountUserTargeting?: GroupTargetingSegment;
}) => {
  await setAccountTargetsForTemplate({
    template,
    isAutoLaunchEnabled: true,
    targeting: accountTargeting,
  });

  await setAccountUserTargetsForTemplate({
    template,
    targeting: accountUserTargeting,
  });
};

/** Given a context, launch a user guide down to creating the participant if provided */
export const configureAndLaunchToUser = async ({
  organization,
  accountUser,
  account,
  modifyTemplate,
  sourceTemplate,
  targeting,
}: {
  organization: Organization;
  account: Account;
  accountUser?: AccountUser;
  /** Perform custom actions to modify a template before launching */
  modifyTemplate?: (template: Template) => void;
  sourceTemplate?: Template;
  targeting?: Partial<GroupTargeting>;
}) => {
  const template = sourceTemplate
    ? sourceTemplate
    : await Template.findOne({
        where: { organizationId: organization.id },
      });

  if (!template) throw 'No template!';

  await template.update({ type: GuideTypeEnum.user });

  if (modifyTemplate) await modifyTemplate(template);

  await configureAutolaunchForTemplateTest({
    template,
    ...(targeting?.account ? { accountTargeting: targeting.account } : {}),
    ...(targeting?.accountUser
      ? { accountUserTargeting: targeting.accountUser }
      : {}),
  });
  await autoLaunchGuidesForAccountIfAny({ account });

  let guideParticipant: GuideParticipant | null = null;

  if (accountUser) {
    await createIndividualGuidesForCreatedAccountUser(accountUser);
    guideParticipant = await GuideParticipant.findOne({
      where: { accountUserId: accountUser.id },
    });
  }

  return {
    template,
    guideParticipant,
  };
};

/** Shortcut method to go from zero to account user having a guide */
export const launchToAccountUser = async ({
  account,
  accountUser,
  organization,
}: {
  account: Account;
  accountUser: AccountUser;
  organization: Organization;
}): Promise<{
  template: Template;
  guideParticipant: GuideParticipant;
  guide: Guide;
}> => {
  const template = await Template.findOne({
    where: { organizationId: organization.id },
  });
  if (!template) throw 'No template!';

  await template.update({ type: GuideTypeEnum.user });

  await configureAutolaunchForTemplateTest({ template });
  await autoLaunchGuidesForAccountIfAny({ account });

  await createIndividualGuidesForCreatedAccountUser(accountUser);

  const firstGp = await GuideParticipant.findOne({
    where: { accountUserId: accountUser.id },
    include: [Guide],
  });

  return {
    template,
    guideParticipant: firstGp!,
    guide: firstGp!.guide,
  };
};

/**
 * Turn one template into n amounts for testing
 */
export const generateTemplates = async ({
  organization,
  count = 1,
  source,
  useExistingModules = true,
}: {
  organization: Organization;
  count?: number;
  source: Template;
  useExistingModules?: boolean;
}) => {
  const results: Template[] = [];

  for (let i = 0; i < count; i++) {
    const t = await duplicateTemplate({
      template: source,
      organization,
      useExistingModules,
    });

    results.push(t);
  }

  return results;
};

/**
 * Set up a split test configuration
 * @param targetTemplateEntityIds What templates to split to
 */
export const getDummySplitTestTemplate = async (
  organization: Organization,
  targetTemplateEntityIds: Array<string | null>
) => {
  const name = getDummyString();
  const createdTemplate = await Template.create({
    name,
    state: TemplateState.draft,
    organizationId: organization.id,
    displayTitle: name,
    description: 'templateData.description',
    type: GuideTypeEnum.splitTest,
  });

  await TemplateAutoLaunchRule.create({
    templateId: createdTemplate.id,
    organizationId: organization.id,
  });
  await TemplateTarget.create({
    templateId: createdTemplate.id,
    organizationId: organization.id,
  });

  await createTemplateSplitTargets({
    sourceTemplate: createdTemplate,
    targetTemplateEntityIds,
  });

  return createdTemplate;
};

export const createNewAudience = async (
  targets: Partial<GroupTargeting>,
  organizationId: number,
  name: string = getDummyString()
) => {
  const fullTargets = {
    ...emptyTargeting,
    ...targets,
  };

  return Audience.create({
    organizationId,
    name,
    autoLaunchRules: targetingSegmentToLegacy(fullTargets.account, 'ruleType'),
    targets: targetingSegmentToLegacy(fullTargets.accountUser, 'targetType'),
  });
};
