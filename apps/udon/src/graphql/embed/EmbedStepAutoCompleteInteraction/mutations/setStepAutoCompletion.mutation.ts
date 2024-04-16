import { GraphQLNonNull } from 'graphql';

import EntityId from 'bento-common/graphql/EntityId';
import { DataSource } from 'bento-common/types';
import generateEmbedMutation from 'src/graphql/helpers/generateEmbedMutation';

import EmbedStepType from '../../EmbedStep/EmbedStep.graphql';
import { withTransaction } from 'src/data';
import { updateGuideLastActiveAt } from 'src/interactions/updateGuideLastActiveAt';
import { Step, StepCompletedByType } from 'src/data/models/Step.model';
import { setStepCompletion } from 'src/interactions/setStepCompletion';
import {
  triggerAvailableGuidesChangedForGuides,
  triggerGuideBaseChangedForSteps,
  triggerGuideChangedForSteps,
  triggerStepAutoCompleteInteractionsChangedForGuides,
} from 'src/data/eventUtils';
import { Guide, isGuideFinished } from 'src/data/models/Guide.model';
import { StepAutoCompleteInteraction } from 'src/data/models/StepAutoCompleteInteraction.model';
import { GuideBaseStepAutoCompleteInteraction } from 'src/data/models/GuideBaseStepAutoCompleteInteraction.model';
import { StepPrototypeAutoCompleteInteraction } from 'src/data/models/StepPrototypeAutoCompleteInteraction.model';
import detachPromise from 'src/utils/detachPromise';
import { recordCustomApiEvent } from 'src/interactions/recordEvents/recordCustomApiEvents';
import { AccountUser } from 'src/data/models/AccountUser.model';

export default generateEmbedMutation({
  name: 'SetStepAutoCompletion',
  description: 'Set step auto completion by interaction',
  inputFields: {
    interactionEntityId: {
      type: new GraphQLNonNull(EntityId),
    },
  },
  outputFields: {
    step: {
      type: EmbedStepType,
    },
  },
  mutateAndGetPayload: async (
    { interactionEntityId },
    { accountUser, organization }
  ) => {
    const interaction = await StepAutoCompleteInteraction.findOne({
      where: {
        entityId: interactionEntityId,
        organizationId: organization.id,
      },
      include: [{ model: Step }],
    });

    if (!interaction) {
      return {
        errors: ['Step auto complete interaction not found'],
      };
    }

    const { step } = interaction;

    // Skip if step is complete.
    if (step.completedAt) {
      return { step };
    }

    const guide = await withTransaction(async () => {
      await setStepCompletion({
        step,
        isComplete: true,
        completedByType: StepCompletedByType.Auto,
        accountUser,
      });

      const guide = await Guide.findOne({
        where: { id: step.guideId },
      });

      if (guide) {
        await updateGuideLastActiveAt({ guide });
      }

      return guide;
    });

    detachPromise(
      () => createAutocompleteInteractionEvent(interaction, accountUser),
      'create autocomplete click event'
    );

    if (isGuideFinished(guide)) {
      triggerAvailableGuidesChangedForGuides([guide!]);
    }
    if (guide) {
      triggerStepAutoCompleteInteractionsChangedForGuides([guide]);
    }

    triggerGuideChangedForSteps([step]);
    triggerGuideBaseChangedForSteps([step]);

    return { step };
  },
});

const createAutocompleteInteractionEvent = async (
  interaction: StepAutoCompleteInteraction,
  accountUser: AccountUser
) => {
  const guideStepBaseInteraction =
    await GuideBaseStepAutoCompleteInteraction.findOne({
      where: {
        id: interaction.createdFromGuideBaseStepAutoCompleteInteractionId,
      },
      include: [
        {
          model: StepPrototypeAutoCompleteInteraction,
          attributes: ['elementText', 'id', 'stepPrototypeId'],
        },
      ],
    });

  const ref = guideStepBaseInteraction?.stepPrototypeAutoCompleteInteraction;

  if (!ref) {
    throw new Error('Failed to find the auto completed interaction reference');
  }

  const elementLabel = ref.elementText || ref.url || ref.wildcardUrl;

  const eventName = `Element clicked: ${elementLabel}`;
  const stepPrototypeIdCompleted = ref.stepPrototypeId;

  await recordCustomApiEvent({
    eventName,
    organizationId: interaction.organizationId,
    source: DataSource.bento,
    eventProperties: {},
    debugInformation: {
      autoCompletedStepIds: stepPrototypeIdCompleted
        ? [stepPrototypeIdCompleted]
        : [],
      triggeredByAccountUserId: accountUser.id,
      payload: {
        triggeredFromUrl: ref.url,
      },
    },
    internalProperties: stepPrototypeIdCompleted
      ? {
          stepPrototypeId: stepPrototypeIdCompleted,
        }
      : {},
    accountUserId: accountUser.id,
  });
};
