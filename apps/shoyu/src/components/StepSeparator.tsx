import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cx from 'classnames';
import { createPortal } from 'react-dom';

import composeComponent from 'bento-common/hocs/composeComponent';
import {
  ActiveStepShadow,
  FormFactorStyle,
  InlineContextualShadow,
  MediaOrientation,
  StepBodyOrientation,
  Theme,
} from 'bento-common/types';
import {
  getGuideThemeFlags,
  getParsedFormFactorStyle,
  getStepSeparationFlags,
  isCompactTheme,
  isFinishedGuide,
  isFlatTheme,
  THEME_LABELS,
} from 'bento-common/data/helpers';
import { isTransparent } from 'bento-common/utils/color';
import { debounce, isNil } from 'bento-common/utils/lodash';
import { isInlineContextualGuide } from 'bento-common/utils/formFactor';
import {
  isElementVisible,
  OBSERVE_TARGET_ELEMENT_ONLY,
} from 'bento-common/utils/dom';
import useDomObserver from 'bento-common/hooks/useDomObserver';
import useElementVisibility from 'bento-common/hooks/useElementVisibility';
import { STANDARD_SHADOW } from 'bento-common/frontend/styles';

import withFormFactor from '../hocs/withFormFactor';
import withCustomUIContext from '../hocs/withCustomUIContext';
import { CustomUIProviderValue } from '../providers/CustomUIProvider';
import { FormFactorContextValue } from '../providers/FormFactorProvider';
import withMainStoreData from '../stores/mainStore/withMainStore';
import {
  lastSerialCyoaInfoSelector,
  selectedGuideForFormFactorSelector,
  selectedModuleForFormFactorSelector,
  shouldHideCompleteStepSelector,
} from '../stores/mainStore/helpers/selectors';
import ArrowDownward from '../icons/arrowDownward.svg';
import { WithSidebarContentWrapperRef } from '../../types/global';
import useCallbackRef from 'bento-common/hooks/useCallbackRef';
import { throttleWithExtraCall } from 'bento-common/utils/functions';
import {
  Guide,
  HideOnCompletionData,
  StepEntityId,
} from 'bento-common/types/globalShoyuState';
import withUIState from '../hocs/withUIState';
import { UIState } from 'bento-common/types/shoyuUIState';
import {
  HIDE_STEP_BACKGROUND_DURATION,
  HIDE_STEP_DELAY_MS,
  HIDE_STEP_FADE_DURATION,
} from '../constants';

type OuterProps = {
  theme: Theme;
  isComplete?: boolean;
  entityId: StepEntityId | undefined;
  isSelected?: boolean;
  enabled: boolean;
  cardColorOverride?: string;
} & React.HTMLProps<HTMLDivElement> &
  WithSidebarContentWrapperRef;

type BeforeMainStoreDataProps = OuterProps &
  Pick<
    FormFactorContextValue,
    'formFactor' | 'renderedFormFactorFlags' | 'embedFormFactorFlags'
  > &
  Pick<
    CustomUIProviderValue,
    | 'cardBackgroundColor'
    | 'borderColor'
    | 'stepSeparationStyle'
    | 'inlineContextualStyle'
    | 'primaryColorHex'
  > &
  Pick<UIState, 'showSuccess'>;

type MainStoreData = {
  isCyoaGuide: boolean;
  finishedGuide: boolean;
  shouldHideIfComplete: HideOnCompletionData;
  formFactorStyle: FormFactorStyle | undefined;
};

type ComposedProps = BeforeMainStoreDataProps & MainStoreData;

/**
 * Used to animate the hiding of steps
 * since animations need to happen strictly in
 * an order not possible to achieve purely with CSS.
 */
const collapseAndHideStep = (element: HTMLElement) => {
  setTimeout(() => {
    const sectionHeight = element.scrollHeight;
    element.style.transition = '';

    requestAnimationFrame(() => {
      element.style.height = sectionHeight + 'px';
      element.style.transition = `opacity ${HIDE_STEP_FADE_DURATION}ms ease-in-out ${HIDE_STEP_BACKGROUND_DURATION}ms, height ${HIDE_STEP_FADE_DURATION}ms ease-in-out ${HIDE_STEP_BACKGROUND_DURATION}ms`;

      requestAnimationFrame(() => {
        element.style.overflowY = 'hidden';
        element.style.height = 0 + 'px';
        element.style.opacity = '0';
        setTimeout(() => {
          element.style.display = 'none';
        }, HIDE_STEP_DELAY_MS);
      });
    });
  }, HIDE_STEP_BACKGROUND_DURATION);
};

const StepSeparator: React.FC<ComposedProps> = ({
  children,
  theme,
  shouldHideIfComplete,
  isCyoaGuide,
  isComplete = false,
  isSelected = false,
  renderedFormFactorFlags: { isInline, isSidebar },
  embedFormFactorFlags: { isSidebar: isSidebarEmbed, isInline: isInlineEmbed },
  borderColor,
  inlineContextualStyle,
  cardBackgroundColor,
  stepSeparationStyle,
  cardColorOverride,
  primaryColorHex,
  enabled,
  className,
  formFactorStyle,
  style,
  onClick,
  sidebarContentWrapperRef,
}) => {
  const { cardFormFactorStyle, checklistFormFactorStyle } = useMemo(
    () => getParsedFormFactorStyle(formFactorStyle),
    [formFactorStyle]
  );
  const stepSeparatorClass = useMemo(
    () =>
      `bento-step-component-${(THEME_LABELS[theme] || '')
        .toLowerCase()
        .replace(' ', '-')}`,
    [theme]
  );

  /**
   * A ref to be passed down to the active step separator.
   * This is used to allow scrolling that step into view whenever necessary.
   */
  const stepSeparatorRef = useRef<HTMLDivElement>(null);

  /**
   * Track whether this component should mount
   * hidden without animations.
   */
  const [initiallyHidden] = useState<boolean>(shouldHideIfComplete.value);

  useEffect(() => {
    if (
      shouldHideIfComplete.value &&
      stepSeparatorRef?.current &&
      !initiallyHidden
    ) {
      collapseAndHideStep(stepSeparatorRef.current);
    }
  }, [shouldHideIfComplete.value]);

  /**
   * A ref to the active step anchor, if exists.
   * This is used to determine in which direction the active step really is, relative to the anchor.
   */
  const activeStepAnchorRef = useRef<HTMLDivElement>(null);

  /**
   * When starting, we just assume the step is going to be visible to avoid
   * showing the "active step" anchor without reason.
   */
  const [isStepVisible, setIsStepVisible] = useState<boolean>(true);

  /**
   * When starting, we just assume the step is going to be visible to avoid
   * showing the "active step" anchor without reason.
   */
  const [anchorDirection, setAnchorDirection] = useState<
    'upward' | 'downward' | undefined
  >(undefined);

  /**
   * Whether we should show the "active step" anchor to assist users trying to go back
   * to the context they previously were.
   *
   * NOTE: This is most useful after a page redirect.
   */
  const canShowActiveStepAnchor = useMemo(
    () =>
      isSidebarEmbed &&
      !shouldHideIfComplete.value &&
      isSelected &&
      (isCompactTheme(theme) || isFlatTheme(theme)) &&
      !isStepVisible,
    [
      isSelected,
      theme,
      isSidebarEmbed,
      isStepVisible,
      shouldHideIfComplete.value,
    ]
  );

  /**
   * Re-compute and update the step visibility state relative to the viewport.
   */
  const updateStepVisibility = useCallback(
    debounce(() => {
      setIsStepVisible(isElementVisible(stepSeparatorRef.current));
    }, 100),
    []
  );

  /**
   * Re-compute and update anchor direction of the "active step".
   */
  const updateAnchorDirection = useCallbackRef(
    throttleWithExtraCall(
      () => {
        if (
          !canShowActiveStepAnchor ||
          !sidebarContentWrapperRef?.current ||
          !stepSeparatorRef.current ||
          !activeStepAnchorRef.current
        ) {
          return setAnchorDirection(undefined);
        }
        const { y: activeStepY } =
          stepSeparatorRef.current?.getBoundingClientRect() || { y: 0 };
        const { y: anchorY } =
          activeStepAnchorRef.current?.getBoundingClientRect() || { y: 0 };
        setAnchorDirection(activeStepY <= anchorY ? 'upward' : 'downward');
      },
      {
        throttleArgs: [100, { leading: true, trailing: false }],
        extraDelay: 100,
      }
    ),
    [canShowActiveStepAnchor],
    { callOnDepsChange: false }
  );

  /**
   * Observes DOM changes of the target element to update its visibility state internally.
   */
  useDomObserver(updateStepVisibility, {
    disabled: !isSelected,
    element: stepSeparatorRef.current,
    observerOpts: OBSERVE_TARGET_ELEMENT_ONLY,
  });

  /**
   * Observes the element visibility and updates internally.
   */
  useElementVisibility(
    isSelected ? stepSeparatorRef.current : null,
    () => void setIsStepVisible(true),
    () => void setIsStepVisible(false),
    {
      // at least 40% of the step container needs to be visible
      threshold: 0.4,
    }
  );

  /**
   * Scroll the active step into view.
   */
  const handleActiveStepClick = useCallback(
    (_event: React.MouseEvent<HTMLDivElement>) => {
      stepSeparatorRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
      });
    },
    []
  );

  /**
   * Observers scrolling into the parent element of the portal in order
   * to update the anchor reference as timely as possible.
   */
  useLayoutEffect(() => {
    const refElement = sidebarContentWrapperRef?.current;
    refElement?.addEventListener('scroll', updateAnchorDirection);
    return () => {
      refElement?.removeEventListener('scroll', updateAnchorDirection);
    };
  }, [sidebarContentWrapperRef?.current]);

  if (!enabled) return <>{children}</>;

  const stepBodyOrientation = isInlineEmbed
    ? checklistFormFactorStyle?.stepBodyOrientation
    : StepBodyOrientation.vertical;

  const isLeftOriented =
    checklistFormFactorStyle?.mediaOrientation === MediaOrientation.Left;

  const {
    isNested,
    isFlat,
    isCompact,
    isTimeline,
    isCarousel,
    isVideoGallery,
  } = getGuideThemeFlags(theme);
  const { isBoxed, isBordered } = getStepSeparationFlags(
    stepSeparationStyle.type
  );
  const isInlineContextual = isInlineContextualGuide(theme);
  const isShadowed =
    stepSeparationStyle.boxActiveStepShadow === ActiveStepShadow.standard;

  const inlineContextualBorderColor =
    cardFormFactorStyle?.borderColor ||
    inlineContextualStyle.borderColor ||
    '#00000000';

  return (
    <>
      {canShowActiveStepAnchor &&
        sidebarContentWrapperRef?.current &&
        createPortal(
          <>
            {/* "Active step" anchor button */}
            <div
              ref={activeStepAnchorRef}
              className={cx(
                'cursor-pointer',
                'absolute',
                'bottom-0',
                'inset-x-0',
                'mx-auto',
                'w-fit',
                'text-sm',
                'py-2'
              )}
              onClick={handleActiveStepClick}
            >
              <div
                className="bento-active-step-btn py-1 px-3 rounded-full flex align-center justify-center gap-1 shadow text-white"
                style={{
                  backgroundColor: primaryColorHex,
                }}
              >
                Active step{' '}
                <ArrowDownward
                  className={cx('w-4', 'h-4', 'my-auto', {
                    'rotate-180': anchorDirection === 'upward',
                  })}
                />
              </div>
            </div>
          </>,
          sidebarContentWrapperRef.current,
          'active-step-anchor-nav'
        )}
      <div
        ref={stepSeparatorRef}
        className={cx(stepSeparatorClass, className, {
          // Applies to multiple themes
          border: isBoxed && !isCyoaGuide,
          'hover:shadow-sm':
            ((((isNested && !isSelected) ||
              (isTimeline && isInline && !isSelected)) &&
              isBoxed &&
              isShadowed) ||
              (isFlat && isBoxed && isShadowed)) &&
            !isCyoaGuide,
          'shadow-md hover:shadow-md':
            ((isNested && isSelected) ||
              (isTimeline && (isSidebar || isSelected))) &&
            isBoxed &&
            isShadowed &&
            !isCyoaGuide,
          'pl-4': isInlineEmbed && (isFlat || isTimeline) && !isCyoaGuide,
          'border-b-2':
            (isNested || isTimeline || isInlineContextual) && isBordered,
          'p-4': (isNested && isSidebar) || (isTimeline && isSidebarEmbed),
          'px-4':
            ((isFlat && isBoxed && (isSidebarEmbed || isLeftOriented)) ||
              (isTimeline && isInlineEmbed && isSidebar) ||
              (isCompact && isBoxed)) &&
            !isCyoaGuide,
          'overflow-hidden':
            isInlineContextual ||
            (isFlat && stepBodyOrientation === StepBodyOrientation.horizontal),
          relative: isCarousel || isVideoGallery,
          hidden: initiallyHidden,

          // Nested specific
          'transition overflow-hidden': isNested,

          // Flat specific
          'opacity-80': isFlat && isComplete,
          'shadow-sm':
            isFlat && isBoxed && isShadowed && isSelected && !isCyoaGuide,
          'border-b last:border-b-0': isFlat && isBordered,
          'transition-[background] ease-in-out duration-300':
            isFlat || isCompact,

          // Compact specific
          'border-t': isCompact && isBordered,
          'mb-3 last:mb-0': isCompact && isBoxed,

          // Timeline specific
          'pt-4': isTimeline && isInlineEmbed,
        })}
        style={{
          borderColor: isInlineContextual
            ? inlineContextualBorderColor
            : borderColor,
          borderWidth: isInlineContextual
            ? isTransparent(inlineContextualBorderColor)
              ? '0px'
              : '1px'
            : undefined,
          backgroundColor: isCyoaGuide
            ? undefined
            : cardColorOverride || cardBackgroundColor,
          borderRadius: isInlineContextual
            ? isNil(cardFormFactorStyle?.borderRadius)
              ? inlineContextualStyle.borderRadius
              : cardFormFactorStyle?.borderRadius
            : isBoxed
            ? stepSeparationStyle.boxBorderRadius
            : undefined,
          ...(isInlineContextual &&
            !isCyoaGuide &&
            inlineContextualStyle.shadow ===
              InlineContextualShadow.standard && {
              boxShadow: STANDARD_SHADOW,
              borderWidth: 0,
            }),
          ...style,
        }}
        onClick={onClick}
      >
        {children}
      </div>
    </>
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withCustomUIContext,
  withUIState,
  withMainStoreData<BeforeMainStoreDataProps, MainStoreData>(
    (state, { formFactor, entityId, showSuccess }) => {
      const guide: Guide | undefined =
        selectedGuideForFormFactorSelector(state, formFactor) ||
        lastSerialCyoaInfoSelector(state, formFactor).guide;

      return {
        selectedModule: selectedModuleForFormFactorSelector(state, formFactor),
        isCyoaGuide: !!guide?.isCyoa,
        finishedGuide: isFinishedGuide(guide),
        shouldHideIfComplete: shouldHideCompleteStepSelector(
          state,
          entityId,
          showSuccess
        ),
        formFactorStyle: guide?.formFactorStyle,
      };
    }
  ),
])(StepSeparator);
