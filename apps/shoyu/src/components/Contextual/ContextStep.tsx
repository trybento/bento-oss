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
  ContextTagAlignment,
  ContextTagType,
} from 'bento-common/types/globalShoyuState';
import { Timeout, VisualTagHighlightType } from 'bento-common/types';
import { pxToNumber } from 'bento-common/frontend/htmlElementHelpers';
import composeComponent from 'bento-common/hocs/composeComponent';
import useDomObserver from 'bento-common/hooks/useDomObserver';
import ElementHighlight, {
  OverlayHighlight,
} from 'bento-common/components/ElementHighlight';
import useElementVisibility from 'bento-common/hooks/useElementVisibility';
import { throttleWithExtraCall } from 'bento-common/utils/functions';
import useCallbackRef from 'bento-common/hooks/useCallbackRef';
import {
  getElementParents,
  getPositionFlags,
  px,
} from 'bento-common/utils/dom';
import useResizeObserver from 'bento-common/hooks/useResizeObserver';
import { debugMessage } from 'bento-common/utils/debugging';
import useElementSize from 'bento-common/hooks/useElementSize';
import { pick, throttle } from 'bento-common/utils/lodash';
import useDisableWindowScroll from 'bento-common/hooks/useDisableWindowScroll';
import useWindowSize from '../../hooks/useWindowSize';
import ContextualBadge from './ContextualBadge';
import ContextualDot from './ContextualDot';
import ContextualIcon from './ContextualIcon';
import { ContextualTagProviderValue } from '../../providers/ContextualTagProvider';
import ContextualTooltip from './ContextualTooltip';
import useEventListener from '../../hooks/useEventListener';
import { SIDEBAR_OVERLAY_Z_INDEX } from '../../lib/sidebarConstants';
import withContextualTagContext from '../../hocs/withContextualTagContext';
import withMainStoreData from '../../stores/mainStore/withMainStore';
import { isGuideSelectedSelector } from '../../stores/mainStore/helpers/selectors';
import { CustomUIProviderValue } from '../../providers/CustomUIProvider';
import withCustomUIContext from '../../hocs/withCustomUIContext';
import {
  getSiblingTagHighestZIndex,
  VTAG_WRAPPER_CLASSNAME,
} from '../../lib/contextTagHelpers';
import withSidebarContext from '../../hocs/withSidebarContext';
import { SidebarProviderValue } from '../../providers/SidebarProvider';
import withFormFactor from '../../hocs/withFormFactor';
import { FormFactorContextValue } from '../../providers/FormFactorProvider';

export const OVERLAY_Z_INDEX = SIDEBAR_OVERLAY_Z_INDEX - 2;

const MAX_VIEWPORT_PERCENTAGE = 0.8;

export const getTagTooltipEl = (
  tagEl: HTMLElement | null
): HTMLElement | null => tagEl?.firstElementChild as HTMLElement | null;

type OuterProps = {};

type BeforeMainStoreDataProps = OuterProps &
  Pick<CustomUIProviderValue, 'featureFlags' | 'tagVisibility'> &
  Pick<SidebarProviderValue, 'isSidebarExpanded'> &
  Pick<FormFactorContextValue, 'embedFormFactorFlags'> &
  Pick<
    ContextualTagProviderValue,
    'taggedElement' | 'forcedToShow' | 'isTooltip' | 'hasOverlay'
  >;

type MainStoreData = {
  isGuideSelected: boolean;
};

type ComposedProps = BeforeMainStoreDataProps & MainStoreData;

const ContextStep: React.FC<ComposedProps> = ({
  taggedElement,
  featureFlags,
  isGuideSelected,
  forcedToShow,
  isTooltip,
  hasOverlay,
  embedFormFactorFlags: { isFlow },
}) => {
  const {
    entityId,
    type = ContextTagType.dot,
    alignment = ContextTagAlignment.topRight,
    yOffset,
    xOffset,
    relativeToText,
    elementSelector,
    style,
  } = taggedElement || {};

  const _yOffset = Number.isNaN(Number(yOffset)) ? 0 : Number(yOffset);
  const _xOffset = Number.isNaN(Number(xOffset)) ? 0 : Number(xOffset);
  const ref = useRef<HTMLDivElement>(null);
  const [refElement, setRefElement] = useState<HTMLElement | null>(null);
  const [refElementFlags, setRefElementFlags] = useState<{
    fixed?: boolean;
    sticky?: boolean;
    isPartiallyVisible?: boolean;
  }>({});
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [zIndex, setZIndex] = useState<number>(0);
  const [isRefElementVisible, setRefElementIsVisible] =
    useState<boolean>(false);
  const scrollLockedRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<Timeout | undefined>(undefined);

  const isHighlight = taggedElement?.type === ContextTagType.highlight;
  const showTooltip = forcedToShow || isHovered;
  const addTargetElementHoverListeners = isHighlight && !forcedToShow;

  const mouseLeaveTimeout = useRef<Timeout>();

  const handleMouseEnter = useCallback(() => {
    clearTimeout(mouseLeaveTimeout.current);
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(mouseLeaveTimeout.current);
    mouseLeaveTimeout.current = setTimeout(() => setIsHovered(false), 100);
  }, []);

  // Follow size changes of the reference.
  // Doesn't work in deeply nested divs from react-table cells.
  // Using windowSize as backup for now.
  const { width: refElementWidth } = useElementSize(refElement, 'debounce');
  const windowSize = useWindowSize();

  const [position, setPosition] = useState<CSSProperties | null>(null);

  const tag = useMemo(() => {
    switch (type) {
      case ContextTagType.icon:
        return <ContextualIcon />;

      case ContextTagType.badge:
      case ContextTagType.badgeDot:
      case ContextTagType.badgeIcon:
        return <ContextualBadge type={type} text={style?.text} />;

      case ContextTagType.dot:
        return <ContextualDot />;

      case ContextTagType.highlight:
        return (
          style &&
          style.type !== VisualTagHighlightType.overlay && (
            <ElementHighlight {...style} />
          )
        );

      default:
        return null;
    }
  }, [type, style]);

  const calculatePositionFromSelector = (
    uiPosition: ContextTagAlignment,
    reference: HTMLElement
  ): CSSProperties | null => {
    if (!reference) return null;

    const { width: contextWidth, height: contextHeight } = getTagTooltipEl(
      ref.current
    )?.getBoundingClientRect() || { width: 0, height: 0 };

    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop =
      (window.pageYOffset || document.documentElement.scrollTop) -
      pxToNumber(getComputedStyle(document.body).marginTop);

    const { left, top, width, height } = (
      reference as HTMLElement
    ).getBoundingClientRect();

    if (type === ContextTagType.highlight) {
      const padding = style?.padding || 0;
      const thickness =
        (style?.type === VisualTagHighlightType.solid && style?.thickness) || 0;

      const result = {
        left: px(left - padding - thickness + scrollLeft),
        top: px(top - padding - thickness + scrollTop),
        height: px(height + padding * 2 + thickness * 2),
        width: px(width + padding * 2 + thickness * 2),
      };

      /**
       * Do not render the tag outside the window
       * to prevent creating scroll.
       * for more details.
       */
      const leftWithBuffer = pxToNumber(result.left) + 15;
      const exceedsWindowWidth =
        pxToNumber(result.width) + leftWithBuffer > window.innerWidth;

      if (exceedsWindowWidth && featureFlags?.isTooltipInsideWindowEnabled) {
        result.width = px(window.innerWidth - leftWithBuffer);
      }

      return result;
    }

    if (!width || !height) return null;

    const topPosition = uiPosition.startsWith('top')
      ? top + _yOffset + scrollTop - contextHeight
      : uiPosition.startsWith('center')
      ? top + height / 2 + _yOffset + scrollTop - contextHeight / 2
      : uiPosition.startsWith('bottom')
      ? top + height + _yOffset + scrollTop
      : null;

    const leftPosition = uiPosition.endsWith('left')
      ? left + _xOffset + scrollLeft - contextWidth
      : uiPosition.endsWith('right')
      ? left + width + _xOffset + scrollLeft
      : null;

    return leftPosition && topPosition
      ? { left: px(leftPosition), top: px(topPosition) }
      : null;
  };

  const updatePosition = useCallbackRef(
    throttleWithExtraCall(
      () => {
        if (ref.current && refElement) {
          const newPosition = calculatePositionFromSelector(
            alignment,
            refElement
          );
          setPosition(newPosition);
          if (newPosition && refElementFlags.sticky) {
            const elRect = refElement.getBoundingClientRect();
            /**
             * Naively check if the element if within a reasonable range of the viewport
             * to disable scroll, otherwise we run the risk of leaving the element unreachable.
             */
            setRefElementFlags((s) => ({
              ...s,
              isPartiallyVisible:
                elRect.y / window.innerHeight <= MAX_VIEWPORT_PERCENTAGE &&
                elRect.x / window.innerWidth <= MAX_VIEWPORT_PERCENTAGE,
            }));
          }
        }
      },
      { throttleArgs: [16, { leading: true }], extraDelay: 500 }
    ),
    [
      type,
      alignment,
      refElement,
      _xOffset,
      _yOffset,
      relativeToText,
      style,
      windowSize,
      refElementWidth,
      featureFlags,
      refElementFlags.sticky,
    ],
    { callOnDepsChange: true }
  );

  /**
   * Determines whether to render the beacon and the proper tag component.
   */
  const shouldRender = !!position;

  /**
   * Whether to show the overlay.
   * As a rule, the overlay should only be shown if the target element is visible,
   * unless the tooltip is forced open.
   */
  const canShowOverlay = hasOverlay && (isRefElementVisible || forcedToShow);
  const autoScrolls =
    canShowOverlay || (isFlow && (isRefElementVisible || forcedToShow));

  /**
   * Computes the beacon's z-index by traversing the DOM tree starting at the
   * body down through the path to the refElement to find the first element
   * which has a z-index specified then adding 1. This helps ensure the beacon
   * is placed just above the refElement and hopefully under any other elements
   * which normally would cover the refElement.
   *
   * WARNING: Needs to be called every time the refElement or its parents
   * change in any way.
   */
  const updateBeaconZIndex = useCallbackRef(
    throttleWithExtraCall(
      () => {
        if (!shouldRender || !refElement) return setZIndex(0);
        if (canShowOverlay) return setZIndex(OVERLAY_Z_INDEX);

        const domPath = getElementParents(refElement).reverse();
        domPath.push(refElement);
        let firstSpecificZIndex = 0;
        for (const el of domPath) {
          const elZIndex = Number(
            window.getComputedStyle(el).getPropertyValue('z-index')
          );
          if (!Number.isNaN(elZIndex)) {
            firstSpecificZIndex = elZIndex;
            break;
          }
        }
        /**
         * Temporarily set the tag zIndex to the highest value
         * among other tags to prevent overlap while showing
         * its tooltip.
         */
        const highestSiblingZIndex = showTooltip
          ? getSiblingTagHighestZIndex(entityId)
          : Number.MIN_SAFE_INTEGER;
        return setZIndex(
          Math.max(firstSpecificZIndex, highestSiblingZIndex) + 1
        );
      },
      { throttleArgs: [16, { leading: true }], extraDelay: 500 }
    ),
    [shouldRender, refElement, canShowOverlay, showTooltip],
    { callOnDepsChange: true }
  );

  const updatePositionAndZIndex = useCallback(() => {
    updatePosition();
    updateBeaconZIndex();
  }, [updatePosition, updateBeaconZIndex]);

  useEffect(() => {
    if (elementSelector) {
      const newEl = document.querySelector(
        elementSelector
      ) as HTMLElement | null;
      if (newEl && newEl !== refElement) {
        setRefElement(newEl);
        setRefElementFlags(getPositionFlags(newEl));
      }
    }
  }, [elementSelector, refElement]);

  useEffect(() => {
    if (isGuideSelected) {
      setIsHovered(false);
    }
  }, [isGuideSelected]);

  useEventListener(document, 'scroll', updatePosition, { bubbles: true });

  useEventListener(refElement, 'mouseenter', handleMouseEnter, {
    disable: !addTargetElementHoverListeners,
  });
  useEventListener(refElement, 'mouseleave', handleMouseLeave, {
    disable: !addTargetElementHoverListeners,
  });

  useResizeObserver(updatePosition);
  useDomObserver(updatePositionAndZIndex);

  const onVisible = useCallback(() => setRefElementIsVisible(true), []);
  useElementVisibility(refElement, onVisible);

  useDisableWindowScroll(
    !!featureFlags?.isDisableWindowScrollHookEnabled &&
      shouldRender &&
      canShowOverlay &&
      (refElementFlags.fixed ||
        !!(refElementFlags.sticky && refElementFlags.isPartiallyVisible))
  );

  const overlayCutoutDimensions = useMemo<
    Omit<
      React.ComponentProps<typeof OverlayHighlight>,
      'color' | 'opacity' | 'pulse' | 'zIndex'
    >
  >(() => {
    if (!position || !style) {
      return {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        radius: 0,
        containerDimensions: { width: 0, height: 0 },
      };
    }
    const w = pxToNumber(position.width as string);
    const h = pxToNumber(position.height as string);
    return {
      left: pxToNumber(position.left as string),
      top: pxToNumber(position.top as string),
      width: w,
      height: h,
      // unlike normal CSS border radius which will automatically max out at
      // half the shortest side of an element always resulting in a circular
      // rounded corner, SVGs will try to honor the radius as best as possible
      // which will cause the corners to be more ovoid if the radius is set
      // larger than half the shortest side
      radius: Math.min(style.radius!, w / 2, h / 2),
      containerDimensions: {
        /**
         * Since we still allow window scroll for
         * non fixed positioned elements, using scrollWidth and
         * scrollHeight allows the overlay background
         * to fully cover all the page.
         */
        width: document.body.scrollWidth,
        height: document.body.scrollHeight,
      },
    };
  }, [position, style]);

  /**
   * Scrolls the ref element into view when set to overlay and the element is not visible.
   *
   * NOTE: This might execute multiple times until all the needed criteria is satisfied, therefore
   * a locking mechanism was implemented.
   */
  const scrollRefElementIntoView = throttle(
    function () {
      // safety check since this shouldn't apply to non-overlay tips
      if (!autoScrolls) return;

      if (
        document.readyState === 'complete' &&
        shouldRender &&
        !isRefElementVisible &&
        !scrollLockedRef.current
      ) {
        scrollLockedRef.current = true;
        refElement?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
      } else if (
        document.readyState !== 'complete' &&
        !scrollLockedRef.current
      ) {
        // requeue itself only if not locked
        scrollTimeoutRef.current = setTimeout(scrollRefElementIntoView, 50);
        return;
      }
    },
    200,
    { leading: false, trailing: true }
  );

  /**
   * Scrolls the refElement into view when set to render and show overlay.
   *
   * WARNING: We need to re-trigger this hook whenever the observed variables change
   * because they wont be ready at first render, therefore we need to have a scroll locking
   * mechanism to avoid unintentionally scrolling more than a single time. That wasn't an issue atm,
   * but added to make this more robust and harder to break in the future.
   */
  useEffect(() => {
    if (autoScrolls) {
      scrollTimeoutRef.current = setTimeout(scrollRefElementIntoView, 100);
    }
    return () => void clearTimeout(scrollTimeoutRef.current);
  }, [shouldRender, autoScrolls, isRefElementVisible]);

  if (!shouldRender) {
    debugMessage('[BENTO] Tag element could not be positioned', {
      taggedElement,
      position,
    });
  }

  return (
    <div
      ref={ref}
      className={cx({
        'select-none': !isTooltip,
        'pointer-events-none': type === ContextTagType.highlight,
      })}
      {...(!isHighlight
        ? { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave }
        : {})}
    >
      {shouldRender && (
        <>
          <div
            className={cx(VTAG_WRAPPER_CLASSNAME, 'flex', 'absolute')}
            style={{
              left: position!.left,
              top: position!.top,
              zIndex: canShowOverlay ? zIndex + 1 : zIndex,
            }}
          >
            <div
              className="my-auto flex"
              style={{
                width: position!.width,
                height: position!.height,
              }}
            >
              {tag}
            </div>
            <ContextualTooltip
              tagRef={ref}
              open={showTooltip}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </div>
          {canShowOverlay && (
            <OverlayHighlight
              {...overlayCutoutDimensions}
              {...pick(style!, ['color', 'opacity', 'pulse'])}
              zIndex={zIndex}
            />
          )}
        </>
      )}
    </div>
  );
};

export default composeComponent<OuterProps>([
  withContextualTagContext,
  withCustomUIContext,
  withSidebarContext,
  withFormFactor,
  withMainStoreData<BeforeMainStoreDataProps, MainStoreData>(
    (state, { taggedElement }): MainStoreData => ({
      isGuideSelected: isGuideSelectedSelector(state, taggedElement?.guide),
    })
  ),
])(ContextStep);
