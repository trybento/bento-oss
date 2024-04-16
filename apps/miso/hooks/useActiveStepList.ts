import { useCallback, useEffect, useState } from 'react';
import { ActiveStepListEvent } from 'components/GuideForm/types';
import { ACTIVE_STEP_LIST_EVENT } from 'helpers/constants';

export default function useActiveStepList() {
  // Consider using useClientStorage if needed.
  const [currentStep, setCurrentStep] = useState<number>(0);

  const handleSelectedStep = useCallback(
    (e: CustomEvent<ActiveStepListEvent>) => {
      const newSelection = e.detail.expandedStepIndex;
      setCurrentStep((cs) => (newSelection === -1 ? cs : newSelection));
    },
    []
  );

  useEffect(() => {
    document.addEventListener(ACTIVE_STEP_LIST_EVENT, handleSelectedStep);
    return () =>
      document.removeEventListener(ACTIVE_STEP_LIST_EVENT, handleSelectedStep);
  }, []);

  return currentStep;
}
