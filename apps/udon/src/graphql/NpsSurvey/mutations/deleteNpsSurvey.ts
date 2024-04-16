import { GraphQLID, GraphQLNonNull } from 'graphql';
import { object } from 'superstruct';
import { NpsSurveyInput } from 'bento-common/types/netPromoterScore';
import { WithEntityId } from 'bento-common/types';
import { Uuid } from 'bento-common/validation/customRules';
import generateMutation from 'src/graphql/helpers/generateMutation';
import { EntityId } from 'src/graphql/helpers/types';
import { assertWithGraphqlError } from 'src/utils/validation';
import { toGlobalId } from 'graphql-relay';
import deleteNpsSurvey from 'src/interactions/netPromoterScore/deleteNpsSurvey';

type Args = WithEntityId<NpsSurveyInput>;

type ReturnType = {
  deletedNpsSurveyId: string;
};

const deleteNpsSchema = object({
  entityId: Uuid,
});

export default generateMutation<unknown, Args>({
  name: 'DeleteNpsSurvey',
  description: 'Delete an NPS survey',
  inputFields: {
    entityId: {
      type: new GraphQLNonNull(EntityId),
      description: 'Entity ID of the target NPS survey',
    },
  },
  outputFields: {
    deletedNpsSurveyId: {
      type: GraphQLID,
    },
  },
  mutateAndGetPayload: async (args, { organization }): Promise<ReturnType> => {
    assertWithGraphqlError(args, deleteNpsSchema);

    const { entityId } = args;

    await deleteNpsSurvey({ organizationId: organization.id, entityId });

    return { deletedNpsSurveyId: toGlobalId('NpsSurvey', entityId) };
  },
});
