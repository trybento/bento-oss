import { GraphQLBoolean, GraphQLNonNull } from 'graphql';

import EntityId from 'bento-common/graphql/EntityId';
import generateEmbedMutation from 'src/graphql/helpers/generateEmbedMutation';

import EmbedStepType from '../EmbedStep.graphql';
import { withTransaction } from 'src/data';
import { updateGuideLastActiveAt } from 'src/interactions/updateGuideLastActiveAt';
import { Step, StepCompletedByType } from 'src/data/models/Step.model';
import { setStepCompletion } from 'src/interactions/setStepCompletion';
import {
  triggerAvailableGuidesChangedForGuides,
  triggerGuideBaseChangedForSteps,
  triggerGuideChangedForSteps,
} from 'src/data/eventUtils';
import { InputFieldAnswersInputType } from 'src/graphql/InputStep/inputSettings';
import recordInputAnswers from 'src/interactions/inputFields/recordInputAnswers';
import { InputWithAnswer } from 'src/graphql/InputStep/types';
import { Guide, isGuideFinished } from 'src/data/models/Guide.model';
import trackCtaClicked from 'src/interactions/analytics/trackCtaClicked';

export default generateEmbedMutation({
  name: 'SetStepCompletion',
  description: 'Set step completion',
  inputFields: {
    stepEntityId: {
      type: new GraphQLNonNull(EntityId),
    },
    isComplete: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    ctaClicked: {
      deprecationReason: 'Send the ctaEntityId instead.',
      type: GraphQLBoolean,
    },
    ctaEntityId: {
      type: EntityId,
    },
    inputAnswers: InputFieldAnswersInputType,
  },
  outputFields: {
    step: {
      type: EmbedStepType,
    },
  },
  mutateAndGetPayload: async (
    { stepEntityId, isComplete, ctaClicked, ctaEntityId, inputAnswers },
    { accountUser, organization }
  ) => {
    const step = await Step.findOne({
      where: {
        entityId: stepEntityId,
        organizationId: organization.id,
      },
    });

    if (!step) {
      return {
        errors: ['Step not found'],
      };
    }

    const guide = await withTransaction(async () => {
      let inputsWithAnswers: InputWithAnswer[] = [];

      // record input answers if step is being completed
      if (isComplete && inputAnswers?.length) {
        inputsWithAnswers = await recordInputAnswers({
          step,
          accountUser,
          answers: inputAnswers,
        });
      }

      await setStepCompletion({
        step,
        isComplete: !!isComplete,
        completedByType: StepCompletedByType.AccountUser,
        accountUser,
        inputsWithAnswers,
      });

      const guide = await Guide.findOne({
        where: {
          id: step.guideId,
        },
      });

      if (guide) {
        await updateGuideLastActiveAt({
          guide,
        });

        if (ctaEntityId)
          trackCtaClicked({
            accountUserEntityId: accountUser.entityId,
            stepEntityId: step.entityId,
            organizationEntityId: organization.entityId,
            ctaEntityId,
          });
      }

      return guide;
    });

    if (isGuideFinished(guide)) {
      triggerAvailableGuidesChangedForGuides([guide!]);
    }

    triggerGuideChangedForSteps([step]);
    triggerGuideBaseChangedForSteps([step]);

    return { step };
  },
});
