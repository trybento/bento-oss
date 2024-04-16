import Dataloader from 'dataloader';
import { groupBy } from 'lodash';

import { Loaders } from '..';
import NpsSurvey from 'src/data/models/NetPromoterScore/NpsSurvey.model';

export default function npsSurveysOfOrganizationLoader(_loaders: Loaders) {
  return new Dataloader<number, NpsSurvey[]>(async (organizationIds) => {
    const surveys = await NpsSurvey.scope([
      { method: ['fromOrganization', organizationIds] },
    ]).findAll({
      order: [['id', 'asc']],
    });

    const surveysByOrgId = groupBy(surveys, 'organizationId');

    return organizationIds.map((orgId) => surveysByOrgId[orgId] || []);
  });
}
