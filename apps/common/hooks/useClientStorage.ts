import { useCallback, useEffect, useMemo, useState } from 'react';

import usePrevious from '../hooks/usePrevious';
import {
  ClientStorage,
  readFromClientStorage,
  removeFromClientStorage,
  saveToClientStorage,
} from '../utils/clientStorage';

type ReturnType<V> = {
  value: V | undefined;
  setValue: (v: V) => void;
  clearValue: () => void;
};

export default function useClientStorage<V>(
  storage: ClientStorage,
  key: string,
  defaultValue?: V,
  overrideValue?: V
): ReturnType<V> {
  const initialValue = useMemo(() => {
    const persistedValue = readFromClientStorage<V>(storage, key);
    return overrideValue != null
      ? overrideValue
      : persistedValue != null
      ? persistedValue
      : defaultValue;
  }, [key, storage, defaultValue, overrideValue]);

  const [value, setLocalValue] = useState(initialValue);

  const setValue = useCallback(
    (newValue: any) => {
      saveToClientStorage(storage, key, newValue);
      setLocalValue(newValue);
    },
    [key, storage]
  );

  const clearValue = useCallback(() => {
    removeFromClientStorage(storage, key);
  }, [key, storage]);

  const prevKey = usePrevious(key);
  useEffect(() => {
    if (prevKey) {
      setValue(initialValue);
    }
  }, [key]);

  return { value, setValue, clearValue };
}

export const LS_KEYS = {
  /** Flag to enable RTE recovery mode */
  RteRecoveryMode: 'rteRecoveryMode',
  /** (Prefix) Where the RTE content snapshots will be saved to */
  RteRecoveryValue: 'rteRecoveryValue',
  /** Temp data for local template previews */
  PreviewInitData: 'previewInitData',
  /** Recently used colors in color pickers */
  RecentColors: 'recentColors',
};
