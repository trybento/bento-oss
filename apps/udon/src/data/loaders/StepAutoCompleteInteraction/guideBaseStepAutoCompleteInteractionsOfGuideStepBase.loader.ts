import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { GuideBaseStepAutoCompleteInteraction } from 'src/data/models/GuideBaseStepAutoCompleteInteraction.model';

export default function guideBaseStepAutoCompleteInteractionsOfGuideStepBaseLoader(
  loaders: Loaders
) {
  return new Dataloader<number, GuideBaseStepAutoCompleteInteraction[]>(
    async (guideStepBaseIds) => {
      const rows = await queryRunner<
        { guideBaseStepId: number; interactionId: number }[]
      >({
        sql: `--sql
          SELECT
            gbsaci.guide_base_step_id as "guideBaseStepId",
            gbsaci.id as "interactionId"
          FROM
            core.guide_base_step_auto_complete_interactions gbsaci
          WHERE
            gbsaci.guide_base_step_id IN (:guideStepBaseIds)
            AND gbsaci.created_from_step_prototype_auto_complete_interaction_id IS NOT NULL;
        `,
        replacements: {
          guideStepBaseIds,
        },
      });

      return loadBulk(
        guideStepBaseIds,
        rows,
        'guideBaseStepId',
        'interactionId',
        loaders.guideBaseStepAutoCompleteInteractionLoader
      );
    }
  );
}
