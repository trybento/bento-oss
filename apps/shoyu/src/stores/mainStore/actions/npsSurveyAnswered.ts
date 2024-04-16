import { GlobalStateActionPayloads } from 'bento-common/types/globalShoyuState';
import { isIncompleteSurvey } from 'bento-common/data/helpers';

import { WorkingState } from '../types';
import { npsSurveySelector } from '../helpers/selectors';
import answerNpsSurvey from '../mutators/answerNpsSurvey';

export default function npsSurveyAnswered(
  state: WorkingState,
  {
    entityId,
    answer,
    fupAnswer,
  }: GlobalStateActionPayloads['npsSurveyAnswered']
) {
  const survey = npsSurveySelector(state, entityId);

  if (survey && isIncompleteSurvey(survey)) {
    // optimistically update the survey object locally
    survey.answeredAt = new Date();

    // update the server
    void answerNpsSurvey({ entityId, answer, fupAnswer });
  }
}
