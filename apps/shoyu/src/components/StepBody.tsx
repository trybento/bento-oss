import React, { useCallback, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';

import {
  BodyPadding,
  CardStyle,
  ChecklistStyle,
  InlineContextualGuideStyles,
  MediaOrientation,
  OrientableFormFactorStyle,
  StepBodyOrientation,
  Theme,
} from 'bento-common/types';
import { isEmptyBody } from 'bento-common/utils/bodySlate';
import { Guide, Step, StepState } from 'bento-common/types/globalShoyuState';
import {
  getGuideThemeFlags,
  getStepSeparationFlags,
  isBranchingStep,
  isInputStep,
  isSerialCyoa,
  THEME_LABELS,
} from 'bento-common/data/helpers';
import { isTransparent } from 'bento-common/utils/color';
import { px } from 'bento-common/utils/dom';
import composeComponent from 'bento-common/hocs/composeComponent';
import useCallbackRef from 'bento-common/hooks/useCallbackRef';
import useResizeObserver from 'bento-common/hooks/useResizeObserver';
import {
  isActiveGuidesView,
  isStepView,
} from 'bento-common/frontend/shoyuStateHelpers';
import {
  hasOnlyOneStep,
  isInlineContextualGuide,
} from 'bento-common/utils/formFactor';
import { SlateRendererOptions } from 'bento-common/types/slate';
import { debounce, isNil } from 'bento-common/utils/lodash';

import ArrowDownward from '../icons/arrowDownward.svg';
import SlateContentRenderer from '../system/RichTextEditor/SlateContentRenderer';
import { CustomUIProviderValue } from '../providers/CustomUIProvider';
import {
  guideSelector,
  selectedGuideForFormFactorSelector,
} from '../stores/mainStore/helpers/selectors';
import { getRenderConfig, SeparationBetween } from '../lib/guideRenderConfig';
import BranchingOptions, {
  getShouldCyoaStepHideContent,
} from './BranchingOptions';
import InputFields from './InputFields';
import withMainStoreData from '../stores/mainStore/withMainStore';
import { MainStoreState } from '../stores/mainStore/types';
import withCustomUIContext from '../hocs/withCustomUIContext';
import TransitionWrapper from './TransitionWrapper';
import withFormFactor from '../hocs/withFormFactor';
import { FormFactorContextValue } from '../providers/FormFactorProvider';
import withUIState from '../hocs/withUIState';
import { UIStateContextValue } from '../providers/UIStateProvider';
import { extractRichContent } from '../lib/richContent';
import {
  StepCTAPosition,
  StepTransition,
  WithSidebarContentWrapperRef,
} from '../../types/global';
import CommonStepWrapper from './layouts/common/StepWrapper';
import CommonStepControls from './layouts/common/StepControls';
import StepSeparator from './StepSeparator';
import withInlineEmbed from '../hocs/withIlnineEmbed';
import { InlineEmbedContextValue } from '../providers/InlineEmbedProvider';
import ResetOnboarding from './ResetOnboarding';
import { getInlineContextPadding } from '../lib/helpers';

type OuterProps = {
  stepContentRef?: React.Ref<HTMLDivElement>;
  step: Step | undefined;
  isSelected?: boolean;
  theme: Theme;
  minHeight?: number;
} & WithSidebarContentWrapperRef;

type MainStoreData = {
  guide: Guide | undefined;
  isCyoaGuide: boolean;
  dispatch: MainStoreState['dispatch'];
};

type Props = OuterProps &
  Pick<UIStateContextValue, 'view'> &
  Pick<
    CustomUIProviderValue,
    | 'paragraphFontSize'
    | 'paragraphLineHeight'
    | 'backgroundColor'
    | 'cardBackgroundColor'
    | 'stepSeparationStyle'
    | 'inlineContextualStyle'
  > &
  Pick<
    FormFactorContextValue,
    | 'formFactor'
    | 'embedFormFactor'
    | 'renderedFormFactor'
    | 'renderedFormFactorFlags'
    | 'embedFormFactorFlags'
  > &
  Pick<InlineEmbedContextValue, 'isEverboardingInline'>;

const CONTENT_WIDTH: { [key in MediaOrientation]: string } = {
  [MediaOrientation.Left]: '400px',
  [MediaOrientation.Right]: '400px',
};

const CONTENT_MIN_HEIGHT: { [key in MediaOrientation]: string } = {
  [MediaOrientation.Left]: '150px',
  [MediaOrientation.Right]: '150px',
};

export const getContentMinHeight = (
  mediaOrientation: MediaOrientation | undefined | null
): string => CONTENT_MIN_HEIGHT[mediaOrientation || MediaOrientation.Right];

export function StepBody({
  formFactor,
  embedFormFactor,
  renderedFormFactor,
  renderedFormFactorFlags: { isInline: isInlineRendered },
  embedFormFactorFlags: { isInline: isInlineEmbed, isSidebar: isSidebarEmbed },
  guide,
  step,
  isSelected,
  view,
  theme,
  dispatch,
  paragraphFontSize,
  paragraphLineHeight,
  isCyoaGuide,
  backgroundColor,
  cardBackgroundColor,
  stepSeparationStyle: { boxCompleteBackgroundColor, type: separationType },
  minHeight,
  inlineContextualStyle,
  isEverboardingInline,
  sidebarContentWrapperRef,
  stepContentRef,
}: React.PropsWithChildren<Props & MainStoreData>) {
  const {
    stepTransition,
    stepControlsTransition,
    defaultStepBodyOrientation,
    verticalCtaPosition,
    horizontalCtasBelowContent,
    bodyPadding: bodyPaddingConfig,
    extractedContentPadding,
    minStepHeight,
    maxStepHeight,
    guideStyleBackgroundField,
    stepScrolls,
    StepWrapper = CommonStepWrapper,
    StepControls = CommonStepControls,
    stepContentGap,
    showMoreBackgroundField,
    separation,
    combineModules,
    boxCompleteBackgroundField,
    borderSeparationBackgroundField,
  } = getRenderConfig({
    theme,
    embedFormFactor,
    renderedFormFactor,
    isCyoaGuide,
    view,
    stepType: step?.stepType,
  });

  const { isCarousel, isFlat, isCard, isVideoGallery, isTimeline } =
    getGuideThemeFlags(theme);
  /**
   * Note: Find a way to use these conditions in `stepBody`
   * without causing a React hook error.
   */
  const fullHeightStepBody = isSidebarEmbed || isFlat || isCard;
  /** TODO: Find a better way of checking this. */
  const hasControlsBelow = isCarousel;
  const selectable = stepTransition !== StepTransition.none;
  const expanded = isSelected || !selectable;

  /**
   * Guide that don't allow "step selection"
   * still need to be aware of the step that performed
   * an action for side effect changes.
   *
   * @todo move logic to stepCtaClicked and dispatch another action
   */
  const beforeCompletionHandler = useCallback(
    (cb: (...args: any[]) => void) => {
      if (!selectable) {
        return (...a) => {
          dispatch({
            type: 'stepSelected',
            step: step?.entityId,
            formFactor,
          });

          setTimeout(() => cb(...a), 100);
        };
      }

      return cb;
    },
    [step?.entityId, formFactor, selectable]
  );

  const stepBodyOrientation = (
    isInlineContextualGuide(theme) ? isInlineEmbed : isInlineRendered
  )
    ? (guide?.formFactorStyle as ChecklistStyle | CardStyle)
        ?.stepBodyOrientation || defaultStepBodyOrientation
    : StepBodyOrientation.vertical;
  const isHorizontal = stepBodyOrientation === StepBodyOrientation.horizontal;
  const isVertical = stepBodyOrientation === StepBodyOrientation.vertical;
  const fixedStepHeight =
    !isBranchingStep(step?.stepType) && !isSidebarEmbed
      ? (guide?.formFactorStyle as ChecklistStyle | CardStyle)?.height
      : undefined;
  const imageWidth = isHorizontal
    ? (guide?.formFactorStyle as ChecklistStyle | CardStyle)?.imageWidth
    : undefined;
  const stepHeight = fixedStepHeight || maxStepHeight;
  const { isBoxed, isBordered } = getStepSeparationFlags(separationType);

  const {
    ctas,
    sanitizedStepBody,
    fullWidth,
    boldCtas,
    position: ctaPosition,
    extractedNodes,
    isEmpty,
    allowMarginlessImages,
    mediaReferenceFlags,
  } = useMemo(() => {
    const richContentData = extractRichContent(
      embedFormFactor!,
      theme,
      stepBodyOrientation,
      (guide?.formFactorStyle as CardStyle)?.verticalMediaOrientation,
      verticalCtaPosition,
      step
    );
    const bodySlate = richContentData.sanitizedStepBody || [];
    return {
      ...richContentData,
      sanitizedStepBody: bodySlate,
      isEmpty: isEmptyBody(bodySlate),
    };
  }, [
    theme,
    step,
    embedFormFactor,
    stepBodyOrientation,
    verticalCtaPosition,
    isVertical,
  ]);

  const [bodyEl, setBodyEl] = useState<HTMLDivElement | null>(null);
  const [stepControlsEl, setStepControlsEl] = useState<HTMLDivElement | null>(
    null
  );

  const [bodyHeight, setBodyHeight] = useState<number>(minStepHeight || 0);
  const [bodyHeightOverLimit, setBodyHeightOverLimit] =
    useState<boolean>(false);
  const [stepControlsHeight, setStepControlsHeight] = useState<number>(0);
  const [additionalHeight, setAdditionalHeight] = useState<number>(0);
  const [bodyExpanded, setBodyExpanded] = useState<boolean>(false);
  const [stepHeightAnimationEnabled, setStepHeightAnimationEnabled] =
    useState(false);
  const hasCtas = (step?.ctas?.length || 0) > 0;

  const controlsHeight = useMemo(
    () =>
      isHorizontal && !horizontalCtasBelowContent && hasCtas
        ? stepControlsHeight
        : 0,
    [
      ctaPosition,
      isHorizontal,
      horizontalCtasBelowContent,
      hasCtas,
      stepControlsHeight,
    ]
  );

  const inlineContextPadding = useMemo(
    () =>
      isEverboardingInline
        ? getInlineContextPadding(
            guide?.formFactorStyle as InlineContextualGuideStyles,
            inlineContextualStyle
          )
        : null,
    [isEverboardingInline, guide?.formFactorStyle, inlineContextualStyle]
  );

  const bodyPadding: BodyPadding | undefined = useMemo(
    () =>
      isEverboardingInline
        ? ['x', 'l', 'r', 'y', 't', 'b'].reduce((acc, k) => {
            const v =
              (bodyPaddingConfig?.[k] || 0) +
              (k === 'y'
                ? (inlineContextPadding?.['t'] || 0) +
                  (inlineContextPadding?.['b'] || 0)
                : k === 'x'
                ? (inlineContextPadding?.['l'] || 0) +
                  (inlineContextPadding?.['r'] || 0)
                : inlineContextPadding?.[k] || 0);
            // Ignore 0 spacing.
            if (v) acc[k] = v;
            return acc;
          }, {})
        : bodyPaddingConfig,
    [bodyPaddingConfig, inlineContextPadding, isEverboardingInline]
  );

  const extractedNodesContainerStyles = useMemo(() => {
    const width = mediaReferenceFlags.hasAttribute
      ? 'auto'
      : imageWidth ||
        CONTENT_WIDTH[
          (guide?.formFactorStyle as OrientableFormFactorStyle)
            ?.mediaOrientation || MediaOrientation.Right
        ];
    const isLeftOriented =
      (guide?.formFactorStyle as OrientableFormFactorStyle)
        ?.mediaOrientation === MediaOrientation.Left;
    const xPadding = inlineContextPadding
      ? isLeftOriented
        ? inlineContextPadding!.l
        : inlineContextPadding!.r
      : !isNil(extractedContentPadding?.x)
      ? extractedContentPadding!.x!
      : !isNil(isLeftOriented ? bodyPadding?.l : bodyPadding?.r)
      ? isLeftOriented
        ? bodyPadding!.l!
        : bodyPadding!.r!
      : bodyPadding?.x || 0;
    const tPadding = inlineContextPadding
      ? inlineContextPadding!.t
      : !isNil(extractedContentPadding?.y)
      ? extractedContentPadding!.y!
      : !isNil(bodyPadding?.t)
      ? bodyPadding!.t!
      : bodyPadding?.y || 0;
    const bPadding = inlineContextPadding
      ? inlineContextPadding!.b
      : !isNil(extractedContentPadding?.y)
      ? extractedContentPadding!.y!
      : !isNil(bodyPadding?.b)
      ? bodyPadding!.b!
      : bodyPadding?.y || 0;
    const height = expanded
      ? // Maintains initial height for images even if the step is expanded.
        (fixedStepHeight || Math.max(bodyHeight, 150)) +
        additionalHeight +
        (horizontalCtasBelowContent ? 0 : controlsHeight) +
        tPadding +
        (hasControlsBelow ? 0 : bPadding)
      : 0;
    const heightStyles = {
      height: px(height),
      transition:
        stepHeightAnimationEnabled && isFlat ? 'height 1s ease' : undefined,
    };
    const settings = allowMarginlessImages
      ? {
          width: `calc(${width} + ${px(xPadding)})`,
          maxWidth: `calc(50% + ${px(xPadding)})`,
          ...((isEverboardingInline || fixedStepHeight) && heightStyles),
          ...(isEverboardingInline
            ? {
                marginTop: px(-tPadding),
                marginBottom: hasControlsBelow ? undefined : px(-bPadding),
                [isLeftOriented ? 'marginLeft' : 'marginRight']: px(-xPadding),
              }
            : {
                height: px(height),
              }),
        }
      : {
          width: width,
          maxWidth: '50%',
          ...((!isEverboardingInline || fixedStepHeight) && heightStyles),
          ...(!isEverboardingInline && {
            paddingTop: px(tPadding),
            paddingBottom: px(bPadding),
          }),
          [isLeftOriented ? 'paddingLeft' : 'paddingRight']: px(xPadding),
        };

    /**
     * Compensate negative margin for Carousel with
     * fixed height to prevent height inconsistency
     * across steps.
     */
    if (isCarousel && fixedStepHeight && allowMarginlessImages)
      settings.height = `calc(${settings.height} + ${px(tPadding)})`;

    return settings;
  }, [
    expanded,
    fixedStepHeight,
    bodyHeight,
    controlsHeight,
    additionalHeight,
    imageWidth,
    mediaReferenceFlags,
    allowMarginlessImages,
    isEverboardingInline,
    guide?.formFactorStyle,
    bodyPadding,
    extractedContentPadding,
    horizontalCtasBelowContent,
    inlineContextPadding,
    stepHeightAnimationEnabled,
    isFlat,
    hasControlsBelow,
    isCarousel,
  ]);

  const mainContentSlateOptions = useMemo<SlateRendererOptions>(
    () => ({
      allowMarginlessImages,
      formFactor: guide?.formFactor,
      theme: guide?.theme,
      horizontalMediaAlignment: (guide?.formFactorStyle as CardStyle)
        ?.horizontalMediaAlignment,
    }),
    [
      allowMarginlessImages,
      guide?.formFactor,
      guide?.formFactorStyle,
      guide?.theme,
    ]
  );

  const isStepContentHidden = getShouldCyoaStepHideContent(
    step?.isComplete,
    isSerialCyoa(step?.branching?.type, step?.branching?.multiSelect) &&
      isCyoaGuide
  );

  const cardBgColor: string | undefined = useMemo(() => {
    if (guideStyleBackgroundField === 'backgroundColor') {
      return (guide?.formFactorStyle as CardStyle)?.backgroundColor || 'white';
    }

    if (
      isBoxed &&
      boxCompleteBackgroundColor &&
      step?.isComplete &&
      boxCompleteBackgroundField === 'boxCompleteBackgroundColor'
    )
      return boxCompleteBackgroundColor;

    if (isBordered && borderSeparationBackgroundField === 'backgroundColor')
      return backgroundColor;

    return undefined;
  }, [
    isBoxed,
    isBordered,
    borderSeparationBackgroundField,
    guide?.formFactorStyle,
    guideStyleBackgroundField,
    cardBackgroundColor,
    boxCompleteBackgroundColor,
    boxCompleteBackgroundField,
    step?.isComplete,
    backgroundColor,
  ]);

  const showMoreBgColor = useMemo(() => {
    if (cardBgColor) return cardBgColor;
    if (
      showMoreBackgroundField === 'cardBackgroundColor' &&
      !isTransparent(cardBackgroundColor) &&
      !isActiveGuidesView(view)
    )
      return cardBackgroundColor;

    return backgroundColor;
  }, [
    view,
    cardBgColor,
    showMoreBackgroundField,
    cardBackgroundColor,
    backgroundColor,
  ]);

  const handleSelectedStep = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!selectable) return;
      e.stopPropagation();
      dispatch({
        type: 'stepSelected',
        step: isSelected ? undefined : step?.entityId,
        formFactor,
      });
    },
    [step?.entityId, isSelected, selectable, formFactor]
  );

  const handleStepCompletion = useCallback(
    beforeCompletionHandler((e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (step) {
        // this is inverted because we wanna toggle the state
        const newIsComplete = !step?.isComplete;

        dispatch({
          type: 'stepChanged',
          step: {
            entityId: step.entityId,
            isComplete: newIsComplete,
            state: newIsComplete ? StepState.complete : StepState.incomplete,
          },
        });
      }
    }),
    [step?.entityId, step?.isComplete]
  );

  const updateBodyHeight = useCallbackRef(
    debounce(() => {
      if (bodyEl) {
        let height = bodyEl.clientHeight;
        let heightLimited = false;
        if (!bodyExpanded && stepHeight && height > stepHeight) {
          height = stepHeight;
          heightLimited = true;
        }
        if ((minStepHeight || minHeight) && !fixedStepHeight) {
          height = Math.max(
            Math.max(minHeight || 0, minStepHeight || 0),
            height
          );
        }

        setBodyHeight(height);
        setBodyHeightOverLimit(heightLimited);
      }
    }, 100),
    [
      bodyEl,
      bodyExpanded,
      minStepHeight,
      maxStepHeight,
      ctaPosition,
      minHeight,
      fixedStepHeight,
    ],
    { callOnDepsChange: true }
  );

  const updateStepControlsHeight = useCallbackRef(
    debounce(() => {
      if (stepControlsEl) {
        setStepControlsHeight(stepControlsEl.clientHeight);
      }
    }, 100),
    [stepControlsEl]
  );

  useResizeObserver(updateBodyHeight, { element: bodyEl });
  useResizeObserver(updateStepControlsHeight, { element: stepControlsEl });

  const handleExpandBody = useCallback(() => {
    setBodyExpanded(true);
  }, []);

  useEffect(() => {
    const enabled = !isCyoaGuide && bodyHeightOverLimit;
    const timeout = setTimeout(
      () => setStepHeightAnimationEnabled(enabled),
      enabled ? 500 : 1000
    );
    return () => clearTimeout(timeout);
  }, [bodyHeightOverLimit, isCyoaGuide]);

  useEffect(() => {
    setBodyExpanded(false);
  }, [
    // Add only properties that may change
    // the height of the step body,
    step?.entityId,
    step?.bodySlate,
    step?.branching?.branches?.length,
    step?.inputs?.length,
    step?.isComplete,
    step?.state,
  ]);

  useEffect(() => {
    if (bodyExpanded && !isSelected) {
      // collapse the body of the step now that it's no longer selected
      setBodyExpanded(false);
    }
  }, [isSelected]);

  /**
   * WARNING: The following is only intended to be used to
   * debug a case where the step content wrapper fully disappears.
   * Remove after a few days.
   */
  const getStepBodyStyle = () => {
    const result = {
      fontSize: px(paragraphFontSize),
      lineHeight: px(paragraphLineHeight),
      minHeight: fixedStepHeight || minStepHeight,
      height:
        // WARNING: Setting a bodyHeight that will later change has the potential
        // to cause some cumulative layout shift (CLS), and thats why we're only
        // setting bodyHeight if not falsy here
        (bodyHeight || !isCard) && !isCyoaGuide ? bodyHeight : undefined,
      maxHeight:
        !bodyExpanded &&
        // WARNING: Also needed to prevent CLS while allowing
        // CTAs in Card guides to remain anchored to the bottom
        // of the container, regardless of the fixed step height setting.
        !(isCard && bodyHeight)
          ? fixedStepHeight || maxStepHeight
          : undefined,
      gridGap: px(stepContentGap),
      transition: stepHeightAnimationEnabled ? 'height 1s ease' : undefined,
    };

    return result;
  };

  const stepControls = (
    <div
      className="shrink-0"
      style={{
        width: ctaPosition === StepCTAPosition.bottomRight ? '100%' : 'auto',
      }}
      ref={setStepControlsEl}
    >
      <StepControls
        ctas={ctas}
        formatting={ctaPosition}
        beforeCompletionHandler={beforeCompletionHandler}
        strong={boldCtas}
        fullWidth={fullWidth}
        theme={theme}
        step={step}
        orientation={
          (guide?.formFactorStyle as ChecklistStyle)?.ctasOrientation
        }
      />
    </div>
  );

  const stepBody = (
    <div
      className={cx('flex bento-step-content-wrapper flex-col', {
        grow: isInlineEmbed,
        'h-full': fullHeightStepBody,
        'w-full': isSidebarEmbed,
      })}
    >
      <div
        ref={stepContentRef}
        className={cx(
          'grow',
          'bento-step-content',
          `bento-${THEME_LABELS[
            theme || Theme.nested
          ].toLocaleLowerCase()}-step-content`,
          'flex',
          'flex-col',
          'relative',
          'overflow-x-hidden',
          {
            'overflow-y-hidden': !stepScrolls,
            'overflow-y-auto': stepScrolls && !isCard,
          }
        )}
        style={getStepBodyStyle()}
      >
        <div
          className="flex flex-col"
          style={{
            fontSize: 'inherit',
            color: (guide?.formFactorStyle as CardStyle)?.textColor,
          }}
          ref={setBodyEl}
        >
          {!isStepContentHidden && (
            <SlateContentRenderer
              body={sanitizedStepBody}
              className="w-full"
              spacing={{
                xPadding: bodyPadding?.x,
                lPadding: bodyPadding?.l,
                rPadding: bodyPadding?.r,
                firstNodeMarginTop: bodyPadding?.t || bodyPadding?.y,
              }}
              options={mainContentSlateOptions}
            />
          )}
          {step && isBranchingStep(step.stepType) && (
            <div
              className={cx({
                'mt-6': isInlineRendered && isStepContentHidden,
                'mt-4': !(isInlineRendered && isStepContentHidden),
              })}
              style={{
                paddingLeft: px(bodyPadding?.l || bodyPadding?.x || 0),
                paddingRight: px(bodyPadding?.r || bodyPadding?.x || 0),
                paddingTop: isEmpty ? px(bodyPadding?.t || 0) : undefined,
              }}
            >
              <BranchingOptions step={step} />
            </div>
          )}
          {isInputStep(step?.stepType) && !isStepContentHidden && (
            <div
              className="mt-4"
              style={{
                paddingLeft: px(bodyPadding?.l || bodyPadding?.x || 0),
                paddingRight: px(bodyPadding?.r || bodyPadding?.x || 0),
                paddingTop: isEmpty ? px(bodyPadding?.t || 0) : undefined,
              }}
            >
              <InputFields step={step!} />
            </div>
          )}
          {showMoreBackgroundField && bodyHeightOverLimit && !bodyExpanded && (
            <div
              className="cursor-pointer absolute bottom-0 left-0 w-full text-sm py-2 flex align-center justify-center"
              style={{
                background: `linear-gradient(to top, ${
                  cardBgColor || showMoreBgColor || 'white'
                }, transparent)`,
              }}
              onClick={handleExpandBody}
            >
              <div
                className="bento-show-more-btn py-1 px-3 rounded-full flex align-center justify-center gap-1 shadow backdrop-blur"
                style={{
                  backgroundColor: isTransparent(showMoreBgColor)
                    ? 'rgba(255, 255, 255, 0.3)'
                    : showMoreBgColor || 'white',
                }}
              >
                Show more <ArrowDownward className="w-4 h-4 my-auto" />
              </div>
            </div>
          )}
        </div>
      </div>
      <ResetOnboarding
        className={cx('ml-auto mt-1 mr-4', {
          hidden: !(isSidebarEmbed && isTimeline),
        })}
      />
      {(!isHorizontal || !horizontalCtasBelowContent) && stepControls}
    </div>
  );

  return (
    <StepSeparator
      theme={theme}
      isComplete={!!step?.isComplete}
      entityId={step?.entityId}
      isSelected={!!isSelected}
      enabled={
        separation === SeparationBetween.steps &&
        (isStepView(view) ||
          /**
           * This is needed to make sure that flat guides will continue
           * to have the step separator enabled when their view is transitioned
           * to guide view after a step has been collapsed.
           *
           * @todo find more elegant solution
           */
          isFlat)
      }
      cardColorOverride={cardBgColor}
      sidebarContentWrapperRef={sidebarContentWrapperRef}
    >
      <div className={cx('h-full', { 'flex flex-col': isInlineEmbed })}>
        <StepWrapper
          step={step!}
          setAdditionalHeight={setAdditionalHeight}
          handleSelectedStep={handleSelectedStep}
          handleStepCompletion={handleStepCompletion}
          isSelected={!!isSelected}
          embedFormFactor={embedFormFactor!}
          renderedFormFactor={renderedFormFactor!}
          selectable={selectable}
          extractedNodes={extractedNodes}
          fixedStepHeight={fixedStepHeight}
          imageWidth={imageWidth}
          transition={stepTransition}
          expanded={expanded}
          singleStep={hasOnlyOneStep(guide)}
          multiModule={!combineModules && (guide?.modules?.length || 0) > 1}
          style={guide?.formFactorStyle}
          combineModules={combineModules}
          extractedNodesContainerStyle={extractedNodesContainerStyles}
          allowMarginlessImages={allowMarginlessImages}
        >
          {!isVideoGallery && stepBody}
        </StepWrapper>
        {isHorizontal && horizontalCtasBelowContent && (
          <TransitionWrapper
            transition={stepControlsTransition}
            expanded={expanded}
            key={step?.entityId}
            className="shrink-0"
          >
            {stepControls}
          </TransitionWrapper>
        )}
      </div>
    </StepSeparator>
  );
}

export default composeComponent<OuterProps>([
  withFormFactor,
  withUIState,
  withCustomUIContext,
  withInlineEmbed,
  withMainStoreData<Props, MainStoreData>((state, { formFactor, step }) => {
    const currentGuide =
      selectedGuideForFormFactorSelector(state, formFactor) ||
      guideSelector(step?.guide, state);

    return {
      guide: currentGuide,
      isCyoaGuide: !!currentGuide?.isCyoa,
      dispatch: state.dispatch,
    };
  }),
])(StepBody);
