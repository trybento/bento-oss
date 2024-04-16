import { QueryDatabase, queryRunner } from 'src/data';

/** Updates template priorityRanking to have a sequential order. */
export async function syncTemplatePriorityRankings({
  organizationId,
}: {
  organizationId: number;
}) {
  await queryRunner({
    sql: `
      WITH subtable AS (
        SELECT
          t.id AS id,
          (ROW_NUMBER() OVER (
        ORDER BY
          t.priority_ranking ASC) - 1) AS "newRanking"
        FROM
          core.templates t
        WHERE
          t.organization_id = :organizationId
          AND t.is_auto_launch_enabled IS TRUE
        ORDER BY
          t.priority_ranking ASC
        )
      UPDATE
          core.templates t2
      SET
          priority_ranking = subtable."newRanking"
      FROM
          subtable
      WHERE
          t2.id = subtable.id
		`,
    replacements: {
      organizationId,
    },
    queryDatabase: QueryDatabase.primary,
  });
}
