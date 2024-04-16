import { GlobalStateActionPayloads } from 'bento-common/types/globalShoyuState';

import { WorkingState } from '../types';
import { npsSurveySelector } from '../helpers/selectors';
import trackNpsSurveyViewed from '../mutators/trackNpsSurveyViewed';

export default function npsSurveySeen(
  state: WorkingState,
  { entityId }: GlobalStateActionPayloads['npsSurveySeen']
) {
  const survey = npsSurveySelector(state, entityId);

  if (survey && !survey.firstSeenAt) {
    // optimistically update the survey object locally
    survey.firstSeenAt = new Date();
    // update the server
    void trackNpsSurveyViewed({ entityId });
  }
}
