import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { StepPrototypeAutoCompleteInteraction } from 'src/data/models/StepPrototypeAutoCompleteInteraction.model';
import { Loaders } from '..';
import { groupLoad } from '../helpers';

export default function stepPrototypeAutoCompleteInteractionOfStepInteractionLoader(
  loaders: Loaders
) {
  return new Dataloader<number, StepPrototypeAutoCompleteInteraction | null>(
    async (stepInteractionIds) => {
      const rows = await queryRunner<
        {
          stepInteractionId: number;
          stepInteractionPrototypeId: number;
        }[]
      >({
        sql: `--sql
          select
            saci.id as "stepInteractionId",
            gbsaui.created_from_step_prototype_auto_complete_interaction_id as "stepInteractionPrototypeId"
          from
            core.step_auto_complete_interactions saci
            join core.guide_base_step_auto_complete_interactions gbsaui
              on gbsaui.id = saci.created_from_guide_base_step_auto_complete_interaction_id
          where
            saci.id in (:stepInteractionIds)
            and saci.created_from_guide_base_step_auto_complete_interaction_id is not null
            and gbsaui.created_from_step_prototype_auto_complete_interaction_id is not null;
        `,
        replacements: {
          stepInteractionIds,
        },
      });

      return groupLoad(
        stepInteractionIds,
        rows,
        'stepInteractionId',
        'stepInteractionPrototypeId',
        loaders.stepPrototypeAutoCompleteInteractionLoader
      );
    }
  );
}
