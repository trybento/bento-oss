import { useState } from 'react';

type RecordState<T> = Record<string, T>;

const useRecordState = <T>(
  defaultValue: RecordState<T>
): [RecordState<T>, (key: string, value: Partial<T>) => void] => {
  const [currentState, setState] = useState<RecordState<T>>(defaultValue);

  const setKeyInState = (key, value) => {
    const newState = {
      ...currentState,
      [key]: value,
    };
    setState(newState);
  };

  return [currentState, setKeyInState];
};

export default useRecordState;
