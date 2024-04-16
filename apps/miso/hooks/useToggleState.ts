import { useMemo, useState } from 'react';

type State = { isOn: boolean };
type UseToggleStateItem = State & { on: () => void; off: () => void };
export type UseToggleStateReturn<T extends string> = Record<
  T,
  UseToggleStateItem
> & { allOn: () => void; allOff: () => void; anyOn: boolean };

export default function useToggleState<T extends string>(
  identifiers: T[]
): UseToggleStateReturn<T> {
  const [states, setStates] = useState<Record<T, State>>(
    identifiers.reduce((acc, field) => {
      acc[field] = { isOn: false };
      return acc;
    }, {} as Record<T, State>)
  );

  const results = useMemo(
    () => ({
      ...identifiers.reduce((acc, field) => {
        const state = states[field as string];
        acc[field] = {
          ...state,
          on: () => {
            setStates({
              ...states,
              [field]: { ...state, isOn: true },
            });
          },
          off: () => {
            setStates({
              ...states,
              [field]: { ...state, isOn: false },
            });
          },
        };
        return acc;
      }, {} as Record<T, UseToggleStateItem>),
      allOn: () => {
        setStates((s) => {
          const newState = { ...s };
          Object.keys(newState).forEach((key) => {
            newState[key].isOn = true;
          });
          return newState;
        });
      },
      allOff: () => {
        setStates((s) => {
          const newState = { ...s };
          Object.keys(newState).forEach((key) => {
            newState[key].isOn = false;
          });
          return newState;
        });
      },
      anyOn: Object.values(states).some((state: State) => state.isOn),
    }),
    [identifiers, states]
  );

  return results;
}
