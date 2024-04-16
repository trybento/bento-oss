import { useCallback, useEffect, useState } from 'react';

type useClientStorageReturnType = [
  /** The value stored in the client storage or `defaultValue`, if set */
  value: string,
  /** Sets the value in the client storage */
  set: (value: string) => void,
  /** Removes the value from the client storage */
  remove: () => void
];

/**
 * Check for the ability to access browser storage
 */
export const checkStorage = (
  storageType: 'localStorage' | 'sessionStorage'
) => {
  // const storageType = storage === 'local' ? 'localStorage' : 'sessionStorage';
  const test = 'Bento-storageTest';
  try {
    if (!window || !window[storageType]) return false;
    window[storageType].setItem(test, test);
    window[storageType].removeItem(test);
    return true;
  } catch (e) {
    // prevent logging outside of the browser's context
    // if (!IS_SERVER) {
    //   console.error(`Browser's ${storageType} is not available or blocked`);
    // }
    return false;
  }
};

export default function useClientStorage(
  /** The key to use for the value in the client storage */
  key: string,
  /** The default value to use if the value is not set in the client storage */
  defaultValue?: string,
  /** The client storage type (localStorage or sessionStorage) */
  storage: 'local' | 'session' = 'local'
): useClientStorageReturnType {
  const storageType = storage === 'local' ? 'localStorage' : 'sessionStorage';
  const isStorageAvailable = checkStorage(storageType);
  const [value, setValue] = useState(defaultValue || null);

  useEffect(() => {
    if (!isStorageAvailable) return;
    const storedValue = window[storageType].getItem(key);
    if (storedValue !== null) {
      setValue(storedValue);
    }
  }, []);

  const set = useCallback(
    (newValue) => {
      if (!isStorageAvailable) return;
      window[storageType].setItem(key, newValue);
      setValue(newValue);
    },
    [isStorageAvailable, storageType, key]
  );

  const remove = useCallback(() => {
    if (!isStorageAvailable) return;
    window[storageType].removeItem(key);
    setValue(undefined);
  }, [isStorageAvailable, storageType, key]);

  return [value, set, remove];
}
