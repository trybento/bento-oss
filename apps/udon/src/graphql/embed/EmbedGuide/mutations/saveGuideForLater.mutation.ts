import { GraphQLNonNull } from 'graphql';

import EntityId from 'bento-common/graphql/EntityId';
import EmbedGuideType from 'src/graphql/embed/EmbedGuide/EmbedGuide.graphql';

import generateEmbedMutation from 'src/graphql/helpers/generateEmbedMutation';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';
import { Guide, GuideScope } from 'src/data/models/Guide.model';
import { triggerAvailableGuidesChangedForAccountUsers } from 'src/data/eventUtils';
import { EmbedContext } from 'src/graphql/types';
import { Events, analytics } from 'src/interactions/analytics/analytics';
import detachPromise from 'src/utils/detachPromise';

interface SaveGuideForLaterInput {
  guideEntityId: string;
}

const SaveGuideForLaterMutation = generateEmbedMutation({
  name: 'SaveGuideForLater',
  description:
    'Save the given guide so the account user can get back to it later',
  inputFields: {
    guideEntityId: {
      type: new GraphQLNonNull(EntityId),
    },
  },
  outputFields: {
    guide: {
      type: EmbedGuideType,
    },
  },
  mutateAndGetPayload: async (
    { guideEntityId }: SaveGuideForLaterInput,
    { organization, accountUser }: EmbedContext
  ) => {
    if (!guideEntityId) {
      return {
        errors: ['Guide entityId not provided'],
      };
    }

    const guide = await Guide.scope([
      GuideScope.launched,
      GuideScope.active,
    ]).findOne({
      where: { entityId: guideEntityId },
    });
    if (!guide) {
      return {
        errors: ['Guide not found'],
      };
    }

    detachPromise(
      () =>
        analytics.guide.newEvent(Events.savedForLater, {
          guideEntityId,
          accountUserEntityId: accountUser.entityId,
          organizationEntityId: organization.entityId,
        }),
      'record saved for later'
    );

    const guideParticipant = await GuideParticipant.findOne({
      where: {
        guideId: guide.id,
        organizationId: organization.id,
        accountUserId: accountUser.id,
      },
    });

    if (!guideParticipant) {
      return {
        errors: ['Guide Participant not found'],
      };
    }

    await guideParticipant.update({
      savedAt: new Date(),
    });

    triggerAvailableGuidesChangedForAccountUsers([accountUser]);

    return { guide };
  },
});

export default SaveGuideForLaterMutation;
