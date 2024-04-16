import pick from 'lodash/pick';
import { StepAutoCompleteInteractionInput } from 'bento-common/types';
import { StepPrototypeAutoCompleteInteraction } from 'src/data/models/StepPrototypeAutoCompleteInteraction.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';

type Args = {
  stepPrototype: StepPrototype;
  stepAutoCompleteInteraction:
    | StepAutoCompleteInteractionInput
    | undefined
    | null;
};

export const commonStepAutoCompleteInteractionFields: (keyof StepAutoCompleteInteractionInput)[] =
  [
    'url',
    'wildcardUrl',
    'type',
    'elementSelector',
    'elementText',
    'elementHtml',
  ];

/** Update auto complete interaction of a step */
export async function editStepPrototypeAutoCompleteInteraction({
  stepPrototype,
  stepAutoCompleteInteraction: stepAutoCompleteInteractionData,
}: Args): Promise<StepPrototypeAutoCompleteInteraction | null> {
  if (!stepAutoCompleteInteractionData) return null;

  const data = {
    stepPrototypeId: stepPrototype.id,
    organizationId: stepPrototype.organizationId,
    ...pick(
      stepAutoCompleteInteractionData,
      commonStepAutoCompleteInteractionFields
    ),
  };

  const existingInteraction =
    await StepPrototypeAutoCompleteInteraction.findOne({
      where: { stepPrototypeId: stepPrototype.id },
    });

  /**
   * Since steps will have only 1 interaction for now,
   * just get the interaction by the stepProto id. If more
   * than one are supported, use the interaction's entityId
   * instead.
   */
  if (existingInteraction) {
    return existingInteraction.update(data);
  }

  return StepPrototypeAutoCompleteInteraction.create(data);
}
