import { debugMessage } from 'bento-common/utils/debugging';

import { AirTrafficStore, WorkingAirTrafficStore } from '../types';

export default function stealthModeToggled(
  state: WorkingAirTrafficStore,
  { value }: Parameters<AirTrafficStore['toggleStealthMode']>[0]
) {
  state.stealthMode = value;
  debugMessage('[BENTO] stealthMode toggled to:', value);
}
