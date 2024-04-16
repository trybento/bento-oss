import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import GraphQLJSON from 'graphql-type-json';
import { entityIdField } from 'bento-common/graphql/EntityId';
import {
  NpsFollowUpQuestionTypeEnumType,
  NpsFormFactorEnumType,
  NpsPageTargetingTypeEnumType,
} from 'bento-common/graphql/netPromoterScore';
import { NpsSurveyPageTargeting } from 'bento-common/types/netPromoterScore';

import { EmbedContext } from 'src/graphql/types';
import NpsParticipant from 'src/data/models/NetPromoterScore/NpsParticipant.model';
import globalEntityId from 'src/graphql/helpers/types/globalEntityId';

/** @todo break down to share with `NpsSurveyPageTargetingType` */
const EmbedNpsSurveyPageTargetingType = new GraphQLObjectType<
  NpsSurveyPageTargeting,
  EmbedContext
>({
  name: 'EmbedNpsSurveyPageTargeting',
  description: 'Page targeting criteria of NPS survey',
  fields: () => ({
    type: {
      type: new GraphQLNonNull(NpsPageTargetingTypeEnumType),
      description: 'Page targeting criteria',
    },
    url: {
      type: GraphQLString,
      description:
        'Page targeting URL when targeting is set to a specific page',
    },
  }),
});

/**
 * Based off participant as that is unique to the user
 * The entityId as such is the NpsParticipant
 */
const EmbedNpsSurveyType = new GraphQLObjectType<NpsParticipant, EmbedContext>({
  name: 'EmbedNpsSurvey',
  description: 'Net Promoter Score (NPS) survey',
  fields: {
    ...globalEntityId('EmbedNpsSurvey'),
    ...entityIdField(),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (np, _, { loaders }) => {
        const survey = await loaders.npsSurveyOfParticipantLoader.load(np.id);
        return survey?.name;
      },
    },
    formFactor: {
      type: new GraphQLNonNull(NpsFormFactorEnumType),
      resolve: async (np, _, { loaders }) => {
        const survey = await loaders.npsSurveyOfParticipantLoader.load(np.id);
        return survey?.formFactor;
      },
    },
    formFactorStyle: {
      type: new GraphQLNonNull(GraphQLJSON),
      description: 'Presentation styles of the form factor',
      resolve: async (np, _, { loaders }) => {
        const survey = await loaders.npsSurveyOfParticipantLoader.load(np.id);
        return survey?.formFactor;
      },
    },
    question: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Follow-up question',
      resolve: async (np, _, { loaders }) => {
        const survey = await loaders.npsSurveyOfParticipantLoader.load(np.id);
        return survey?.question;
      },
    },
    fupType: {
      type: new GraphQLNonNull(NpsFollowUpQuestionTypeEnumType),
      description: 'Follow-up question-type',
      resolve: async (np, _, { loaders }) => {
        const survey = await loaders.npsSurveyOfParticipantLoader.load(np.id);
        return survey?.fupType;
      },
    },
    fupSettings: {
      type: new GraphQLNonNull(GraphQLJSON),
      description: 'Settings of the follow-up question',
      deprecationReason: 'Not implemented',
      resolve: async (np, _, { loaders }) => {
        const survey = await loaders.npsSurveyOfParticipantLoader.load(np.id);
        return survey?.fupSettings;
      },
    },
    orderIndex: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (np, _args, { accountUser, loaders }) => {
        return loaders.orderIndexOfNpsParticipantLoader.load({
          accountUserId: accountUser.id,
          npsParticipantId: np.id,
        });
      },
    },
    pageTargeting: {
      type: new GraphQLNonNull(EmbedNpsSurveyPageTargetingType),
      description: 'Page targeting criteria of NPS survey',
      resolve: async (np, _, { loaders }) => {
        const survey = await loaders.npsSurveyOfParticipantLoader.load(np.id);
        return {
          type: survey!.pageTargetingType,
          url: survey!.pageTargetingUrl,
        };
      },
    },
    firstSeenAt: {
      type: GraphQLDateTime,
      description: 'Moment when this was seen for the first time',
    },
    answeredAt: {
      type: GraphQLDateTime,
      description: 'Moment when this got answered',
    },
    dismissedAt: {
      type: GraphQLDateTime,
      description: 'Moment when this got dismissed',
    },
  },
});

export default EmbedNpsSurveyType;
