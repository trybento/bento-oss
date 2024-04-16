import React, { useContext, useEffect, useRef, useState } from 'react';
import { ContextTagTooltipAlignment } from 'bento-common/types/globalShoyuState';
import { isFlowGuide, isTooltipGuide } from 'bento-common/utils/formFactor';
import { isEqual } from 'bento-common/utils/lodash';

import { ContextualTagContext } from '../../providers/ContextualTagProvider';
import { getTooltipCoordinates, TooltipCoordinates } from './helpers';
import { getTagTooltipEl } from './ContextStep';
import { RichTooltip } from './RichTooltip';
import { SimpleTooltip } from './SimpleTooltip';
import { isVisualBuilderSession } from 'bento-common/features/wysiwyg/messaging';
import { WYSIWYG_CHROME_EXTENSION_ID } from '../../lib/constants';

type ContextualTooltipProps = {
  tagRef: React.RefObject<HTMLElement>;
  open: boolean;
} & Pick<React.HTMLAttributes<HTMLDivElement>, 'onMouseEnter' | 'onMouseLeave'>;

export default function ContextualTooltip({
  tagRef,
  open,
  onMouseEnter,
  onMouseLeave,
}: ContextualTooltipProps) {
  const [visualBuilderSession, setVisualBuilderSession] = useState(false);
  const { taggedElement } = useContext(ContextualTagContext);
  const ref = useRef<HTMLDivElement>(null);

  const [tooltipCoordinates, setTooltipCoordinates] =
    useState<TooltipCoordinates>(
      getTooltipCoordinates(
        ref.current,
        getTagTooltipEl(tagRef.current),
        taggedElement!.tooltipAlignment || ContextTagTooltipAlignment.right
      )
    );
  const { alignment, coordinates, tagRect } = tooltipCoordinates;

  /**
   * NOTE: If we ever allow other form factors to render as RichTooltip, then we need to update
   * the logic to register back with ATC to only affect what makes sense (i.e. we shouldn't ever
   * register guides as shown/hidden if they can be rendered in other components — like sidebars).
   */
  const TooltipComponent =
    isTooltipGuide(taggedElement?.formFactor) ||
    isFlowGuide(taggedElement?.formFactor)
      ? RichTooltip
      : SimpleTooltip;

  // NOTE: intentionally left without deps so this runs after every render to
  // ensure any changes to the ref elements' sizes have been updated for better
  // computation of the position
  useEffect(() => {
    if (ref.current && tagRef.current) {
      const newCoords = getTooltipCoordinates(
        ref.current,
        getTagTooltipEl(tagRef.current),
        taggedElement!.tooltipAlignment || ContextTagTooltipAlignment.right
      );
      if (!isEqual(newCoords, tooltipCoordinates)) {
        setTooltipCoordinates(newCoords);
      }
    }
  });

  useEffect(() => {
    const wrapper = async () => {
      setVisualBuilderSession(
        await isVisualBuilderSession(WYSIWYG_CHROME_EXTENSION_ID)
      );
    };

    wrapper();
  }, []);

  useEffect(() => {
    let interval: number;

    if (visualBuilderSession) {
      interval = window.setInterval(() => {
        window.postMessage(
          {
            action: 'tooltipPositionUpdated',
            payload: {
              alignment: tooltipCoordinates.alignment,
            },
          },
          '*'
        );
      }, 250);
    }

    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [visualBuilderSession, tooltipCoordinates]);

  return (
    <TooltipComponent
      {...coordinates}
      containerRef={ref}
      open={open}
      tagRect={tagRect}
      alignment={alignment}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
}
