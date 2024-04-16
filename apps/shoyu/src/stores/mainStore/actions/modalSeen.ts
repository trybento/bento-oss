import { isSavedGuide } from 'bento-common/data/helpers';
import { GlobalStateActionPayloads } from 'bento-common/types/globalShoyuState';
import { isModal } from '../../../lib/formFactors';

import { guideSelector } from '../helpers/selectors';
import { recordModalSeen } from '../helpers/throttling';
import { WorkingState } from '../types';

/** Cache that we've seen a modal this session */
export default function modalSeen(
  state: WorkingState,
  { guide: guideEntityId }: GlobalStateActionPayloads['modalSeen']
) {
  const guide = guideSelector(guideEntityId, state);

  if (
    guide &&
    isModal(guide?.formFactor) &&
    !guide.isPreview &&
    !isSavedGuide(guide) &&
    // is not a destination guide
    !guide?.isDestination
  ) {
    recordModalSeen(guideEntityId);
  }
}
