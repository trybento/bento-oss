import { NpsSurveyInstanceState } from 'bento-common/types/netPromoterScore';

import { SelectedModelAttrs } from 'bento-common/types';
import NpsSurvey from 'src/data/models/NetPromoterScore/NpsSurvey.model';
import NoOrganizationError from 'src/errors/NoOrganizationError';
import { extractId } from 'src/utils/helpers';
import NpsSurveyInstance from 'src/data/models/NetPromoterScore/NpsSurveyInstance.model';
import { invalidateLaunchingCacheForOrg } from '../caching/identifyChecksCache';

type Args = {
  survey: SelectedModelAttrs<NpsSurvey, 'organizationId' | 'instances'>;
};

/**
 * Creates the instances necessary to effectively "launch" a survey to end-users.
 *
 * @returns Promise the NpsSurveyInstance created
 */
export default async function createSurveyInstance({
  survey,
}: Args): Promise<NpsSurveyInstance> {
  const organization = await survey.$get('organization');

  if (!organization) throw new NoOrganizationError(survey.organizationId);

  const [activeInstance] = await survey.$get('instances', { scope: 'active' });

  // check whether one active instance already exists
  if (activeInstance) {
    throw new Error('Survey already has an active instance in flight');
  }

  const now = new Date();

  const newInstance = (await survey.$create(
    'instance',
    {
      organizationId: extractId(organization),
      state: NpsSurveyInstanceState.active,
      startedAt: now,
    },
    {
      fields: [
        'createdFromNpsSurveyId',
        'organizationId',
        'state',
        'startedAt',
      ],
      returning: true,
    }
  )) as NpsSurveyInstance;

  // invalidate orgs cache to immediately unblock launching
  await invalidateLaunchingCacheForOrg(organization, 'createSurveyInstance');

  return newInstance;
}
