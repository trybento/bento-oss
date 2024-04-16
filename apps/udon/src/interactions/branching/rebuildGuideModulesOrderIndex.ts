import { QueryTypes } from 'sequelize';

import { SelectedModelAttrs } from 'bento-common/types';
import { queryRunner } from 'src/data';
import { Guide } from 'src/data/models/Guide.model';
import { extractId } from 'src/utils/helpers';

type Args = {
  /** Which guide to affect */
  guide: SelectedModelAttrs<Guide, 'id'> | number;
};

/**
 * Re-computes the order index of GuideModules of a given guide.
 *
 * NOTE: Since this function is usually called when adding new instances after branching,
 * it favors the most recent instances in case of sorting conflicts.
 */
export async function rebuildGuideModulesOrderIndex({
  guide,
}: Args): Promise<number> {
  const guideId = extractId(guide);

  const [_, affectedRows] = await queryRunner<[any, number]>({
    sql: `--sql
      with
        sorted as (
          select
            gm.id,
            row_number() over (
              order by
                -- respects the current order of things
                gm.order_index asc,
                -- in case of conflicts, the thing added later wins
                gm.id desc
            ) - 1 as "new_order_index"
          from
            core.guide_modules gm
            join core.guides g on g.id = gm.guide_id
          where
            g.id = :guideId
            -- exclude removed modules
            and gm.deleted_at is null
        )
      update
        core.guide_modules gm
      set
        order_index = sorted.new_order_index
      from
        sorted
      where
        gm.id = sorted.id
        and gm.order_index != sorted.new_order_index;
    `,
    replacements: {
      guideId,
    },
    type: QueryTypes.UPDATE,
  });

  return affectedRows;
}
