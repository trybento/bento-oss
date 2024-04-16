import { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

export default function useDebouncedInput(
  initialValue,
  onChange
): [string, (newVal: string) => void] {
  const [inputValue, setInputValue] = useState<string>(initialValue);

  const debouncedOnChange = useCallback(debounce(onChange, 500), [onChange]);

  const handleChange = (newValue: string) => {
    setInputValue(newValue);
    debouncedOnChange(newValue);
  };

  useEffect(() => {
    if (initialValue !== inputValue) {
      setInputValue(initialValue);
    }
  }, [initialValue]);

  return [inputValue, handleChange];
}
