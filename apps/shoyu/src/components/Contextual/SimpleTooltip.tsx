import React, { useContext, useEffect } from 'react';

import { ContextualTagContext } from '../../providers/ContextualTagProvider';
import { CustomUIContext } from '../../providers/CustomUIProvider';
import { px } from '../../lib/helpers';
import { TOOLTIP_MIN_WIDTH_PX } from './helpers';
import { FlyingProps } from './RichTooltip';

/**
 * Different than "Rich Tooltips", these are simple tooltips implemented by visual tags associated
 * with onboarding or contextual checklists.
 *
 * These are simple components that won't show step content or CTAs and will act as a trigger
 * to open the actual content elsewhere (i.e. sidebar).
 */
export const SimpleTooltip: React.FC<FlyingProps> = ({
  containerRef,
  open,
  x,
  y,
  onMouseEnter,
  onMouseLeave,
}) => {
  const {
    taggedElement,
    handleSeeMore,
    handleDismiss,
    unsetForcefullyOpen,
    scrollIntoViewIfNeeded,
    shouldShowSelectionControls,
  } = useContext(ContextualTagContext);

  const { primaryColorHex } = useContext(CustomUIContext);

  useEffect(() => {
    /**
     * When set to forcefully open, we mimic the user action
     * to immediately show what he otherwise would need to click
     * at "see more" to see it.
     */
    if (taggedElement?.forcefullyOpen) {
      handleSeeMore(undefined);
      unsetForcefullyOpen();
    }
  }, [taggedElement?.forcefullyOpen]);

  useEffect(() => {
    scrollIntoViewIfNeeded();
  }, [scrollIntoViewIfNeeded]);

  return (
    <div
      className={`
        tooltip
        absolute
        pointer-events-auto
        ${open ? 'tooltip-fade-in' : 'tooltip-fade-out'}
      `}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        ref={containerRef}
        className="absolute flex flex-col p-2 bg-white"
        style={{
          left: px(x || 0),
          top: px(y || 0),
          borderRadius: '4px',
          boxShadow:
            '0px 0px 4px rgba(0, 0, 0, 0.04), 1px 2px 4px rgba(0, 0, 0, 0.08)',
        }}
      >
        <div className="line-clamp-2 pb-0.5 font-semibold text-gray-900">
          <div
            className="text-left m-auto w-max "
            style={{
              maxWidth: '170px',
              minWidth: `${TOOLTIP_MIN_WIDTH_PX}px`,
              fontSize: '13px',
            }}
          >
            {taggedElement!.tooltipTitle}
          </div>
        </div>
        <div
          className="flex place-content-between flex-row pt-2 overflow-hidden"
          style={{ fontSize: '11px' }}
        >
          <div
            className={`cursor-pointer hover:underline text-gray-500 whitespace-nowrap 'mr-auto`}
            onClick={handleDismiss}
          >
            Dismiss
          </div>
          {shouldShowSelectionControls && (
            <div
              className="cursor-pointer hover:underline ml-auto whitespace-nowrap"
              style={{ color: primaryColorHex }}
              onClick={handleSeeMore}
            >
              See more
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
