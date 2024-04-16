import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Guide, Step } from 'bento-common/types/globalShoyuState';
import {
  UIState,
  View,
  TransitionDirection,
} from 'bento-common/types/shoyuUIState';
import useReduxDevtools from 'bento-common/hooks/useReduxDevtools';
import { guideListConfig, isNestedTheme } from 'bento-common/data/helpers';
import { Action, GuidesListEnum } from 'bento-common/types';
import usePrevious from 'bento-common/hooks/usePrevious';

import withMainStoreData from '../stores/mainStore/withMainStore';
import { MainStoreState } from '../stores/mainStore/types';
import {
  selectedGuideForFormFactorSelector,
  selectedStepForFormFactorSelector,
} from '../stores/mainStore/helpers/selectors';
import { FormFactorContextValue } from './FormFactorProvider';
import composeComponent from 'bento-common/hocs/composeComponent';
import withFormFactor from '../hocs/withFormFactor';
import { hasOnlyOneStep } from 'bento-common/utils/formFactor';
import { isDevtoolsEnabled } from '../lib/debug';
import {
  isActiveGuidesSubView,
  isKbArticleView,
  isTicketView,
} from 'bento-common/frontend/shoyuStateHelpers';
import useAirTrafficJourney from '../stores/airTrafficStore/hooks/useAirTrafficJourney';

type UIContextActions = {
  viewChanged: (v: View) => void;
  showSuccessChanged: (s: boolean) => void;
  stepTransitionDirectionChanged: (d: TransitionDirection) => void;
  handleShowActiveGuides: () => void;
  handleShowTicketForm: () => void;
  handleShowKbArticle: () => void;
  handleShowMoreActiveGuides: (t: GuidesListEnum) => void;
  handleBack: () => void;
};
type UIStateContextActions = UIContextActions;
export type UIStateContextValue = UIState & {
  uiActions: UIStateContextActions;
};

const defaultContextValue: UIStateContextValue = {
  view: View.step,
  showSuccess: false,
  stepTransitionDirection: TransitionDirection.right,
  uiActions: {
    viewChanged: () => {},
    showSuccessChanged: () => {},
    stepTransitionDirectionChanged: () => {},
    handleShowActiveGuides: () => {},
    handleShowTicketForm: () => {},
    handleShowKbArticle: () => {},
    handleShowMoreActiveGuides: (_t) => {},
    handleBack: () => {},
  },
};

export const UIStateContext =
  createContext<UIStateContextValue>(defaultContextValue);

type OuterProps = {};

type Props = OuterProps &
  Pick<FormFactorContextValue, 'formFactor' | 'forcedView'>;

type MainStoreData = {
  guide?: Guide;
  step?: Step;
  mainStoreDispatch: MainStoreState['dispatch'];
};

export const UIStateContextProvider: React.FC<
  React.PropsWithChildren<Props & MainStoreData>
> = ({ formFactor, children, guide, step, mainStoreDispatch, forcedView }) => {
  const [view, setView] = useState<View>(View.step);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [stepTransitionDirection, setStepTransitionDirection] =
    useState<TransitionDirection>(TransitionDirection.right);

  const state = useMemo<UIState>(
    () => ({ view, showSuccess, stepTransitionDirection }),
    [view, showSuccess, stepTransitionDirection]
  );
  const prevState = usePrevious<UIState>(state);
  const lastActions = useRef<(Action & { payload: any[] })[]>([]);

  const { sendAction, init } = useReduxDevtools(
    `Bento UI State (${formFactor}) - ${window.location.host}`,
    isDevtoolsEnabled()
  );

  const { endJourney } = useAirTrafficJourney({
    selectedGuideEntityId: guide?.entityId,
  });

  useEffect(() => {
    if (!prevState) {
      init(state);
    } else if (lastActions.current.length > 0) {
      lastActions.current.forEach((a) => sendAction(a, state));
      lastActions.current = [];
    }
  }, [state]);

  useEffect(() => {
    if (forcedView) {
      setView(forcedView);
    }
    if (guide?.entityId && forcedView) {
      mainStoreDispatch({
        type: 'guideSelected',
        formFactor,
        guide: undefined,
      });
    }
  }, [guide?.entityId, forcedView]);

  const actionWrapper =
    (
      name: string,
      cb: (...args: any[]) => void,
      getPayload = (...args: any[]) => args
    ) =>
    (...a: Parameters<typeof cb>) => {
      lastActions.current.push({ type: name, payload: getPayload(...a) });
      cb(...a);
    };

  const viewChanged = useCallback(actionWrapper('viewChanged', setView), []);

  const showSuccessChanged = useCallback(
    actionWrapper('showSuccessChanged', setShowSuccess),
    []
  );

  const stepTransitionDirectionChanged = useCallback(
    actionWrapper('stepTransitionDirectionChanged', setStepTransitionDirection),
    []
  );

  const handleShowActiveGuides = useCallback(
    actionWrapper(
      'handleShowActiveGuides',
      () => {
        setView(View.activeGuides);
      },
      () => []
    ),
    []
  );

  const handleShowTicketForm = useCallback(
    actionWrapper(
      'handleShowTicketForm',
      () => setView(View.ticketForm),
      () => []
    ),
    []
  );

  const handleShowKbArticle = useCallback(
    actionWrapper(
      'handleShowKbArticle',
      () => setView(View.kbArticle),
      () => []
    ),
    []
  );

  const handleShowMoreActiveGuides = useCallback(
    actionWrapper(
      'handleShowMoreActiveGuides',
      (type: GuidesListEnum) => {
        const newView = guideListConfig[type]?.view;
        setView((v) =>
          newView && newView !== v ? newView : View.activeGuides
        );
      },
      () => []
    ),
    []
  );

  /**
   * Handles navigating backwards after pressing the back button within the inline/sidebar headers.
   * This is useful to transition the view and unselect guide/step when appropriate.
   *
   * Similarly, we also end journeys when appropriate given clicking back should be treated as
   * dismissing the selection.
   */
  const handleBack = useCallback(
    actionWrapper(
      'handleBack',
      () => {
        if (
          isActiveGuidesSubView(view) ||
          isTicketView(view) ||
          isKbArticleView(view)
        ) {
          /** One-off views go back to resource center */
          handleShowActiveGuides();
          return;
        }

        if (stepTransitionDirection !== TransitionDirection.left) {
          setStepTransitionDirection(TransitionDirection.left);
        }

        const isMultiStepNested =
          step &&
          guide &&
          !hasOnlyOneStep(guide) &&
          !guide.isCyoa &&
          isNestedTheme(guide.theme);

        if (isMultiStepNested) {
          /** De-select step back into guide/step groups */
          mainStoreDispatch({
            type: 'stepSelected',
            formFactor,
            step: undefined,
          });
        } else if (guide) {
          /** De-select guide */
          mainStoreDispatch({
            type: 'guideSelected',
            formFactor,
            guide: undefined,
          });
        }

        // Ends the journey for the active guide/step, if that matches the active journey.
        // This is helpful for ending the active journey of a contextual/sidebar guide
        // (i.e. after clicking link-type cta)
        endJourney({ reason: { dismissSelection: true } });
      },
      () => []
    ),
    [step, guide, view, stepTransitionDirection, mainStoreDispatch]
  );

  const uiActions = useMemo<UIStateContextActions>(
    () => ({
      viewChanged,
      showSuccessChanged,
      stepTransitionDirectionChanged,
      handleShowActiveGuides,
      handleShowMoreActiveGuides,
      handleShowTicketForm,
      handleShowKbArticle,
      handleBack,
    }),
    [handleBack]
  );

  const value = useMemo<UIStateContextValue>(
    () => ({
      ...state,
      uiActions,
    }),
    [state, uiActions]
  );

  return (
    <UIStateContext.Provider value={value}>{children}</UIStateContext.Provider>
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withMainStoreData<Props, MainStoreData>((state, { formFactor }) => ({
    guide: selectedGuideForFormFactorSelector(state, formFactor),
    step: selectedStepForFormFactorSelector(state, formFactor),
    mainStoreDispatch: state.dispatch,
  })),
])(UIStateContextProvider) as React.FC<OuterProps>;
