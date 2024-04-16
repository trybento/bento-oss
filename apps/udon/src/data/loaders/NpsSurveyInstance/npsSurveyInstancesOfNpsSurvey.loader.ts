import Dataloader from 'dataloader';
import { groupBy } from 'lodash';

import { Loaders } from '..';
import NpsSurveyInstance from 'src/data/models/NetPromoterScore/NpsSurveyInstance.model';

export default function npsSurveyInstancesOfNpsSurveyLoader(_loaders: Loaders) {
  return new Dataloader<number, NpsSurveyInstance[]>(async (npsSurveyIds) => {
    const surveys = await NpsSurveyInstance.scope([
      { method: ['fromSurvey', npsSurveyIds] },
    ]).findAll({
      order: [['id', 'asc']],
    });

    const instancesBySurveyId = groupBy(surveys, 'createdFromNpsSurveyId');

    return npsSurveyIds.map((surveyId) => instancesBySurveyId[surveyId] || []);
  });
}
