import Dataloader from 'dataloader';
import { keyBy } from 'lodash';

import { Loaders } from '..';
import { queryRunner } from 'src/data';

export default function lastLaunchedAtOfNpsSurveyLoader(_loaders: Loaders) {
  return new Dataloader<number, Date>(async (npsSurveyIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
          ns.id AS "id",
          MAX(nsi.started_at) AS "lastLaunchedAt"
        FROM
          core.nps_surveys ns
          JOIN core.nps_survey_instances nsi ON nsi.created_from_nps_survey_id = ns.id
        WHERE
          ns.id IN (:npsSurveyIds)
        GROUP BY
          ns.id;
      `,
      replacements: {
        npsSurveyIds,
      },
    })) as { id: number; lastLaunchedAt: Date }[];

    const rowsBySurveyId = keyBy(rows, 'id');

    return npsSurveyIds.map(
      (surveyId) => rowsBySurveyId[surveyId]?.lastLaunchedAt || 0
    );
  });
}
