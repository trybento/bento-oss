import { ContextTagTooltipAlignment } from 'bento-common/types/globalShoyuState';

import { WINDOW_PADDING_PX } from '../../hooks/useFloatingElement';
import { getBoundingRects } from '../../lib/helpers';
import { ARROW_SIZE, SHORT_TOOLTIP_MAX_HEIGHT } from '../Tooltip';

export const TOOLTIP_ARROW_VERTICAL_OFFSET = -50;
export const TOOLTIP_MIN_WIDTH_PX = 100;
export const TOOLTIP_DISTANCE_PX = 8;
export const TOOLTIP_LEFT_RIGHT_DEFAULT_Y = -6 * 4; // -6 * tailwind px constant

export const getArrowOffsets = (
  alignment: ContextTagTooltipAlignment,
  tagRect: DOMRect,
  tooltipHeight: number,
  xOffset = 0,
  yOffset = 0
) => ({
  x:
    xOffset +
    ([
      ContextTagTooltipAlignment.top,
      ContextTagTooltipAlignment.bottom,
    ].includes(alignment)
      ? 0
      : alignment === ContextTagTooltipAlignment.left
      ? -1 * ARROW_SIZE
      : ARROW_SIZE),
  y:
    yOffset +
    ([
      ContextTagTooltipAlignment.left,
      ContextTagTooltipAlignment.right,
    ].includes(alignment)
      ? (tooltipHeight >= SHORT_TOOLTIP_MAX_HEIGHT
          ? TOOLTIP_ARROW_VERTICAL_OFFSET
          : tooltipHeight / -2) +
        tagRect.height / 2
      : alignment === ContextTagTooltipAlignment.top
      ? -1 * ARROW_SIZE
      : ARROW_SIZE),
});

export type TooltipCoordinates = {
  alignment: ContextTagTooltipAlignment;
  coordinates: { x: number; y: number; xOffset?: number; yOffset?: number };
  tagRect: DOMRect;
};

const isVerticalAlignment = (alignment: ContextTagTooltipAlignment) =>
  alignment === ContextTagTooltipAlignment.top ||
  alignment === ContextTagTooltipAlignment.bottom;
const isHorizontalAlignment = (alignment: ContextTagTooltipAlignment) =>
  alignment === ContextTagTooltipAlignment.left ||
  alignment === ContextTagTooltipAlignment.right;

enum OverflowProblems {
  left,
  right,
  top,
  bottom,
}

/**
 * Determines position of tooltip based on various factors, such as the content,
 * container, and view port positions and dimensions.
 *
 * May toggle the alignments if space doesn't allow for original alignments.
 */
export function getTooltipCoordinates(
  tooltipEl: HTMLElement | null,
  tagEl: HTMLElement | null,
  alignment: ContextTagTooltipAlignment
): TooltipCoordinates {
  if (!tagEl || !tooltipEl) {
    return {
      alignment,
      coordinates: { x: 0, y: 0, xOffset: 0, yOffset: 0 },
      tagRect: { width: 0, height: 0 } as DOMRect,
    };
  }

  const { tagRect, tooltipRect, containerRect, windowHeight, windowWidth } =
    getBoundingRects(tooltipEl, tagEl);

  const tooltipWidth = tooltipRect ? tooltipRect.width : TOOLTIP_MIN_WIDTH_PX;
  const tooltipHeight = tooltipRect ? tooltipRect.height : 0;

  const tagWidth = tagRect.width;
  const tagHeight = tagRect.height;

  /**
   * Calculate positioning based on dimensions extracted above
   */
  const containerXPos = containerRect?.x || 0;
  const containerYPos = containerRect?.top || 0;

  const leftX = -tooltipWidth - TOOLTIP_DISTANCE_PX;
  const rightX = TOOLTIP_DISTANCE_PX + tagWidth;
  const topBottomX = -tooltipWidth / 2 + tagWidth / 2;
  const topBottomLeftBuffer = topBottomX + containerXPos - WINDOW_PADDING_PX;
  const topBottomRightBuffer =
    windowWidth -
    WINDOW_PADDING_PX -
    (topBottomX + tooltipWidth + containerXPos);
  const topBottomXOffset =
    topBottomLeftBuffer < 0
      ? -1 * topBottomLeftBuffer
      : topBottomRightBuffer < 0
      ? topBottomRightBuffer
      : 0;

  const leftRightY = -2;
  const topY = -TOOLTIP_DISTANCE_PX - tooltipHeight;
  const bottomY = TOOLTIP_DISTANCE_PX + tagHeight;
  const leftRightTopBuffer =
    containerYPos +
    TOOLTIP_LEFT_RIGHT_DEFAULT_Y +
    leftRightY -
    WINDOW_PADDING_PX;
  const leftRightBottomBuffer =
    windowHeight -
    WINDOW_PADDING_PX -
    (containerYPos + leftRightY + tooltipHeight + TOOLTIP_LEFT_RIGHT_DEFAULT_Y);
  const leftRightYOffset =
    leftRightTopBuffer < 0
      ? -1 * leftRightTopBuffer
      : leftRightBottomBuffer < 0
      ? leftRightBottomBuffer
      : 0;

  // get initial coordinates
  const coordinates = {
    x:
      alignment === ContextTagTooltipAlignment.right
        ? rightX
        : alignment === ContextTagTooltipAlignment.left
        ? leftX
        : topBottomX + topBottomXOffset,
    y:
      alignment === ContextTagTooltipAlignment.top
        ? topY
        : alignment === ContextTagTooltipAlignment.bottom
        ? bottomY
        : leftRightY + leftRightYOffset,
    xOffset: isVerticalAlignment(alignment) ? topBottomXOffset : 0,
    yOffset: isHorizontalAlignment(alignment) ? leftRightYOffset : 0,
  };

  /**
   * Check for overflow issues.
   *
   * If we have no space on the left or right but we want to place there, we'll
   *   also check top/bottom problems and react accordingly
   */
  const overflowProblems = new Set<OverflowProblems>();

  /**
   * Test for the tooltip running out of the display area and flag the sides it runs off
   */
  if (containerXPos - tooltipWidth - TOOLTIP_DISTANCE_PX < WINDOW_PADDING_PX)
    overflowProblems.add(OverflowProblems.left);

  if (
    containerXPos + tooltipWidth + TOOLTIP_DISTANCE_PX + tagWidth >
    windowWidth - WINDOW_PADDING_PX
  )
    overflowProblems.add(OverflowProblems.right);

  if (containerYPos - tooltipHeight - TOOLTIP_DISTANCE_PX < WINDOW_PADDING_PX)
    overflowProblems.add(OverflowProblems.top);

  if (
    containerYPos +
      tooltipHeight +
      tagHeight +
      TOOLTIP_DISTANCE_PX +
      TOOLTIP_DISTANCE_PX >
    windowHeight - WINDOW_PADDING_PX
  )
    overflowProblems.add(OverflowProblems.bottom);

  /**
   * Check if we ran out of horizontal space
   */
  const noHorizontalSpace =
    overflowProblems.has(OverflowProblems.left) &&
    overflowProblems.has(OverflowProblems.right);

  /**
   * Check if we ran out of vertical space
   */
  const noVerticalSpace =
    overflowProblems.has(OverflowProblems.top) &&
    overflowProblems.has(OverflowProblems.bottom);

  /**
   * Based on where we have overflow issues, determine where to force the tooltip
   */
  let forcePos: ContextTagTooltipAlignment | null = null;

  if (noHorizontalSpace) {
    /** Don't check bottom, because if we have all 4 then we simply don't have space */
    forcePos = overflowProblems.has(OverflowProblems.top)
      ? ContextTagTooltipAlignment.bottom
      : ContextTagTooltipAlignment.top;

    /* Correct the x positioning since we're no longer placing L/R */
    coordinates.x = topBottomX + topBottomXOffset;
  } else if (noVerticalSpace) {
    /** Don't check right, because if we have all 4 then we simply don't have space */
    forcePos = overflowProblems.has(OverflowProblems.left)
      ? ContextTagTooltipAlignment.right
      : ContextTagTooltipAlignment.left;

    /* Correct the y positioning since we're no longer placing T/B */
    coordinates.y = leftRightY + leftRightYOffset;
  } else {
    if (
      isVerticalAlignment(alignment) &&
      overflowProblems.has(OverflowProblems.top)
    )
      forcePos = ContextTagTooltipAlignment.bottom;
    if (
      isVerticalAlignment(alignment) &&
      overflowProblems.has(OverflowProblems.bottom)
    )
      forcePos = ContextTagTooltipAlignment.top;
    if (
      isHorizontalAlignment(alignment) &&
      overflowProblems.has(OverflowProblems.left)
    )
      forcePos = ContextTagTooltipAlignment.right;
    if (
      isHorizontalAlignment(alignment) &&
      overflowProblems.has(OverflowProblems.right)
    )
      forcePos = ContextTagTooltipAlignment.left;
  }

  /** Returned forced position if any. */
  switch (forcePos) {
    case ContextTagTooltipAlignment.top:
      return {
        alignment: ContextTagTooltipAlignment.top,
        coordinates: { ...coordinates, y: topY },
        tagRect,
      };
    case ContextTagTooltipAlignment.bottom:
      return {
        alignment: ContextTagTooltipAlignment.bottom,
        coordinates: { ...coordinates, y: bottomY },
        tagRect,
      };
    case ContextTagTooltipAlignment.left:
      return {
        alignment: ContextTagTooltipAlignment.left,
        coordinates: { ...coordinates, x: leftX },
        tagRect,
      };
    case ContextTagTooltipAlignment.right:
      return {
        alignment: ContextTagTooltipAlignment.right,
        coordinates: { ...coordinates, x: rightX },
        tagRect,
      };
    default:
      return { alignment, coordinates, tagRect };
  }
}
