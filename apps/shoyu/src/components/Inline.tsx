import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { px } from 'bento-common/utils/dom';
import {
  isActiveGuidesView,
  isGuideView,
  isStepView,
  isTicketView,
} from 'bento-common/frontend/shoyuStateHelpers';
import { Guide, Module, Step } from 'bento-common/types/globalShoyuState';
import composeComponent from 'bento-common/hocs/composeComponent';
import { EmbedFormFactor, Theme, Timeout } from 'bento-common/types';
import { getGuideThemeFlags } from 'bento-common/data/helpers';
import { COMPLETION_STYLE_CLASSES } from 'bento-common/utils/constants';
import EmojiSpacingFixWrapper from 'bento-common/components/EmojiSpacingFixWrapper';
import { InlineEmptyBehaviour } from 'bento-common/types/shoyuUIState';
import { isSkippedStep } from 'bento-common/utils/steps';

import withCustomUIContext from '../hocs/withCustomUIContext';
import { CustomUIProviderValue } from '../providers/CustomUIProvider';
import GuideDescription from './GuideDescription';
import { UIStateContextValue } from '../providers/UIStateProvider';
import withUIState from '../hocs/withUIState';
import { FormFactorContextValue } from '../providers/FormFactorProvider';
import withMainStoreData from '../stores/mainStore/withMainStore';
import {
  lastSerialCyoaInfoSelector,
  formFactorGuidesSelector,
  incompleteOnboardingGuideSelector,
  selectedGuideForFormFactorSelector,
  selectedModuleForFormFactorSelector,
  selectedStepForFormFactorSelector,
  wasInlineContextualGuideDismissedSelector,
  SerialCyoaInfo,
} from '../stores/mainStore/helpers/selectors';
import SeeAllGuides, { SeeAllGuidesAction } from './SeeAllGuides';
import { getRenderConfig } from '../lib/guideRenderConfig';
import TransitionWrapper from './TransitionWrapper';
import StepBody from './StepBody';
import ModulesList from './ModulesList';
import ActiveGuides from './ActiveGuides';
import withFormFactor from '../hocs/withFormFactor';
import withInlineEmbed from '../hocs/withIlnineEmbed';
import { InlineEmbedContextValue } from '../providers/InlineEmbedProvider';
import { StepTransition } from '../../types/global';
import SuccessMessage from './SuccessMessage';
import { SUCCESS_DELAY_MS } from '../lib/constants';
import SuccessBanner from './SuccessBanner';
import ResetOnboarding from './ResetOnboarding';
import TicketForm from './TicketForm';
import { isSidebarInjectedAsInline } from 'bento-common/utils/formFactor';

type OuterProps = { theme: Theme; style?: CSSProperties };

type Props = OuterProps &
  Pick<FormFactorContextValue, 'formFactor'> &
  Pick<
    CustomUIProviderValue,
    | 'paragraphFontSize'
    | 'paragraphLineHeight'
    | 'primaryColorHex'
    | 'backgroundColor'
    | 'fontColorHex'
    | 'stepCompletionStyle'
    | 'inlineEmptyBehaviour'
  > &
  Pick<UIStateContextValue, 'view' | 'uiActions'> &
  Pick<InlineEmbedContextValue, 'isEverboardingInline'>;

type MainStoreData = {
  guide: Guide | undefined;
  module: Module | undefined;
  step: Step | undefined;
  hasGuides: boolean;
  hasOnboardingGuidesAvailable: boolean;
  wasContextualDismissed: boolean;
  serialCyoaData: SerialCyoaInfo | undefined;
};

export type InlineComponentProps = Props & MainStoreData;

export const InlineComponent: React.FC<InlineComponentProps> = ({
  guide,
  module,
  step,
  hasGuides,
  view,
  backgroundColor,
  wasContextualDismissed,
  fontColorHex,
  theme,
  style = {},
  stepCompletionStyle,
  hasOnboardingGuidesAvailable,
  inlineEmptyBehaviour,
  serialCyoaData,
  isEverboardingInline,
  formFactor,
}) => {
  const {
    stepTransition,
    moduleTransition,
    bodyPadding,
    skipModuleViewIfOnlyOne,
    combineModules,
    showSuccessOnStepComplete,
  } = getRenderConfig({
    theme,
    embedFormFactor: EmbedFormFactor.inline,
    renderedFormFactor: EmbedFormFactor.inline,
    isCyoaGuide: guide?.isCyoa,
    view,
    stepType: step?.stepType,
  });

  const hideTimeout = useRef<Timeout>();
  const [shouldHide, setShouldHide] = useState<boolean>(true);
  const { isNested, isVideoGallery, isTimeline } = getGuideThemeFlags(theme);
  const isEverboardingInlineFinished: boolean =
    isEverboardingInline &&
    !!(wasContextualDismissed || guide?.isComplete || guide?.isDone);
  // Video gallery handles step selection differently.
  const stepBodyKey = isVideoGallery
    ? undefined
    : `${theme}-step-${step?.entityId}`;

  const seeAllGuidesAction = !isNested
    ? SeeAllGuidesAction.back
    : SeeAllGuidesAction.showActiveGuides;

  useEffect(() => {
    clearTimeout(hideTimeout.current);

    /**
     * Should hide the inline when ALL conditions below are satisfied:
     *
     * - Empty behavior is set to hide
     * - There is no incomplete onboarding guides
     * - There is no incomplete and reachable branching paths
     * - Serial CYOA guide was dismissed.
     * - The guide is not a preview, inline contextual guide
     *   or sidebar contextual guide set to be inline.
     */
    const hide =
      !isEverboardingInline &&
      !isSidebarInjectedAsInline(
        theme,
        guide?.isSideQuest,
        guide?.formFactor
      ) &&
      !guide?.isPreview &&
      inlineEmptyBehaviour === InlineEmptyBehaviour.hide &&
      !hasOnboardingGuidesAvailable &&
      serialCyoaData?.isFinished;

    if (hide) {
      hideTimeout.current = setTimeout(() => {
        setShouldHide(true);
      }, SUCCESS_DELAY_MS);
    } else {
      setShouldHide(false);
    }
  }, [
    [
      isEverboardingInline,
      hasOnboardingGuidesAvailable,
      inlineEmptyBehaviour,
      serialCyoaData?.isFinished,
    ],
  ]);

  if (!hasGuides || shouldHide || isEverboardingInlineFinished) return null;

  return (
    <div
      className={cx('flex flex-col relative', {
        // Allows shadow to render properly.
        'overflow-x-hidden': !isEverboardingInline,
      })}
      style={{
        color: fontColorHex || undefined,
        backgroundColor: isEverboardingInline
          ? undefined
          : backgroundColor || undefined,
        ...style,
      }}
    >
      {isGuideView(view) ||
        (isStepView(view) && (
          // show the success banner on top of the completed guide
          <SuccessBanner renderingStyle="overlay" />
        ))}
      {isTicketView(view) ? (
        <TicketForm />
      ) : isActiveGuidesView(view) ? (
        <ActiveGuides />
      ) : // if the module transition is not set to slide then all the steps
      // should be viewable in the guide view so it should just stay there
      (isGuideView(view) || moduleTransition !== StepTransition.slide) &&
        ((!combineModules && (guide?.modules?.length || 0) > 1) ||
          !skipModuleViewIfOnlyOne) ? (
        <TransitionWrapper
          transition={
            moduleTransition === StepTransition.slide
              ? moduleTransition
              : StepTransition.none
          }
        >
          <div
            className={cx({ grid: !isEverboardingInline })}
            style={{
              gridTemplateColumns: 'auto 1fr',
            }}
          >
            {!isEverboardingInline && (
              <>
                <div
                  className="flex bento-guide-title font-semibold text-2xl"
                  style={{ gridColumn: 2 }}
                >
                  <EmojiSpacingFixWrapper text={guide?.name} />
                  <ResetOnboarding className="ml-auto" />
                </div>
                <div
                  className={cx('self-center justify-self-center')}
                  style={{ gridColumn: 1, gridRow: 1 }}
                >
                  <SeeAllGuides action={seeAllGuidesAction} />
                </div>
                {!guide?.isCyoa && !isEverboardingInline && (
                  <>
                    <div style={{ gridColumn: 2 }}>
                      <GuideDescription guide={guide!} />
                    </div>
                  </>
                )}
              </>
            )}
            <div className="relative" style={{ gridColumn: 2 }}>
              {guide?.isCyoa ? (
                <>
                  <StepBody step={step} theme={guide.theme} isSelected />
                  {showSuccessOnStepComplete && (
                    <SuccessMessage formFactor={formFactor} step={step} />
                  )}
                </>
              ) : (
                <ModulesList theme={theme} />
              )}
            </div>
          </div>
        </TransitionWrapper>
      ) : (
        <>
          {!isEverboardingInline && (
            <TransitionWrapper transition={stepTransition}>
              <div
                className="flex items-center justify-start pb-3"
                style={{
                  paddingLeft: px(bodyPadding?.l || bodyPadding?.x || 0),
                  paddingRight: px(bodyPadding?.r || bodyPadding?.x || 0),
                }}
              >
                {/* Arrow back */}
                {!guide?.isCyoa && <SeeAllGuides action={seeAllGuidesAction} />}
                {/* Module and step titles */}
                <div className="flex flex-col">
                  {module?.name && isNested && (
                    <div className="truncate text-base">
                      <EmojiSpacingFixWrapper text={module?.name || ''} />
                    </div>
                  )}
                  <div className="bento-step-title flex gap-2 items-center">
                    <div
                      className={cx('font-semibold text-2xl', {
                        [COMPLETION_STYLE_CLASSES[stepCompletionStyle]]:
                          step?.isComplete,
                      })}
                    >
                      <EmojiSpacingFixWrapper text={step?.name || ''} />
                    </div>
                    {isSkippedStep(step?.state) && (
                      <div className="text-base italic">(Skipped)</div>
                    )}
                  </div>
                </div>
                {isTimeline && <ResetOnboarding className="ml-auto" />}
              </div>
            </TransitionWrapper>
          )}
          <StepBody key={stepBodyKey} step={step} theme={theme} isSelected />
        </>
      )}
    </div>
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withCustomUIContext,
  withUIState,
  withInlineEmbed,
  withMainStoreData<Props, MainStoreData>((state, { formFactor }) => {
    const guide = selectedGuideForFormFactorSelector(state, formFactor);
    return {
      guide,
      wasContextualDismissed: wasInlineContextualGuideDismissedSelector(
        state,
        guide?.entityId
      ),
      module: selectedModuleForFormFactorSelector(state, formFactor),
      step: selectedStepForFormFactorSelector(state, formFactor),
      hasGuides: formFactorGuidesSelector(state, formFactor).length > 0,
      hasOnboardingGuidesAvailable: !!incompleteOnboardingGuideSelector(
        state,
        formFactor
      ),
      serialCyoaData: lastSerialCyoaInfoSelector(state, formFactor),
    };
  }),
])(InlineComponent);
