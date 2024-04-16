import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} from 'graphql';
import { AttributeAttributeType } from 'bento-common/graphql/attributes';
import EntityId from 'bento-common/graphql/EntityId';
import { arrayToGraphqlEnum } from 'bento-common/utils/graphql';
import { INTERNAL_TEMPLATE_ORG } from 'bento-common/utils/constants';

import AccountType from 'src/graphql/Account/Account.graphql';
import AttributeType from 'src/graphql/Attribute/Attribute.graphql';
import BranchingPathType from 'src/graphql/BranchingPath/BranchingPath.graphql';
import GuideType, {
  GuideLastActiveWithinFilterEnum,
} from 'src/graphql/Guide/Guide.graphql';
import GuideBaseType, {
  GuideCompletionPercentageFilterEnum,
} from 'src/graphql/GuideBase/GuideBase.graphql';
import StepEventMappingType from './StepEventMapping/StepEventMapping.graphql';
import { guideBasesConnection } from 'src/graphql/GuideBase/connections/guideBases.connection';
import { accountsConnection } from 'src/graphql/Account/connections/accounts.connection';
import OrganizationType from 'src/graphql/Organization/Organization.graphql';
import ModuleType from 'src/graphql/Module/Module.graphql';
import StepType from 'src/graphql/Step/Step.graphql';
import TemplateType, {
  GuideFormFactorEnumType,
} from 'src/graphql/Template/Template.graphql';
import UserType from 'src/graphql/User/User.graphql';
import AuditEventType from 'src/graphql/Audit/Audit.graphql';

import { fetchAvailableModuleIds } from 'src/interactions/fetchAvailableModules';
import fetchCustomApiEvents from 'src/interactions/fetchCustomApiEvents';
import { GraphQLContext } from './types';
import findAttributeValues from 'src/interactions/findAttributeValues';
import { findBranchingPaths } from 'src/interactions/branching/findBranchingPaths';
import AnalyticsType, { AnalyticsObject } from './analytics/Analytics.graphql';
import { accountUserAnalyticsConnection } from './AccountUser/connections/accountUserAnalytics.connection';
import CustomApiEventType, {
  CustomApiEventEnumType,
} from './CustomApiEvent/CustomApiEvent.graphql';
import fetchGuideBases from 'src/interactions/fetchGuideBases';
import fetchAccounts from 'src/interactions/fetchAccounts';
import StepEventMappingRuleType from './StepEventMappingRule/StepEventMappingRule.graphql';
import allTaggedElements from './TaggedElements/connections/allTaggedElements.connection';
import StepPrototypeType from './StepPrototype/StepPrototype.graphql';
import StepPrototypeTaggedElementType from './StepPrototypeTaggedElement/StepPrototypeTaggedElement.graphql';
import { GuideStepBaseBranchingInfo } from './GuideStepBase/GuideStepBaseBranchingInfo.graphql';
import fetchAttributesForOrganization from 'src/interactions/targeting/fetchAttributesForOrganization';
import getTemplateAuditTrail from 'src/interactions/audit/getTemplateAuditTrail';
import { Template } from 'src/data/models/Template.model';
import { Module } from 'src/data/models/Module.model';
import StepPrototypeAutoCompleteInteractionType from './StepPrototypeAutoCompleteInteraction/StepPrototypeAutoCompleteInteraction.graphql';
import { CustomAttribute } from 'src/data/models/CustomAttribute.model';
import InlineEmbedType from './InlineEmbed/InlineEmbed.graphql';
import { CustomApiEvent } from 'src/data/models/CustomApiEvent.model';
import AudienceType from './Audience/Audience.graphql';
import { Audience } from 'src/data/models/Audience.model';
import fetchTemplates, {
  FetchTemplateArgs,
  FetchTemplateGqlArgs,
} from 'src/interactions/library/fetchTemplates';
import AccountUserType from './AccountUser/AccountUser.graphql';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { StepEventMapping } from 'src/data/models/StepEventMapping.model';
import { StepEventMappingRule } from 'src/data/models/StepEventMappingRule.model';
import { BranchingPath } from 'src/data/models/BranchingPath.model';
import fetchUserIdsWhoEditedTemplates from 'src/interactions/fetchUserIdsWhoEditedTemplates';
import NpsSurveyType from './NpsSurvey/NpsSurvey.graphql';
import { npsSurveyAccountsConnections } from './NpsSurvey/connections/npsSurveyAccounts.connection';
import { templatesConnections } from './Template/connections/templates.connections';
import { OrganizationUISettingsType } from './Organization/OrganizationUISettings.graphql';
import { OrganizationOrgSettingsType } from './Organization/OrganizationSettings.graphql';
import findAccount from 'src/interactions/users/findAccount';
import findAccountUser from 'src/interactions/users/findAccountUser';
import searchAccounts from 'src/interactions/users/searchAccounts';
import searchAccountUsers from 'src/interactions/users/searchAccountUsers';
import { withRetries } from 'src/utils/helpers';
import VisualBuilderSessionGraphQlType from './VisualBuilderSession/VisualBuilderSession.graphql';
import { VisualBuilderSession } from 'src/data/models/VisualBuilderSession.model';
import InvalidRequestError from 'src/errors/InvalidRequest';

function returnIfMatchesOrg(
  item: { organizationId?: number } = {},
  organization
) {
  return item && item.organizationId === organization.id ? item : null;
}

export default new GraphQLObjectType<unknown, GraphQLContext>({
  name: 'RootType',
  fields: () => ({
    organization: {
      type: new GraphQLNonNull(OrganizationType),
      resolve: (_source, _args, { organization }) => organization,
    },
    currentUser: {
      type: new GraphQLNonNull(UserType),
      resolve: (_source, _args, { user }) => user,
    },
    accounts: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(AccountType))
      ),
      args: {
        searchQuery: {
          type: GraphQLString,
        },
        assignedToEntityId: {
          type: GraphQLString,
        },
        hasLaunchedGuides: {
          type: GraphQLBoolean,
        },
        withoutGuidesFromTemplateEntityId: {
          type: EntityId,
        },
        blocked: {
          description: 'Optional filter on blocked status',
          type: GraphQLBoolean,
        },
        limit: {
          type: GraphQLInt,
        },
      },
      resolve: (_source, args, { organization }) =>
        fetchAccounts(args, organization),
    },
    accountsConnection: {
      description: 'A paginated version of Accounts',
      ...accountsConnection(),
    },
    accountUserAnalytics: {
      description: 'A paginated list of account users with analytics data',
      ...accountUserAnalyticsConnection(),
    },
    stepEventMappings: {
      type: new GraphQLNonNull(new GraphQLList(StepEventMappingType)),
      description: 'Step event mappings for auto-launch an account has set up',
      resolve: async (_source, _args, { organization, loaders }) => {
        const mappings = await StepEventMapping.findAll({
          where: {
            organizationId: organization.id,
          },
        });
        for (const mapping of mappings) {
          loaders.stepEventMappingEntityLoader.prime(mapping.entityId, mapping);
          loaders.stepEventMappingLoader.prime(mapping.id, mapping);
        }
        return mappings;
      },
    },
    stepEventMappingRules: {
      type: new GraphQLNonNull(new GraphQLList(StepEventMappingRuleType)),
      description:
        'Step event mapping rules for auto-launch an account has set up',
      resolve: async (_source, _args, { organization, loaders }) => {
        const rules = await StepEventMappingRule.findAll({
          where: {
            organizationId: organization.id,
          },
        });
        for (const rule of rules) {
          loaders.stepEventMappingRuleEntityLoader.prime(rule.entityId, rule);
          loaders.stepEventMappingRuleLoader.prime(rule.id, rule);
        }
        return rules;
      },
    },
    customApiEvents: {
      type: new GraphQLNonNull(new GraphQLList(CustomApiEventType)),
      args: {
        name: {
          type: GraphQLString,
        },
        type: {
          type: CustomApiEventEnumType,
        },
        excludeBentoEvents: {
          type: GraphQLBoolean,
        },
        excludePseudoEvents: {
          description:
            'Exclude fake events that Bento generates for visibility',
          type: GraphQLBoolean,
        },
      },
      description: 'Custom events that have been received',
      resolve: (
        _source,
        { name, type, excludeBentoEvents, excludePseudoEvents },
        { organization, loaders }
      ) =>
        fetchCustomApiEvents({
          loaders,
          name,
          organization,
          type,
          excludeBentoEvents,
          excludePseudoEvents,
        }),
    },
    guideBases: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GuideBaseType))
      ),
      description:
        'The guide bases within the organization. They are default filtered',
      args: {
        completionPercentage: {
          type: GuideCompletionPercentageFilterEnum,
        },
        createdFromTemplateEntityId: {
          type: EntityId,
        },
        lastActiveWithin: {
          type: GuideLastActiveWithinFilterEnum,
          defaultValue: 'all',
        },
        accountNameSearchQuery: {
          type: GraphQLString,
        },
        assignedToEntityId: {
          type: GraphQLString,
        },
        hasBeenViewed: {
          type: GraphQLBoolean,
        },
      },
      resolve: (_, args, { organization }) =>
        fetchGuideBases(args, organization),
    },
    guideBasesConnection: {
      description: 'A paginated version of GuideBases',
      ...guideBasesConnection(),
    },
    searchAccounts: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(AccountType))
      ),
      args: {
        queryField: {
          type: arrayToGraphqlEnum({
            name: 'AccountQueryFieldEnum',
            keys: ['name', 'externalId'],
          }),
        },
        query: {
          type: GraphQLString,
        },
        filterAccountUserEntityId: {
          description: 'Limit accounts to what this user is in',
          type: GraphQLString,
        },
      },
      resolve: (_, args, { organization }) =>
        searchAccounts({ ...args, organizationId: organization.id }),
    },
    searchAccountUsers: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(AccountUserType))
      ),
      args: {
        queryField: {
          type: arrayToGraphqlEnum({
            name: 'AccountUserQueryFieldEnum',
            keys: ['fullName', 'email', 'externalId'],
          }),
        },
        query: {
          type: GraphQLString,
        },
        filterAccountEntityId: {
          description: 'Find users only within this account',
          type: GraphQLString,
        },
      },
      resolve: (_, args, { organization }) =>
        searchAccountUsers({ ...args, organizationId: organization.id }),
    },
    templates: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(TemplateType))
      ),
      args: FetchTemplateGqlArgs,
      resolve: (_source, args: FetchTemplateArgs, { organization }) =>
        fetchTemplates({
          organizationId: organization.id,
          ...args,
        }),
    },
    usersWhoEditedATemplate: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (_source, _args, { organization, loaders }) => {
        const userIds = await fetchUserIdsWhoEditedTemplates({ organization });
        if (userIds.length === 0) return [];
        return loaders.userLoader.loadMany(userIds);
      },
    },
    modules: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ModuleType))),
      args: {
        allowedFormFactors: {
          type: new GraphQLList(GuideFormFactorEnumType),
          description:
            'Determines a list of allowed form factors to return modules from',
        },
      },
      resolve: async (_source, args, { loaders: Loaders, organization }) => {
        const { allowedFormFactors } = args;
        const ids = await fetchAvailableModuleIds({
          organization,
          allowedFormFactors,
        });

        return Loaders.moduleLoader.loadMany(ids);
      },
    },
    audiences: {
      type: new GraphQLList(AudienceType),
      resolve: async (_, _a, { organization }) =>
        await Audience.findAll({
          where: { organizationId: organization.id },
        }),
    },
    findAudience: {
      type: AudienceType,
      args: {
        entityId: {
          type: EntityId,
        },
      },
      resolve: (_, { entityId }, { organization }) =>
        Audience.findOne({
          where: {
            entityId,
            organizationId: organization.id,
          },
        }),
    },
    attributes: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(AttributeType))
      ),
      args: {
        fullList: {
          type: GraphQLBoolean,
        },
      },
      description: 'Attributes used for targeting',
      resolve: (_, { fullList }, { loaders, organization }) =>
        fetchAttributesForOrganization({ loaders, organization, fullList }),
    },
    findAttribute: {
      type: AttributeType,
      args: {
        type: {
          type: AttributeAttributeType,
        },
        name: {
          type: GraphQLString,
        },
      },
      resolve: (_, { type, name }, { organization }) =>
        CustomAttribute.findOne({
          where: {
            name,
            type,
            organizationId: organization.id,
          },
        }),
    },
    findAttributeValues: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString))
      ),
      args: {
        name: {
          type: GraphQLString,
        },
        type: {
          type: GraphQLString,
        },
        q: {
          type: GraphQLString,
        },
        qs: {
          type: new GraphQLList(GraphQLString),
        },
      },
      description: 'Values of an account or accountUser attribute.',
      resolve: (
        _,
        {
          name,
          type,
          q,
          qs,
        }: { name?: string; type?: string; q?: string; qs?: string[] },
        { organization }
      ) => findAttributeValues(organization, name, type, q, qs),
    },
    findCustomApiEvent: {
      type: CustomApiEventType,
      args: {
        entityId: { type: EntityId },
      },
      resolve: async (_, { entityId }, { organization }) =>
        await CustomApiEvent.findOne({
          where: {
            entityId,
            organizationId: organization.id,
          },
        }),
    },
    findAccount: {
      type: AccountType,
      args: {
        entityId: {
          type: EntityId,
        },
        externalId: {
          type: GraphQLString,
        },
        includeArchived: {
          type: GraphQLBoolean,
        },
      },
      resolve: async (
        _,
        { entityId, externalId, includeArchived },
        { organization, loaders }
      ) => {
        const account = await findAccount({
          entityId,
          externalId,
          includeArchived,
          organization,
        });

        if (account) {
          loaders.accountLoader.prime(account.id, account);
          loaders.accountEntityLoader.prime(account.entityId, account);
        }
        return account;
      },
    },
    findAccountUser: {
      type: AccountUserType,
      args: {
        entityId: {
          type: EntityId,
        },
        externalId: {
          type: GraphQLString,
        },
        email: {
          type: GraphQLString,
        },
      },
      resolve: async (_, { entityId, externalId, email }, { organization }) =>
        findAccountUser({ entityId, externalId, email, organization }),
    },
    findGuidesForUser: {
      type: new GraphQLNonNull(new GraphQLList(GuideType)),
      args: {
        entityId: {
          type: new GraphQLNonNull(EntityId),
        },
      },
      resolve: async (_, { entityId }, { loaders }) => {
        const accountUser = await AccountUser.findOne({
          where: { entityId },
          attributes: ['id'],
        });

        if (!accountUser) return [];
        return loaders.guidesForAccountUser.load(accountUser.id);
      },
    },
    findGuide: {
      type: GuideType,
      args: {
        entityId: {
          type: new GraphQLNonNull(EntityId),
        },
      },
      resolve: async (_, { entityId }, { organization, loaders }) =>
        returnIfMatchesOrg(
          await loaders.guideEntityLoader.load(entityId),
          organization
        ),
    },
    findGuideBase: {
      type: GuideBaseType,
      args: {
        entityId: {
          type: new GraphQLNonNull(EntityId),
        },
      },
      resolve: async (_, { entityId }, { organization, loaders }) =>
        returnIfMatchesOrg(
          await loaders.guideBaseEntityLoader.load(entityId),
          organization
        ),
    },
    findTemplate: {
      type: TemplateType,
      args: {
        entityId: {
          type: EntityId,
        },
      },
      resolve: async (_, { entityId }, { organization, user }) => {
        if (!entityId) throw new Error('No entityId provided');

        /* Allow admins in templating org to cross search */
        const unrestrict =
          organization.slug === INTERNAL_TEMPLATE_ORG && user.isSuperadmin;
        const template = await Template.findOne({
          where: {
            entityId,
            ...(unrestrict
              ? {}
              : {
                  organizationId: organization.id,
                }),
          },
        });

        return template;
      },
    },
    findTemplates: {
      type: new GraphQLList(new GraphQLNonNull(TemplateType)),
      args: {
        entityIds: {
          type: new GraphQLList(new GraphQLNonNull(EntityId)),
        },
      },
      resolve: (_, { entityIds }, { organization }) =>
        Template.findAll({
          where: { entityId: entityIds, organizationId: organization.id },
        }),
    },
    findModule: {
      type: ModuleType,
      args: {
        entityId: {
          type: new GraphQLNonNull(EntityId),
        },
      },
      resolve: async (_, { entityId }, { organization, loaders }) =>
        returnIfMatchesOrg(
          await loaders.moduleEntityLoader.load(entityId),
          organization
        ),
    },
    findModules: {
      type: new GraphQLList(new GraphQLNonNull(ModuleType)),
      args: {
        entityIds: {
          type: new GraphQLList(new GraphQLNonNull(EntityId)),
        },
      },
      resolve: (_, { entityIds }, { organization }) =>
        Module.findAll({
          where: {
            entityId: entityIds,
            organizationId: organization.id,
          },
        }),
    },
    findStep: {
      type: StepType,
      args: {
        entityId: {
          type: new GraphQLNonNull(EntityId),
        },
      },
      resolve: async (_, { entityId }, { organization, loaders }) =>
        returnIfMatchesOrg(
          await loaders.stepEntityLoader.load(entityId),
          organization
        ),
    },
    findStepPrototype: {
      type: StepPrototypeType,
      args: {
        stepPrototypeEntityId: {
          type: new GraphQLNonNull(EntityId),
        },
      },
      resolve: async (_, { stepPrototypeEntityId }, { loaders }) => {
        return await loaders.stepPrototypeEntityLoader.load(
          stepPrototypeEntityId
        );
      },
    },
    findBranchingPaths: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(BranchingPathType))
      ),
      args: {
        branchingKey: {
          type: EntityId,
        },
      },
      resolve: (
        _,
        { branchingKey },
        { organization: { id: organizationId } }
      ) => findBranchingPaths({ branchingKey, organizationId }),
    },
    findStepPrototypeTaggedElement: {
      type: StepPrototypeTaggedElementType,
      args: {
        entityId: {
          type: EntityId,
        },
      },
      resolve: async (_, { entityId }, { organization, loaders }) =>
        returnIfMatchesOrg(
          await loaders.stepPrototypeTaggedElementEntityLoader.load(entityId),
          organization
        ),
    },
    allBranchingPaths: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(BranchingPathType))
      ),
      description: 'Gets all the branching paths possible',
      resolve: async (_, _args, { organization, loaders }) => {
        const branchingPaths = await BranchingPath.findAll({
          where: {
            organizationId: organization.id,
          },
        });
        for (const path of branchingPaths) {
          loaders.branchingPathLoader.prime(path.id, path);
          loaders.branchingPathEntityLoader.prime(path.entityId, path);
        }
        return branchingPaths;
      },
    },
    uiSettings: {
      type: OrganizationUISettingsType,
      resolve: (_, _args, { organization, loaders }) =>
        loaders.organizationSettingsOfOrganizationLoader.load(organization.id),
    },
    orgSettings: {
      type: OrganizationOrgSettingsType,
      resolve: (_, _args, { organization, loaders }) =>
        loaders.organizationSettingsOfOrganizationLoader.load(organization.id),
    },
    analytics: {
      type: AnalyticsType,
      args: {
        startDate: { type: GraphQLNonNull(GraphQLString) },
        endDate: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (_source, { startDate, endDate }, { organization }) => {
        return new AnalyticsObject(organization, startDate, endDate);
      },
    },
    allTaggedElements: allTaggedElements(),
    findGuideBaseStepBranches: {
      description:
        'Get the branching info (choices vs number of selections) for each choice of a branching guide step base. This is currently used in the GB editor',
      type: new GraphQLList(GuideStepBaseBranchingInfo),
      args: {
        guideStepBaseEntityId: { type: new GraphQLNonNull(EntityId) },
      },
      resolve: (_, { guideStepBaseEntityId }, { loaders }) => {
        return loaders.branchingInfoOfGuideStepBaseLoader.load(
          guideStepBaseEntityId
        );
      },
    },
    templateAuditTrail: {
      type: new GraphQLList(AuditEventType),
      args: {
        templateEntityId: { type: new GraphQLNonNull(EntityId) },
      },
      resolve: async (_, { templateEntityId }, { organization, loaders }) => {
        return getTemplateAuditTrail({
          templateEntityId,
          organization,
          loaders,
        });
      },
    },
    findStepPrototypeAutoCompleteInteraction: {
      type: StepPrototypeAutoCompleteInteractionType,
      args: {
        entityId: { type: new GraphQLNonNull(EntityId) },
      },
      resolve: (_, { entityId }, { loaders }) =>
        loaders.stepPrototypeAutoCompleteInteractionEntityLoader.load(entityId),
    },
    allStepPrototypeAutoCompleteInteractions: {
      type: new GraphQLList(StepPrototypeAutoCompleteInteractionType),
      resolve: (_, __, { organization, loaders }) =>
        loaders.organizationStepPrototypeAutoCompleteInteractionsLoader.load(
          organization.id
        ),
    },
    inlineEmbed: {
      type: InlineEmbedType,
      args: {
        entityId: { type: new GraphQLNonNull(EntityId) },
      },
      resolve: (_, { entityId }, { loaders }) =>
        loaders.organizationInlineEmbedEntityLoader.load(entityId),
    },
    inlineEmbeds: {
      type: new GraphQLList(InlineEmbedType),
      resolve: (_, __, { loaders, organization }) =>
        loaders.onboardingInlineEmbedsLoader.load(organization.id),
    },
    allInlineEmbeds: {
      type: new GraphQLList(InlineEmbedType),
      resolve: (_, __, { loaders, organization }) =>
        loaders.allInlineEmbedsLoader.load(organization.id),
    },
    npsSurveys: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(NpsSurveyType))
      ),
      args: {
        launched: { type: GraphQLBoolean },
      },
      resolve: (_parent, { launched }, { organization, loaders }) =>
        launched
          ? loaders.launchedNpsSurveysOfOrganizationLoader.load(organization.id)
          : loaders.npsSurveysOfOrganizationLoader.load(organization.id),
    },
    npsSurvey: {
      type: NpsSurveyType,
      args: {
        entityId: {
          type: new GraphQLNonNull(EntityId),
        },
      },
      resolve: async (_parent, { entityId }, { organization, loaders }) => {
        const survey = await loaders.npsSurveyEntityLoader.load(entityId);
        if (survey && survey.organizationId === organization.id) return survey;
        return undefined;
      },
    },
    templatesConnection: {
      description: 'Paginated library search with some sorts and filters',
      ...templatesConnections(),
    },
    npsSurveyAccountsConnection: {
      description: 'An iterable version of accounts for a given NPS survey',
      ...npsSurveyAccountsConnections(),
    },
    findVisualBuilderSession: {
      type: VisualBuilderSessionGraphQlType,
      args: {
        entityId: {
          type: EntityId,
        },
      },
      resolve: async (_, { entityId }, { organization, user }) => {
        const session = await VisualBuilderSession.findOne({
          where: {
            entityId,
            organizationId: organization.id,
            userId: user.id,
          },
        });

        return session;
      },
    },
  }),
});
