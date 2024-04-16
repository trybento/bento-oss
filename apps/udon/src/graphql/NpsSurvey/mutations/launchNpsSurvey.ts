import { GraphQLNonNull } from 'graphql';
import { object } from 'superstruct';
import { NpsSurveyInput } from 'bento-common/types/netPromoterScore';
import { WithEntityId } from 'bento-common/types';
import { Uuid } from 'bento-common/validation/customRules';

import generateMutation from 'src/graphql/helpers/generateMutation';
import { EntityId } from 'src/graphql/helpers/types';
import { assertWithGraphqlError } from 'src/utils/validation';
import NpsSurvey from 'src/data/models/NetPromoterScore/NpsSurvey.model';
import launchNpsSurvey from 'src/interactions/netPromoterScore/launchNpsSurvey';
import NpsSurveyType from '../NpsSurvey.graphql';

type Args = WithEntityId<NpsSurveyInput>;

type ReturnType = {
  npsSurvey: NpsSurvey | null;
};

const launchNpsSchema = object({
  entityId: Uuid,
});

export default generateMutation<unknown, Args>({
  name: 'LaunchNpsSurvey',
  description: 'Immediately launch or schedule a NPS survey',
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
    assertWithGraphqlError(args, launchNpsSchema);

    const { entityId } = args;

    const npsSurvey = await launchNpsSurvey({ organization, entityId });

    return { npsSurvey };
  },
});
