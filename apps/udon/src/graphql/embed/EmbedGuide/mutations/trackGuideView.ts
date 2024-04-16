import { GraphQLNonNull, GraphQLString } from 'graphql';
import { InternalTrackEvents } from 'bento-common/types';
import { VIEWED_FROM } from 'bento-common/data/helpers';

import generateEmbedMutation from 'src/graphql/helpers/generateEmbedMutation';
import {
  endPreviousGuideViewingGql,
  setViewingGuide,
} from 'src/websockets/trackView.helpers';
import detachPromise from 'src/utils/detachPromise';
import { trackGuideViewingStarted } from 'src/interactions/analytics/trackGuideViewingStarted';
import recordGuideView from 'src/interactions/recordEvents/recordGuideView';
import { logger } from 'src/utils/logger';
import { Guide } from 'src/data/models/Guide.model';

interface TrackGuideViewArgs {
  formFactor: string;
  type: InternalTrackEvents;
  guideEntityId?: string;
}

const inputFields = {
  formFactor: {
    type: new GraphQLNonNull(GraphQLString),
  },
  type: {
    type: new GraphQLNonNull(GraphQLString),
  },
  guideEntityId: {
    type: GraphQLString,
  },
};

export default generateEmbedMutation({
  name: 'TrackGuideView',
  description: 'Track guide view start/end',
  inputFields,
  outputFields: inputFields,
  mutateAndGetPayload: async (
    args: TrackGuideViewArgs,
    { accountUser, organization }
  ) => {
    const { formFactor, type, guideEntityId } = args;

    if (!type) {
      throw new Error('[TrackGuideView] No type specified.');
    }

    if (!formFactor) {
      throw new Error('[TrackGuideView] No formFactor specified.');
    }

    const accountUserEntityId = accountUser.entityId;
    const organizationEntityId = organization.entityId;
    const viewedFrom = VIEWED_FROM[formFactor];

    switch (type) {
      case InternalTrackEvents.guideViewingStarted: {
        if (!guideEntityId) {
          throw new Error(`[TrackGuideView] No guide id specified to track.`);
        }

        const guide = await Guide.findOne({
          where: {
            entityId: guideEntityId,
            organizationId: accountUser.organizationId,
          },
        });

        if (!guide) {
          logger.warn(
            `[trackGuideView] could not find ${guideEntityId} to start tracking`
          );

          return {
            errors: ['Guide not found'],
          };
        }

        endPreviousGuideViewingGql(accountUserEntityId, formFactor);
        setViewingGuide(accountUserEntityId, formFactor, guideEntityId);

        detachPromise(
          () =>
            trackGuideViewingStarted({
              guideEntityId: guideEntityId!,
              viewedFrom,
              accountUserEntityId,
              organizationEntityId,
            }),
          'trackGuideViewingStarted'
        );

        detachPromise(
          () =>
            recordGuideView({
              entityId: guideEntityId,
              accountUser,
            }),
          'record guide view'
        );
        break;
      }
      case InternalTrackEvents.guideViewingEnded:
        endPreviousGuideViewingGql(accountUserEntityId, formFactor);
        break;
    }

    // TODO: trigger guideChanged

    return args;
  },
});
