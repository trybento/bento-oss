import React, { createContext, useCallback, useContext, useMemo } from 'react';
import {
  EmbedTypenames,
  Guide,
  Step,
  TaggedElement,
  TooltipGuide,
} from 'bento-common/types/globalShoyuState';
import composeComponent from 'bento-common/hocs/composeComponent';
import { isInViewport } from 'bento-common/utils/dom';
import {
  TagVisibility,
  TooltipShowOn,
  VisualTagHighlightType,
} from 'bento-common/types';
import { isTooltipGuide } from 'bento-common/utils/formFactor';
import { isOnboarding, isEverboarding } from 'bento-common/data/helpers';

import withSidebarContext from '../hocs/withSidebarContext';
import { SidebarProviderValue } from './SidebarProvider';
import withMainStoreData, {
  withMainStoreDispatch,
  WithMainStoreDispatchData,
} from '../stores/mainStore/withMainStore';
import {
  firstStepOfGuideSelector,
  guideSelector,
  stepSelector,
} from '../stores/mainStore/helpers/selectors';
import { FormFactorContextValue } from './FormFactorProvider';
import withFormFactor from '../hocs/withFormFactor';
import { CustomUIContext } from './CustomUIProvider';
import useAirTrafficJourney from '../stores/airTrafficStore/hooks/useAirTrafficJourney';

export type ContextualTagProviderValue = {
  handleDismiss: (e: React.MouseEvent) => void;
  handleSeeMore: (e: React.MouseEvent | undefined) => void;
  unsetForcefullyOpen: () => void;
  unsetScrollIntoView: () => void;
  scrollIntoViewIfNeeded: () => void;
  /**
   * Determines whether the tag is forced to show up.
   * This is true when the tag is forced within the context of previews OR
   * if the tag is set to show on page load.
   */
  forcedToShow: boolean;
  /** Whether the tag has an overlay style */
  hasOverlay: boolean;
  /** Whether tag is associated with a Tooltip guide */
  isTooltip: boolean;
  /** Whether the tag is set to open on page load */
  shouldOpenOnLoad: boolean;
  shouldShowSelectionControls: boolean;
  /** Tag element instance */
  taggedElement: TaggedElement | undefined;
  /** Guide directly associated with tagged element */
  guide: Guide | undefined;
  /**
   * Step directly/indirectly associated with tagged element.
   *
   * This will either be the directly associated Step or the first Step of the associated guide,
   * regardless of completion status.
   */
  step: Step | undefined;
};

type OuterProps = React.PropsWithChildren<{
  /** Tag element associated with this instance */
  taggedElement: TaggedElement;
}>;

type MainStoreData = {
  guide: TooltipGuide | undefined;
  step: Step | undefined;
};

type Props = OuterProps &
  MainStoreData &
  Pick<
    SidebarProviderValue,
    'setIsSidebarExpanded' | 'disableSidebarTransitions'
  > &
  Pick<FormFactorContextValue, 'formFactor'>;

type ContextualTagProviderProps = Props & WithMainStoreDispatchData;

export const ContextualTagContext = createContext<ContextualTagProviderValue>({
  handleDismiss: () => {},
  handleSeeMore: () => {},
  unsetForcefullyOpen: () => {},
  unsetScrollIntoView: () => {},
  scrollIntoViewIfNeeded: () => {},
  forcedToShow: false,
  hasOverlay: false,
  isTooltip: false,
  shouldOpenOnLoad: false,
  shouldShowSelectionControls: false,
  taggedElement: undefined,
  guide: undefined,
  step: undefined,
});

const ContextualTagProvider: React.FC<ContextualTagProviderProps> = ({
  children,
  taggedElement,
  guide,
  step,
  setIsSidebarExpanded,
  disableSidebarTransitions,
  dispatch,
  formFactor,
}) => {
  const { tagVisibility } = useContext(CustomUIContext);

  const { activeJourney, endJourney } = useAirTrafficJourney({
    selectedGuideEntityId: guide?.entityId,
  });

  const belongsToActiveJourney = useMemo<boolean>(() => {
    if (!activeJourney || activeJourney.type !== EmbedTypenames.guide)
      return false;

    const common = taggedElement.guide === activeJourney.selectedGuide;

    if (taggedElement.step) {
      return common && taggedElement.step === activeJourney.selectedStep;
    }

    return common;
  }, [
    taggedElement.guide,
    taggedElement.step,
    activeJourney?.entityId, // this is safe given a journey is immutable
  ]);

  /**
   * Marks the step as viewed and dismisses the tag.
   * If in preview mode, simply un-hides the tag after a delay.
   */
  const handleDismiss = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      dispatch({ type: 'tagDismissed', tag: taggedElement.entityId });
      endJourney({ reason: { dismissSelection: true } });
    },
    [dispatch]
  );

  /**
   * Dispatch an event to select the guide for this tag
   *
   * @todo start a journey for the contextual guide, remove direct sidebar control
   */
  const handleSeeMore = useCallback(
    (e: React.MouseEvent | undefined) => {
      e?.stopPropagation();
      e?.preventDefault();

      disableSidebarTransitions();

      dispatch({
        type: 'guideSelected',
        guide: taggedElement.guide,
        formFactor,
      });

      /**
       * For onboarding and contextual guides we need to directly select
       * the desired step, so that vtags pointing to specific steps of a guide
       * can open the expected step instead of the first incomplete step.
       */
      if (
        (isOnboarding(taggedElement.designType) ||
          isEverboarding(taggedElement.designType)) &&
        taggedElement.step
      ) {
        dispatch({
          type: 'stepSelected',
          step: taggedElement.step,
          formFactor,
        });
      }

      /**
       * Should toggle the sidebar expanded state to have it open.
       * This is specially important to allow for opening the guide on the sidebar.
       */
      setIsSidebarExpanded(true);
    },
    [taggedElement, setIsSidebarExpanded]
  );

  const unsetForcefullyOpen = useCallback(() => {
    if (taggedElement.forcefullyOpen && !taggedElement.isPreview) {
      dispatch({
        type: 'taggedElementFlagSet',
        taggedElementEntityId: taggedElement.entityId,
        forcefullyOpen: false,
      });
    }
  }, [
    taggedElement.entityId,
    taggedElement.forcefullyOpen,
    taggedElement.isPreview,
  ]);

  const unsetScrollIntoView = useCallback(() => {
    dispatch({
      type: 'taggedElementFlagSet',
      taggedElementEntityId: taggedElement.entityId,
      scrollIntoView: false,
    });
  }, [taggedElement.entityId]);

  const scrollIntoViewIfNeeded = useCallback(() => {
    if (!taggedElement.scrollIntoView) return;

    const targetElement = document.querySelector(taggedElement.elementSelector);

    if (targetElement && !isInViewport(targetElement)) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }

    // unset the flag to prevent scrolling hell
    unsetScrollIntoView();
  }, [
    taggedElement.elementSelector,
    taggedElement.scrollIntoView,
    unsetScrollIntoView,
  ]);

  const enrichedState = useMemo(() => {
    const hasOverlay =
      taggedElement.style?.type === VisualTagHighlightType.overlay;
    const shouldOpenOnLoad =
      hasOverlay ||
      guide?.formFactorStyle?.tooltipShowOn === TooltipShowOn.load;
    return {
      forcedToShow:
        taggedElement.forcefullyOpen ||
        shouldOpenOnLoad ||
        belongsToActiveJourney,
      hasOverlay,
      isTooltip: isTooltipGuide(taggedElement.formFactor),
      shouldOpenOnLoad,
    };
  }, [
    guide?.formFactorStyle?.tooltipShowOn,
    taggedElement.formFactor,
    taggedElement.style?.type,
    taggedElement.forcefullyOpen,
  ]);

  /**
   * Determines whether to show the visual tag selection controls (i.e. "see more").
   *
   * This shouldn't be shown for tags associated with steps of onboarding tags when tag visibility
   * is set to "active step" since allegedly the guide is already being shown, therefore selecting
   * wouldn't have any effect.
   */
  const shouldShowSelectionControls = useMemo<boolean>(() => {
    switch (tagVisibility) {
      case TagVisibility.activeStep:
        return !taggedElement.step || !isOnboarding(guide?.designType);

      default:
        return true;
    }
  }, [tagVisibility, taggedElement.step, guide?.designType]);

  if (!guide) return null;

  return (
    <ContextualTagContext.Provider
      value={{
        handleDismiss,
        handleSeeMore,
        scrollIntoViewIfNeeded,
        unsetForcefullyOpen,
        unsetScrollIntoView,
        shouldShowSelectionControls,
        taggedElement,
        guide,
        step,
        ...enrichedState,
      }}
    >
      {children}
    </ContextualTagContext.Provider>
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withSidebarContext,
  withMainStoreDispatch,
  withMainStoreData<Props, MainStoreData>(
    (state, { taggedElement }): MainStoreData => {
      const guide = guideSelector<TooltipGuide>(taggedElement.guide, state);
      return {
        guide,
        step: taggedElement.step
          ? stepSelector(taggedElement.step, state)
          : firstStepOfGuideSelector(state, guide?.entityId),
      };
    }
  ),
])(ContextualTagProvider);
