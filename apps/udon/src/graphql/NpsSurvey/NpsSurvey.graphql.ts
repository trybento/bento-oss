import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
import { entityIdField } from 'bento-common/graphql/EntityId';
import {
  NpsEndingTypeEnumType,
  NpsFollowUpQuestionTypeEnumType,
  NpsFormFactorEnumType,
  NpsPageTargetingTypeEnumType,
  NpsStartingTypeEnumType,
  NpsSurveyStateEnumType,
} from 'bento-common/graphql/netPromoterScore';
import { NpsSurveyPageTargeting } from 'bento-common/types/netPromoterScore';

import { GraphQLContext } from '../types';
import NpsSurvey from 'src/data/models/NetPromoterScore/NpsSurvey.model';
import NpsSurveyInstanceType from '../NpsSurveyInstance/NpsSurveyInstance.graphql';
import globalEntityId from '../helpers/types/globalEntityId';

const NpsScoreBreakdownType = new GraphQLObjectType({
  name: 'NpsScoreBreakdown',
  fields: {
    responses: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    promoters: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    passives: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    detractors: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    score: {
      type: GraphQLInt,
    },
  },
});

const NpsSurveyPageTargetingType = new GraphQLObjectType<
  NpsSurveyPageTargeting,
  GraphQLContext
>({
  name: 'NpsSurveyPageTargeting',
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

const NpsSurveyType = new GraphQLObjectType<NpsSurvey, GraphQLContext>({
  name: 'NpsSurvey',
  description: 'Net Promoter Score (NPS) survey',
  fields: {
    ...globalEntityId('NpsSurvey'),
    ...entityIdField(),
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    formFactor: {
      type: new GraphQLNonNull(NpsFormFactorEnumType),
    },
    formFactorStyle: {
      type: new GraphQLNonNull(GraphQLJSON),
      description: 'Presentation styles of the form factor',
    },
    question: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Follow-up question',
    },
    fupType: {
      type: new GraphQLNonNull(NpsFollowUpQuestionTypeEnumType),
      description: 'Follow-up question-type',
    },
    fupSettings: {
      type: new GraphQLNonNull(GraphQLJSON),
      description: 'Settings of the follow-up question',
    },
    startingType: {
      type: new GraphQLNonNull(NpsStartingTypeEnumType),
      description: '"Starting" criteria of the NPS survey',
    },
    startAt: {
      type: GraphQLDateTime,
    },
    endingType: {
      type: new GraphQLNonNull(NpsEndingTypeEnumType),
      description: '"Ending" criteria of the NPS survey',
    },
    endAt: {
      type: GraphQLDateTime,
    },
    endAfterTotalAnswers: {
      type: GraphQLInt,
    },
    repeatInterval: {
      type: GraphQLInt,
    },
    priorityRanking: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    targets: {
      type: new GraphQLNonNull(GraphQLJSONObject),
      description: 'Audience targeting criteria',
    },
    pageTargeting: {
      type: new GraphQLNonNull(NpsSurveyPageTargetingType),
      description: 'Page targeting criteria of NPS survey',
      resolve: (survey) => ({
        type: survey.pageTargetingType,
        url: survey.pageTargetingUrl,
      }),
    },
    totalAnswers: {
      type: new GraphQLNonNull(GraphQLInt),
      description:
        'Total number of answers collected across all launched instances',
      resolve: async (survey, _args, { loaders }) =>
        loaders.totalAnswersOfNpsSurveyLoader.load(survey.id),
    },
    totalViews: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Total number of account user views for the NPS survey',
      resolve: async (survey, _args, { loaders }) =>
        loaders.totalViewsOfNpsSurveyLoader.load(survey.id),
    },
    scoreBreakdown: {
      type: NpsScoreBreakdownType,
      description:
        'The NPS score and breakdown (promoters, detractors, passives) for the given NPS survey',
      resolve: async (survey, _args, { loaders }) =>
        loaders.npsScoreBreakdownOfNpsSurveyLoader.load(survey.id),
    },
    lastLaunchedAt: {
      type: GraphQLDateTime,
      description: 'When it was last launched',
      resolve: async (survey, _args, { loaders }) =>
        loaders.lastLaunchedAtOfNpsSurveyLoader.load(survey.id),
    },
    state: {
      type: new GraphQLNonNull(NpsSurveyStateEnumType),
      description: 'The current state of NPS survey',
    },
    launchedAt: {
      type: GraphQLDateTime,
    },
    deletedAt: {
      type: GraphQLDateTime,
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
    },
    instances: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(NpsSurveyInstanceType))
      ),
      resolve: (survey, _args, { loaders }) =>
        loaders.npsSurveyInstancesOfNpsSurveyLoader.load(survey.id),
    },
  },
});

export default NpsSurveyType;
