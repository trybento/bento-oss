import { normalize, NormalizedSchema } from 'normalizr';
import {
  GlobalStateActionPayloads,
  NpsSurvey,
  NpsSurveyEntityId,
} from 'bento-common/types/globalShoyuState';

import schema from '../schema';
import { WorkingState } from '../types';

type NormalizedData = NormalizedSchema<
  { npsSurveys: Record<NpsSurveyEntityId, NpsSurvey> },
  NpsSurveyEntityId[]
>;

export default function npsSurveysChanged(
  state: WorkingState,
  payload: GlobalStateActionPayloads['npsSurveysChanged']
) {
  const {
    result: _inlineEmbedEntityIds,
    entities: { npsSurveys },
  } = normalize(payload.npsSurveys, [schema.npsSurvey]) as NormalizedData;

  state.npsSurveys = npsSurveys || {};
}
