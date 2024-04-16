import { GraphQLObjectType, GraphQLNonNull, GraphQLList } from 'graphql';
import EntityId from 'bento-common/graphql/EntityId';

import EmbedOrganization from 'src/graphql/embed/EmbedOrganization/EmbedOrganization.graphql';
import EmbedAccount from 'src/graphql/embed/EmbedAccount/EmbedAccount.graphql';
import EmbedAccountUser from 'src/graphql/embed/EmbedAccountUser/EmbedAccountUser.graphql';
import EmbedGuide from 'src/graphql/embed/EmbedGuide/EmbedGuide.graphql';
import EmbedStepAutoCompleteInteractionType from './EmbedStepAutoCompleteInteraction/EmbedStepAutoCompleteInteraction';
import EmbedInlineEmbedType from './EmbedInlineEmbeds/EmbedInlineEmbed.graphql';
import EmbedNpsSurveyType from './EmbedNpsSurvey/EmbedNpsSurvey.graphql';
import { EmbedContext } from '../types';
import { enableNpsSurveys } from 'src/utils/features';
import { EmbedOrganizationUISettingsType } from './EmbedOrganization/EmbedOrganizationSettings.graphql';

export default new GraphQLObjectType<unknown, EmbedContext>({
  name: 'RootType',
  fields: () => ({
    organization: {
      type: new GraphQLNonNull(EmbedOrganization),
      resolve: (_, _args, { organization }) => organization,
    },
    availableGuides: {
      type: new GraphQLNonNull(new GraphQLList(EmbedGuide)),
      description: 'Guides available to the user',
      resolve: async (_, __, { loaders, accountUser }) =>
        loaders.availableGuidesForAccountUserLoader.load(accountUser.id),
    },
    stepAutoCompleteInteractions: {
      type: new GraphQLNonNull(
        new GraphQLList(EmbedStepAutoCompleteInteractionType)
      ),
      resolve: async (_, _args, { accountUser, loaders }) => {
        return loaders.stepAutoCompleteInteractionsForEmbeddableLoader.load(
          accountUser.id
        );
      },
    },
    account: {
      type: new GraphQLNonNull(EmbedAccount),
      resolve: (_, _args, { account }) => account,
    },
    accountUser: {
      type: new GraphQLNonNull(EmbedAccountUser),
      resolve: (_, _args, { accountUser }) => accountUser,
    },
    npsSurveys: {
      type: new GraphQLNonNull(new GraphQLList(EmbedNpsSurveyType)),
      description:
        'Fetch an incomplete NPS survey, currently available to the end-user',
      resolve: async (_, _args, { organization, accountUser, loaders }) => {
        if (!(await enableNpsSurveys.enabled(organization))) return [];

        return loaders.npsParticipantForAccountUserLoader.load(accountUser.id);
      },
    },
    guide: {
      type: EmbedGuide,
      args: {
        guideEntityId: {
          type: new GraphQLNonNull(EntityId),
        },
      },
      resolve: async (_, { guideEntityId }, { loaders, accountUser }) =>
        loaders.availableGuideForAccountUserLoader.load([
          accountUser.id,
          guideEntityId,
        ]),
    },
    uiSettings: {
      type: EmbedOrganizationUISettingsType,
      resolve: (_source, _args, { organization, loaders }) => {
        return loaders.organizationSettingsOfOrganizationLoader.load(
          organization.id
        );
      },
    },
    inlineEmbeds: {
      type: new GraphQLList(EmbedInlineEmbedType),
      resolve: (_, __, { loaders, accountUser }) =>
        loaders.inlineEmbedsForAccountUserLoader.load(accountUser),
    },
  }),
});
