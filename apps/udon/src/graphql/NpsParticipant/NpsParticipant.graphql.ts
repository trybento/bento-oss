import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { entityIdField } from 'bento-common/graphql/EntityId';

import { GraphQLContext } from '../types';
import globalEntityId from '../helpers/types/globalEntityId';
import NpsParticipant from 'src/data/models/NetPromoterScore/NpsParticipant.model';
import AccountUserType from '../AccountUser/AccountUser.graphql';

const NpsParticipantType = new GraphQLObjectType<
  NpsParticipant,
  GraphQLContext
>({
  name: 'NpsParticipant',
  description: 'Details of a participant of a NPS survey',
  fields: {
    ...globalEntityId('NpsParticipant'),
    ...entityIdField(),
    answer: {
      type: GraphQLInt,
      description: 'Answer to the NPS survey (score)',
    },
    fupAnswer: {
      type: GraphQLString,
      description: 'Answer to the follow-up question',
    },
    answeredAt: {
      type: GraphQLDateTime,
      description: 'Moment when the participant answered the NPS survey',
    },
    dismissedAt: {
      type: GraphQLDateTime,
      description: 'Moment when the participant dismissed the NPS survey',
    },
    firstSeenAt: {
      type: GraphQLDateTime,
      description:
        'Moment when the NPS survey was first seen by the participant',
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
    },
    accountUser: {
      type: new GraphQLNonNull(AccountUserType),
      resolve: (participant, _args, { loaders }) =>
        loaders.accountUserOfNpsParticipantLoader.load(participant.id),
    },
  },
});

export default NpsParticipantType;
