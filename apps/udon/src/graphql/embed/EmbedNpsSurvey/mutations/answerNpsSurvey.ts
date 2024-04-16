import { GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import EntityId from 'bento-common/graphql/EntityId';
import { WithEntityId } from 'bento-common/types';
import { NpsSurveyAnswerInput } from 'bento-common/types/netPromoterScore';

import generateEmbedMutation from 'src/graphql/helpers/generateEmbedMutation';
import answerNpsSurvey from 'src/interactions/netPromoterScore/answerNpsSurvey';
import EmbedNpsSurveyType from '../EmbedNpsSurvey.graphql';
import { graphQlError } from 'src/graphql/utils';

export type AnswerNpsSurveyMutationArgs = WithEntityId<NpsSurveyAnswerInput>;

export default generateEmbedMutation<unknown, AnswerNpsSurveyMutationArgs>({
  name: 'AnswerNpsSurvey',
  description: 'Record the answer given by the end-user to a NPS Survey',
  inputFields: {
    entityId: {
      type: new GraphQLNonNull(EntityId),
      description: 'Entity ID of the NPS survey',
    },
    answer: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'NPS Score given by the end-user',
    },
    fupAnswer: {
      type: GraphQLString,
      description: 'Answer to the follow-up question given by the end-user',
    },
  },
  outputFields: {
    npsSurvey: {
      type: EmbedNpsSurveyType,
    },
  },
  mutateAndGetPayload: async (
    { entityId, answer, fupAnswer = null },
    { accountUser }
  ) => {
    try {
      const result = await answerNpsSurvey({
        entityId,
        answer,
        fupAnswer,
        accountUser,
      });

      if (result) {
        const [_npsSurvey, participant] = result;

        return { npsSurvey: participant };
      } else {
        return null;
      }
    } catch (innerError: any) {
      return graphQlError('Something went wrong');
    }
  },
});
