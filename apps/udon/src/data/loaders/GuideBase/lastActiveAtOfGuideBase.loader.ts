import Dataloader from 'dataloader';
import { keyBy } from 'lodash';

import { queryRunner } from 'src/data';

export default function lastActiveAtOfGuideBaseLoader() {
  return new Dataloader<number, Date | null>(async (guideBaseIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
          max(guides.last_active_at) as last_active_at,
          guide_bases.id as guide_base_id
        FROM core.guide_bases
        JOIN core.guides
        ON guides.created_from_guide_base_id = guide_bases.id
        WHERE guide_bases.id IN (:guideBaseIds)
        GROUP BY guide_bases.id
      `,
      replacements: {
        guideBaseIds: guideBaseIds as number[],
      },
    })) as { last_active_at: Date; guide_base_id: number }[];

    const rowsByGuideBaseId = keyBy(rows, 'guide_base_id');
    return guideBaseIds.map((guideBaseId) => {
      const row = rowsByGuideBaseId[guideBaseId];
      if (row && row.last_active_at) {
        return new Date(row.last_active_at);
      } else {
        return null;
      }
    });
  });
}
