import shallow from 'zustand/shallow';
import { useCallback, useEffect } from 'react';
import {
  FormFactorStateKey,
  GuideEntityId,
  StepEntityId,
} from 'bento-common/types/globalShoyuState';

import { MainStoreState } from '../types';
import useMainStore from './useMainStore';
import { formFactorSelector } from '../helpers/selectors';

export default function useSelectGuideAndStep(
  dispatch: MainStoreState['dispatch'],
  formFactor: FormFactorStateKey,
  guideEntityId?: GuideEntityId,
  stepEntityId?: StepEntityId
) {
  const { selectedGuideEntityId, selectedStepEntityId } = useMainStore<{
    selectedGuideEntityId: GuideEntityId | undefined;
    selectedStepEntityId: StepEntityId | undefined;
  }>(
    useCallback((state) => {
      const formFactorState = formFactorSelector(state, formFactor);
      return {
        selectedGuideEntityId: formFactorState?.selectedGuide,
        selectedStepEntityId: formFactorState?.selectedStep,
      };
    }, []),
    shallow
  );

  useEffect(() => {
    if (guideEntityId !== selectedGuideEntityId) {
      dispatch({ type: 'guideSelected', guide: guideEntityId, formFactor });
    }
  }, [guideEntityId, dispatch]);

  useEffect(() => {
    if (stepEntityId !== selectedStepEntityId) {
      dispatch({ type: 'stepSelected', step: stepEntityId, formFactor });
    }
  }, [stepEntityId, dispatch]);
}
