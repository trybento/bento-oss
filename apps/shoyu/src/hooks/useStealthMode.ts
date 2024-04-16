import { useCallback } from 'react';
import shallow from 'zustand/shallow';

import useAirTrafficStore from '../stores/airTrafficStore/hooks/useAirTrafficStore';

/**
 * Use this hook to know whether or not we're running in stealth mode
 * and all Bento components should be hidden.
 *
 * NOTE: The stealth mode flag already considers the relevant organization settings.
 *
 * See the `stealthModeObserver` within `BentoAirTrafficElement`.
 *
 * @deprecated get it directly from `withAirTrafficState` or `useAirTrafficStore` instead
 */
export default function useStealthMode(): boolean {
  const stealthMode = useAirTrafficStore(
    useCallback((state) => state.stealthMode, []),
    shallow
  );
  return stealthMode;
}
