import {
  GlobalStateActionPayloads,
  GuideHydrationState,
} from 'bento-common/types/globalShoyuState';

import { WorkingState } from '../types';
import { guideSelector } from '../helpers/selectors';

export default function guideHydrationFailed(
  state: WorkingState,
  payload: GlobalStateActionPayloads['guideHydrationFailed']
) {
  const guide = guideSelector(payload.guide, state);
  if (guide) {
    guide.hydrationState = GuideHydrationState.failed;
  }
}
