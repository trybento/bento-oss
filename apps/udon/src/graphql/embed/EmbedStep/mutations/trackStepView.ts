import { GraphQLNonNull, GraphQLString } from 'graphql';
import { InternalTrackEvents } from 'bento-common/types';
import { VIEWED_FROM } from 'bento-common/data/helpers';

import generateEmbedMutation from 'src/graphql/helpers/generateEmbedMutation';
import { setViewingStep } from 'src/websockets/trackView.helpers';
import detachPromise from 'src/utils/detachPromise';
import { trackStepViewingStarted } from 'src/interactions/analytics/trackStepViewingStarted';
import recordStepView from 'src/interactions/recordEvents/recordStepView';
import { logger } from 'src/utils/logger';
import { Step } from 'src/data/models/Step.model';

interface TrackStepViewArgs {
  formFactor: string;
  type: InternalTrackEvents;
  stepEntityId?: string;
}

const inputFields = {
  formFactor: {
    type: new GraphQLNonNull(GraphQLString),
  },
  type: {
    type: new GraphQLNonNull(GraphQLString),
  },
  stepEntityId: {
    type: GraphQLString,
  },
};

export default generateEmbedMutation({
  name: 'TrackStepView',
  description: 'Track step view start/end',
  inputFields,
  outputFields: inputFields,
  mutateAndGetPayload: async (
    args: TrackStepViewArgs,
    { accountUser, organization }
  ) => {
    const { formFactor, type, stepEntityId } = args;
    if (!type) {
      throw new Error('[TrackStepView] No type specified.');
    }

    if (!formFactor) {
      throw new Error('[TrackStepView] No formFactor specified.');
    }

    const accountUserEntityId = accountUser.entityId;
    const organizationEntityId = organization.entityId;
    const viewedFrom = VIEWED_FROM[formFactor];

    switch (type) {
      case InternalTrackEvents.stepViewingStarted: {
        if (!stepEntityId) {
          throw new Error(`[TrackStepView] No step id specified to track.`);
        }

        const step = await Step.findOne({
          where: {
            entityId: stepEntityId,
            organizationId: accountUser.organizationId,
          },
        });

        if (!step) {
          logger.warn(
            `[trackStepView] could not find ${stepEntityId} to start tracking`
          );

          return {
            errors: ['Step not found'],
          };
        }

        setViewingStep(accountUserEntityId, formFactor, stepEntityId);

        detachPromise(
          () =>
            trackStepViewingStarted({
              stepEntityId: stepEntityId!,
              viewedFrom,
              accountUserEntityId,
              organizationEntityId,
            }),
          'trackStepViewingStarted'
        );

        detachPromise(
          () =>
            recordStepView({
              stepEntityId,
              accountUserEntityId,
            }),
          'record step view'
        );
        break;
      }
      case InternalTrackEvents.stepViewingEnded:
        break;
    }

    // TODO: trigger guideChanged

    return args;
  },
});
