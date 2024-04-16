import { isGuideShownSelector } from '../helpers/selectors';
import { AirTrafficStore, WorkingAirTrafficStore } from '../types';

export default function registered(
  state: WorkingAirTrafficStore,
  { guide: guideEntityId, shown }: Parameters<AirTrafficStore['register']>[0]
) {
  const isGuideShown = isGuideShownSelector(state, guideEntityId);

  // "shown" state already registered, skipping
  if (shown === isGuideShown) return;

  if (shown) {
    state.guidesShown.push(guideEntityId);
  } else {
    state.guidesShown = state.guidesShown.filter(
      (geId) => geId !== guideEntityId
    );
  }
}
