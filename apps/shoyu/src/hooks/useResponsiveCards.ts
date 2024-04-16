import { useMemo } from 'react';
import { BreakPoints, EmbedFormFactor } from 'bento-common/types';

import { InlineBreakpoint } from '../lib/constants';
import useElementSize from 'bento-common/hooks/useElementSize';
import { HOSTED_GUIDE_SIDEBAR_WIDTH_PX } from '../lib/sidebarConstants';

interface Props {
  containerRef: HTMLElement | null;
  formFactor: EmbedFormFactor;
  defaultFullWidth?: boolean;
  maxInlineCols?: number;
  hasImages?: boolean;
  inlineBreakPoint?: Record<BreakPoints, number>;
}

const colsClass: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
};

export default function useResponsiveCards({
  containerRef,
  formFactor,
  defaultFullWidth,
  maxInlineCols = 3,
  hasImages,
  inlineBreakPoint = InlineBreakpoint,
}: Props) {
  const { width: containerWidth } = useElementSize(containerRef, 'throttle', {
    width: 999,
    height: 999,
  });

  const [cols, fontSizeClass, minWidth] = useMemo(() => {
    switch (formFactor) {
      case EmbedFormFactor.inline:
        if (containerWidth <= inlineBreakPoint.sm) return [1, 'text-base', 200];
        if (containerWidth <= inlineBreakPoint.md) return [2, 'text-base', 200];
        return [maxInlineCols, 'text-lg', 200];

      default:
        return defaultFullWidth ||
          hasImages ||
          containerWidth <= HOSTED_GUIDE_SIDEBAR_WIDTH_PX
          ? [1, 'text-base', 0]
          : [2, 'text-base', 0];
    }
  }, [containerWidth, formFactor, defaultFullWidth, maxInlineCols]);

  return {
    containerRef,
    colsClass: colsClass[cols],
    fontSizeClass,
    minWidth,
    cols,
  };
}
