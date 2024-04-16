import Dataloader from 'dataloader';
import { queryRunner } from 'src/data';
import { loadBulk } from 'src/data/loaders/helpers';
import { StepAutoCompleteInteraction } from 'src/data/models/StepAutoCompleteInteraction.model';
import { Loaders } from '..';

export const stepAutoCompleteInteractionsForGuideLoader = (loaders: Loaders) =>
  new Dataloader<number, StepAutoCompleteInteraction[]>(async (guideIds) => {
    const rows = await queryRunner<{ id: number; guideId: number }[]>({
      sql: `--sql
        SELECT
          saci.id AS "id",
          s.guide_id AS "guideId"
        FROM
          core.step_auto_complete_interactions saci
          JOIN core.guide_base_step_auto_complete_interactions gbsaci
            ON gbsaci.id = saci.created_from_guide_base_step_auto_complete_interaction_id
          JOIN core.steps s
            ON s.id = saci.step_id
        WHERE
          s.guide_id IN (:guideIds)
          AND saci.created_from_guide_base_step_auto_complete_interaction_id IS NOT NULL
          AND gbsaci.created_from_step_prototype_auto_complete_interaction_id IS NOT NULL;
      `,
      replacements: {
        guideIds,
      },
    });

    return loadBulk(
      guideIds,
      rows,
      'guideId',
      'id',
      loaders.stepAutoCompleteInteractionLoader
    );
  });

export default stepAutoCompleteInteractionsForGuideLoader;
