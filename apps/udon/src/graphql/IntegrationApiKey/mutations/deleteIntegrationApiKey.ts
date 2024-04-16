import { GraphQLString } from 'graphql';
import { IntegrationApiKey } from 'src/data/models/IntegrationApiKey.model';
import generateMutation from 'src/graphql/helpers/generateMutation';
import SegmentApiKeyType from 'src/graphql/SegmentApiKey/SegmentApiKey.graphql';
import { IntegrationTypeEnum } from '../IntegrationApiKey.graphql';

export default generateMutation({
  name: 'DeleteIntegrationApiKey',
  inputFields: {
    orgEntityId: {
      type: GraphQLString,
    },
    integrationType: {
      type: IntegrationTypeEnum,
    },
  },
  outputFields: {
    segmentApiKey: {
      type: SegmentApiKeyType,
    },
  },
  mutateAndGetPayload: async ({ integrationType }, { organization }) => {
    await IntegrationApiKey.destroy({
      where: {
        organizationId: organization.id,
        type: integrationType,
      },
    });

    return {};
  },
});
