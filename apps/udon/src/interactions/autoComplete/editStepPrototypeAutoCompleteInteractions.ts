import { keyBy } from 'lodash';
import {
  AutoCompleteInteractionCompletableType,
  StepAutoCompleteInteraction,
} from 'bento-common/types/stepAutoComplete';

import AutoCompleteInteraction from 'src/data/models/AutoCompleteInteraction.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { withTransaction } from 'src/data';
import { Template } from 'src/data/models/Template.model';
import AutoCompleteInteractionGuideCompletion from 'src/data/models/AutoCompleteInteractionGuideCompletion.model';
import { deleteStepPrototypeAutoCompleteInteractions } from './deleteStepPrototypeAutoCompleteInteractions';

type Args = {
  stepPrototype: StepPrototype;
  interactions: StepAutoCompleteInteraction[];
};

/** Delete auto-complete interactions of a step */
export async function editStepPrototypeAutoCompleteInteractions({
  stepPrototype,
  interactions,
}: Args): Promise<void> {
  await withTransaction(async () => {
    // clear any previous interactions
    await deleteStepPrototypeAutoCompleteInteractions({ stepPrototype });

    const templates = await Template.findAll({
      attributes: ['id', 'entityId'],
      where: {
        entityId: interactions.map((i) => i.templateEntityId).filter(Boolean),
      },
    });

    const templatesByEntityId = keyBy(templates, 'entityId');

    await AutoCompleteInteraction.bulkCreate(
      interactions.map((interaction) => ({
        organizationId: stepPrototype.organizationId,
        completableType: AutoCompleteInteractionCompletableType.stepPrototype,
        completableId: stepPrototype.id,
        interactionType: interaction.interactionType,
        ofGuideCompletions: {
          organizationId: stepPrototype.organizationId,
          templateId: templatesByEntityId[interaction.templateEntityId].id,
        },
      })),
      {
        include: [
          {
            model: AutoCompleteInteractionGuideCompletion,
            as: 'ofGuideCompletions',
          },
        ],
      }
    );
  });
}
