import { GraphQLBoolean, GraphQLList, GraphQLNonNull } from 'graphql';
import EntityId from 'bento-common/graphql/EntityId';
import EmbedGuideType from 'src/graphql/embed/EmbedGuide/EmbedGuide.graphql';
import generateEmbedMutation from 'src/graphql/helpers/generateEmbedMutation';
import { EmbedContext } from 'src/graphql/types';
import launchDestinationGuide, {
  LaunchDestinationArgs,
} from 'src/interactions/embed/launchDestinationGuide';
import { triggerAvailableGuidesChangedForAccountUsers } from 'src/data/eventUtils';
import trackCtaClicked from 'src/interactions/analytics/trackCtaClicked';
import { queueIdentifyChecks } from 'src/jobsBull/jobs/handleIdentifyChecks/identifyChecks.helpers';
import detachPromise from 'src/utils/detachPromise';
import EmbedStepAutoCompleteInteractionType from '../../EmbedStepAutoCompleteInteraction/EmbedStepAutoCompleteInteraction';

type GetDestinationGuideInput = LaunchDestinationArgs;

const GetDestinationGuideMutation = generateEmbedMutation<
  unknown,
  GetDestinationGuideInput
>({
  name: 'GetDestinationGuide',
  description: 'Launch and return the destination guide to the user',
  inputFields: {
    stepEntityId: {
      type: new GraphQLNonNull(EntityId),
    },
    ctaEntityId: {
      type: new GraphQLNonNull(EntityId),
    },
    destinationKey: {
      type: new GraphQLNonNull(EntityId),
    },
    markComplete: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Whether to mark the step as complete',
    },
  },
  outputFields: {
    guide: {
      type: EmbedGuideType,
    },
    /**
     * Include the auto-complete interactions associated with the launched
     * guide, in case we are relaunching an already-completed guide.
     */
    stepAutoCompleteInteractions: {
      type: new GraphQLNonNull(
        new GraphQLList(
          new GraphQLNonNull(EmbedStepAutoCompleteInteractionType)
        )
      ),
    },
  },
  mutateAndGetPayload: async (
    { destinationKey, stepEntityId, ctaEntityId, markComplete = false },
    { account, accountUser, organization, loaders }: EmbedContext
  ) => {
    const guide = await launchDestinationGuide(
      { destinationKey, stepEntityId, ctaEntityId, markComplete },
      { account, accountUser, organization }
    );

    const stepAutoCompleteInteractions =
      await loaders.stepAutoCompleteInteractionsForGuideLoader.load(guide.id);

    triggerAvailableGuidesChangedForAccountUsers([accountUser]);

    /**
     * Records the "CTA clicked" event to support analytics,
     * since this resulted in the step being marked as complete.
     */
    trackCtaClicked({
      ctaEntityId,
      accountUserEntityId: accountUser.entityId,
      stepEntityId: stepEntityId,
      organizationEntityId: organization.entityId,
    });

    detachPromise(async () => {
      /**
       * Queues a new identify check to potentially launch any
       * guides targeted by "guide received"
       */
      await queueIdentifyChecks({
        behavior: {
          checkAccounts: true,
          checkAccountUsers: true,
          accountChanged: true,
          accountUserChanged: true,
          emitSocketEvents: true,
          recordAttributes: false,
        },
        accountEntityId: account.entityId,
        accountAttributes: account.attributes,
        accountUserEntityId: accountUser.entityId,
        accountUserAttributes: accountUser.attributes,
      });
    });

    return { guide, stepAutoCompleteInteractions };
  },
});

export default GetDestinationGuideMutation;
