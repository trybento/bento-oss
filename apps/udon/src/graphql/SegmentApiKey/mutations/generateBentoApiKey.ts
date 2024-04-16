import { GraphQLBoolean, GraphQLString } from 'graphql';
import generateMutation from 'src/graphql/helpers/generateMutation';
import SegmentApiKeyType, {
  BentoApiKeyTypeEnum,
} from 'src/graphql/SegmentApiKey/SegmentApiKey.graphql';

import generateSegmentApiKey from 'src/interactions/generateSegmentApiKey';

export default generateMutation({
  name: 'GenerateBentoApiKey',
  inputFields: {
    orgEntityId: {
      type: GraphQLString,
    },
    recreate: {
      type: GraphQLBoolean,
    },
    keyType: {
      type: BentoApiKeyTypeEnum,
    },
  },
  outputFields: {
    segmentApiKey: {
      type: SegmentApiKeyType,
    },
  },
  mutateAndGetPayload: async (
    { recreate, keyType: type },
    { organization }
  ) => {
    const segmentApiKey = await generateSegmentApiKey({
      type,
      organization,
      recreate,
    });

    return { segmentApiKey };
  },
});
