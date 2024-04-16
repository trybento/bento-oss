import { GraphQLNonNull } from 'graphql';
import EntityId from 'bento-common/graphql/EntityId';
import generateEmbedMutation from 'src/graphql/helpers/generateEmbedMutation';
import EmbedNpsSurveyType from '../EmbedNpsSurvey.graphql';
import { getSurveyParticipant } from './embedNpsSurveyMutations.helpers';

type Args = {
  entityId: string;
};

export default generateEmbedMutation<unknown, Args>({
  name: 'DismissNpsSurvey',
  description: 'Record an NPS Survey as dimissed by the end-user',
  inputFields: {
    entityId: {
      type: new GraphQLNonNull(EntityId),
      description: 'Entity ID of the NPS survey',
    },
  },
  outputFields: {
    npsSurvey: {
      type: EmbedNpsSurveyType,
    },
  },
  mutateAndGetPayload: async ({ entityId }, { accountUser }) => {
    const participant = await getSurveyParticipant({
      accountUserId: accountUser.id,
      surveyEntityId: entityId,
    });

    /**
     * If we don't have a participant, it likely means that
     * the survey has been deleted, so just ignore the dismiss.
     */
    if (!participant?.instance) {
      return null;
    }

    if (!participant.dismissedAt)
      await participant.update({
        dismissedAt: new Date(),
      });

    return { npsSurvey: participant };
  },
});
