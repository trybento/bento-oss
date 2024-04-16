import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import cx from 'classnames';
import ReactTooltip from 'react-tooltip';
import useRandomKey from 'bento-common/hooks/useRandomKey';
import {
  AnnouncementShadow,
  CtasOrientation,
  EmbedFormFactor,
  MediaOrientation,
  StepBodyOrientation,
  Theme,
  TooltipSize,
  TooltipStyle,
} from 'bento-common/types';
import { pick } from 'bento-common/utils/lodash';
import {
  ContextTagTooltipAlignment,
  FormFactorStateKey,
  Step,
  StepState,
  TooltipGuide,
} from 'bento-common/types/globalShoyuState';
import composeComponent from 'bento-common/hocs/composeComponent';
import { STANDARD_SHADOW } from 'bento-common/frontend/styles';
import { px, stopEvent } from 'bento-common/utils/dom';
import { isEmptyBody } from 'bento-common/utils/bodySlate';
import useResizeObserver from 'bento-common/hooks/useResizeObserver';
import useCallbackRef from 'bento-common/hooks/useCallbackRef';
import { mockedTooltipValues } from 'bento-common/utils/previews';
import {
  activeTooltipSelector,
  firstStepOfGuideSelector,
} from '../stores/mainStore/helpers/selectors';
import SlateContentRenderer from '../system/RichTextEditor/SlateContentRenderer';
import { CustomUIProviderValue } from '../providers/CustomUIProvider';
import useSelectGuideAndStep from '../stores/mainStore/hooks/useSelectGuideAndStep';
import withMainStoreData from '../stores/mainStore/withMainStore';
import { MainStoreState } from '../stores/mainStore/types';
import StepCta from '../system/StepCta';
import withCustomUIContext from '../hocs/withCustomUIContext';
import CloseButton from './CloseButton';
import { FormFactorContextValue } from '../providers/FormFactorProvider';
import withFormFactor from '../hocs/withFormFactor';
import { TOOLTIP_LEFT_RIGHT_DEFAULT_Y } from './Contextual/helpers';
import InputFields from './InputFields';
import { isInputStep } from 'bento-common/data/helpers';
import { extractRichContent } from '../lib/richContent';
import { StepCTAPosition } from '../../types/global';
import ExtractedRichContent from './layouts/common/ExtractedRichContent';

const embedFormFactor = EmbedFormFactor.tooltip;

type CustomUIProps = Pick<
  CustomUIProviderValue,
  | 'paragraphFontSize'
  | 'paragraphLineHeight'
  | 'tooltipsStyle'
  | 'backgroundColor'
  | 'fontColorHex'
  | 'featureFlags'
>;

export type TooltipProps = {
  /** Tooltip position */
  x?: number;
  y?: number;
  caretXOffset?: number;
  caretYOffset?: number;
  /** The actual form factor or uipreviewid when in preview mode */
  formFactor: FormFactorStateKey;
  /** Should it be displayed? */
  isOpen: boolean;
  /** Callback fired when the banner is dismissed */
  onDismiss: (e: React.MouseEvent<HTMLButtonElement>) => void;
  step: Step;
  /** Controls the tooltip style, if any */
  style: TooltipStyle;
  alignment?: ContextTagTooltipAlignment;
  ref?: React.Ref<HTMLDivElement>;
  onMouseEnter?: React.HTMLAttributes<HTMLDivElement>['onMouseEnter'];
  onMouseLeave?: React.HTMLAttributes<HTMLDivElement>['onMouseLeave'];
} & CustomUIProps;

export const ARROW_SIZE = 16;
const widths = {
  [TooltipSize.small]: 308,
  [TooltipSize.medium]: 415,
  [TooltipSize.large]: 593,
};

/** Added when tooltips have horizontal media. */
const extraWidth = 100;

const TooltipCaret: React.FC<{
  alignment: ContextTagTooltipAlignment;
  color: string;
  shadow: AnnouncementShadow;
  short: boolean;
  xOffset?: number;
  yOffset?: number;
}> = ({ alignment, color, shadow, short, xOffset = 0, yOffset = 0 }) => {
  const { isLeft, isRight, isTop, isBottom } = useMemo(
    () => ({
      isLeft: alignment === ContextTagTooltipAlignment.left,
      isRight: alignment === ContextTagTooltipAlignment.right,
      isTop: alignment === ContextTagTooltipAlignment.top,
      isBottom: alignment === ContextTagTooltipAlignment.bottom,
    }),
    [alignment]
  );
  const isLeftOrRight = isLeft || isRight;
  const isTopOrBottom = isTop || isBottom;
  return (
    <div
      className={cx('absolute overflow-hidden', {
        'w-14 h-14 scale-y-75': isLeftOrRight,
        '-translate-y-1/2': isLeftOrRight && short,
        '-translate-x-1/2 w-14 h-14 scale-x-75': isTopOrBottom,
        'right-full': isRight,
        'left-full': isLeft,
        'bottom-full': isBottom,
        'top-full': isTop,
      })}
      style={useMemo(
        () =>
          isTopOrBottom
            ? { left: `calc(50% + ${px(xOffset)})` }
            : isLeftOrRight
            ? {
                top: short
                  ? `calc(50% + ${px(Math.max(yOffset, 0))})`
                  : px(Math.max(-TOOLTIP_LEFT_RIGHT_DEFAULT_Y + yOffset, 0)),
              }
            : {},
        [isTopOrBottom, isLeftOrRight, xOffset, yOffset, short]
      )}
    >
      <div
        className={cx('absolute rotate-45 w-9 h-9', {
          'top-1/2 -translate-y-1/2': isLeftOrRight,
          'left-1/2 -translate-x-1/2': isTopOrBottom,
          '-right-1/2': isRight,
          '-left-1/2': isLeft,
          '-top-1/2': isTop,
          '-bottom-1/2': isBottom,
        })}
        style={{
          backgroundColor: color,
          boxShadow:
            shadow === AnnouncementShadow.standard
              ? STANDARD_SHADOW
              : undefined,
        }}
      />
    </div>
  );
};

// caret default position is 6 units from the top and the caret itself is
// 14 units tall so if the tooltip is less than 26 units high the caret will
// look weird because it'll be offset.
// tailwind base size is 4px so this is 104px max height
export const SHORT_TOOLTIP_MAX_HEIGHT = 26 * 4;

export const TooltipCore = React.forwardRef<HTMLDivElement, TooltipProps>(
  function TooltipCore(
    {
      x,
      y,
      caretXOffset,
      caretYOffset,
      formFactor,
      isOpen,
      onDismiss,
      paragraphFontSize,
      paragraphLineHeight,
      tooltipsStyle,
      backgroundColor: globalBackgroundColor,
      fontColorHex: globalTextColor,
      style,
      step,
      alignment,
      onMouseEnter,
      onMouseLeave,
    },
    ref
  ) {
    const isLeftOriented = style?.mediaOrientation === MediaOrientation.Left;

    const {
      sanitizedStepBody,
      extractedNodes,
      allowMarginlessImages,
      hasExtractedNodes,
      edgeToEdgePositions,
    } = useMemo(() => {
      const richContentData = extractRichContent(
        embedFormFactor,
        Theme.nested,
        style?.stepBodyOrientation!,
        style?.verticalMediaOrientation,
        StepCTAPosition.bottom,
        step
      );
      const bodySlate = richContentData.sanitizedStepBody || [];

      return {
        ...richContentData,
        sanitizedStepBody: bodySlate,
        isEmpty: isEmptyBody(bodySlate),
      };
    }, [step, style]);

    const [tooltipContainer, setTooltipContainer] =
      useState<HTMLDivElement | null>(null);
    const [containerHeight, setContainerHeight] = useState<number>(0);
    const closeTipId = useRandomKey();
    const width =
      widths[style.tooltipSize || TooltipSize.large] +
      (hasExtractedNodes &&
      style?.stepBodyOrientation === StepBodyOrientation.horizontal
        ? extraWidth
        : 0);

    const boxShadow =
      tooltipsStyle.shadow === AnnouncementShadow.standard
        ? STANDARD_SHADOW
        : undefined;

    const backgroundColor = style.backgroundColor || globalBackgroundColor;
    const textColor = style.textColor || globalTextColor;
    const isShort = containerHeight < SHORT_TOOLTIP_MAX_HEIGHT;

    useResizeObserver(
      useCallbackRef(() => {
        if (tooltipContainer) {
          setContainerHeight(tooltipContainer.clientHeight);
        }
      }, [tooltipContainer]),
      { element: tooltipContainer }
    );

    const slateOptions = useMemo(
      () => ({
        formFactor: embedFormFactor,
        allowExpand: { image: true },
        maxDimensions: { image: { height: '40vh' } },
        allowMarginlessImages: true,
        horizontalMediaAlignment: style?.horizontalMediaAlignment,
      }),
      [style]
    );

    const slateSpacing = useMemo(
      () => ({
        lPadding:
          hasExtractedNodes && isLeftOriented ? 0 : tooltipsStyle.paddingX,
        rPadding:
          hasExtractedNodes && !isLeftOriented ? 0 : tooltipsStyle.paddingX,
      }),
      [hasExtractedNodes, isLeftOriented, tooltipsStyle]
    );

    useEffect(() => {
      if (ref && tooltipContainer) {
        // @ts-ignore
        (ref as React.RefObject<HTMLDivElement>).current = tooltipContainer;
      }
    }, [tooltipContainer, ref]);

    const [isReallyOpen, setIsReallyOpen] = useState<boolean>(false);

    /**
     * Creates a little time buffer to allow the content to render
     * and its position be better measured before effectively showing up,
     * therefore preventing jumpiness in some cases.
     */
    useLayoutEffect(() => {
      const timer = setTimeout(() => {
        setIsReallyOpen(isOpen && !(x === 16 && y === 0));
      }, 50);
      return () => {
        clearTimeout(timer);
      };
    }, [x, y, isOpen]);

    const paddingsPx = useMemo(
      () => ({
        y: px(tooltipsStyle.paddingY),
        x: px(tooltipsStyle.paddingX),
      }),
      [tooltipsStyle]
    );

    return (
      <>
        <div
          ref={setTooltipContainer}
          className={cx('bento-tooltip text-left pointer-events-auto', {
            // ref's exisitence is an indicator this is an actual tooltip and not
            // just a preview
            relative: !ref,
            absolute: ref,
            'tooltip-fade-in': isReallyOpen,
            'tooltip-fade-out': !isReallyOpen,
          })}
          style={{
            width: px(width),
            borderRadius: px(tooltipsStyle.borderRadius),
            boxShadow,
            backgroundColor,
            color: textColor,
            // position is fixed when this is a mockup
            left: x ?? mockedTooltipValues.x - width / 2,
            top: y ?? mockedTooltipValues.y + (style.hasArrow ? ARROW_SIZE : 0),
          }}
          onClick={stopEvent}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {/* Carat */}
          {style.hasArrow && (
            <TooltipCaret
              alignment={alignment || ContextTagTooltipAlignment.bottom}
              shadow={tooltipsStyle.shadow}
              color={backgroundColor}
              short={isShort}
              xOffset={caretXOffset}
              yOffset={caretYOffset}
            />
          )}
          <div
            className={cx('flex gap-6 w-full h-full overflow-hidden', {
              'flex-row-reverse': isLeftOriented,
            })}
            style={{
              borderRadius: px(tooltipsStyle.borderRadius),
            }}
          >
            <div
              className={cx('flex flex-col w-full')}
              style={{
                paddingTop: edgeToEdgePositions.first
                  ? undefined
                  : paddingsPx.y,
                paddingBottom:
                  edgeToEdgePositions.last && !step.ctas?.length
                    ? undefined
                    : paddingsPx.y,
              }}
            >
              <div>
                <div
                  className="tooltip-content"
                  style={{
                    fontSize: px(paragraphFontSize),
                    lineHeight: px(paragraphLineHeight),
                  }}
                >
                  <SlateContentRenderer
                    body={sanitizedStepBody}
                    options={slateOptions}
                    spacing={slateSpacing}
                  />
                </div>
                {isInputStep(step.stepType) && (
                  <div
                    className="my-4"
                    style={{ padding: `0 ${paddingsPx.x}` }}
                  >
                    <InputFields step={step} />
                  </div>
                )}
              </div>
              {style.canDismiss && (
                <CloseButton
                  color={textColor}
                  withBackground={
                    edgeToEdgePositions.first ||
                    (edgeToEdgePositions.horizontal && !isLeftOriented)
                  }
                  onDismiss={onDismiss}
                  data-for={closeTipId}
                  data-tip="Close"
                  data-test-id="tooltip-close-btn"
                />
              )}
              {step.ctas && step.ctas.length > 0 && (
                <div
                  className={cx(
                    'bento-step-ctas-wrapper mt-auto pt-2 flex align-center gap-3',
                    {
                      'justify-between':
                        style?.ctasOrientation === CtasOrientation.spaceBetween,
                      'justify-end':
                        style?.ctasOrientation === CtasOrientation.right,
                    }
                  )}
                  style={{
                    paddingLeft: px(slateSpacing.lPadding),
                    paddingRight: px(slateSpacing.rPadding),
                  }}
                >
                  {step.ctas.map((cta, idx) => (
                    <StepCta
                      cta={cta}
                      formFactor={formFactor}
                      key={`cta-${idx}`}
                      stepEntityId={step.entityId}
                    />
                  ))}
                </div>
              )}
            </div>
            {hasExtractedNodes && (
              <div
                className={cx('shrink-0 align-self-start')}
                style={{
                  width: style?.imageWidth,
                  maxWidth: `50%`,
                  paddingLeft:
                    isLeftOriented && !edgeToEdgePositions.horizontal
                      ? paddingsPx.x
                      : undefined,
                  paddingRight:
                    !isLeftOriented && !edgeToEdgePositions.horizontal
                      ? paddingsPx.x
                      : undefined,
                  paddingBottom: edgeToEdgePositions.horizontal
                    ? undefined
                    : paddingsPx.y,
                  paddingTop: edgeToEdgePositions.horizontal
                    ? undefined
                    : paddingsPx.y,
                }}
              >
                <ExtractedRichContent
                  extractedNodes={extractedNodes!}
                  allowMarginless={allowMarginlessImages}
                  {...pick(style || ({} as TooltipStyle), [
                    'mediaOrientation',
                    'verticalMediaAlignment',
                    'horizontalMediaAlignment',
                    'mediaFontSize',
                    'mediaTextColor',
                  ])}
                />
              </div>
            )}
          </div>
        </div>
        {ref && (
          <ReactTooltip
            id={closeTipId}
            effect="solid"
            place="top"
            offset={{ top: 12 }}
            delayShow={500}
            className="toggle-tooltip"
          />
        )}
      </>
    );
  }
);

type OuterProps = {};

type Props = OuterProps &
  CustomUIProps &
  Pick<FormFactorContextValue, 'formFactor'>;

type MainStoreData = {
  guide?: TooltipGuide;
  step?: Step;
  dispatch: MainStoreState['dispatch'];
};

type TooltipContainerProps = Props & MainStoreData;

const TooltipContainer: React.FC<TooltipContainerProps> = (
  { guide, step, formFactor, dispatch, ...rest },
  _ref: React.Ref<HTMLDivElement>
) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDismiss = useCallback(() => {
    if (!guide?.formFactorStyle?.canDismiss) return;

    dispatch({
      type: 'stepChanged',
      step: {
        entityId: step!.entityId,
        state: StepState.skipped,
      },
    });
  }, [step, guide?.formFactorStyle]);

  useEffect(() => {
    // toggle visibility of the tooltip
    const isOpen = !!step;
    setIsOpen(isOpen);
  }, [step]);

  useSelectGuideAndStep(dispatch, formFactor, guide?.entityId, step?.entityId);

  return guide?.formFactorStyle && step ? (
    <TooltipCore
      formFactor={formFactor}
      isOpen={isOpen}
      onDismiss={handleDismiss}
      style={guide.formFactorStyle as TooltipStyle}
      step={step}
      {...rest}
    />
  ) : null;
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withCustomUIContext,
  withMainStoreData<Props, MainStoreData>((state, { formFactor }) => {
    const guide = activeTooltipSelector(state, formFactor) as TooltipGuide;
    return {
      guide,
      step: firstStepOfGuideSelector(state, guide?.entityId),
      dispatch: state.dispatch,
    };
  }),
])(TooltipContainer);
