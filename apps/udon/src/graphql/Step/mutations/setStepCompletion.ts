import { GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { Step, StepCompletedByType } from 'src/data/models/Step.model';

import StepType from 'src/graphql/Step/Step.graphql';
import EntityId from 'bento-common/graphql/EntityId';
import generateMutation from 'src/graphql/helpers/generateMutation';
import { setStepCompletion } from 'src/interactions/setStepCompletion';

import {
  triggerAvailableGuidesChangedForGuides,
  triggerGuideBaseChangedForSteps,
  triggerGuideChangedForSteps,
} from 'src/data/eventUtils';
import { Guide, isGuideFinished } from 'src/data/models/Guide.model';

export default generateMutation({
  name: 'SetStepCompletion',
  inputFields: {
    stepEntityId: {
      type: new GraphQLNonNull(EntityId),
    },
    isComplete: {
      type: new GraphQLNonNull(GraphQLBoolean), // TODO: Make this non-null
    },
  },
  outputFields: {
    step: {
      type: StepType,
    },
  },
  mutateAndGetPayload: async (
    { stepEntityId, isComplete },
    { user, organization }
  ) => {
    const step = await Step.findOne({
      where: {
        entityId: stepEntityId,
        organizationId: organization.id,
      },
    });

    if (!step) {
      throw new Error('Step not found');
    }

    await setStepCompletion({
      step,
      isComplete,
      completedByType: StepCompletedByType.User,
      user,
    });

    const guide = await Guide.findOne({ where: { id: step.guideId } });
    if (isGuideFinished(guide)) {
      triggerAvailableGuidesChangedForGuides([guide!]);
    }

    triggerGuideChangedForSteps([step]);
    triggerGuideBaseChangedForSteps([step]);

    return { step };
  },
});
