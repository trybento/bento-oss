import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { Sequelize } from 'sequelize-typescript';

import { enumToGraphqlEnum } from 'bento-common/utils/graphql';
import {
  InlineEmbedState,
  MinimalSidebarSize,
  OrgState,
  Theme,
} from 'bento-common/types';
import { OrgPlan } from 'bento-common/types/accounts';
import { DEFAULT_ALLOTTED_GUIDES } from 'bento-common/utils/constants';
import EntityId, { entityIdField } from 'bento-common/graphql/EntityId';

import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import AccountType from 'src/graphql/Account/Account.graphql';
import GuideType from 'src/graphql/Guide/Guide.graphql';
import TemplateType from 'src/graphql/Template/Template.graphql';
import UserType from 'src/graphql/User/User.graphql';
import SegmentApiKeyType from 'src/graphql/SegmentApiKey/SegmentApiKey.graphql';
import { Organization } from 'src/data/models/Organization.model';
import { GraphQLContext } from 'src/graphql/types';
import { filterFeatureFlags } from 'src/utils/features/api';
import { AuthType } from 'src/data/models/types';
import { BranchingQuestionType } from 'src/graphql/BranchingQuestion/BranchingQuestion.graphql';
import { OrgDiagnosticsType } from './OrgDiagnostics.graphql';
import {
  BentoApiKeyType,
  SegmentApiKey,
} from 'src/data/models/SegmentApiKey.model';
import UserAuth from 'src/data/models/UserAuth.model';
import { User } from 'src/data/models/User.model';
import { Template } from 'src/data/models/Template.model';
import { StepPrototypeTaggedElement } from 'src/data/models/StepPrototypeTaggedElement.model';
import { Audience } from 'src/data/models/Audience.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import fetchBranchingQuestions from 'src/interactions/branching/fetchBranchingQuestions';
import { hasDiagnosticWarnings } from 'src/interactions/clientDiagnostics/diagnostics.helpers';
import { OrganizationData } from 'src/data/models/Analytics/OrganizationData.model';
import InlineEmbedType from '../InlineEmbed/InlineEmbed.graphql';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { ResetLevel } from 'src/jobsBull/jobs/guideReset/helpers';
import { Account } from 'src/data/models/Account.model';
import OrganizationInlineEmbed from 'src/data/models/OrganizationInlineEmbed.model';

export const ThemeType = enumToGraphqlEnum({
  name: 'ThemeType',
  description: 'Guide themes',
  enumType: Theme,
});

export const MinimalSidebarSizeType = enumToGraphqlEnum({
  name: 'MinimalSidebarSizeType',
  description: 'Minimal sidebar size',
  enumType: MinimalSidebarSize,
});

export const OrgPlanType = enumToGraphqlEnum({
  name: 'OrgPlan',
  enumType: OrgPlan,
  description: 'Level of service this org is paying for',
});

const OrganizationStateEnumType = enumToGraphqlEnum({
  name: 'OrganizationStateEnumType',
  description: 'The current state of the org as a bento customer',
  enumType: OrgState,
});

const ResetLevelEnumType = enumToGraphqlEnum({
  name: 'ResetLevelEnumType',
  description: 'Level at which guide reset applies',
  enumType: ResetLevel,
});

const OrganizationType = new GraphQLObjectType<Organization, GraphQLContext>({
  name: 'Organization',
  fields: () => ({
    ...globalEntityId('Organization'),
    ...entityIdField(),
    createdAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
    },
    trialStartedAt: {
      type: GraphQLDateTime,
    },
    trialEndedAt: {
      type: GraphQLDateTime,
    },
    allottedGuides: {
      type: GraphQLInt,
      resolve: (organization) =>
        organization.options?.allottedGuides ?? DEFAULT_ALLOTTED_GUIDES,
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The name of the organization',
    },
    plan: {
      type: new GraphQLNonNull(OrgPlanType),
    },
    googleSSOEnabled: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Determine if the org domain has Google SSO enabled.',
      resolve: async (organization, _a, { loaders }) => {
        const googleUser = await UserAuth.findOne({
          attributes: ['id'],
          where: { type: AuthType.google },
          include: [
            {
              model: User,
              attributes: ['id'],
              where: {
                organizationId: organization.id,
              },
            },
          ],
        });

        if (googleUser) {
          loaders.userAuthLoader.prime(
            [googleUser.id, AuthType.google],
            googleUser
          );
        }

        return !!(googleUser && organization.domain);
      },
    },
    domain: {
      type: GraphQLString,
      description: 'The domain of the organization',
    },
    slug: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The unique slug identifying the organization',
    },
    state: {
      type: new GraphQLNonNull(OrganizationStateEnumType),
      description: 'The current state of the org as a bento customer',
    },
    controlSyncing: {
      type: GraphQLBoolean,
      description: 'If we need to limit the ability to consecutively propagate',
      resolve: (organization) => organization.options?.controlSyncing ?? false,
    },
    accounts: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(AccountType))
      ),
      description: 'The accounts belonging to the organization',
      resolve: (organization, _, { loaders }) =>
        loaders.accountsOfOrganizationLoader.load(organization.id),
    },
    accountsCount: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'The accounts count within the organization',
      resolve: async (organization, _, { loaders }) =>
        await loaders.accountsOfOrganizationCountLoader.load(organization.id),
    },
    templates: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(TemplateType))
      ),
      description: 'The templates within the organization',
      resolve: async (organization, _a, { loaders }) => {
        const templates = await Template.scope('contentTemplates').findAll({
          where: {
            organizationId: organization.id,
          },
          order: [['createdAt', 'ASC']],
        });
        for (const template of templates) {
          loaders.templateEntityLoader.prime(template.entityId, template);
          loaders.templateLoader.prime(template.id, template);
        }
        return templates;
      },
    },
    templatesCount: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'The templates count within the organization',
      resolve: (organization) =>
        Template.count({ where: { organizationId: organization.id } }),
    },
    guideBaseCount: {
      type: new GraphQLNonNull(GraphQLInt),
      description:
        'The count of guide bases that have been viewed within the organization',
      resolve: (organization, _, { loaders }) =>
        loaders.guideBasesOfOrganizationCountLoader.load(organization.id),
    },
    hasIntegrations: {
      type: new GraphQLList(GraphQLString),
      description: 'A list of integrations the org has',
      resolve: async (organization, _, { loaders }) => {
        const info = await loaders.organizationHasIntegrationsLoader.load(
          organization.id
        );

        if (!info) return [];

        return Object.keys(info).reduce((a, k) => {
          if (k === 'organizationId') return a;
          if (info[k]) a.push(k);

          return a;
        }, [] as string[]);
      },
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      description: 'The users in the organization',
      resolve: (organization) =>
        User.findAll({
          where: {
            organizationId: organization.id,
          },
        }),
    },
    hostnames: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString))
      ),
      resolve: async (organization) => {
        const hosts = await organization.$get('hostnames');

        return hosts.map((h) => h.hostname);
      },
    },
    taggedElementUrls: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString))
      ),
      resolve: async (organization: Organization) => {
        const orgUrls = await StepPrototypeTaggedElement.findAll({
          attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('url')), 'url']],
          where: {
            organizationId: organization.id,
          },
        });

        return orgUrls.map((o) => o.url);
      },
    },
    activeGuide: {
      type: GuideType,
      description:
        '[TEMP] The guide that is currently active this organization in a Chrome extension',
      resolve: (organization, _, { loaders }) => {
        if (organization.TEMPactiveGuideEntityId) {
          return loaders.guideEntityLoader.load(
            organization.TEMPactiveGuideEntityId
          );
        }

        return null;
      },
    },
    branchingQuestions: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(BranchingQuestionType))
      ),
      description: 'The branching questions in the organization',
      resolve: async (organization) => {
        return await fetchBranchingQuestions(organization);
      },
    },
    bentoApiKey: {
      type: SegmentApiKeyType,
      description: 'For use with Bento native API',
      resolve: (organization) =>
        SegmentApiKey.findOne({
          where: {
            organizationId: organization.id,
            type: BentoApiKeyType.api,
          },
        }),
    },
    enabledFeatureFlags: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString))
      ),
      description: 'Features enabled for this organization',
      resolve: async (organization, _, { loaders }) => {
        const flags = await loaders.featureFlagsForOrganizationLoader.load(
          organization.id
        );
        return await filterFeatureFlags(flags, 'admin');
      },
    },
    diagnostics: {
      type: OrgDiagnosticsType,
      description: 'Diagnostics for an org. Must specify keys to load data',
      resolve: async (organization, _, { loaders }) =>
        (await loaders.organizationDataOfOrganizationLoader.load(
          organization.id
        )) || {},
    },
    hasDiagnosticWarnings: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Check all cached diagnostic states without specifying keys',
      resolve: async (organization, _, { loaders }) => {
        const orgData =
          (await loaders.organizationDataOfOrganizationLoader.load(
            organization.id
          )) ?? {};

        return hasDiagnosticWarnings(orgData as OrganizationData);
      },
    },
    hasAudiences: {
      type: GraphQLBoolean,
      resolve: async (organization) => {
        const audience = await Audience.findOne({
          where: { organizationId: organization.id },
          attributes: ['id'],
        });

        return !!audience;
      },
    },
    hasLaunchedGuides: {
      type: GraphQLBoolean,
      description: 'Whether or not the org has launched a guide base.',
      resolve: async (organization) => {
        const guideBase = await GuideBase.findOne({
          where: {
            organizationId: organization.id,
          },
          attributes: ['id'],
        });

        return !!guideBase;
      },
    },
    hasAccountUsers: {
      type: GraphQLBoolean,
      resolve: async (organization) => {
        const accountUser = await AccountUser.findOne({
          where: { organizationId: organization.id },
          attributes: ['id'],
        });

        return !!accountUser;
      },
    },
    inlineEmbeds: {
      type: new GraphQLList(InlineEmbedType),
      resolve: (organization, _args, { loaders }) =>
        loaders.allInlineEmbedsLoader.load(organization.id),
    },
    visualBuilderDefaultUrl: {
      type: GraphQLString,
      description: 'Retrieves a default URL for the visual builder entry page',
      resolve: async (organization, _args, { loaders }) => {
        // First check inline embeds
        const inlineEmbed = await OrganizationInlineEmbed.findOne({
          attributes: ['url'],
          where: {
            organizationId: organization.id,
            state: InlineEmbedState.active,
          },
          // Get the last used URL
          order: [['id', 'DESC']],
        });

        if (inlineEmbed) {
          return new URL(inlineEmbed.url).origin;
        }

        // Then try tagged elements
        const stepPrototype = await StepPrototypeTaggedElement.findOne({
          attributes: ['url'],
          where: {
            organizationId: organization.id,
          },
          // Get the last used URL
          order: [['id', 'DESC']],
        });

        if (stepPrototype) {
          return new URL(stepPrototype.url).origin;
        }

        return null;
      },
    },
    areEntitiesResetting: {
      type: GraphQLBoolean,
      description:
        'Indicates whether any of the given list of entities are currently being reset',
      args: {
        resetLevel: {
          type: new GraphQLNonNull(ResetLevelEnumType),
        },
        entityIds: {
          type: new GraphQLNonNull(
            new GraphQLList(new GraphQLNonNull(EntityId))
          ),
        },
      },
      resolve: async (organization, { resetLevel, entityIds }) => {
        const where = {
          organizationId: organization.id,
          isResetting: true,
          entityId: entityIds,
        };

        switch (resetLevel) {
          case ResetLevel.Template: {
            const resetting = await Template.scope('notArchived').findOne({
              attributes: ['id'],
              where,
            });

            return !!resetting;
          }
          case ResetLevel.Account: {
            const resetting = await Account.scope('notArchived').findOne({
              attributes: ['id'],
              where,
            });

            return !!resetting;
          }
          case ResetLevel.GuideBase:
            const resetting = await GuideBase.findOne({
              attributes: ['id'],
              where,
            });

            return !!resetting;
        }

        return false;
      },
    },
  }),
});

export default OrganizationType;
