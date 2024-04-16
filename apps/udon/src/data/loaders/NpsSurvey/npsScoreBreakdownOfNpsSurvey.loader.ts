import Dataloader from 'dataloader';
import { queryRunner } from 'src/data';

interface NpsScoreBreakdown {
  responses: number;
  promoters: number;
  passives: number;
  detractors: number;
  score: number | null;
}

export default function npsScoreBreakdownOfNpsSurveyLoader() {
  return new Dataloader<number, NpsScoreBreakdown>(async (npsSurveyIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
          t.*,
          CASE
            WHEN COALESCE(t.responses, 0) > 0 THEN
              ROUND(
                ((CAST(t.promoters as DECIMAL) / t.responses) * 100) -
                ((CAST(t.detractors AS DECIMAL) / t.responses) * 100)
              )
            ELSE NULL
          END AS "score"
        FROM (
          SELECT
            ns.id AS "npsSurveyId",
            COUNT(np.answered_at) AS "responses",
            SUM(CASE WHEN np.answer < 7 THEN 1 ELSE 0 END) AS "detractors",
            SUM(CASE WHEN np.answer = 7 OR np.answer = 8 THEN 1 ELSE 0 END) AS "passives",
            SUM(CASE WHEN np.answer > 8 THEN 1 ELSE 0 END) AS "promoters"
          FROM core.nps_surveys ns
          JOIN core.nps_survey_instances nsi
            ON nsi.created_from_nps_survey_id = ns.id
          JOIN core.nps_participants np
            ON np.nps_survey_instance_id = nsi.id
          WHERE ns.id IN (:npsSurveyIds)
            AND np.answered_at IS NOT NULL
          GROUP BY ns.id
        ) t;
      `,
      replacements: {
        npsSurveyIds,
      },
    })) as ({
      npsSurveyId: number;
    } & NpsScoreBreakdown)[];

    const lookup = rows.reduce(
      (
        out: {
          [key: number]: NpsScoreBreakdown;
        },
        curr
      ) => {
        out[curr.npsSurveyId] = curr;

        return out;
      },
      {}
    );

    return npsSurveyIds.map(
      (npsSurveyId) =>
        lookup[npsSurveyId] || {
          responses: 0,
          promoters: 0,
          passives: 0,
          detractors: 0,
          score: null,
        }
    );
  });
}
