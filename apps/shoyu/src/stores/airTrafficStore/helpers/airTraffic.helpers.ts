import airTrafficStore from '..';
import { JourneyEndActionPayload, JourneyStartActionPayload } from '../types';

/**
 * Helper to wrap calling for air traffic store and getting state
 * Prefer to use startJourney where possible. e.g. in composed component
 */
export const startAirTrafficJourney = (args: JourneyStartActionPayload) => {
  return airTrafficStore.getState().startJourney(args);
};

/**
 * Helper to wrap calling for air traffic store and getting state
 * Prefer to use endJourney where possible. e.g. in composed component
 */
export const endAirTrafficJourney = (args: JourneyEndActionPayload) => {
  return airTrafficStore.getState().endJourney(args);
};
