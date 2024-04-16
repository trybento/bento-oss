import { useCallback, useEffect } from 'react';
import usePageVisibility from '../../../hooks/usePageVisibility';
import usePrevious from 'bento-common/hooks/usePrevious';

import { InternalTrackEvents } from 'bento-common/types';
import useMainStore from '../hooks/useMainStore';
import {
  FormFactorStateKey,
  GuideEntityId,
  StepEntityId,
} from 'bento-common/types/globalShoyuState';
import shallow from 'zustand/shallow';
import { MainStoreState } from '../types';
import {
  formFactorSelector,
  guideIsHydratedSelector,
} from '../helpers/selectors';

type MainStoreData = {
  dispatch: MainStoreState['dispatch'];
  guideEntityId: GuideEntityId | undefined;
  stepEntityId: StepEntityId | undefined;
  isGuideHydrated: boolean;
};

const useGuideViews = (
  formFactor: FormFactorStateKey,
  isGuideVisible: boolean,
  viewAs?: {
    guide: GuideEntityId;
    step: StepEntityId;
  }
) => {
  const isVisible = usePageVisibility() && isGuideVisible;
  const { dispatch, guideEntityId, stepEntityId, isGuideHydrated } =
    useMainStore<MainStoreData>(
      useCallback(
        (state) => {
          let returnState: Omit<MainStoreData, 'dispatch'>;

          /**
           * This is supposed to be used by components that needs
           * to have control over the guide/step that is going to
           * record the view to, since they cannot rely
           * on standard formFactor selection.
           *
           * An example of this are Tooltips, since multiple can be
           * visible at the same time.
           */
          if (viewAs) {
            returnState = {
              guideEntityId: viewAs.guide,
              stepEntityId: viewAs.step,
              isGuideHydrated: guideIsHydratedSelector(state, viewAs.guide),
            };
          } else {
            const formFactorState = formFactorSelector(state, formFactor);
            returnState = {
              guideEntityId: formFactorState?.selectedGuide,
              stepEntityId: formFactorState?.selectedStep,
              isGuideHydrated: guideIsHydratedSelector(
                state,
                formFactorState?.selectedGuide
              ),
            };
          }

          return {
            dispatch: state.dispatch,
            ...returnState,
          };
        },
        [formFactor, viewAs?.guide, viewAs?.step]
      ),
      shallow
    );

  const previousGuideEntityId = usePrevious(guideEntityId);
  const previousStepEntityId = usePrevious(stepEntityId);
  const previouslyVisible = usePrevious(isVisible);
  const wasGuideHydrated = usePrevious(isGuideHydrated);

  useEffect(() => {
    if (
      guideEntityId &&
      isGuideHydrated &&
      isVisible &&
      (guideEntityId !== previousGuideEntityId ||
        !wasGuideHydrated ||
        !previouslyVisible)
    ) {
      /**
       * record viewed if all of the following are true:
       * 1. a guide is selected
       * 2. the guide is hydrated
       * 3. the guide is visible (either the inline is on the page and is showing
       *    the guide or the sidebar is open and showing the guide or step view)
       * 4. one or more of the following:
       *   a. the guide wasn't previously selected
       *   b. OR the guide wasn't yet hydrated
       *   c. OR the guide wasn't previous visible
       */
      dispatch({
        type: 'guideViewed',
        eventType: InternalTrackEvents.guideViewingStarted,
        guide: guideEntityId,
        formFactor,
      });
    } else if (
      (!guideEntityId && previousGuideEntityId) ||
      (!isVisible && previouslyVisible)
    ) {
      /**
       * end the view if any of the following are true:
       * 1. there isn't a guide selected anymore
       * 2. the guide is no longer visible (e.g. sidebar closed)
       */
      dispatch({
        type: 'guideViewed',
        eventType: InternalTrackEvents.guideViewingEnded,
        formFactor,
        guide: undefined,
      });
    }
  }, [
    isVisible,
    previouslyVisible,
    formFactor,
    guideEntityId,
    previousGuideEntityId,
    isGuideHydrated,
    wasGuideHydrated,
  ]);

  useEffect(() => {
    if (
      stepEntityId &&
      isVisible &&
      (stepEntityId !== previousStepEntityId || !previouslyVisible)
    ) {
      /**
       * record viewed if all of the following are true:
       * 1. a step is selected
       * 2. the step is visible (either the inline is on the page and is showing
       *    the step or the sidebar is open and showing the step view)
       * 3. one or more of the following:
       *   a. the step wasn't previously selected
       *   c. OR the step wasn't previous visible
       */
      dispatch({
        type: 'stepViewed',
        eventType: InternalTrackEvents.stepViewingStarted,
        step: stepEntityId,
        formFactor,
      });
    } else if (
      (!stepEntityId && previousStepEntityId) ||
      (!isVisible && previouslyVisible)
    ) {
      /**
       * end the view if any of the following are true:
       * 1. there isn't a step selected anymore
       * 2. the step is no longer visible (e.g. sidebar closed)
       */
      dispatch({
        type: 'stepViewed',
        eventType: InternalTrackEvents.stepViewingEnded,
        formFactor,
        step: undefined,
      });
    }
  }, [
    isVisible,
    previouslyVisible,
    formFactor,
    stepEntityId,
    previousStepEntityId,
  ]);

  return;
};

export default useGuideViews;
