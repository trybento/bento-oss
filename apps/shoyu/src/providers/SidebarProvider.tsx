import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Guide, InlineEmbed } from 'bento-common/types/globalShoyuState';
import composeComponent from 'bento-common/hocs/composeComponent';
import { EmbedFormFactor } from 'bento-common/types';
import {
  ClientStorage,
  saveToClientStorage,
} from 'bento-common/utils/clientStorage';
import useCallbackRef from 'bento-common/hooks/useCallbackRef';
import { debugMessage } from 'bento-common/utils/debugging';

import { DraggedTo } from '../hooks/useFloatingElement';
import withSidebarState from '../stores/sidebarStore/withSidebarState';
import { formFactorToSidebarStateId } from '../stores/sidebarStore/utils';
import { SidebarState, SidebarStoreState } from '../stores/sidebarStore/types';
import { SIDEBAR_EXPANDED_PERSISTED_KEY } from '../stores/sidebarStore/constants';
import withMainStoreData from '../stores/mainStore/withMainStore';
import {
  onboardingInlineEmbedSelector,
  selectedGuideForFormFactorSelector,
} from '../stores/mainStore/helpers/selectors';
import withCustomUIContext from '../hocs/withCustomUIContext';
import { CustomUIProviderValue } from './CustomUIProvider';
import { FormFactorContextValue } from './FormFactorProvider';
import withFormFactor from '../hocs/withFormFactor';
import mainStore from '../stores/mainStore';
import withLocation, {
  WithLocationPassedProps,
} from 'bento-common/hocs/withLocation';
import { SidebarAvailability } from 'bento-common/types/shoyuUIState';
import withAirTrafficState from '../stores/airTrafficStore/withAirTrafficState';
import { AirTrafficStore } from '../stores/airTrafficStore/types';

export type SidebarProviderValue = {
  sidebarId?: string;
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (open?: boolean, force?: boolean) => void;
  setSidebarOpenForLater: () => void;
  draggedPosition: DraggedTo | null;
  setDraggedPosition: (position: DraggedTo | null) => void;
  floatingAppPosition: DraggedTo | null;
  setFloatingAppPosition: (position: DraggedTo) => void;
  transitionsEnabled: boolean;
  disableSidebarTransitions: () => void;
  enableSidebarTransitions: () => void;
  shouldAutoFocusSidebar: boolean;
  hiddenViaZendesk: boolean;
  isInlineEmbedPresent: boolean;
};

type OuterProps = {
  alwaysExpanded?: boolean;
  initiallyExpanded?: boolean;
};

type BeforeSidebarStateDataProps = OuterProps &
  Pick<
    CustomUIProviderValue,
    'isSidebarAutoOpenOnFirstViewDisabled' | 'sidebarAvailability'
  > &
  Pick<FormFactorContextValue, 'formFactor' | 'isPreviewFormFactor'> &
  WithLocationPassedProps;

type SidebarStateData = {
  sidebarId: string;
  isSidebarExpandedPersisted: boolean;
  shouldAutoOpenPersisted: boolean;
  toggledOffAtLeastOnce: SidebarState['toggledOffAtLeastOnce'];
  transitionsEnabled: SidebarState['transitionBetweenViews'];
  toggleSidebar: SidebarStoreState['toggleSidebar'];
  disableTransitions: SidebarStoreState['disableTransitions'];
  enableTransitions: SidebarStoreState['enableTransitions'];
  toggleSidebarAutoOpen: SidebarStoreState['toggleSidebarAutoOpen'];
  isInlineEmbedPresent: SidebarStoreState['isInlineEmbedPresent'];
  hiddenViaZendesk: SidebarStoreState['hiddenViaZendesk'];
};

type BeforeAirTrafficDataProps = BeforeSidebarStateDataProps & SidebarStateData;

type AirTrafficData = Pick<AirTrafficStore, 'sidebarAutoFocused'>;

type BeforeMainStoreDataProps = BeforeAirTrafficDataProps & AirTrafficData;

type MainStoreData = {
  isMainStoreInitialized: boolean;
  guide: Guide | undefined;
  onboardingInlineEmbed: InlineEmbed | undefined;
};

export const SidebarContext = createContext<SidebarProviderValue>({
  sidebarId: undefined,
  isSidebarExpanded: false,
  setIsSidebarExpanded: (_o?: boolean, _force?: boolean) => {},
  setSidebarOpenForLater: () => {},
  draggedPosition: null,
  setDraggedPosition: (_position: DraggedTo | null) => {},
  floatingAppPosition: null,
  setFloatingAppPosition: (_position: DraggedTo) => {},
  transitionsEnabled: false,
  disableSidebarTransitions: () => {},
  enableSidebarTransitions: () => {},
  shouldAutoFocusSidebar: false,
  hiddenViaZendesk: false,
  isInlineEmbedPresent: false,
});

const SidebarProvider: React.FC<
  React.PropsWithChildren<
    BeforeMainStoreDataProps & SidebarStateData & MainStoreData
  >
> = ({
  children,
  alwaysExpanded,
  initiallyExpanded,
  sidebarId,
  isSidebarExpandedPersisted,
  shouldAutoOpenPersisted,
  toggleSidebar,
  transitionsEnabled,
  disableTransitions,
  enableTransitions,
  toggleSidebarAutoOpen,
  guide,
  sidebarAutoFocused,
  formFactor,
  isInlineEmbedPresent,
  hiddenViaZendesk,
  sidebarAvailability,
}) => {
  // Floating container only.
  const [draggedPosition, setDraggedPosition] = useState<DraggedTo | null>(
    null
  );
  const [floatingAppPosition, setFloatingAppPosition] =
    useState<DraggedTo | null>(null);

  const isSidebarExpanded = alwaysExpanded || isSidebarExpandedPersisted;

  const shouldAutoFocusSidebar = sidebarAutoFocused;

  /**
   * Prevent auto expansion behaviors based on toggle settings. We should still
   *   allow manual behaviors so things don't appear unresponsive.
   */
  const preventAutoOpens =
    sidebarAvailability === SidebarAvailability.hide ||
    sidebarAvailability === SidebarAvailability.neverOpen;

  useEffect(() => {
    toggleSidebarAutoOpen(sidebarId, shouldAutoFocusSidebar);
  }, [shouldAutoFocusSidebar, sidebarId]);

  /**
   * Controls sidebar open/close state
   *
   * The force param will override auto-open prevention logic, and should
   *   only be applied when the call is a result of a direct user action
   *   such as clicking the toggle itself.
   */
  const setIsSidebarExpanded = useCallbackRef(
    (isOpen?: boolean, force = false) => {
      if (isOpen && !force && preventAutoOpens) return;

      if (!alwaysExpanded) {
        toggleSidebar(sidebarId, isOpen);
      }
    },
    [
      alwaysExpanded,
      sidebarId,
      isSidebarExpanded,
      guide?.designType,
      formFactor,
      preventAutoOpens,
    ]
  );

  const setSidebarOpenForLater = useCallback(() => {
    if (preventAutoOpens) return;
    saveToClientStorage(
      ClientStorage.sessionStorage,
      SIDEBAR_EXPANDED_PERSISTED_KEY,
      true
    );
  }, [preventAutoOpens]);

  const disableSidebarTransitions = useCallbackRef(() => {
    disableTransitions(sidebarId);
  }, [sidebarId]);

  const enableSidebarTransitions = useCallbackRef(() => {
    enableTransitions(sidebarId);
  }, [sidebarId]);

  useEffect(() => {
    if (initiallyExpanded || alwaysExpanded) {
      debugMessage('[BENTO] Toggling sidebar open');
      toggleSidebar(sidebarId, true);
    }
  }, [sidebarId]);

  useEffect(() => {
    if (isInlineEmbedPresent) {
      debugMessage('[BENTO] Toggling sidebar closed due to inline presence');
      toggleSidebar(sidebarId, false);
    }
  }, [isInlineEmbedPresent, sidebarId]);

  const value = useMemo<SidebarProviderValue>(
    () => ({
      sidebarId,
      isSidebarExpanded,
      setIsSidebarExpanded,
      setSidebarOpenForLater,
      floatingAppPosition,
      setFloatingAppPosition,
      draggedPosition,
      setDraggedPosition,
      transitionsEnabled,
      disableSidebarTransitions,
      enableSidebarTransitions,
      shouldAutoFocusSidebar: shouldAutoOpenPersisted || shouldAutoFocusSidebar,
      hiddenViaZendesk,
      isInlineEmbedPresent,
    }),
    [
      sidebarId,
      isSidebarExpanded,
      setIsSidebarExpanded,
      setSidebarOpenForLater,
      floatingAppPosition,
      setFloatingAppPosition,
      draggedPosition,
      setDraggedPosition,
      transitionsEnabled,
      disableSidebarTransitions,
      enableSidebarTransitions,
      shouldAutoFocusSidebar,
      shouldAutoOpenPersisted,
      hiddenViaZendesk,
      isInlineEmbedPresent,
    ]
  );

  return (
    // @ts-ignore
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

export default composeComponent<React.PropsWithChildren<OuterProps>>([
  withFormFactor,
  withCustomUIContext,
  withLocation,
  withSidebarState<BeforeSidebarStateDataProps, SidebarStateData>(
    (state, { formFactor }): SidebarStateData => {
      const sidebarId = formFactorToSidebarStateId(
        mainStore.getState(),
        formFactor
      );
      const sidebar = state.sidebars[sidebarId] as SidebarState | undefined;
      return {
        sidebarId,
        isSidebarExpandedPersisted: !!sidebar?.open,
        shouldAutoOpenPersisted: !!sidebar?.shouldAutoOpen,
        transitionsEnabled: !!sidebar?.transitionBetweenViews,
        toggledOffAtLeastOnce: !!sidebar?.toggledOffAtLeastOnce,
        toggleSidebar: state.toggleSidebar,
        disableTransitions: state.disableTransitions,
        enableTransitions: state.enableTransitions,
        toggleSidebarAutoOpen: state.toggleSidebarAutoOpen,
        isInlineEmbedPresent: state.isInlineEmbedPresent,
        hiddenViaZendesk: state.hiddenViaZendesk,
      };
    }
  ),
  withAirTrafficState<BeforeAirTrafficDataProps, AirTrafficData>(
    (state): AirTrafficData => ({
      sidebarAutoFocused: state.sidebarAutoFocused,
    })
  ),
  withMainStoreData<BeforeMainStoreDataProps & SidebarStateData, MainStoreData>(
    (state, { formFactor, isPreviewFormFactor }): MainStoreData => {
      const sidebarFormFactor = isPreviewFormFactor
        ? formFactor
        : EmbedFormFactor.sidebar;
      return {
        isMainStoreInitialized: !!state.initialized,
        guide: selectedGuideForFormFactorSelector(state, sidebarFormFactor),
        onboardingInlineEmbed: onboardingInlineEmbedSelector(state),
      };
    }
  ),
])(SidebarProvider);
