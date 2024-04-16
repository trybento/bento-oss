import React, { useCallback, useMemo } from 'react';
import Tooltip from 'react-tooltip';
import cx from 'classnames';

import { EmbedToggleStyle } from 'bento-common/types';
import {
  Guide,
  GuideEntityId,
  Step,
} from 'bento-common/types/globalShoyuState';
import composeComponent from 'bento-common/hocs/composeComponent';
import withLocation, {
  WithLocationPassedProps,
} from 'bento-common/hocs/withLocation';
import {
  EmbedToggleBehavior,
  SidebarVisibility,
} from 'bento-common/types/shoyuUIState';
import {
  allowedGuideTypesSettings,
  isFinishedGuide,
} from 'bento-common/data/helpers';
import { withStopEvent } from 'bento-common/utils/dom';

import LeftArrow from '../icons/leftArrow.svg';
import RightArrow from '../icons/rightArrow.svg';
import LastPage from '../icons/lastPage.svg';
import FirstPage from '../icons/firstPage.svg';
import LibraryBooksOutline from '../icons/libraryBooksOutline.svg';
import ArrowBack from '../icons/arrowBackIos.svg';
import BookmarkOutline from '../icons/bookmarkOutline.svg';
import { SidebarProviderValue } from '../providers/SidebarProvider';
import { CustomUIProviderValue } from '../providers/CustomUIProvider';
import ProgressCircle from './ProgressCircle';
import { px } from '../lib/helpers';
import { SIDEBAR_TOGGLE_Z_INDEX } from '../lib/constants';
import { UIStateContextValue } from '../providers/UIStateProvider';
import withCustomUIContext from '../hocs/withCustomUIContext';
import withUIState from '../hocs/withUIState';
import {
  availableIncompleteGuidesSelector,
  completeEverboardingGuidesSelector,
  lastSerialCyoaInfoSelector,
  everboardingGuidesSelector,
  formFactorGuidesSelector,
  leadingGuideSelector,
  savedForLaterGuidesSelector,
  selectedGuideForFormFactorSelector,
  selectedStepForFormFactorSelector,
  autoSelectGuideSelector,
} from '../stores/mainStore/helpers/selectors';
import withMainStoreData from '../stores/mainStore/withMainStore';
import withSidebarContext from '../hocs/withSidebarContext';
import withSidebarVisibility from '../hocs/withSidebarVisibility';
import { FormFactorContextValue } from '../providers/FormFactorProvider';
import withFormFactor from '../hocs/withFormFactor';
import { onSidebarOpened } from '../lib/events';
import { MainStoreState } from '../stores/mainStore/types';
import withAirTrafficState from '../stores/airTrafficStore/withAirTrafficState';
import { guidesToShowSelector } from '../stores/airTrafficStore/helpers/selectors';

type OuterProps = {
  isEmphasized: boolean;
};

type BeforeAirTrafficProps = OuterProps &
  Pick<UIStateContextValue, 'uiActions'> &
  Pick<
    CustomUIProviderValue,
    | 'toggleColorHex'
    | 'toggleTextColor'
    | 'backgroundColor'
    | 'isFloatingSidebar'
    | 'isEmbedToggleColorInverted'
    | 'toggleStyle'
    | 'toggleText'
    | 'sidebarSide'
    | 'sidebarStyle'
    | 'sidebarVisibility'
    | 'embedToggleBehavior'
  > &
  Pick<
    SidebarProviderValue,
    'isSidebarExpanded' | 'setIsSidebarExpanded' | 'hiddenViaZendesk'
  > &
  WithLocationPassedProps &
  Pick<FormFactorContextValue, 'formFactor' | 'embedFormFactor'>;

type AirTrafficStoreData = {
  guidesToShow: GuideEntityId[];
};

type BeforeMainStoreDataProps = BeforeAirTrafficProps & AirTrafficStoreData;

type MainStoreData = {
  /** The selected guide or the first incomplete onboarding guide */
  guide?: Guide;
  /** Has available onboarding guides? */
  hasOnboardingGuides: boolean;
  /** Has available saved guides? */
  hasSavedGuides: boolean;
  /** Any incomplete everboarding guides */
  everboardingGuides: Guide[];
  /** Has complete everboarding guides? */
  hasCompleteEverboardingGuides: boolean;
  /** The leading onboarding guide, if available */
  onboardingGuide?: Guide;
  /** Selected step of any sort */
  step?: Step;
  /** Determines what guide we auto select when opening the sidebar */
  focusGuide?: Guide;
  dispatch: MainStoreState['dispatch'];
  waitingForNextGuide: boolean;
  hasAvailableGuides: boolean;
  hasCompletedGuides: boolean;
  serialCyoaData: ReturnType<typeof lastSerialCyoaInfoSelector>;
};

export type SidebarToggleTabProps = BeforeMainStoreDataProps & MainStoreData;

/**
 * Determines the inner padding size for the toggle wrapper.
 */
const PADDING_SIZE = 6;
const ICON_SIZE = 40;

export const SidebarToggleTabComponent: React.FC<SidebarToggleTabProps> = ({
  isEmphasized,
  toggleColorHex,
  toggleTextColor,
  isEmbedToggleColorInverted,
  toggleStyle,
  toggleText,
  sidebarSide,
  isFloatingSidebar,
  sidebarVisibility,
  uiActions,
  isSidebarExpanded,
  hasAvailableGuides,
  hasCompletedGuides,
  serialCyoaData,
  embedToggleBehavior,
  setIsSidebarExpanded,
  guide,
  hasOnboardingGuides,
  hasSavedGuides,
  hasCompleteEverboardingGuides,
  formFactor,
  waitingForNextGuide,
  hiddenViaZendesk,
  dispatch,
  everboardingGuides,
  focusGuide,
  step,
}) => {
  const allowedGuideTypes = allowedGuideTypesSettings(
    sidebarVisibility,
    formFactor
  );

  /**
   * The "hidden" style is for customers to use their own toggle.
   * However we should still show something for saved for later
   *
   * Other settings have specific scenarios where we'll still hide the toggle.
   */
  const isSidebarToggleHidden = useMemo(() => {
    /** Always show toggle is sidebar already open */
    if (isSidebarExpanded) return false;

    /** Always show toggle if there are saved guides */
    if (hasSavedGuides) return false;

    switch (sidebarVisibility) {
      case SidebarVisibility.show:
        /** Hide if sidebar is set to show but there aren't any past/present guides */
        return !hasAvailableGuides && !hasCompletedGuides;
      case SidebarVisibility.activeGuides:
        /** Hide if showing only on active guides but there aren't any */
        return (
          !hasAvailableGuides &&
          !waitingForNextGuide &&
          serialCyoaData.isFinished
        );
      case SidebarVisibility.activeOnboardingGuides:
        /** Hide if "Only onboarding" and there is no guide, or the guide is a side quest */
        return (!guide || guide?.isSideQuest) && !waitingForNextGuide;
      case SidebarVisibility.hide:
      default:
        /** Hide if setting is to hide and we didn't already punt on must-show condition */
        return true;
    }
  }, [
    guide?.isSideQuest,
    waitingForNextGuide,
    sidebarVisibility,
    isSidebarExpanded,
    hasSavedGuides,
    hasAvailableGuides,
    hasCompletedGuides,
    serialCyoaData.isFinished,
  ]);

  const hasEverboardingGuides = everboardingGuides.length > 0;

  /**
   * Calculates the progress ring parameters
   */
  const { completedStepsCount = 0, totalSteps = 0 } = guide || {};
  const [numerator, denominator] =
    completedStepsCount === totalSteps
      ? [100, 100]
      : [completedStepsCount, totalSteps];

  /**
   * Determines if we have some available/finished everboarding
   * guides to show in the sidebar, based on wether or not
   * we're hiding the toggle if no active guides.
   */
  const hasSomeEverboardingGuides =
    (hasEverboardingGuides && allowedGuideTypes.everboarding) ||
    (hasCompleteEverboardingGuides && allowedGuideTypes.completed);

  /**
   * Determines if only have side quest icons (i.e. saved/more guides)
   * to display since there is no other available onboarding  guides
   * and sidebar is set to be hidden.
   */
  const sideQuestsIconsOnly =
    ((hasSavedGuides ||
      (hasEverboardingGuides && allowedGuideTypes.everboarding) ||
      (sidebarVisibility === SidebarVisibility.show &&
        allowedGuideTypes.completed &&
        hasCompleteEverboardingGuides)) &&
      !(hasOnboardingGuides && allowedGuideTypes.activeOnboarding) &&
      (!isSidebarExpanded || isFloatingSidebar)) ||
    isSidebarToggleHidden;

  /**
   * Should only show the progress indicator if toggle style
   * matches and shouldn't be hidden when 100% complete.
   */
  const shouldShowProgressIndicator =
    !!guide &&
    allowedGuideTypes.activeOnboarding &&
    toggleStyle === EmbedToggleStyle.progressRing &&
    !sideQuestsIconsOnly;

  const handleToggleSidebar = useCallback(
    () => void setIsSidebarExpanded(undefined, true),
    [setIsSidebarExpanded, isSidebarExpanded]
  );

  const openSidebar = useCallback(
    withStopEvent(() => {
      handleToggleSidebar();
    }),
    [handleToggleSidebar]
  );

  const showActiveGuides = useCallback(
    withStopEvent(() => {
      uiActions.handleShowActiveGuides();
      handleToggleSidebar();
    }),
    [handleToggleSidebar, uiActions]
  );

  /**
   * If a guide and step needs to be focused, do so
   * If it already is, simply open sidebar
   * If nothing to focus, open the resource center
   */
  const showLatestGuide = useCallback(
    withStopEvent((e) => {
      if (focusGuide?.firstIncompleteStep) {
        if (step?.entityId !== focusGuide.firstIncompleteStep) {
          dispatch({
            type: 'stepSelected',
            formFactor,
            step: focusGuide?.firstIncompleteStep,
          });
        }
        openSidebar(e);
        return;
      }

      showActiveGuides(e);
    }),
    [showActiveGuides, formFactor, step, focusGuide]
  );

  const handleToggleClick = useCallback(
    (e) => {
      if (!isSidebarExpanded) onSidebarOpened();

      (embedToggleBehavior === EmbedToggleBehavior.resourceCenter
        ? showActiveGuides
        : embedToggleBehavior === EmbedToggleBehavior.default
        ? showLatestGuide
        : openSidebar)(e);
    },
    [handleToggleSidebar, uiActions, isSidebarExpanded]
  );

  const isSidebarOnRight = sidebarSide === 'right';

  /**
   * Determines when to show the open arrow for the toggle,
   * when `true` the progress indicator will be hidden.
   */
  const shouldShowOpenArrow =
    ((isSidebarExpanded && !isFloatingSidebar) ||
      (!hasOnboardingGuides && !hasSomeEverboardingGuides)) &&
    !sideQuestsIconsOnly;

  /**
   * We should show the separator whenever:
   *
   * - The end user has onboardind and saved/everboarding guides at the same time;
   * - OR the toggle style is arrow/text and the sidebar is set to be always displayed;
   *
   * Make sure it doesn't show for "hidden" since there's no top element
   */
  const shouldShowSeparator =
    ((shouldShowProgressIndicator &&
      (hasSavedGuides || hasSomeEverboardingGuides)) ||
      toggleStyle !== EmbedToggleStyle.progressRing) &&
    !isSidebarToggleHidden;

  const arrowRight =
    (isSidebarOnRight && isSidebarExpanded) ||
    (!isSidebarOnRight && !isSidebarExpanded);
  const ArrowEl = arrowRight ? RightArrow : LeftArrow;

  /**
   * Determines the control icon sizes (everboarding or saved guides)
   * based on the toggle style.
   */
  const controlIconSize =
    toggleStyle === EmbedToggleStyle.progressRing ? 24 : 20;

  /**
   * Determines the expected toggle width based on the toggle style.
   */
  const expectedToggleWidth =
    toggleStyle !== EmbedToggleStyle.text ? ICON_SIZE : 24;

  const sideQuestIconsInARow =
    (toggleStyle === EmbedToggleStyle.progressRing &&
      shouldShowProgressIndicator) ||
    toggleStyle === EmbedToggleStyle.arrow;

  /**
   * Determines the width for the side quest icons.
   */
  const sideQuestIconsWidth =
    hasSavedGuides && hasSomeEverboardingGuides
      ? sideQuestsIconsOnly && toggleStyle === EmbedToggleStyle.progressRing
        ? px(expectedToggleWidth)
        : '20px'
      : sideQuestsIconsOnly
      ? px(expectedToggleWidth)
      : px(controlIconSize);

  /**
   * Only the progress ring and hidden styles should have a minimum height.
   */
  const shouldHaveMinHeight =
    toggleStyle === EmbedToggleStyle.progressRing || isSidebarToggleHidden;

  /**
   * Hide sidebar toggle if there are only tag targeted guides
   * and none of them are active.
   */
  const shouldHideToggle = useMemo(
    () =>
      sideQuestsIconsOnly &&
      !hasSavedGuides &&
      !hasEverboardingGuides &&
      !(hasCompletedGuides && allowedGuideTypes.completed),
    [
      hasEverboardingGuides,
      hasSavedGuides,
      sideQuestsIconsOnly,
      hasCompletedGuides,
      allowedGuideTypes,
    ]
  );

  /**
   * Hide if conditions met, or hidden style with no saved guides
   */
  if (shouldHideToggle || isSidebarToggleHidden || hiddenViaZendesk)
    return null;

  return (
    <>
      <div
        className={cx(
          'bento-sidebar-toggle',
          'overflow-hidden',
          'absolute',
          'top-2/4',
          'cursor-pointer',
          'fill-current',
          'hover:text-gray-500',
          'flex',
          'flex-col',
          'items-center',
          'justify-start',
          'transition-all',
          'duration-500',
          {
            'w-13': shouldShowProgressIndicator,
            'rounded-lg': isSidebarExpanded,
            'rounded-l-lg': isSidebarOnRight,
            'rounded-r-lg': !isSidebarExpanded && !isSidebarOnRight,
            'opacity-0': isFloatingSidebar && isSidebarExpanded,
          }
        )}
        style={{
          zIndex: SIDEBAR_TOGGLE_Z_INDEX,
          padding: px(PADDING_SIZE),
          minWidth: px(expectedToggleWidth),
          minHeight: shouldHaveMinHeight ? '3rem' : 'auto',
          top: 'calc(50% - 24px)',
          left: isSidebarOnRight
            ? px(0 - expectedToggleWidth - PADDING_SIZE * 2)
            : '100%',
          transform: `translateX(${
            isSidebarExpanded ? (isSidebarOnRight ? '5px' : '-5px') : '0px'
          })`,
          backgroundColor: isEmbedToggleColorInverted
            ? toggleColorHex
            : 'white',
          color: isEmbedToggleColorInverted ? 'white' : toggleTextColor,
          boxShadow: isEmphasized
            ? `1px 2px 10px 10px rgba(0, 0, 0, 0.16), 0px 1px 10px 10px rgba(0, 0, 0, 0.08)`
            : '1px 2px 6px rgba(0, 0, 0, 0.16), 0px 1px 4px rgba(0, 0, 0, 0.08)',
        }}
        onClick={handleToggleClick}
      >
        {toggleStyle === EmbedToggleStyle.progressRing ? (
          !shouldShowOpenArrow && !shouldShowProgressIndicator ? null : (
            <div
              className={cx('circular-progress-wrapper w-10 my-auto', {
                'h-6': shouldShowOpenArrow,
                'h-10': !shouldShowOpenArrow,
              })}
            >
              {shouldShowOpenArrow ? (
                arrowRight ? (
                  <LastPage className="sidebar-toggle-arrow-right w-6 m-auto" />
                ) : (
                  <FirstPage className="sidebar-toggle-arrow-left w-6 m-auto" />
                )
              ) : (
                shouldShowProgressIndicator && (
                  <ProgressCircle
                    numerator={numerator}
                    denominator={denominator}
                  />
                )
              )}
            </div>
          )
        ) : toggleStyle === EmbedToggleStyle.arrow ? (
          <div style={{ width: px(ICON_SIZE), height: px(ICON_SIZE) }}>
            <ArrowEl className="w-full h-full fill-current" />
          </div>
        ) : toggleStyle === EmbedToggleStyle.text ? (
          <div className={`w-6 flex flex-col`}>
            <div
              className="rotate-180 leading-5 mt-1"
              style={{ writingMode: 'vertical-rl' }}
            >
              {toggleText}
            </div>
            <div className="h-6 w-6 mt-2">
              <ArrowBack
                className={`opacity-50 h-4 w-4`}
                style={{
                  transform: arrowRight
                    ? 'rotate(180deg) translateX(1px)'
                    : 'translateX(8px)',
                }}
              />
            </div>
          </div>
        ) : null}
        {(!isSidebarExpanded || isFloatingSidebar) &&
          (hasSavedGuides || hasSomeEverboardingGuides) && (
            <div
              className={cx('bento-sidebar-toggle-controls', 'flex', {
                'm-auto': sideQuestsIconsOnly,
                'flex-row': sideQuestIconsInARow,
                'flex-col': !sideQuestIconsInARow,
                'border-t border-gray-200 mt-2 pt-2': shouldShowSeparator,
              })}
              style={{
                animation: 'fadeIn 300ms ease-in',
              }}
            >
              {hasSomeEverboardingGuides && (
                <div
                  data-for="toggleTooltip"
                  data-tip="More guides"
                  className={cx('flex flex-1', 'justify-center', {
                    'mx-auto': !sideQuestIconsInARow,
                  })}
                  style={{
                    width: sideQuestIconsWidth,
                  }}
                >
                  <LibraryBooksOutline
                    style={{
                      fill: isEmbedToggleColorInverted ? 'white' : 'inherit',
                      height:
                        hasSavedGuides &&
                        (toggleStyle !== EmbedToggleStyle.progressRing ||
                          sideQuestIconsInARow)
                          ? '18px'
                          : undefined,
                    }}
                  />
                </div>
              )}
              {hasSavedGuides && (
                <div
                  data-for="toggleTooltip"
                  data-tip="Saved guides"
                  className={cx('flex flex-1', 'justify-center', {
                    'mx-auto': !sideQuestIconsInARow,
                    'pt-2': !sideQuestIconsInARow && hasSomeEverboardingGuides,
                  })}
                  style={{
                    width: sideQuestIconsWidth,
                  }}
                  onClick={showActiveGuides}
                >
                  <BookmarkOutline
                    style={{
                      fill: isEmbedToggleColorInverted ? 'white' : 'inherit',
                      ...(hasSomeEverboardingGuides &&
                        (toggleStyle !== EmbedToggleStyle.progressRing ||
                          sideQuestIconsInARow) && {
                          height: '15px',
                          paddingTop: '2px',
                        }),
                    }}
                  />
                </div>
              )}
            </div>
          )}
      </div>
      {!isSidebarExpanded && (
        <Tooltip
          id="toggleTooltip"
          effect="solid"
          place={isSidebarOnRight ? 'left' : 'right'}
          offset={isSidebarOnRight ? { left: 0 } : { right: 0 }}
          delayShow={500}
          className="toggle-tooltip"
        />
      )}
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
  withLocation,
  withSidebarContext,
  withAirTrafficState<BeforeAirTrafficProps, AirTrafficStoreData>(
    (state, { embedFormFactor }): AirTrafficStoreData => ({
      guidesToShow: guidesToShowSelector(state, embedFormFactor),
    })
  ),
  withMainStoreData<BeforeMainStoreDataProps, MainStoreData>(
    (state, { formFactor, appLocation, guidesToShow }): MainStoreData => {
      const onboardingGuide = leadingGuideSelector(state, formFactor);

      const everboardingGuides = everboardingGuidesSelector(
        state,
        formFactor,
        appLocation.href
      );

      const guide =
        selectedGuideForFormFactorSelector(state, formFactor) ||
        onboardingGuide;

      const step = selectedStepForFormFactorSelector(state, formFactor);

      const focusGuide = autoSelectGuideSelector(
        state,
        formFactor,
        appLocation,
        guidesToShow
      );

      return {
        guide,
        step,
        onboardingGuide,
        waitingForNextGuide: !!guide?.nextGuide,
        hasOnboardingGuides: !!onboardingGuide,
        dispatch: state.dispatch,
        hasAvailableGuides:
          availableIncompleteGuidesSelector(state, formFactor, appLocation.href)
            .length > 0,
        hasCompletedGuides: formFactorGuidesSelector(state, formFactor).some(
          (g) => isFinishedGuide(g) && !g.isCyoa
        ),
        serialCyoaData: lastSerialCyoaInfoSelector(state, formFactor),
        hasSavedGuides:
          savedForLaterGuidesSelector(state, formFactor).length > 0,
        everboardingGuides,
        focusGuide,
        hasCompleteEverboardingGuides:
          completeEverboardingGuidesSelector(
            state,
            formFactor,
            appLocation.href
          ).length > 0,
      };
    }
  ),
])(SidebarToggleTabComponent);
