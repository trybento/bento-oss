import React, {
  CSSProperties,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cx from 'classnames';

import { EmbedFormFactor, InjectionAlignment, Theme } from 'bento-common/types';
import composeComponent from 'bento-common/hocs/composeComponent';
import {
  InlineEmbed,
  InlineEmbedEntityId,
} from 'bento-common/types/globalShoyuState';
import useCallbackRef from 'bento-common/hooks/useCallbackRef';
import useResizeObserver from 'bento-common/hooks/useResizeObserver';
import { throttle } from 'bento-common/utils/lodash';
import { SidebarAvailability } from 'bento-common/types/shoyuUIState';

import { CustomUIProviderValue } from '../providers/CustomUIProvider';
import Inline from './Inline';
import Sidebar from './Sidebar';
import withMainStoreData, {
  withMainStoreDispatch,
  WithMainStoreDispatchData,
} from '../stores/mainStore/withMainStore';
import withCustomUIContext from '../hocs/withCustomUIContext';
import {
  inlineEmbedSelector,
  selectedGuideForFormFactorSelector,
} from '../stores/mainStore/helpers/selectors';
import useGuideViews from '../stores/mainStore/hooks/useGuideViews';
import { SidebarProviderValue } from '../providers/SidebarProvider';
import withSidebarContext from '../hocs/withSidebarContext';
import withFormFactor from '../hocs/withFormFactor';
import { FormFactorContextValue } from '../providers/FormFactorProvider';
import InlineEmbedProvider from '../providers/InlineEmbedProvider';

type OuterProps = {
  container?: string;
  inlineEmbedId?: InlineEmbedEntityId;
};

type Props = OuterProps &
  Pick<CustomUIProviderValue, 'isFloatingSidebar' | 'orgTheme'> &
  Pick<SidebarProviderValue, 'isSidebarExpanded'> &
  Pick<
    FormFactorContextValue,
    'formFactor' | 'renderedFormFactorFlags' | 'embedFormFactorFlags'
  > &
  WithMainStoreDispatchData;

type MainStoreData = {
  guideTheme: Theme | undefined;
  inlineEmbed: InlineEmbed | undefined;
};

type GuideThemeSelectorProps = Props & MainStoreData;

const RENDER_WIDTH_THRESHOLD = 700;

const GuideThemeSelector: React.FC<GuideThemeSelectorProps> = ({
  guideTheme,
  formFactor,
  embedFormFactorFlags: { isSidebar: isSidebarEmbed, isInline: isInlineEmbed },
  renderedFormFactorFlags: { isInline: isInlineRendered },
  isSidebarExpanded,
  orgTheme,
  container,
  inlineEmbed,
  dispatch,
}) => {
  const currentTheme: Theme = guideTheme || orgTheme;

  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number | undefined>();
  const lastContainerWidths = useRef<Array<number | undefined>>([]);

  useGuideViews(formFactor, isSidebarEmbed ? isSidebarExpanded : true);

  const updateContainerWidth = useCallbackRef(
    /** uses clientWidth to prevent issues with scaled dimensions as used in previews */
    throttle(() => {
      const newW = containerEl?.clientWidth;
      setContainerWidth(newW);
      /**
       * Records the last 2 unique container widths.
       * Useful to protect against an infinite responsive loop (see below).
       */
      if (!lastContainerWidths.current.includes(newW)) {
        lastContainerWidths.current = [lastContainerWidths.current?.[1], newW];
      }
    }, 16),
    [containerEl],
    { callOnDepsChange: true }
  );

  useResizeObserver(updateContainerWidth, { element: containerEl });

  useLayoutEffect(() => {
    if (
      !containerWidth ||
      isSidebarEmbed ||
      /**
       * Checks whether or not the current containerWidth has already been handled,
       * effectively protecting against alternating between two widths indefinitely
       * when in the middle of the breaking point +/- scrollbar width.
       */
      lastContainerWidths.current.includes(containerWidth)
    )
      return;
    dispatch({
      type: 'renderedFormFactorChanged',
      formFactor,
      renderedFormFactor:
        containerWidth <= RENDER_WIDTH_THRESHOLD
          ? EmbedFormFactor.sidebar
          : EmbedFormFactor.inline,
    });
  }, [containerWidth, isSidebarEmbed]);

  const guideWrapperStyle: CSSProperties = useMemo(
    () => ({
      padding: inlineEmbed?.padding,
      borderRadius: inlineEmbed?.borderRadius,
    }),
    [inlineEmbed]
  );

  const component = isInlineRendered ? (
    <Inline theme={currentTheme} style={guideWrapperStyle} />
  ) : (
    <Sidebar
      theme={currentTheme}
      container={container}
      style={guideWrapperStyle}
    />
  );

  const alignmentMargin = useMemo<string | undefined>(() => {
    switch (inlineEmbed?.alignment) {
      case InjectionAlignment.center:
        return 'mx-auto';

      case InjectionAlignment.left:
        return 'mr-auto';

      case InjectionAlignment.right:
        return 'ml-auto';

      default:
        return undefined;
    }
  }, [inlineEmbed?.alignment]);

  return isInlineEmbed ? (
    <InlineEmbedProvider inlineEmbed={inlineEmbed}>
      <div
        className={cx(alignmentMargin, 'empty:hidden', {
          'bento-auto-injected-inline-wrapper': inlineEmbed !== undefined,
          'bento-inline-wrapper p-6': inlineEmbed === undefined,
          'max-w-screen-xl': inlineEmbed?.maxWidth === undefined,
        })}
        style={{
          paddingTop: inlineEmbed?.topMargin,
          paddingBottom: inlineEmbed?.bottomMargin,
          paddingLeft: inlineEmbed?.leftMargin,
          paddingRight: inlineEmbed?.rightMargin,
          maxWidth: inlineEmbed?.maxWidth,
          opacity: containerWidth ? 1 : 0,
        }}
        ref={setContainerEl}
      >
        {component}
      </div>
    </InlineEmbedProvider>
  ) : (
    component
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withCustomUIContext,
  withSidebarContext,
  withMainStoreDispatch,
  withMainStoreData<Props, MainStoreData>(
    (state, { formFactor, inlineEmbedId }) => ({
      guideTheme: selectedGuideForFormFactorSelector(state, formFactor)?.theme,
      inlineEmbed: inlineEmbedSelector(state, inlineEmbedId),
    })
  ),
])(GuideThemeSelector);
