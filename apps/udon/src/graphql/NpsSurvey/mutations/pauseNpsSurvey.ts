import { GraphQLNonNull } from 'graphql';
import { object } from 'superstruct';
import { WithEntityId } from 'bento-common/types';
import { Uuid } from 'bento-common/validation/customRules';

import generateMutation from 'src/graphql/helpers/generateMutation';
import { EntityId } from 'src/graphql/helpers/types';
import { assertWithGraphqlError } from 'src/utils/validation';
import NpsSurvey from 'src/data/models/NetPromoterScore/NpsSurvey.model';
import pauseNpsSurvey from 'src/interactions/netPromoterScore/pauseNpsSurvey';
import NpsSurveyType from '../NpsSurvey.graphql';

type Args = WithEntityId<{}>;

type ReturnType = {
  npsSurvey: NpsSurvey | null;
};

const pauseNpsSchema = object({
  entityId: Uuid,
});

export default generateMutation<unknown, Args>({
  name: 'PauseNpsSurvey',
  description: 'Immediately pause a previously launched NPS survey',
  inputFields: {
    entityId: {
      type: new GraphQLNonNull(EntityId),
      description: 'Entity Id of the target NPS survey',
    },
  },
  outputFields: {
    npsSurvey: {
      type: NpsSurveyType,
    },
  },
  mutateAndGetPayload: async (args, { organization }): Promise<ReturnType> => {
    assertWithGraphqlError(args, pauseNpsSchema);

    const { entityId } = args;

    const npsSurvey = await pauseNpsSurvey({ organization, entityId });

    return { npsSurvey };
  },
});
