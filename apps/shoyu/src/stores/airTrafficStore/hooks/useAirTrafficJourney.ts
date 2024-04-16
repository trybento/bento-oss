import { useCallback } from 'react';
import shallow from 'zustand/shallow';
import {
  EmbedTypenames,
  GuideEntityId,
} from 'bento-common/types/globalShoyuState';

import useAirTrafficStore from './useAirTrafficStore';
import { JourneyEndActionPayload } from '../types';

type Args = {
  /**
   * Which guide is currently selected within the component scope.
   * This will be used to conditionally end the journey only if there is an active journey
   * targeting the same guide.
   */
  selectedGuideEntityId: GuideEntityId | undefined;
};

/**
 * Convenient hook for manipulating Air Traffic journeys, including starting and ending journeys.
 *
 * To end a journey, one must exist and match the guide selected within the component context,
 * otherwise calling `endJourney` will have no effect.
 *
 * WARNING: Start/endJourney methods can only handle guide-type journeys as of now.
 */
export default function useAirTrafficJourney({ selectedGuideEntityId }: Args) {
  const { activeJourney, startJourney, endJourney, lock, unlock } =
    useAirTrafficStore(
      (state) => ({
        activeJourney: state.activeJourney,
        startJourney: state.startJourney,
        endJourney: state.endJourney,
        lock: state.lock,
        unlock: state.unlock,
      }),
      shallow
    );

  const endJourneyWrapper = useCallback(
    ({ reason }: Pick<JourneyEndActionPayload, 'reason'>) => {
      endJourney({
        type: EmbedTypenames.guide,
        selectedGuide: selectedGuideEntityId,
        reason,
      });
    },
    [selectedGuideEntityId]
  );

  const unlockWrapper = useCallback(
    (
      /** Waiting time before unlocking AirTraffic control state, in ms */
      wait = 0
    ) => {
      window.setTimeout(() => void unlock(), wait);
    },
    [unlock]
  );

  return {
    activeJourney,
    startJourney,
    endJourney: endJourneyWrapper,
    lockAirTraffic: lock,
    unlockAirTraffic: unlockWrapper,
  };
}
