import Dataloader from 'dataloader';
import { queryRunner } from 'src/data';

export default function totalViewsOfNpsSurveyLoader() {
  return new Dataloader<number, number>(async (npsSurveyIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
          ns.id AS "npsSurveyId",
          COUNT(*) AS "totalViews"
        FROM core.nps_surveys ns
        JOIN core.nps_survey_instances nsi
          ON nsi.created_from_nps_survey_id = ns.id
        JOIN core.nps_participants np
          ON np.nps_survey_instance_id = nsi.id
        WHERE ns.id IN (:npsSurveyIds)
          AND np.first_seen_at IS NOT NULL
        GROUP BY ns.id;
      `,
      replacements: {
        npsSurveyIds,
      },
    })) as { npsSurveyId: number; totalViews: number }[];

    const lookup = rows.reduce((out: { [key: string]: number }, curr) => {
      out[curr.npsSurveyId] = curr.totalViews;

      return out;
    }, {});

    return npsSurveyIds.map((npsSurveyId) => lookup[npsSurveyId] || 0);
  });
}
