import Dataloader from 'dataloader';
import keyBy from 'lodash/keyBy';
import { queryRunner } from 'src/data';

export default function branchedFromGuideLoader() {
  return new Dataloader<number, string | undefined>(async (guideIds) => {
    const rows = (await queryRunner({
      sql: `--sql
				SELECT
					tbp.created_guide_id AS "guideId",
					g.entity_id AS "triggeredFromGuideEntityId"
				FROM core.triggered_branching_paths tbp
				LEFT JOIN core.guides g ON tbp.triggered_from_guide_id = g.id
				WHERE 
					tbp.created_guide_id IN (:guideIds)
					AND g.deleted_at IS NULL
			`,
      replacements: {
        guideIds,
      },
    })) as { guideId: number; triggeredFromGuideEntityId: string }[];

    const rowsByGuideId = keyBy(rows, 'guideId');
    return guideIds.map(
      (gId) => rowsByGuideId[gId]?.triggeredFromGuideEntityId
    );
  });
}
