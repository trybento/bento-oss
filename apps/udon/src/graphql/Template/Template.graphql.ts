import {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
  GraphQLFloat,
} from 'graphql';
import { GraphQLDate, GraphQLDateTime } from 'graphql-iso-date';
import { Op } from 'sequelize';
import {
  GuideTypeEnum,
  GuideDesignType,
  GuideFormFactor,
  GuidePageTargetingType,
  AuditEvent,
  GuideCategory,
  SplitTestState,
  GuideExpirationCriteria,
  TemplateState,
  InlineEmbedState,
} from 'bento-common/types';
import { enumToGraphqlEnum } from 'bento-common/utils/graphql';
import { isSplitTestGuide } from 'bento-common/data/helpers';
import { entityIdField } from 'bento-common/graphql/EntityId';
import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import AccountType from 'src/graphql/Account/Account.graphql';
import ModuleType from 'src/graphql/Module/Module.graphql';
import { Template } from 'src/data/models/Template.model';
import { GraphQLContext } from 'src/graphql/types';
import { AllowedEmbedType } from 'src/data/models/types';
import GuideBaseType from '../GuideBase/GuideBase.graphql';
import { TemplateStatsQueryResult } from 'src/data/loaders/Template/templateStats.loader';
import OrganizationType, {
  ThemeType,
} from '../Organization/Organization.graphql';
import getTemplateAutoLaunchAudience from 'src/interactions/targeting/getTemplateAutoLaunchAudience';
import fetchTemplateStats from 'src/interactions/analytics/fetchTemplateStats';
import StepPrototypeTaggedElementType from 'src/graphql/StepPrototypeTaggedElement/StepPrototypeTaggedElement.graphql';
import StepPrototypeType from '../StepPrototype/StepPrototype.graphql';
import withPerfTimer from 'src/utils/perfTimer';
import { logger } from 'src/utils/logger';
import InlineEmbedType from 'src/graphql/InlineEmbed/InlineEmbed.graphql';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { TemplateAudit } from 'src/data/models/Audit/TemplateAudit.model';
import { User } from 'src/data/models/User.model';
import UserType from '../User/User.graphql';
import { Guide } from 'src/data/models/Guide.model';
import { FormFactorStyleResolverField } from '../Guide/Guide.helpers';
import { enableSplitTesting } from 'src/utils/features';
import {
  MappedAnnouncementCtaActivity,
  composeAnnouncementTimeSeries,
  getBranchingPerformance,
  getBranchedGuidesCount,
  getTemplateTaggedElements,
} from './templateGql.helpers';
import { EntityId } from '../helpers/types';
import GuideBaseStepCtaType from '../GuideBaseStepCta/GuideBaseStepCta.graphql';
import BranchingPathType from '../BranchingPath/BranchingPath.graphql';
import { usesFirstStepTagLocation } from 'bento-common/utils/formFactor';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { areStepPrototypesEmpty } from '../StepPrototype/utils';
import { getSplitTestState, getTemplateState } from 'src/data/models/common';
import { countJobsWithSyncKey } from 'src/jobsBull/jobs/syncTemplateChanges/syncChanges.helpers';
import { formatTargeting } from 'src/interactions/targeting/targeting.helpers';
import { TargetsType } from '../graphQl.types';
import { enableCachedTemplateData } from 'src/utils/internalFeatures/internalFeatures';
import { withRetries } from 'src/utils/helpers';

export const TemplateStateEnumType = enumToGraphqlEnum({
  name: 'TemplateState',
  description: 'The current state of the template',
  enumType: TemplateState,
});

export const GuideCategoryEnum = enumToGraphqlEnum({
  name: 'GuideCategoryEnumType',
  enumType: GuideCategory,
  description: 'If the †emplate is the content itself or another mechanism',
});

export const GuideTypeEnumType = enumToGraphqlEnum({
  name: 'GuideTypeEnumType',
  enumType: GuideTypeEnum,
  description: 'The scope of the created guide template',
});

export const GuideAllowedEmbedTypeEnumType = enumToGraphqlEnum({
  name: 'GuideAllowedEmbedTypeEnumType',
  description:
    'The embed type (e.g. inline or sidebar) the guide should be restricted to, if any.',
  enumType: AllowedEmbedType,
});

export const GuideFormFactorEnumType = enumToGraphqlEnum({
  name: 'GuideFormFactorEnumType',
  description: 'The form factor this guide is meant to display as.',
  enumType: GuideFormFactor,
});

export const GuideDesignTypeEnumType = enumToGraphqlEnum({
  name: 'GuideDesignTypeEnumType',
  description: 'The design type of this guide.',
  enumType: GuideDesignType,
});

export const GuidePageTargetingEnumType = enumToGraphqlEnum({
  name: 'GuidePageTargetingEnumType',
  description: 'The type of page targeting mechanism',
  enumType: GuidePageTargetingType,
});

export const GuideExpirationCriteriaEnumType = enumToGraphqlEnum({
  name: 'GuideExpirationCriteria',
  description: 'Criteria based on which to expire guides',
  enumType: GuideExpirationCriteria,
});

export const SplitTestStateEnumType = enumToGraphqlEnum({
  name: 'SplitTestStateEnumType',
  enumType: SplitTestState,
});

const TemplateUsageType = new GraphQLObjectType({
  name: 'TemplateUsage',
  fields: () => ({
    autoLaunchedAccounts: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Number of guide bases auto launched',
    },
    autoLaunchedUsers: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Number of guides auto launched',
    },
    manualLaunchedAccounts: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Number of guide bases manual launched',
    },
    manualLaunchedUsers: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Number of guides manual launched',
    },
  }),
});

export const notificationSettingsFields = {
  disable: {
    type: GraphQLBoolean,
    description: 'Disable notifications entirely',
  },
  branching: {
    type: GraphQLBoolean,
    description: 'Disable notifying on branching steps',
  },
  input: {
    type: GraphQLBoolean,
    description: 'Disable notifying on input steps',
  },
  action: {
    type: GraphQLBoolean,
    description: 'Disable notifying on action steps',
  },
  info: {
    type: GraphQLBoolean,
    description: 'Disable notifying on info steps',
  },
};

const TemplateNotificationSettingsType = new GraphQLObjectType({
  name: 'TemplateNotificationSettings',
  fields: () => ({
    ...notificationSettingsFields,
  }),
});

const TemplateStatsType = new GraphQLObjectType<
  TemplateStatsQueryResult,
  GraphQLContext
>({
  name: 'TemplateStats',
  description: 'Template usage/completion stats',
  fields: {
    usersSeenGuide: {
      type: GraphQLInt,
      description: 'Count of users that have seen a step in this guide',
    },
    completedAStep: {
      type: GraphQLInt,
      description: 'Count of users that have completed a step in this guide',
    },
    totalStepsCompleted: {
      type: GraphQLInt,
      description: 'Raw number of steps that are complete',
    },
    percentCompleted: {
      type: GraphQLFloat,
      description:
        'Out of all guides from this template, what percent are fully completed',
    },
    usersDismissed: {
      type: GraphQLInt,
      description:
        'Count of users that dismissed an announcement (e.g. skipped step)',
    },
    usersClickedCta: {
      type: GraphQLInt,
      description: 'Count of unique users that have clicked a CTA',
    },
    usersSavedForLater: {
      type: GraphQLInt,
      description: 'Count of users that saved an announcement for later',
    },
    guidesViewed: {
      type: GraphQLInt,
      description: 'The number of guides with a registered view',
    },
    guidesWithCompletedStep: {
      type: GraphQLInt,
      description: 'The number of guides with at least one step complete',
    },
    percentGuidesCompleted: {
      type: GraphQLFloat,
      description:
        'Same as percentCompleted but instead of total guides, it is out of total guides with a view',
    },
    averageStepsCompleted: {
      type: GraphQLFloat,
      description: 'Avarege number of steps completed in each guide',
    },
    averageStepsCompletedForEngaged: {
      type: GraphQLFloat,
      description:
        'Average steps completed but only counting those who have completed any steps',
    },
    inputStepAnswersCount: {
      type: GraphQLInt,
      description: 'Count of input answers submitted, not deduped by users',
    },
    accountsSeen: {
      type: GraphQLInt,
      deprecationReason:
        'Use guidesViewed instead for number of accounts that have seen the guide',
      description: 'The number of guide bases created from this template',
    },
    ctaClickCount: {
      type: GraphQLInt,
      deprecationReason: 'Use usersClickedCta instead',
      description: 'The number of times any CTAs in this guide were clicked.',
    },
    usersAnswered: {
      type: GraphQLInt,
      description:
        'Count of unique users that have submitted an answer to input fields',
    },
  },
});

const AnnouncementCtaActivity = new GraphQLObjectType<
  MappedAnnouncementCtaActivity,
  GraphQLContext
>({
  name: 'AnnouncementCtaActivity',
  description: 'Name and count of CTA activity',
  fields: {
    text: {
      description: 'Label of the CTA in question',
      type: new GraphQLNonNull(GraphQLString),
    },
    ctaEntityId: {
      type: EntityId,
    },
    count: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    cta: {
      type: GuideBaseStepCtaType,
      description:
        'This can be null if the original CTA associated was changed or removed',
      resolve: ({ ctaEntityId }, _a, { loaders }) =>
        loaders.guideBaseStepCtaEntityLoader.load(ctaEntityId),
    },
  },
});

const AnnouncementTimeSeriesPoint = new GraphQLObjectType({
  name: 'AnnouncementTimeSeriesPoint',
  description: 'Announcement activity data for one day, used with time series',
  fields: {
    date: {
      type: new GraphQLNonNull(GraphQLDate),
    },
    dismissed: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    savedForLater: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    viewed: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    ctaActivity: {
      type: new GraphQLNonNull(new GraphQLList(AnnouncementCtaActivity)),
    },
  },
});

export const LastEditedType = new GraphQLObjectType<
  { editedAt: Date; user: User },
  GraphQLContext
>({
  name: 'TemplateLastEdited',
  description: 'Template last edited data',
  fields: () => ({
    timestamp: { type: GraphQLDateTime },
    user: { type: UserType },
  }),
});

export type APITemplate = Omit<Template, 'id'> & {
  // id is provided by the globalIdField function of graphql-relay.
  id: string;
};

const TemplateType = new GraphQLObjectType<Template, GraphQLContext>({
  name: 'Template',
  fields: () => ({
    ...globalEntityId('Template'),
    ...entityIdField(),
    name: {
      type: GraphQLString,
      description: 'Means the public name',
    },
    /** @todo cleanup displayTitle */
    displayTitle: {
      deprecationReason: 'Use `name` instead',
      type: GraphQLString,
      description: 'Means the public name, previously meant the private name',
    },
    privateName: {
      type: GraphQLString,
      description: 'Means the private name',
    },
    description: {
      type: GraphQLString,
      description: 'The description of the template',
    },
    isAutoLaunchEnabled: {
      type: GraphQLBoolean,
      description: 'Indicates if auto-launch is enabled for the template.',
    },
    enableAutoLaunchAt: {
      type: GraphQLDateTime,
      description: 'The timestamp at which auto-launch will be enabled',
    },
    disableAutoLaunchAt: {
      type: GraphQLDateTime,
      description: 'The timestamp at which auto-launch will be disabled',
    },
    pageTargetingType: {
      type: new GraphQLNonNull(GuidePageTargetingEnumType),
      description: 'The type of page targeting mechanism',
    },
    pageTargetingUrl: {
      type: GraphQLString,
      description: 'The URL for side quests page targeting, if enabled',
    },
    updatedAt: {
      type: GraphQLDateTime,
    },
    editedAt: {
      type: GraphQLDateTime,
      description:
        'The timestamp at which the template was last edited, or otherwise falls back to the timestamp at which the template was created if it has not yet been edited.',
      resolve: (template) => template.editedAt || template.createdAt,
    },
    editedBy: {
      type: UserType,
      description: 'The user that last edited the template',
      resolve: async (template, _, { loaders }) =>
        template.editedByUserId
          ? loaders.userLoader.load(template.editedByUserId)
          : null,
    },
    isCyoa: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description:
        'Whether this guide is CYOA (single step guide that branches to another guide)',
      resolve: async (template, _args, _ctx) => !!template.isCyoa,
    },
    lastUsedAt: {
      type: GraphQLDateTime,
      description: 'When was the template last used',
    },
    autoLaunchForAccountsCreatedAfter: {
      type: GraphQLDateTime,
      description:
        'Automatically create and launch for this template when a new account is created?',
    },
    archivedAt: {
      type: GraphQLDateTime,
      description:
        'Indicate this template will not show for users and is effectively gone',
    },
    expireBasedOn: {
      type: new GraphQLNonNull(GuideExpirationCriteriaEnumType),
      description: 'Criteria based on which to expire guides',
    },
    expireAfter: {
      type: GraphQLInt,
      description: 'After how many days the guide should expire',
    },
    accounts: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(AccountType))
      ),
      description: 'The accounts that are using this template',
      resolve: (template, _, { loaders }) =>
        loaders.accountsUsingTemplateLoader.load(template.id),
    },
    guideBases: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GuideBaseType))
      ),
      description: 'Guide bases launched from this template',
      resolve: (template, _, { loaders }) =>
        loaders.guideBasesOfTemplateLoader.load(template.id),
    },
    modules: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ModuleType))),
      description: 'The modules that comprise this template',
      resolve: (template, _, { loaders }) =>
        loaders.modulesOfTemplateLoader.load(template.id),
    },
    dynamicModules: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ModuleType))),
      description:
        'Dynamic modules that target and can be appended to this template',
      resolve: (template, _, { loaders }) =>
        loaders.dynamicModulesOfTemplateLoader.load(template.id),
    },
    branchingModules: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ModuleType))),
      description: 'Step groups that can be branched to in this template',
      resolve: (template, _, { loaders }) =>
        loaders.branchingModulesOfTemplateLoader.load(template.id),
    },
    organization: {
      type: OrganizationType,
      resolve: (template) => template.$get('organization'),
    },
    type: {
      type: new GraphQLNonNull(GuideTypeEnumType),
      description:
        'Whether this template will create an account-specific guide or a user-specific guide',
    },
    priorityRanking: {
      type: new GraphQLNonNull(GraphQLInt),
      description:
        'Ranking that indicates the order for auto-launchable templates. Higher rankings go first.',
    },
    numberOfAccountsWithUnmodifiedGuides: {
      type: new GraphQLNonNull(GraphQLInt),
      description:
        'The number of accounts with unmodified guides created from this template',
      resolve: (template, _, { loaders }) =>
        loaders.numberOfAccountsWithUnmodifiedGuidesConnectedToTemplateLoader.load(
          template.id
        ),
    },
    state: {
      type: new GraphQLNonNull(TemplateStateEnumType),
      description:
        'The state of the template based on guide-bases created from it.',
      resolve: (template) => getTemplateState({ template }),
    },
    splitTestState: {
      type: new GraphQLNonNull(SplitTestStateEnumType),
      description:
        'The state of the split test, if this template is of type split test.',
      resolve: async (template, _, context) => {
        const { loaders } = context;

        const hasActiveGuideBases =
          await loaders.splitTestHasBeenLaunchedLoader.load(template.id);

        return getSplitTestState({
          hasActiveGuideBases,
          template,
        });
      },
    },
    stepPrototypes: {
      type: new GraphQLNonNull(new GraphQLList(StepPrototypeType)),
      resolve: (template, _, { loaders }) =>
        loaders.stepPrototypesOfTemplateLoader.load(template.id),
    },
    participantCount: {
      type: GraphQLInt,
      description: 'Number of customers using this template',
      resolve: (template, _, { loaders }) =>
        loaders.templateParticipantCountLoader.load(template.id),
    },
    usage: {
      type: TemplateUsageType,
      description: 'The usage of the template in guide base and guide count',
      resolve: async (template, _, { loaders }) =>
        loaders.templateUsageLoader.load(template.id),
    },
    targets: {
      type: TargetsType,
      description:
        'The account and account user targeting rules for this template',
      resolve: async (template, _, { loaders }) => {
        let context: object = {};
        return withRetries(
          async () => {
            const [autoLaunchRules, templateTargets, templateAudiences] =
              await Promise.all([
                loaders.templateAutoLaunchRulesOfTemplateLoader.load(
                  template.id
                ),
                loaders.templateTargetsOfTemplateLoader.load(template.id),
                loaders.templateAudiencesOfTemplateLoader.load(template.id),
              ]);

            context = {
              autoLaunchRules,
              templateTargets,
              templateAudiences,
            };

            const targets = formatTargeting({
              autoLaunchRules,
              templateTargets,
              templateAudiences,
            });

            return targets;
          },
          {
            max: 2,
            onError: (e) => {
              logger.error(
                `[template.graphQl] Error formatting targeting: ${e.message}`,
                context
              );
            },
          }
        );
      },
    },
    allowedEmbedType: {
      deprecationReason: 'use formFactor',
      type: GuideAllowedEmbedTypeEnumType,
      description:
        'The embed type (e.g. inline or sidebar) guides created from this template should be restricted to, if any.',
    },
    isTemplate: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'If it is an unlaunchable template',
    },
    isSideQuest: {
      type: GraphQLBoolean,
      description: 'Whether this guide is a side quest or a main quest.',
    },
    formFactor: {
      type: GuideFormFactorEnumType,
      description: 'The form factor this guide is meant to display as.',
    },
    formFactorStyle: FormFactorStyleResolverField,
    designType: {
      type: new GraphQLNonNull(GuideDesignTypeEnumType),
      description: 'The design type of the guide',
    },
    notificationSettings: {
      type: TemplateNotificationSettingsType,
    },
    hasIncompleteCYOAPaths: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Whether a CYOA template has incomplete paths or not.',
      deprecationReason: 'CYOA paths are branching v1 and deprecated',
      resolve: async (_, _a, _c) => false,
    },
    warnUnpublishedTag: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description:
        'Whether a warning should be shown for an everboarding template with unpublished tags.',
      resolve: async (template, _, { loaders }) => {
        const { designType, pageTargetingType } = template;
        const supportsFirstStepTagLocation = usesFirstStepTagLocation(
          template.formFactor
        );

        // Warn only for everboarding guides with visual tag targeting.
        if (
          !(
            designType === GuideDesignType.everboarding &&
            pageTargetingType === GuidePageTargetingType.visualTag
          ) &&
          !supportsFirstStepTagLocation
        )
          return false;

        const firstStep: StepPrototype | undefined =
          supportsFirstStepTagLocation
            ? (
                await loaders.stepPrototypesOfTemplateLoader.load(template.id)
              )[0]
            : undefined;

        if (firstStep) {
          return (
            (
              await loaders.stepPrototypeTaggedElementsOfStepPrototypeAndTemplateLoader.load(
                {
                  stepPrototypeId: firstStep.id,
                  templateEntityId: template.entityId,
                }
              )
            ).length === 0
          );
        }

        return (
          (
            await loaders.stepPrototypeTaggedElementsOfTemplateLoader.load(
              template.id
            )
          ).length === 0
        );
      },
    },
    taggedElements: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(StepPrototypeTaggedElementType))
      ),
      args: {
        checkFirstStepSupport: {
          type: GraphQLBoolean,
          description:
            'Whether to include the first step tag, if the guide supports it.',
        },
      },
      description:
        'The visual tags attached only to the template and not to any steps in the template',
      resolve: async (
        template,
        { checkFirstStepSupport }: { checkFirstStepSupport?: boolean },
        { loaders }
      ) => getTemplateTaggedElements(template, loaders, checkFirstStepSupport),
    },
    stats: {
      type: TemplateStatsType,
      args: { useLocked: { type: GraphQLBoolean } },
      description: TemplateStatsType.description,
      resolve: async (
        template,
        { useLocked }: { useLocked?: boolean },
        { organization, loaders }
      ) =>
        await withPerfTimer(
          'templateStats',
          async () => {
            const allowCached = await enableCachedTemplateData.enabled();

            return fetchTemplateStats({
              template,
              useLocked,
              loaders,
              allowCached,
            });
          },
          (time) => {
            if (time > 10 * 1000)
              logger.warn(
                `[fetchTemplateStats] long stat query for ${organization.name} tEid ${template.entityId}: ${time}ms`
              );
          }
        ),
    },
    announcementActivity: {
      type: new GraphQLNonNull(new GraphQLList(AnnouncementTimeSeriesPoint)),
      resolve: (template) => composeAnnouncementTimeSeries(template),
    },
    theme: {
      type: new GraphQLNonNull(ThemeType),
      description: 'The theme for this template',
    },
    autoLaunchAudienceCount: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The number of account users that match auto launch rules',
      resolve: async (template, _, { organization }) =>
        (await getTemplateAutoLaunchAudience({ organization, template }))
          .accountUsers,
    },
    launchedAt: {
      type: GraphQLDateTime,
      resolve: async (template) => {
        const auditLog = await TemplateAudit.findOne({
          attributes: ['eventName', 'createdAt'],
          where: {
            templateId: template.id,
            [Op.or]: [
              {
                eventName: AuditEvent.launched,
              },
              {
                eventName: AuditEvent.paused,
              },
            ],
          },
          order: [['createdAt', 'DESC']],
        });

        return auditLog?.eventName === AuditEvent.launched
          ? auditLog.createdAt
          : null;
      },
    },
    targetingSet: {
      type: GraphQLDateTime,
      description:
        'When/if targeting has been set by the user manually, or by manual launching',
    },
    stoppedAt: {
      type: GraphQLDateTime,
      resolve: async (template) => {
        const auditLog = await TemplateAudit.findOne({
          attributes: ['eventName', 'createdAt'],
          where: {
            templateId: template.id,
            [Op.or]: [
              {
                eventName: AuditEvent.launched,
              },
              {
                eventName: AuditEvent.paused,
              },
            ],
          },
          order: [['createdAt', 'DESC']],
        });

        return auditLog?.eventName === AuditEvent.paused
          ? auditLog.createdAt
          : null;
      },
    },
    propagationQueue: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Number of pending propagation jobs as a result of saving',
      resolve: (template) => countJobsWithSyncKey('template', template.id),
    },
    propagationCount: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The number of guides this template will propagate to',
      resolve: async (template) => {
        return await Guide.count({
          where: {
            createdFromTemplateId: template.id,
          },
          include: [
            {
              model: GuideBase.scope(['active', 'receivesPropagation']),
              required: true,
            },
          ],
        });
      },
    },
    locationShown: {
      type: GraphQLString,
      description:
        'What (wildcard) URLs might the user be exposed to the guide',
      resolve: async (template, _, { loaders, organization }) => {
        if (template.pageTargetingType === GuidePageTargetingType.visualTag) {
          const tags = await getTemplateTaggedElements(template, loaders, true);

          return tags?.[0].wildcardUrl;
        } else if (
          template.pageTargetingType === GuidePageTargetingType.inline
        ) {
          const inlineEmbed = await loaders.templateInlineEmbedLoader.load(
            template.id
          );
          return inlineEmbed?.wildcardUrl;
        } else if (
          template.pageTargetingType === GuidePageTargetingType.specificPage
        ) {
          return template.pageTargetingUrl;
        }

        const orgEmbed = await loaders.onboardingInlineEmbedsLoader.load(
          organization.id
        );

        /** Display setting: both inline and sidebar */
        if (
          !template.isSideQuest &&
          orgEmbed?.[0].state === InlineEmbedState.active
        )
          return orgEmbed[0].wildcardUrl;

        return null;
      },
    },
    inlineOnboarding: {
      type: InlineEmbedType,
      description: 'If onboarding, the inline embed where it will show up',
      resolve: (template, _, { organization, loaders }) =>
        template.isSideQuest
          ? null
          : loaders.onboardingInlineEmbedsLoader.load(organization.id),
    },
    inlineEmbed: {
      type: InlineEmbedType,
      args: {
        force: { type: GraphQLBoolean, deprecationReason: 'Not in use' },
      },
      description: 'The inline embed where this guide should be shown',
      resolve: (template, _, { loaders }) =>
        loaders.templateInlineEmbedLoader.load(template.id),
    },
    stepsCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: async (template, _args, { loaders }) => {
        const steps = await loaders.stepPrototypesOfTemplateLoader.load(
          template.id
        );
        return steps.length;
      },
    },
    inputStepAnswersCount: {
      type: new GraphQLNonNull(GraphQLInt),
      deprecationReason: 'Use template stats to share caching mechanics',
      resolve: async (template, _args, { loaders }) =>
        loaders.inputStepAnswersCountOfTemplateLoader.load(template.id),
    },
    inputsCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: async (template, _args, { loaders }) =>
        loaders.inputStepPrototypesOfTemplateCountLoader.load(template.id),
    },
    splitTargets: {
      type: new GraphQLNonNull(new GraphQLList(TemplateType)),
      description: 'Templates that this split test template leads to',
      resolve: (template, _args, { loaders }) =>
        isSplitTestGuide(template.type)
          ? loaders.templateSplitTargetsLoader.load(template.id)
          : [],
    },
    splitSources: {
      type: new GraphQLNonNull(new GraphQLList(TemplateType)),
      description: 'Templates that this split test template leads to',
      resolve: async (template, _args, { loaders }) =>
        template.type === GuideTypeEnum.splitTest
          ? []
          : loaders.templateSplitSourcesLoader.load(template.id),
    },
    isTargetedForSplitTesting: {
      type: new GraphQLNonNull(SplitTestStateEnumType),
      description:
        'Whether or not active split tests are targeting this template',
      resolve: async (template, _args, { loaders, organization }) =>
        isSplitTestGuide(template.type) ||
        !(await enableSplitTesting.enabled(organization))
          ? SplitTestState.none
          : loaders.templateTargetedBySplitTestingLoader.load(template.id),
    },
    branchingPerformance: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(BranchingPerformanceType))
      ),
      description:
        'List of step groups dynamically added by branching, and how many users selected them',
      args: { detachedOnly: { type: GraphQLBoolean } },
      resolve: (template, { detachedOnly }) =>
        getBranchingPerformance(template, detachedOnly),
    },
    branchedGuidesCount: {
      type: new GraphQLNonNull(GraphQLInt),
      description:
        'Represents number of accounts/users that have selected a branching path',
      resolve: (template) => getBranchedGuidesCount(template.id),
    },
    isEmpty: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description:
        'Indicates whether the template is empty based on step body content',
      resolve: async (template, _args, { loaders }) => {
        const stepPrototypes =
          await loaders.stepPrototypesOfTemplateLoader.load(template.id);

        return areStepPrototypesEmpty(stepPrototypes);
      },
    },
    hasGuideBases: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Indicates whether the template has one or more guide bases',
      resolve: (template, _args, { loaders }) =>
        loaders.hasGuideBasesLoader.load(template.id),
    },
    hasAutoLaunchedGuideBases: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description:
        'Indicates whether the template has one or more guide bases that have been auto-launched',
      resolve: (template, _args, { loaders }) =>
        loaders.hasAutoLaunchedGuideBasesLoader.load(template.id),
    },
    manuallyLaunchedAccounts: {
      type: new GraphQLNonNull(new GraphQLList(AccountType)),
      description:
        'The accounts to which this template has been manually launched',
      resolve: (template, _args, { loaders }) =>
        loaders.manuallyLaunchedAccountsLoader.load(template.id),
    },
    launchedBy: {
      type: new GraphQLNonNull(new GraphQLList(TemplateType)),
      description:
        'Templates that launch this one, e.g. with branching or CTA destination',
      resolve: async (template, _, { loaders }) => {
        const sources = await loaders.templatesLaunchingTemplateLoader.load(
          template.id
        );

        if (!sources.length) return [];

        const sourceIds = sources.map((s) => s.sourceTemplate);
        return loaders.templateLoader.loadMany(sourceIds);
      },
    },
  }),
});

const BranchingPerformanceType = new GraphQLObjectType({
  name: 'BranchingPerformance',
  description: 'Branching performance by destination, for step group branching',
  fields: {
    branchingPath: {
      type: BranchingPathType,
    },
    createdModule: {
      description: 'Step group targeted by branching',
      type: ModuleType,
    },
    createdTemplate: {
      description: 'Guide targeted by branching',
      type: TemplateType,
    },
    /*
    stepPrototype: {
      description: 'Step prototype branched from',
      type: StepPrototypeType,
    },
		*/
    count: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
});

export default TemplateType;
