import { keyBy } from 'lodash';
import { QueryDatabase, queryRunner } from 'src/data';

export default async function getNumberUsersAnsweredForGuideBase(
  guideBaseIds: readonly number[]
) {
  if (guideBaseIds.length === 0) return [];

  const rows = (await queryRunner({
    sql: `--sql
        SELECT
					gsb.guide_base_id AS "guideBaseId",
					COUNT (DISTINCT isa.answered_by_account_user_id) AS "numUsersAnswered"
				FROM core.input_step_answers isa
				JOIN core.input_step_bases isb
					ON isa.input_step_base_id = isb.id
				JOIN core.guide_step_bases gsb
					ON isb.guide_step_base_id = gsb.id
					AND gsb.deleted_at IS NULL
				WHERE isa.step_id IS NOT NULL
				AND gsb.guide_base_id IN (:guideBaseIds)
				GROUP BY gsb.guide_base_id
      `,
    replacements: {
      guideBaseIds: guideBaseIds as number[],
    },
    queryDatabase: QueryDatabase.follower,
  })) as { numUsersAnswered: number; guideBaseId: number }[];

  const countByGuideBaseId = keyBy(rows, 'guideBaseId');
  return guideBaseIds.map(
    (tId) => countByGuideBaseId[tId]?.numUsersAnswered ?? 0
  );
}
