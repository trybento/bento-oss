import { GraphQLString } from 'graphql';
import {
  BentoApiKeyType,
  SegmentApiKey,
} from 'src/data/models/SegmentApiKey.model';
import generateMutation from 'src/graphql/helpers/generateMutation';
import SegmentApiKeyType, {
  BentoApiKeyTypeEnum,
} from 'src/graphql/SegmentApiKey/SegmentApiKey.graphql';

export default generateMutation({
  name: 'DeleteBentoApiKey',
  inputFields: {
    orgEntityId: {
      type: GraphQLString,
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
  mutateAndGetPayload: async ({ keyType }, { organization }) => {
    await SegmentApiKey.destroy({
      where: {
        organizationId: organization.id,
        type: keyType || BentoApiKeyType.api,
      },
    });

    return {};
  },
});
