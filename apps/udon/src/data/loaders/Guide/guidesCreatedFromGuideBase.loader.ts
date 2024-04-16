import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import { loadBulk } from 'src/data/loaders/helpers';
import { Guide } from 'src/data/models/Guide.model';

/**
 * Loads all (living) guides created for a given guide base Id.
 *
 * WARNING: This can't return soft-deleted guides, otherwise run the risk of returning null
 * items from the `loaders.guideLoader` and fail upstream non-nullable GQL resolvers.
 */
export default function guidesCreatedFromGuideBaseLoader(loaders: Loaders) {
  return new Dataloader<number, Guide[]>(async (guideBaseIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
					g.id as "guideId"
					, gb.id as "guideBaseId"
				FROM
					core.guides g
				JOIN core.guide_bases gb
					ON g.created_from_guide_base_id = gb.id
				WHERE
					gb.id IN (:guideBaseIds)
					AND g.deleted_at IS NULL -- exclude deleted guides
				ORDER BY
					gb.id ASC
					, g.id ASC
      `,
      replacements: {
        guideBaseIds: guideBaseIds as number[],
      },
    })) as { guideId: number; guideBaseId: number }[];

    return loadBulk(
      guideBaseIds,
      rows,
      'guideBaseId',
      'guideId',
      loaders.guideLoader
    );
  });
}
