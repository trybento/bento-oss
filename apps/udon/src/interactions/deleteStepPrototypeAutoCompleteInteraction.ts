import { withTransaction } from 'src/data';
import { StepPrototypeAutoCompleteInteraction } from 'src/data/models/StepPrototypeAutoCompleteInteraction.model';
import { GuideBaseStepAutoCompleteInteraction } from 'src/data/models/GuideBaseStepAutoCompleteInteraction.model';
import { StepAutoCompleteInteraction } from 'src/data/models/StepAutoCompleteInteraction.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';

type Args = {
  stepPrototype: StepPrototype;
};

/** Delete auto complete interactions of a step */
export async function deleteStepPrototypeAutoCompleteInteraction({
  stepPrototype,
}: Args): Promise<void> {
  return await withTransaction(async () => {
    const stepPrototypeAutoCompleteInteractions =
      await StepPrototypeAutoCompleteInteraction.findAll({
        where: {
          stepPrototypeId: stepPrototype.id,
        },
      });

    if (!stepPrototypeAutoCompleteInteractions.length) return;

    const guideBaseStepAutoCompleteInteractions =
      await GuideBaseStepAutoCompleteInteraction.findAll({
        where: {
          createdFromSpacInteractionId:
            stepPrototypeAutoCompleteInteractions.map((s) => s.id),
        },
      });

    const guideBaseStepAutoCompleteInteractionIds =
      guideBaseStepAutoCompleteInteractions.map((g) => g.id);

    await StepAutoCompleteInteraction.destroy({
      where: {
        createdFromGuideBaseStepAutoCompleteInteractionId:
          guideBaseStepAutoCompleteInteractionIds,
      },
    });

    await GuideBaseStepAutoCompleteInteraction.destroy({
      where: {
        id: guideBaseStepAutoCompleteInteractionIds,
      },
    });

    // Delete step prototype auto complete interactions.
    await StepPrototypeAutoCompleteInteraction.destroy({
      where: {
        id: stepPrototypeAutoCompleteInteractions.map((s) => s.id),
      },
    });

    return;
  });
}
