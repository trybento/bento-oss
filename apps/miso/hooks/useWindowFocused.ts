import { useState, useEffect } from 'react';

const hasFocus = () => typeof document !== 'undefined' && document.hasFocus();

/**
 * Check if window focused
 * src: https://github.com/jpalumickas/use-window-focus/blob/main/src/index.ts
 */
const useWindowFocus = () => {
  const [focused, setFocused] = useState(hasFocus); // Focus for first render

  useEffect(() => {
    setFocused(hasFocus()); // Focus for additional renders

    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);

    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  return focused;
};

export default useWindowFocus;
