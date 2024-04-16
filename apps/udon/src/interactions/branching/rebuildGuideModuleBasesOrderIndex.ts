import { QueryTypes } from 'sequelize';

import { SelectedModelAttrs } from 'bento-common/types';
import { queryRunner } from 'src/data';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { extractId } from 'src/utils/helpers';

type Args = {
  /** Which GuideBase to affect */
  guideBase: SelectedModelAttrs<GuideBase, 'id'> | number;
};

/**
 * Re-computes the order index of GuideModuleBases of a given guide base.
 *
 * NOTE: Since this function is usually called when adding new instances after branching,
 * it favors the most recent instances in case of sorting conflicts.
 */
export async function rebuildGuideModuleBasesOrderIndex({
  guideBase,
}: Args): Promise<number> {
  const guideBaseId = extractId(guideBase);

  const [_, affectedRows] = await queryRunner<[any, number]>({
    sql: `--sql
      with
        sorted as (
          select
            gmb.id,
            row_number() over (
              order by
                -- respects the current order of things
                gmb.order_index asc,
                -- in case of conflicts, the thing dynamically added later wins
                gmb.added_dynamically_at desc
            ) - 1 as "new_order_index"
          from
            core.guide_module_bases gmb
            join core.guide_bases gb on gb.id = gmb.guide_base_id
          where
            gb.id = :guideBaseId
        )
      update
        core.guide_module_bases gmb
      set
        order_index = sorted.new_order_index
      from
        sorted
      where
        gmb.id = sorted.id
        and gmb.order_index != sorted.new_order_index;
    `,
    replacements: {
      guideBaseId,
    },
    type: QueryTypes.UPDATE,
  });

  return affectedRows;
}
