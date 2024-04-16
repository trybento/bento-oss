import Dataloader from 'dataloader';
import { groupBy } from 'lodash';

import { Loaders } from '..';
import NpsSurvey from 'src/data/models/NetPromoterScore/NpsSurvey.model';

export default function launchedNpsSurveysOfOrganizationLoader(
  _loaders: Loaders
) {
  return new Dataloader<number, NpsSurvey[]>(async (organizationIds) => {
    const surveys = await NpsSurvey.scope([
      { method: ['fromOrganization', organizationIds] },
      'launched',
    ]).findAll({
      order: [['priorityRanking', 'asc']],
    });

    const surveysByOrgId = groupBy(surveys, 'organizationId');

    return organizationIds.map((orgId) => surveysByOrgId[orgId] || []);
  });
}
