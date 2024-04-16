import { GlobalStateActionPayloads } from 'bento-common/types/globalShoyuState';

import getDestinationGuide from '../mutators/getDestinationGuide';

import { WorkingState } from '../types';

export default function launchCtaClicked(
  _state: WorkingState,
  {
    stepEntityId,
    destinationKey,
    markComplete,
    ctaEntityId,
    ...options
  }: GlobalStateActionPayloads['launchCtaClicked']
) {
  getDestinationGuide(
    { stepEntityId, destinationKey, markComplete, ctaEntityId },
    options
  );
}
