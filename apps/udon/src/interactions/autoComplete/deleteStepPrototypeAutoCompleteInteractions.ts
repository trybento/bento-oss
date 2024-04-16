import { AutoCompleteInteractionCompletableType } from 'bento-common/types/stepAutoComplete';
import AutoCompleteInteraction from 'src/data/models/AutoCompleteInteraction.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';

type Args = {
  stepPrototype: StepPrototype;
};

/** Delete auto-complete interactions of a step */
export async function deleteStepPrototypeAutoCompleteInteractions({
  stepPrototype,
}: Args): Promise<void> {
  await AutoCompleteInteraction.destroy({
    where: {
      organizationId: stepPrototype.organizationId,
      completableType: AutoCompleteInteractionCompletableType.stepPrototype,
      completableId: stepPrototype.id,
    },
  });
}
