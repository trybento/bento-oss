import { AtLeast } from 'bento-common/types';
import {
  NpsSurveyInstanceState,
  NpsSurveyState,
} from 'bento-common/types/netPromoterScore';

import { withTransaction } from 'src/data';
import { Organization } from 'src/data/models/Organization.model';
import { extractId } from 'src/utils/helpers';
import NpsSurvey from 'src/data/models/NetPromoterScore/NpsSurvey.model';
import NoContentError from 'src/errors/NoContentError';
import { DEFAULT_PRIORITY_RANKING } from 'bento-common/utils/constants';

type Args = {
  /** Org to which the NPS Survey should belong to */
  organization: number | AtLeast<Organization, 'id'>;
  /** Entity Id of the target NPS survey to update */
  entityId: string;
};

/**
 * Pause a previously launched NPS survey
 *
 * @returns Promise the updated NpsSurvey instance
 */
export default async function pauseNpsSurvey({
  organization,
  entityId,
}: Args): Promise<NpsSurvey> {
  const survey = await NpsSurvey.scope([
    { method: ['fromOrganization', extractId(organization)] },
    'withActiveInstance',
  ]).findOne({
    where: {
      entityId,
    },
  });

  if (!survey) {
    throw new NoContentError(entityId, 'NPS survey');
  }

  if (survey.state !== NpsSurveyState.live) {
    throw new Error(
      "Survey can't be paused because it is not currently launched"
    );
  }

  return await withTransaction(async () => {
    const now = new Date();

    const activeInstance = survey.instances?.[0];

    if (activeInstance) {
      await activeInstance.update({
        state: NpsSurveyInstanceState.terminated,
        endedAt: now,
      });
    }

    await survey.update({
      launchedAt: null,
      priorityRanking: DEFAULT_PRIORITY_RANKING,
      state: NpsSurveyState.stopped,
    });

    return survey;
  });
}
