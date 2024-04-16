import { AirTrafficState } from '../types';

export const removeEphemeralKeys = (key: string, value: any) => {
  const unallowedKeys: Array<keyof Omit<AirTrafficState, 'activeJourney'>> = [
    'initialized',
    'sidebarOpen',
    'sidebarAutoFocused',
    'guidesShown',
    'desiredStateHistory',
    // we shouldn't ever persist the locked state
    'locked',
  ];
  return (unallowedKeys as string[]).includes(key) ? undefined : value;
};
