import { startOfTomorrow } from 'date-fns';
import { AtLeast } from 'bento-common/types';
import {
  NpsStartingType,
  NpsSurveyState,
} from 'bento-common/types/netPromoterScore';

import { withTransaction } from 'src/data';
import { Organization } from 'src/data/models/Organization.model';
import { extractId } from 'src/utils/helpers';
import NpsSurvey from 'src/data/models/NetPromoterScore/NpsSurvey.model';
import NoContentError from 'src/errors/NoContentError';
import createSurveyInstance from './createSurveyInstances';

type Args = {
  /** Org to which the NPS Survey should belong to */
  organization: number | AtLeast<Organization, 'id'>;
  /** Entity Id of the target NPS survey to update */
  entityId: string;
};

/**
 * Launch or schedule a NPS survey
 *
 * @returns Promise the launched/scheduled NpsSurvey instance
 */
export default async function launchNpsSurvey({
  organization,
  entityId,
}: Args): Promise<NpsSurvey> {
  const survey = await NpsSurvey.scope([
    { method: ['fromOrganization', extractId(organization)] },
  ]).findOne({
    where: {
      entityId,
    },
  });

  if (!survey) {
    throw new NoContentError(entityId, 'NPS survey');
  }

  if (![NpsSurveyState.stopped, NpsSurveyState.draft].includes(survey.state)) {
    throw new Error(
      "Survey can't be launched because it is not currently in draft or stopped"
    );
  }

  if (survey.startingType === NpsStartingType.dateBased) {
    if (!survey.startAt) {
      throw new Error(
        "Survey can't be scheduled to launch without a starting date"
      );
    } else if (survey.startAt.getTime() < startOfTomorrow().getTime()) {
      throw new Error("Survey can't be scheduled to launch before tomorrow");
    }
  }

  return await withTransaction(async () => {
    const surveyFieldsToUpdate: Partial<NpsSurvey> = {
      state: NpsSurveyState.live,
    };
    const now = new Date();

    surveyFieldsToUpdate.launchedAt = now;

    if (survey.startingType === NpsStartingType.manual) {
      // preemptively clear any starting date that could be previously set
      surveyFieldsToUpdate.startAt = null;

      // create the new instance
      await createSurveyInstance({ survey });

      // reload the survey to include the active instance just launched
      await survey.reload();
    }

    // update all survey fields at once
    await survey.update(surveyFieldsToUpdate);

    return survey;
  });
}
