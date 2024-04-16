import React, { ReactNode, useCallback, useMemo } from 'react';
import cx from 'classnames';
import {
  isActiveGuidesSubView,
  isActiveGuidesView,
  isStepView,
} from 'bento-common/frontend/shoyuStateHelpers';
import composeComponent from 'bento-common/hocs/composeComponent';
import { Guide, Module, Step } from 'bento-common/types/globalShoyuState';
import {
  getGuideThemeFlags,
  isEverboarding,
  isIncompleteGuide,
  showResourceCenterInline,
} from 'bento-common/data/helpers';
import withLocation, {
  WithLocationPassedProps,
} from 'bento-common/hocs/withLocation';
import SidebarHeader from 'bento-common/components/SidebarHeader';
import { KbArticle } from 'bento-common/types/integrations';

import withUIState from '../hocs/withUIState';
import { UIStateContextValue } from '../providers/UIStateProvider';
import {
  selectedArticleForFormFactorSelector,
  selectedGuideForFormFactorSelector,
  selectedModuleForFormFactorSelector,
  selectedStepForFormFactorSelector,
} from '../stores/mainStore/helpers/selectors';
import withMainStoreData from '../stores/mainStore/withMainStore';
import { CustomUIProviderValue } from '../providers/CustomUIProvider';
import withCustomUIContext from '../hocs/withCustomUIContext';
import { SidebarProviderValue } from '../providers/SidebarProvider';
import withSidebarContext from '../hocs/withSidebarContext';
import { EmbedFormFactor, GuideHeaderType, Theme } from 'bento-common/types';
import { FormFactorContextValue } from '../providers/FormFactorProvider';
import withFormFactor from '../hocs/withFormFactor';
import withInlineEmbed from '../hocs/withIlnineEmbed';
import { InlineEmbedContextValue } from '../providers/InlineEmbedProvider';
import { ResponsiveClassNames, responsiveClassNames } from '../lib/formFactors';
import { hasOnlyOneStep } from 'bento-common/utils/formFactor';

type OuterProps = {
  /**
   * Components to render between
   * the title and the close button.
   */
  guideTitleSibling?: ReactNode;
  draggableRef?: React.Ref<HTMLDivElement>;
};

type MainStoreData = {
  guide: Guide | undefined;
  module: Module | undefined;
  step: Step | undefined;
  article: KbArticle | undefined;
};

type Props = OuterProps &
  Pick<
    CustomUIProviderValue,
    | 'isFloatingSidebar'
    | 'stepCompletionStyle'
    | 'floatingDragDisabled'
    | 'secondaryColorHex'
    | 'primaryColorHex'
    | 'backgroundColor'
    | 'sidebarHeader'
    | 'sidebarVisibility'
    | 'quickLinks'
    | 'allGuidesStyle'
    | 'inlineEmptyBehaviour'
  > &
  Pick<UIStateContextValue, 'view' | 'uiActions'> &
  Pick<SidebarProviderValue, 'setIsSidebarExpanded'> &
  WithLocationPassedProps &
  Pick<
    FormFactorContextValue,
    'formFactor' | 'embedFormFactorFlags' | 'embedFormFactor'
  > &
  InlineEmbedContextValue;

const SidebarHeaderComponent: React.FC<Props & MainStoreData> = ({
  guide,
  module,
  step,
  view,
  guideTitleSibling,
  allGuidesStyle,
  uiActions,
  isFloatingSidebar,
  stepCompletionStyle,
  setIsSidebarExpanded,
  floatingDragDisabled,
  draggableRef,
  secondaryColorHex,
  primaryColorHex,
  backgroundColor,
  sidebarHeader,
  embedFormFactorFlags: { isInline: isInlineEmbed },
  embedFormFactor,
  inlineEmbed,
  article,
  inlineEmptyBehaviour,
}) => {
  const _theme = guide?.theme ?? Theme.nested;
  const { isFlat, isCompact, isTimeline, isNested } =
    getGuideThemeFlags(_theme);
  const moduleless = isFlat || isCompact || guide?.isCyoa;
  const showModuleNameInStepView =
    sidebarHeader.showModuleNameInStepView &&
    !moduleless &&
    (guide?.modules?.length || 0) > 1;

  const sidebarHeaderSettings = isInlineEmbed
    ? {
        ...sidebarHeader,
        type: GuideHeaderType.simple,
        progressBar: undefined,
        showModuleNameInStepView: false,
      }
    : sidebarHeader;

  const classNames: ResponsiveClassNames | undefined =
    responsiveClassNames[embedFormFactor || EmbedFormFactor.sidebar];

  const showBackButton = useMemo(() => {
    const isSidebar = !isInlineEmbed;

    /**
     * Force the back button when viewing a nested guide, as we otherwise
     * have no way of returning to the step list.
     */
    if (isNested && isStepView(view) && !hasOnlyOneStep(guide)) {
      return true;
    }

    /**
     * Never show the back button during preview or on the top-level resource center page.
     */
    if (
      guide?.isPreview ||
      (isActiveGuidesView(view) && !isActiveGuidesSubView(view))
    ) {
      return false;
    }

    /**
     * Show the back button if one of the following are true:
     *
     * - We're in the sidebar
     * - We're in a sub-level page of the resource center (e.g., report an issue)
     * - We're viewing an onboarding guide, and the organization has resource center set to "sidebar and inline"
     * - We're viewing a single step of a nested layout, and there's more than one step
     */
    return (
      isSidebar ||
      isActiveGuidesSubView(view) ||
      (!isEverboarding(guide?.designType) &&
        showResourceCenterInline(inlineEmptyBehaviour))
    );
  }, [isInlineEmbed, inlineEmptyBehaviour, view, isNested, guide]);

  return (
    <SidebarHeader
      ref={draggableRef}
      {...sidebarHeaderSettings}
      showGuideNameInStepView={moduleless}
      showModuleNameInStepView={showModuleNameInStepView}
      isFloating={isFloatingSidebar}
      primaryColor={primaryColorHex}
      secondaryColor={secondaryColorHex}
      guideTitleSibling={guideTitleSibling}
      backgroundColor={backgroundColor}
      view={view}
      article={article}
      classNames={{
        wrapper: classNames?.header,
        content: cx(classNames?.headerContent, {
          'px-0': isTimeline && isInlineEmbed,
        }),
        title: classNames?.headerTitle,
        subtitle: classNames?.headerSubtitle,
      }}
      stepCompletionStyle={
        isIncompleteGuide(guide) && moduleless ? null : stepCompletionStyle
      }
      allGuidesStyle={allGuidesStyle}
      guide={guide}
      module={module}
      step={step}
      padding={isInlineEmbed ? inlineEmbed?.padding : undefined}
      draggable={!floatingDragDisabled && isFloatingSidebar}
      showBackButton={showBackButton}
      showCloseButton={isFloatingSidebar && !inlineEmbed}
      onBack={uiActions.handleBack}
      onClose={useCallback(
        () => setIsSidebarExpanded(false),
        [setIsSidebarExpanded]
      )}
    />
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withInlineEmbed,
  withCustomUIContext,
  withUIState,
  withLocation,
  withSidebarContext,
  withMainStoreData<Props, MainStoreData>((state, { formFactor }) => {
    return {
      guide: selectedGuideForFormFactorSelector(state, formFactor),
      module: selectedModuleForFormFactorSelector(state, formFactor),
      step: selectedStepForFormFactorSelector(state, formFactor),
      article: selectedArticleForFormFactorSelector(state, formFactor),
    };
  }),
])(SidebarHeaderComponent);
