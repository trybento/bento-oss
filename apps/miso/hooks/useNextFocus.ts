import { useCallback, useEffect } from 'react';

export enum FocusableIds {
  templateDisplayTitle = 'templateDisplayTitle',
  templateDescription = 'templateDescription',
  addModuleButton = 'addModuleButton',
}

const DATA_TAB_FOCUS = 'nextfocustarget';

export const getNextFocusProp = (targetId: string | undefined | null) =>
  targetId
    ? {
        [`data-${DATA_TAB_FOCUS}`]: targetId,
      }
    : {};

const useNextFocus = () => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const nextTargetId = (e.target as HTMLElement).dataset[DATA_TAB_FOCUS];
    if ((e.key !== 'Tab' && e.key !== 'Enter') || !nextTargetId) return;

    const target = document.getElementById(nextTargetId);
    if (!target) return;
    e.preventDefault();
    target.focus();
  }, []);

  // Note: Components that use stopPropagation()
  // may interfere with this.
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
};

export default useNextFocus;
