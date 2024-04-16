import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { loadBulk } from 'src/data/loaders/helpers';
import { StepAutoCompleteInteraction } from 'src/data/models/StepAutoCompleteInteraction.model';
import { Loaders } from '..';

export const stepAutoCompleteInteractionsForAccountUserLoader = (
  loaders: Loaders
) =>
  new Dataloader<number, StepAutoCompleteInteraction[]>(
    async (accountUserIds) => {
      const rows = (await queryRunner({
        sql: `--sql
      SELECT
        saci.id AS "id",
        gp.account_user_id AS "accountUserId"
      FROM
        core.step_auto_complete_interactions saci
      JOIN core.guide_base_step_auto_complete_interactions gbsaci
        ON gbsaci.id = saci.created_from_guide_base_step_auto_complete_interaction_id
      JOIN core.steps s ON
        s.id = saci.step_id
      JOIN core.guides gd ON
        gd.id = s.guide_id
      JOIN core.guide_participants gp ON
        gp.guide_id = gd.id
      JOIN core.guide_bases gb ON
        gb.id = gd.created_from_guide_base_id
      JOIN core.account_users au ON
        au.id = gp.account_user_id
      JOIN core.accounts acc ON
        acc.id = au.account_id
      WHERE
        gd.state = 'active'
        AND gb.state = 'active'
        AND gd.launched_at IS NOT NULL
        AND gd.completed_at IS NULL
        AND s.completed_at IS NULL
        AND acc.deleted_at IS NULL
				AND gb.deleted_at IS NULL
        AND gd.deleted_at IS NULL
        AND saci.created_from_guide_base_step_auto_complete_interaction_id IS NOT NULL
        AND gbsaci.created_from_step_prototype_auto_complete_interaction_id IS NOT NULL
        AND gp.account_user_id IN (:accountUserIds);
      `,
        replacements: {
          accountUserIds,
        },
      })) as { id: number; accountUserId: number }[];

      return loadBulk(
        accountUserIds,
        rows,
        'accountUserId',
        'id',
        loaders.stepAutoCompleteInteractionLoader
      );
    }
  );

export default stepAutoCompleteInteractionsForAccountUserLoader;
