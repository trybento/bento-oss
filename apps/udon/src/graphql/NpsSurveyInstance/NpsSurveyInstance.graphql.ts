import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { entityIdField } from 'bento-common/graphql/EntityId';
import { NpsSurveyInstanceStateEnumType } from 'bento-common/graphql/netPromoterScore';

import { GraphQLContext } from '../types';
import NpsSurveyInstance from 'src/data/models/NetPromoterScore/NpsSurveyInstance.model';
import globalEntityId from '../helpers/types/globalEntityId';
import NpsParticipantType from '../NpsParticipant/NpsParticipant.graphql';

const NpsSurveyInstanceType = new GraphQLObjectType<
  NpsSurveyInstance,
  GraphQLContext
>({
  name: 'NpsSurveyInstance',
  description: 'Single instance of a Net Promoter Score (NPS) survey',
  fields: {
    ...globalEntityId('NpsSurvey'),
    ...entityIdField(),
    state: {
      type: new GraphQLNonNull(NpsSurveyInstanceStateEnumType),
    },
    totalAnswers: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Total number of answers received',
    },
    startedAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
      description: 'Moment when this survey actually started launching',
    },
    endedAt: {
      type: GraphQLDateTime,
      description: 'Moment when this survey stopped launching',
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
    },
    participants: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(NpsParticipantType))
      ),
      resolve: (instance, _args, { loaders }) =>
        loaders.npsParticipantsOfNpsSurveyInstanceLoader.load(instance.id),
    },
  },
});

export default NpsSurveyInstanceType;
