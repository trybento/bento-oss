import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cx from 'classnames';
import {
  isActiveGuidesView,
  isStepView,
  isGuideView,
  isTicketView,
  isKbArticleView,
} from 'bento-common/frontend/shoyuStateHelpers';
import BugIcon from '../icons/bug.svg';
import {
  Guide,
  GuideEntityId,
  Step,
} from 'bento-common/types/globalShoyuState';
import composeComponent from 'bento-common/hocs/composeComponent';
import usePrevious from 'bento-common/hooks/usePrevious';
import { GuideHeaderType, Theme } from 'bento-common/types';
import withLocation, {
  WithLocationPassedProps,
} from 'bento-common/hocs/withLocation';
import useDomObserver from 'bento-common/hooks/useDomObserver';
import useCallbackRef from 'bento-common/hooks/useCallbackRef';
import { getGuideThemeFlags } from 'bento-common/data/helpers';
import { debounce } from 'bento-common/utils/lodash';

import { SidebarProviderValue } from '../providers/SidebarProvider';
import { CustomUIProviderValue } from '../providers/CustomUIProvider';
import SuccessMessage from './SuccessMessage';
import withSidebarVisibility from '../hocs/withSidebarVisibility';
import { SIDEBAR_OVERLAY_Z_INDEX } from '../lib/sidebarConstants';
import ActiveGuides from './ActiveGuides';
import { UIStateContextValue } from '../providers/UIStateProvider';
import withCustomUIContext from '../hocs/withCustomUIContext';
import withUIState from '../hocs/withUIState';

import {
  selectedGuideForFormFactorSelector,
  selectedStepForFormFactorSelector,
  wasInlineContextualGuideDismissedSelector,
} from '../stores/mainStore/helpers/selectors';
import withMainStoreData from '../stores/mainStore/withMainStore';
import withSidebarContext from '../hocs/withSidebarContext';
import SidebarHeaderComponent from './SidebarHeader';
import StepBody from './StepBody';
import ModulesList from './ModulesList';
import FullHeightSidebarWrapper from './FullHeightSidebarWrapper';
import FloatingSidebarWrapper from './FloatingSidebarWrapper';
import { getRenderConfig } from '../lib/guideRenderConfig';
import withSidebarTracking from '../hocs/withSidebarTracking';
import withFormFactor from '../hocs/withFormFactor';
import { FormFactorContextValue } from '../providers/FormFactorProvider';
import InlineSidebarWrapper from './InlineSidebarWrapper';
import withInlineEmbed from '../hocs/withIlnineEmbed';
import { InlineEmbedContextValue } from '../providers/InlineEmbedProvider';
import { StepTransition } from '../../types/global';
import SuccessBanner from './SuccessBanner';
import ResetOnboarding from './ResetOnboarding';
import TicketForm from './TicketForm';
import ZendeskChat from './ActiveGuides/ZendeskChatButton';
import HelpCenterArticle from './ActiveGuides/helpCenter/HelpCenterArticle';
import { trackOnboardedSidebar } from '../api';
import { SidebarAvailability } from 'bento-common/types/shoyuUIState';
import { AirTrafficStore } from '../stores/airTrafficStore/types';
import withAirTrafficState from '../stores/airTrafficStore/withAirTrafficState';

type OuterProps = {
  theme: Theme | undefined;
  container?: string;
  style?: CSSProperties;
};

type BeforeAirTrafficDataProps = OuterProps &
  Pick<UIStateContextValue, 'view' | 'uiActions'> &
  Pick<
    CustomUIProviderValue,
    | 'sidebarHeader'
    | 'floatingAnchorXOffset'
    | 'floatingAnchorYOffset'
    | 'floatingDragDisabled'
    | 'backgroundColor'
    | 'primaryColorHex'
    | 'ticketCreationEnabled'
    | 'zendeskChatEnabled'
    | 'isFloatingSidebar'
    | 'helpCenterStyle'
    | 'sidebarAvailability'
  > &
  Pick<
    SidebarProviderValue,
    | 'sidebarId'
    | 'isSidebarExpanded'
    | 'setIsSidebarExpanded'
    | 'shouldAutoFocusSidebar'
  > &
  WithLocationPassedProps &
  Pick<
    FormFactorContextValue,
    | 'formFactor'
    | 'renderedFormFactor'
    | 'embedFormFactor'
    | 'embedFormFactorFlags'
    | 'isPreviewFormFactor'
  > &
  Pick<InlineEmbedContextValue, 'isEverboardingInline'>;

type AirTrafficData = {
  airTrafficRegister: AirTrafficStore['register'];
};

type MainStoreData = {
  guide: Guide | undefined;
  step: Step | undefined;
  wasContextualDismissed: boolean;
};

type BeforeMainStoreProps = BeforeAirTrafficDataProps & AirTrafficData;

type SidebarProps = BeforeMainStoreProps & MainStoreData;

const Sidebar: React.FC<SidebarProps> = ({
  view,
  guide,
  step,
  style = {},
  isSidebarExpanded,
  setIsSidebarExpanded,
  shouldAutoFocusSidebar,
  sidebarHeader,
  theme,
  appLocation,
  isFloatingSidebar,
  backgroundColor,
  embedFormFactor,
  ticketCreationEnabled,
  zendeskChatEnabled,
  sidebarAvailability,
  embedFormFactorFlags: { isInline },
  wasContextualDismissed,
  uiActions,
  renderedFormFactor,
  container: containerSelector,
  isEverboardingInline,
  formFactor,
  isPreviewFormFactor,
  helpCenterStyle,
  airTrafficRegister,
}) => {
  const [isSidebarOverlayDisplayed, setIsSidebarOverlayDisplayed] =
    useState<boolean>(false);
  const [isToggleEmphasized, setIsToggleEmphasized] = useState<boolean>(false);
  const [bottomControlsRef, setBottomControlsRef] =
    useState<HTMLDivElement | null>(null);
  const { stepTransition, skipModuleViewIfOnlyOne, showSuccessOnStepComplete } =
    getRenderConfig({
      stepType: step?.stepType,
      theme,
      embedFormFactor,
      renderedFormFactor,
      isCyoaGuide: undefined,
      view: undefined,
    });
  const { isCard, isCarousel } = getGuideThemeFlags(theme);
  const [headerRef, setHeaderRef] = useState<HTMLDivElement | null>(null);
  const stepContentRef = useRef<HTMLDivElement>(null);
  const prevGuideEntityId = useRef<GuideEntityId | undefined>(undefined);
  const [container, setContainer] = useState<HTMLElement | null | undefined>(
    containerSelector ? null : undefined
  );

  const updateContainer = useCallbackRef(
    debounce(() => {
      if (containerSelector) {
        const containerEl = document.body.querySelector(containerSelector);
        if (container !== containerEl) {
          setContainer(containerEl as HTMLElement | null);
        }
      }
    }, 100),
    [containerSelector],
    { callOnDepsChange: true, callOnLoad: true }
  );

  useDomObserver(updateContainer, {
    disabled: !containerSelector,
  });

  /**
   * Controls the blocking auto open experience, which is intended to alert users of
   *   the presence of the sidebar onboarding guide when there is no inline detected.
   */
  const executeAutoOpenSidebarAnimation = useCallback(() => {
    let completed = false;
    const startTimeout = setTimeout(() => setIsToggleEmphasized(true), 250);
    const emphasizedTimeout = setTimeout(
      () => setIsToggleEmphasized(false),
      800
    );
    const overlayTimeout = setTimeout(() => {
      setIsSidebarExpanded(true);
      setIsSidebarOverlayDisplayed(true);
      completed = true;
    }, 1300);

    void trackOnboardedSidebar();

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(emphasizedTimeout);
      clearTimeout(overlayTimeout);
      if (!completed) {
        setIsToggleEmphasized(false);
      }
    };
  }, []);

  useEffect(() => {
    if (!isSidebarExpanded && isSidebarOverlayDisplayed) {
      setIsSidebarOverlayDisplayed(false);
    }
  }, [
    isSidebarExpanded,
    isSidebarOverlayDisplayed,
    setIsSidebarOverlayDisplayed,
  ]);

  useEffect(() => {
    let cancelAnimation: () => void;
    if (shouldAutoFocusSidebar) {
      cancelAnimation = executeAutoOpenSidebarAnimation();
    }
    return () => cancelAnimation?.();
  }, [shouldAutoFocusSidebar]);

  const previousLocation = usePrevious(appLocation.href);

  useEffect(() => {
    if (
      previousLocation &&
      previousLocation !== appLocation.href &&
      isSidebarExpanded &&
      !guide
    ) {
      setIsSidebarExpanded(false);
    }
  }, [appLocation, isSidebarExpanded, guide, setIsSidebarExpanded]);

  const handleDismissOverlay = useCallback(() => {
    setIsSidebarOverlayDisplayed(false);
  }, []);

  const SidebarWrapper = isInline
    ? InlineSidebarWrapper
    : isFloatingSidebar
    ? FloatingSidebarWrapper
    : FullHeightSidebarWrapper;

  const isEverboardingInlineFinished: boolean =
    isEverboardingInline &&
    !!(wasContextualDismissed || guide?.isComplete || guide?.isDone);

  const guideTitleSibling = useMemo(
    () => (isInline ? <ResetOnboarding className="ml-1" /> : null),
    [isInline]
  );

  const wrapperBackgroundColor = isEverboardingInline
    ? undefined
    : backgroundColor || 'white';

  const sidebarContentWrapperRef = useRef<HTMLDivElement>(null);

  const componentHiddenBySetting =
    sidebarAvailability === SidebarAvailability.hide && !isInline;

  /** Factors that'll cause render to punt */
  const hideSidebarComponent =
    isEverboardingInlineFinished || componentHiddenBySetting;

  /**
   * Updates air traffic control whenever a guide is shown or hidden.
   * This shouldn't ever record a guide as seen if the sidebar is NOT expanded
   * or if the sidebar component fully is hidden.
   */
  useEffect(() => {
    if (isSidebarExpanded && !hideSidebarComponent && guide) {
      airTrafficRegister({
        guide: guide.entityId,
        shown: true,
      });
      prevGuideEntityId.current = guide.entityId;
    } else if (
      prevGuideEntityId.current &&
      (!isSidebarExpanded || hideSidebarComponent)
    )
      airTrafficRegister({
        guide: prevGuideEntityId.current,
        shown: false,
      });
  }, [isSidebarExpanded, guide, hideSidebarComponent]);

  if (hideSidebarComponent) return null;

  return (
    <>
      {isSidebarOverlayDisplayed && (
        <div
          className={`
            fixed
            h-full
            w-full
            bg-black
            opacity-60
            top-0
            left-0
            right-0
            cursor-pointer
          `}
          style={{
            animation: 'partialFadeIn 1.2s',
            zIndex: SIDEBAR_OVERLAY_Z_INDEX,
          }}
          onClick={handleDismissOverlay}
        />
      )}
      <SidebarWrapper
        isOverlayDisplayed={isSidebarOverlayDisplayed}
        handleDismissOverlay={handleDismissOverlay}
        emphasizeToggle={isToggleEmphasized}
        headerRef={headerRef}
        container={container}
      >
        {!isEverboardingInline && (
          <SidebarHeaderComponent
            draggableRef={setHeaderRef}
            guideTitleSibling={guideTitleSibling}
          />
        )}
        <div
          ref={sidebarContentWrapperRef}
          className={cx('overflow-x-hidden overflow-y-auto grow', {
            'pt-2':
              sidebarHeader.type !== GuideHeaderType.simple &&
              !isStepView(view) &&
              !isFloatingSidebar,
            'pb-2':
              isStepView(view) && !isFloatingSidebar && !isCard && !isCarousel,
          })}
          style={{
            backgroundColor: wrapperBackgroundColor,
            ...style,
          }}
        >
          <div className="h-full relative">
            {isGuideView(view) ||
              (isStepView(view) && (
                // show the success banner on top of the completed guide
                <SuccessBanner renderingStyle="overlay" />
              ))}
            {isTicketView(view) ? (
              <div
                className={cx('h-full px-4', {
                  'py-2': sidebarHeader.type !== GuideHeaderType.simple,
                })}
              >
                <TicketForm />
              </div>
            ) : isKbArticleView(view) ? (
              <div
                className={cx('h-full px-4', {
                  'py-2': sidebarHeader.type !== GuideHeaderType.simple,
                })}
              >
                <HelpCenterArticle />
              </div>
            ) : isActiveGuidesView(view) ? (
              <div
                className={cx('px-4', {
                  'py-2': sidebarHeader.type !== GuideHeaderType.simple,
                })}
              >
                <ActiveGuides
                  overridenMarginBottomPx={
                    bottomControlsRef?.getBoundingClientRect()?.height
                  }
                />
              </div>
            ) : // if the step transition is not set to slide then all the steps
            // should be viewable in the guide view so it should just stay there
            (isGuideView(view) || stepTransition !== StepTransition.slide) &&
              ((guide?.modules?.length || 0) > 1 ||
                !skipModuleViewIfOnlyOne) ? (
              <div
                className={cx({ 'px-4': !isEverboardingInline && !isInline })}
              >
                <ModulesList
                  sidebarContentWrapperRef={sidebarContentWrapperRef}
                  theme={theme}
                />
              </div>
            ) : (
              <>
                {/** Step success only shows in the step view. */}
                <StepBody
                  stepContentRef={stepContentRef}
                  step={step}
                  theme={theme!}
                  isSelected
                />
                {showSuccessOnStepComplete && (
                  <SuccessMessage formFactor={formFactor} step={step} />
                )}
              </>
            )}
          </div>
          {!isInline && isActiveGuidesView(view) && (
            <div
              ref={setBottomControlsRef}
              className="absolute bottom-0 flex flex-col gap-4 w-full p-4 font-semibold rounded-b-lg empty:hidden"
              style={{
                boxShadow: '0px -1px 4px 0px rgba(0, 0, 0, 0.12)',
                backgroundColor: wrapperBackgroundColor,
              }}
            >
              {ticketCreationEnabled && (
                <div
                  className="text-sm cursor-pointer flex gap-2.5 items-center select-none"
                  onClick={
                    isPreviewFormFactor
                      ? undefined
                      : uiActions.handleShowTicketForm
                  }
                >
                  <BugIcon className="resource-center-icon-w text-gray-600" />
                  <div>{helpCenterStyle.supportTicketTitle}</div>
                </div>
              )}
              {zendeskChatEnabled && <ZendeskChat />}
            </div>
          )}
        </div>
      </SidebarWrapper>
    </>
  );
};

export default composeComponent<OuterProps>([
  /**
   * `withSidebarVisibility` internally uses `withFormFactor` and destructures
   * the props received for its own use, meaning it needs to come before `withFormFactor`
   * here to remove the risk of passing down undefined props.
   */
  withSidebarVisibility,
  withFormFactor,
  withCustomUIContext,
  withUIState,
  withSidebarContext,
  withLocation,
  withSidebarTracking,
  withInlineEmbed,
  withAirTrafficState<BeforeAirTrafficDataProps, AirTrafficData>(
    (state): AirTrafficData => ({
      airTrafficRegister: state.register,
    })
  ),
  withMainStoreData<BeforeMainStoreProps, MainStoreData>(
    (state, { formFactor }) => {
      const guide = selectedGuideForFormFactorSelector(state, formFactor);

      return {
        guide,
        step: selectedStepForFormFactorSelector(state, formFactor),
        wasContextualDismissed: wasInlineContextualGuideDismissedSelector(
          state,
          guide?.entityId
        ),
      };
    }
  ),
])(Sidebar);
