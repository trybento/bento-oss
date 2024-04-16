import { GraphQLNonNull } from 'graphql';
import { Step } from 'src/data/models/Step.model';

import generateEmbedMutation from 'src/graphql/helpers/generateEmbedMutation';
import { EntityId } from 'src/graphql/helpers/types';
import { EmbedContext } from 'src/graphql/types';
import { graphQlError } from 'src/graphql/utils';
import trackCtaClicked from 'src/interactions/analytics/trackCtaClicked';

interface TrackCtaClickedInput {
  stepEntityId: string;
  ctaEntityId?: string;
}

const TrackCtaClickedMutation = generateEmbedMutation({
  name: 'TrackCtaClicked',
  description: 'Registers a CTA as clicked without any other action',
  inputFields: {
    stepEntityId: {
      type: new GraphQLNonNull(EntityId),
    },
    ctaEntityId: {
      type: EntityId,
    },
  },
  outputFields: {},
  mutateAndGetPayload: async (
    { stepEntityId, ctaEntityId }: TrackCtaClickedInput,
    { accountUser, organization }: EmbedContext
  ) => {
    const step = await Step.findOne({
      where: {
        organizationId: organization.id,
        entityId: stepEntityId,
      },
      attributes: ['id', 'entityId'],
    });

    if (!step) return graphQlError('Step not found');
    if (!ctaEntityId) return graphQlError('CTA entityId not provided');

    trackCtaClicked({
      accountUserEntityId: accountUser.entityId,
      stepEntityId: step.entityId,
      organizationEntityId: organization.entityId,
      ctaEntityId,
    });

    return {};
  },
});

export default TrackCtaClickedMutation;
