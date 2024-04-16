import React, { useState, useCallback } from 'react';
import { set } from 'lodash';

/**
 * Take this as `useState` on steroids.
 * Allows you to set the `path` to be updated within the state without having to manually
 * handle composing the new state based on all other existing properties.
 */
export default function useStateCruizer<T extends object>(
  defaultValue: T
): [
  value: T,
  setter: (newValue: any, path?: Parameters<typeof set>[1]) => void
] {
  const [value, setValue] = useState<T>(defaultValue);

  const setter = useCallback(
    (newValue: any, path?: Parameters<typeof set>[1]) => {
      if (!path) {
        setValue(newValue);
        return;
      }

      setValue(set(value, path, newValue));
    },
    [value]
  );

  return [value, setter];
}
