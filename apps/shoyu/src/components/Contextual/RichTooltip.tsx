import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import shallow from 'zustand/shallow';
import { EmbedFormFactor, TooltipStyle } from 'bento-common/types';
import { EMPTY_CONTENT_CALLOUT } from 'bento-common/utils/templates';
import {
  ContextTagTooltipAlignment,
  EmbedTypenames,
  StepState,
} from 'bento-common/types/globalShoyuState';
import { isFlowGuide } from 'bento-common/utils/formFactor';
import useCallbackRef from 'bento-common/hooks/useCallbackRef';
import useResizeObserver from 'bento-common/hooks/useResizeObserver';
import { SlateBodyElement } from 'bento-common/types/slate';
import { debounce } from 'bento-common/utils/lodash';

import { ContextualTagContext } from '../../providers/ContextualTagProvider';
import { CustomUIContext } from '../../providers/CustomUIProvider';
import useMainStore from '../../stores/mainStore/hooks/useMainStore';
import useSelectGuideAndStep from '../../stores/mainStore/hooks/useSelectGuideAndStep';
import useGuideViews from '../../stores/mainStore/hooks/useGuideViews';
import useAirTrafficStore from '../../stores/airTrafficStore/hooks/useAirTrafficStore';
import { isEmptySlate } from '../../system/RichTextEditor/SlateContentRenderer/helpers';
import { TooltipCore } from '../Tooltip';
import { getArrowOffsets } from './helpers';

export type FlyingProps = {
  containerRef: React.RefObject<HTMLDivElement>;
  open: boolean;
  x: number | null;
  y: number | null;
  xOffset?: number;
  yOffset?: number;
  tagRect: DOMRect;
  alignment: ContextTagTooltipAlignment;
} & Pick<React.HTMLAttributes<HTMLDivElement>, 'onMouseEnter' | 'onMouseLeave'>;

/**
 * Rich Tooltips should be implemented by Tooltip and Flow-type guides.
 *
 * These are rich components that display step content, media and CTAs.
 */
export const RichTooltip: React.FC<FlyingProps> = ({
  containerRef,
  open,
  x,
  y,
  xOffset,
  yOffset,
  tagRect,
  alignment,
  onMouseEnter,
  onMouseLeave,
}) => {
  const {
    taggedElement,
    guide,
    step,
    handleDismiss: handleTagDismiss,
    unsetForcefullyOpen,
    scrollIntoViewIfNeeded,
  } = useContext(ContextualTagContext);

  const {
    paragraphFontSize,
    paragraphLineHeight,
    tooltipsStyle,
    backgroundColor: globalBackgroundColor,
    fontColorHex: globalTextColor,
    featureFlags,
  } = useContext(CustomUIContext);

  const [dispatch] = useMainStore(useCallback((state) => [state.dispatch], []));

  const { airTrafficRegister, activeJourney, startJourney } =
    useAirTrafficStore(
      useCallback(
        (state) => ({
          activeJourney: state.activeJourney,
          airTrafficRegister: state.register,
          startJourney: state.startJourney,
        }),
        []
      ),
      shallow
    );

  /**
   * Prevent sub components like CTAs
   * and styling from using the guide formFactor
   * since it could be "sidebar" with VTs.
   */
  const formFactor = useMemo(
    () =>
      isFlowGuide(guide?.formFactor)
        ? EmbedFormFactor.flow
        : EmbedFormFactor.tooltip,
    [guide?.formFactor]
  );

  /**
   * If bodySlate is empty, we replace it with a callout
   * saying the content is empty
   */
  const stepBodySlate = useMemo<SlateBodyElement[]>(
    () =>
      (guide?.isPreview || step?.isPreview) && isEmptySlate(step?.bodySlate)
        ? EMPTY_CONTENT_CALLOUT
        : step?.bodySlate,
    [guide?.isPreview, step?.isPreview, step?.bodySlate]
  );

  const [tooltipHeight, setTooltipHeight] = useState<number>(0);

  /**
   * Handles the dismissing action for actual tooltips.
   *
   * This not only dismisses the tag itself, but also records
   * the step as skipped and the guide as done.
   */
  const handleTipDismiss = useCallback(
    (event: React.MouseEvent) => {
      if (step) {
        handleTagDismiss(event);

        dispatch({
          type: 'stepChanged',
          step: {
            entityId: step.entityId,
            state: StepState.skipped,
          },
        });
      }
    },
    [dispatch, handleTagDismiss, step, taggedElement!.formFactor]
  );

  const style = (guide?.formFactorStyle || {}) as TooltipStyle;
  const backgroundColor = style.backgroundColor || globalBackgroundColor;
  const textColor = style.textColor || globalTextColor;

  const arrowOffsets = useMemo(
    () => getArrowOffsets(alignment, tagRect, tooltipHeight),
    [alignment, tagRect.width, tagRect.height, tooltipHeight]
  );

  const unsetWrapper = useCallback(
    (
      cb: typeof onMouseEnter | typeof onMouseLeave | typeof handleTipDismiss
    ) => {
      return (e: any) => {
        unsetForcefullyOpen();
        cb?.(e);
      };
    },
    [unsetForcefullyOpen]
  );

  const updateTooltipHeight = useCallbackRef(
    debounce(() => {
      if (containerRef.current) {
        setTooltipHeight(containerRef.current.clientHeight);
      }
    }, 100),
    []
  );

  useSelectGuideAndStep(dispatch, taggedElement!.formFactor, guide?.entityId);

  // This is neeeded since multiple Tooltips can be seen at the same time,
  // therefore not allowing us to rely on the selected guide/step for this
  // specific formFactor, since they would overlap and ultimately
  // make analytics unreliable
  const recordViewAs =
    guide && step
      ? {
          guide: guide!.entityId,
          step: step.entityId,
        }
      : undefined;

  // record as viewed when *open*
  useGuideViews(taggedElement!.formFactor, open && !!step, recordViewAs);

  useEffect(() => {
    return () => {
      taggedElement?.forcefullyOpen && unsetForcefullyOpen();
    };
  }, []);

  useEffect(() => {
    scrollIntoViewIfNeeded();
  }, [scrollIntoViewIfNeeded]);

  useResizeObserver(updateTooltipHeight, {
    element: containerRef.current || null,
  });

  const shouldRender = !!step;
  const isContentVisible = shouldRender && open;

  /**
   * Register back with ATC whenever a tooltip is shown or hidden (incl. when unmounted),
   * according to whether it is allowed to render and its open state.
   *
   * If part of a Flow-type guide, creates a journey when content is visible if there is
   * no active journey at the moment. This is helpful to automatically record dismissal
   * if we navigate away.
   */
  useEffect(() => {
    airTrafficRegister({
      guide: taggedElement!.guide,
      shown: isContentVisible,
    });

    // starts journeys for flow-type guides (i.e. first step)
    if (isContentVisible && isFlowGuide(guide?.formFactor) && !activeJourney) {
      startJourney({
        type: EmbedTypenames.guide,
        selectedGuide: step.guide,
        selectedModule: step.module,
        selectedStep: step.entityId,
        selectedPageUrl: window.location.href,
        endingCriteria: {
          closeSidebar: false,
          navigateAway: true,
        },
      });
    }

    return () => {
      airTrafficRegister({
        guide: taggedElement!.guide,
        shown: false,
      });
    };
  }, [isContentVisible]);

  /**
   * Prevents cumulative layout shift (CLS) due to a potential missing step
   * at first render that can crease a poor user experience.
   */
  if (!shouldRender) return null;

  return (
    <TooltipCore
      x={(x || 0) + arrowOffsets.x}
      y={(y || 0) + arrowOffsets.y}
      caretXOffset={-(xOffset || 0)}
      caretYOffset={-(yOffset || 0)}
      formFactor={formFactor}
      isOpen={open}
      onDismiss={unsetWrapper(handleTipDismiss)}
      paragraphFontSize={paragraphFontSize}
      paragraphLineHeight={paragraphLineHeight}
      tooltipsStyle={tooltipsStyle}
      backgroundColor={backgroundColor}
      fontColorHex={textColor}
      style={style}
      step={{ ...step, bodySlate: stepBodySlate }}
      alignment={alignment}
      ref={containerRef}
      onMouseEnter={unsetWrapper(onMouseEnter)}
      onMouseLeave={unsetWrapper(onMouseLeave)}
      featureFlags={featureFlags}
    />
  );
};
