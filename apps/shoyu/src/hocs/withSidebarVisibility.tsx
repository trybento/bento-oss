import React, { useEffect, useState } from 'react';
import {
  allowedGuideTypesSettings,
  isFinishedGuide,
  showResourceCenterInline,
} from 'bento-common/data/helpers';
import { Guide } from 'bento-common/types/globalShoyuState';
import composeComponent from 'bento-common/hocs/composeComponent';
import withLocation, {
  WithLocationPassedProps,
} from 'bento-common/hocs/withLocation';

import { CustomUIProviderValue } from '../providers/CustomUIProvider';
import { SidebarProviderValue } from '../providers/SidebarProvider';
import withMainStoreData from '../stores/mainStore/withMainStore';
import withCustomUIContext from './withCustomUIContext';
import { FormFactorContextValue } from '../providers/FormFactorProvider';
import withFormFactor from './withFormFactor';
import {
  availableIncompleteGuidesSelector,
  lastSerialCyoaInfoSelector,
  mainQuestGuidesSelector,
  savedForLaterGuidesSelector,
  selectedGuideForFormFactorSelector,
  wasInlineContextualGuideDismissedSelector,
  previousGuidesSelector,
} from '../stores/mainStore/helpers/selectors';
import withSidebarContext from './withSidebarContext';
import withInlineEmbed from './withIlnineEmbed';
import { InlineEmbedContextValue } from '../providers/InlineEmbedProvider';
import withUIState from './withUIState';
import { UIStateContextValue } from '../providers/UIStateProvider';
import { SUCCESS_DELAY_MS } from '../lib/constants';
import { isSidebarInjectedAsInline } from 'bento-common/utils/formFactor';

type OuterProps = {
  uiPreviewId?: string;
  children?: React.ReactNode;
};

type Props = OuterProps &
  Pick<UIStateContextValue, 'showSuccess'> &
  Pick<
    CustomUIProviderValue,
    'sidebarVisibility' | 'isFloatingSidebar' | 'inlineEmptyBehaviour'
  > &
  Pick<
    SidebarProviderValue,
    | 'isSidebarExpanded'
    | 'setIsSidebarExpanded'
    | 'draggedPosition'
    | 'floatingAppPosition'
    | 'disableSidebarTransitions'
    | 'enableSidebarTransitions'
  > &
  Pick<FormFactorContextValue, 'formFactor' | 'embedFormFactorFlags'> &
  WithLocationPassedProps &
  Pick<InlineEmbedContextValue, 'isEverboardingInline'>;

type MainStoreData = {
  guide: Guide | undefined;
  waitingForNextGuide: boolean;
  hasAvailableGuides: boolean;
  hasSavedForLaterGuides: boolean;
  hasCompletedGuides: boolean;
  isMainStoreInitialized: boolean;
  serialCyoaData: ReturnType<typeof lastSerialCyoaInfoSelector>;
  wasContextualDismissed: boolean;
};

type WithSidebarVisibilityProps = Props & MainStoreData;

export default function withSidebarVisibility(
  WrappedSidebar: React.ComponentType
) {
  const WithSidebarVisibility: React.FC<WithSidebarVisibilityProps> = ({
    formFactor,
    guide,
    showSuccess,
    hasAvailableGuides,
    hasCompletedGuides,
    hasSavedForLaterGuides,
    waitingForNextGuide,
    sidebarVisibility,
    inlineEmptyBehaviour,
    isFloatingSidebar,
    isSidebarExpanded,
    setIsSidebarExpanded,
    draggedPosition,
    floatingAppPosition,
    isMainStoreInitialized,
    enableSidebarTransitions,
    disableSidebarTransitions,
    embedFormFactorFlags: {
      isSidebar: isSidebarEmbed,
      isInline: isInlineEmbed,
    },
    isEverboardingInline,
    serialCyoaData,
    wasContextualDismissed,
    ...props
  }) => {
    const shouldShowSidebarOrInline =
      isMainStoreInitialized &&
      (hasAvailableGuides ||
        !serialCyoaData.isFinished ||
        waitingForNextGuide ||
        (hasCompletedGuides &&
          // when this is the sidebar and the toggle is not set to hide
          allowedGuideTypesSettings(sidebarVisibility, formFactor).completed) ||
        // when this is an inline context guide and the guide isn't finished
        ((isEverboardingInline ||
          isSidebarInjectedAsInline(
            guide?.theme,
            guide?.isSideQuest,
            guide?.formFactor
          )) &&
          !isFinishedGuide(guide) &&
          !wasContextualDismissed) ||
        // when this is the inline and the inline is not set to hide
        (isInlineEmbed && showResourceCenterInline(inlineEmptyBehaviour)));

    const [isToggleHidden, setIsToggleHidden] = useState<boolean>(true);

    useEffect(() => {
      let timeout: ReturnType<typeof setTimeout> | undefined;

      // when this is not the sidebar embed,
      // we can bypass any of the below logic and simply set the toggle state
      // based on the shouldShowSidebar state with enabled transitions
      // (i.e. this happens when the sidebar is replacing the inline)
      if (!isSidebarEmbed) {
        setIsToggleHidden(!shouldShowSidebarOrInline);
        // @ts-ignore-error
        return;
      }

      if (isMainStoreInitialized) {
        if (!shouldShowSidebarOrInline) {
          if (!isSidebarExpanded) {
            // Wait for collapse animation to finish.
            timeout = setTimeout(() => {
              setIsToggleHidden(true);
              disableSidebarTransitions();
            }, 1200);
          } else {
            timeout = setTimeout(
              () => {
                setIsSidebarExpanded(false);
              },
              showSuccess ? SUCCESS_DELAY_MS : 100
            );
          }
        } else {
          if (isSidebarExpanded) {
            disableSidebarTransitions();
            timeout = setTimeout(() => {
              enableSidebarTransitions();
            }, 500);
          }
          setIsToggleHidden(false);
        }
      }

      /**
       * Its important to cleanup any timers when unmounting,
       * otherwise this can create undesired problems in branding settings
       * where we expect multiple re-renders to happen, sometimes leaving
       * the `isToggleHidden` flag as true, therefore preventing the sidebar
       * from showing up within preview containers.
       */
      return () => clearTimeout(timeout);
    }, [
      isSidebarEmbed,
      shouldShowSidebarOrInline,
      isSidebarExpanded,
      isMainStoreInitialized,
      showSuccess,
    ]);

    if (isToggleHidden) {
      return null;
    }

    return <WrappedSidebar {...props} />;
  };

  WithSidebarVisibility.whyDidYouRender = true;

  return composeComponent<OuterProps>([
    withFormFactor,
    withCustomUIContext,
    withUIState,
    withLocation,
    withSidebarContext,
    withInlineEmbed,
    withMainStoreData<Props, MainStoreData>(
      (state, { formFactor, appLocation, sidebarVisibility }) => {
        const guide = selectedGuideForFormFactorSelector(state, formFactor);
        return {
          guide,
          waitingForNextGuide: !!mainQuestGuidesSelector(state, formFactor)[0]
            ?.nextGuide,
          hasCompletedGuides:
            previousGuidesSelector(
              state,
              sidebarVisibility,
              appLocation.href,
              formFactor
            ).total > 0,
          hasAvailableGuides:
            availableIncompleteGuidesSelector(
              state,
              formFactor,
              appLocation.href
            ).length > 0,
          hasSavedForLaterGuides:
            savedForLaterGuidesSelector(state, formFactor).length > 0,
          isMainStoreInitialized: !!state.initialized,
          serialCyoaData: lastSerialCyoaInfoSelector(state, formFactor),
          wasContextualDismissed: wasInlineContextualGuideDismissedSelector(
            state,
            guide?.entityId
          ),
        };
      }
    ),
  ])(WithSidebarVisibility);
}
