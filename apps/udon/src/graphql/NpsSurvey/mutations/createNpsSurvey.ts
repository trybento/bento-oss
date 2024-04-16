import { NpsSurveyInput } from 'bento-common/types/netPromoterScore';

import generateMutation from 'src/graphql/helpers/generateMutation';
import { npsSurveyCreateOrUpdateSchema } from 'src/interactions/netPromoterScore/helpers';
import upsertNpsSurvey from 'src/interactions/netPromoterScore/upsertNpsSurvey';
import { assertWithGraphqlError } from 'src/utils/validation';
import NpsSurvey from 'src/data/models/NetPromoterScore/NpsSurvey.model';
import NpsSurveyType from '../NpsSurvey.graphql';
import { npsSurveyInputFields } from '../helpers';

type Args = NpsSurveyInput;

type ReturnType = {
  npsSurvey: NpsSurvey;
};

export default generateMutation<unknown, Args>({
  name: 'CreateNpsSurvey',
  description: 'Create a new NPS Survey',
  inputFields: npsSurveyInputFields,
  outputFields: {
    npsSurvey: {
      type: NpsSurveyType,
    },
  },
  mutateAndGetPayload: async (args, { organization }): Promise<ReturnType> => {
    assertWithGraphqlError(args, npsSurveyCreateOrUpdateSchema);

    const [npsSurvey] = await upsertNpsSurvey({
      organization,
      input: args,
    });

    return { npsSurvey };
  },
});
