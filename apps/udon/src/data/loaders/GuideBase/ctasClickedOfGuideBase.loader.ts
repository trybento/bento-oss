import Dataloader from 'dataloader';
import { keyBy } from 'lodash';

import { queryRunner } from 'src/data';

/**
 * Only really relevant for annoucnement types, fetches cached CTA click count
 * @todo: deprecate? Not interested in raw CTA click count
 */
export default function ctasClickedOfGuideBaseLoader() {
  return new Dataloader<number, number>(async (guideBaseIds) => {
    const rows = (await queryRunner({
      sql: `
        SELECT
					gd.ctas_clicked, gd.guide_base_id
				FROM analytics.guide_data gd
				WHERE gd.guide_base_id IN (:guideBaseIds)
      `,
      replacements: {
        guideBaseIds: guideBaseIds as number[],
      },
    })) as { ctas_clicked: number; guide_base_id: number }[];

    const rowsByGuideBaseId = keyBy(rows, 'guide_base_id');
    return guideBaseIds.map(
      (guideBaseId) => rowsByGuideBaseId[guideBaseId]?.ctas_clicked || 0
    );
  });
}
