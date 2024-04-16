import { GlobalStateActionPayloads } from 'bento-common/types/globalShoyuState';
import { isIncompleteSurvey } from 'bento-common/data/helpers';

import { WorkingState } from '../types';
import { npsSurveySelector } from '../helpers/selectors';
import dismissNpsSurvey from '../mutators/dismissNpsSurvey';

export default function npsSurveyDismissed(
  state: WorkingState,
  { entityId }: GlobalStateActionPayloads['npsSurveyDismissed']
) {
  const survey = npsSurveySelector(state, entityId);

  if (survey && isIncompleteSurvey(survey)) {
    // optimistically update the survey object locally
    survey.dismissedAt = new Date();
    // update the server
    void dismissNpsSurvey({ entityId });
  }
}
