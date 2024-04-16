import React, { useMemo } from 'react';
import cx from 'classnames';
import Tooltip from 'react-tooltip';
import {
  HideOnCompletionData,
  Step,
  StepState,
} from 'bento-common/types/globalShoyuState';
import composeComponent from 'bento-common/hocs/composeComponent';
import { Theme } from 'bento-common/types';
import { COMPLETION_STYLE_CLASSES } from 'bento-common/utils/constants';
import EmojiSpacingFixWrapper from 'bento-common/components/EmojiSpacingFixWrapper';
import {
  getParsedFormFactorStyle,
  getStepSeparationFlags,
} from 'bento-common/data/helpers';
import { isFinishedStep, isSkippedStep } from 'bento-common/utils/steps';

import withMainStoreData from '../../../stores/mainStore/withMainStore';
import {
  selectedStepForFormFactorSelector,
  shouldHideCompleteModuleSelector,
  stepsSelectorOfModule,
} from '../../../stores/mainStore/helpers/selectors';
import {
  getIsToggleCompletionDisabled,
  ModuleCardProps,
} from '../../../lib/guideRenderConfig';
import { MainStoreState } from '../../../stores/mainStore/types';
import { FormFactorContextValue } from '../../../providers/FormFactorProvider';
import withFormFactor from '../../../hocs/withFormFactor';
import StepBody from '../../StepBody';
import StepSeparator from '../../StepSeparator';
import ArrowDown from '../../../icons/downArrow.svg';
import ArrowUp from '../../../icons/upArrow.svg';
import Done from '../../../icons/done.svg';
import { CustomUIProviderValue } from '../../../providers/CustomUIProvider';
import withCustomUIContext from '../../../hocs/withCustomUIContext';
import withUIState from '../../../hocs/withUIState';
import { UIState } from 'bento-common/types/shoyuUIState';
import useDelayedOn from '../../../hooks/useDelayedOn';
import { HIDE_STEP_DELAY_MS } from '../../../constants';

type OuterProps = ModuleCardProps;

type MainStoreData = {
  steps: Step[];
  selectedStep: Step | undefined;
  shouldHideIfComplete: HideOnCompletionData;
  dispatch: MainStoreState['dispatch'];
};

type BeforeMainStoreDataProps = OuterProps &
  Pick<
    FormFactorContextValue,
    'formFactor' | 'renderedFormFactorFlags' | 'embedFormFactorFlags'
  > &
  Pick<
    CustomUIProviderValue,
    | 'primaryColorHex'
    | 'stepCompletionStyle'
    | 'stepSeparationStyle'
    | 'backgroundColor'
  > &
  Pick<UIState, 'showSuccess'>;

type ComposedProps = BeforeMainStoreDataProps & MainStoreData;

const CompactModuleCard: React.FC<ComposedProps> = ({
  guide,
  steps,
  module,
  formFactor,
  singleStep,
  renderedFormFactorFlags: { isSidebar: isSidebarRendered },
  embedFormFactorFlags: { isSidebar: isSidebarEmbed },
  stepSeparationStyle,
  backgroundColor,
  shouldHideIfComplete,
  selectedStep,
  dispatch,
  multiModule,
  showSeparator,
  primaryColorHex,
  stepCompletionStyle,
  sidebarContentWrapperRef,
}) => {
  /**
   * Delayed flag used to allow the fade out animation
   * to finish before fully removing the element from
   * the page.
   */
  const hide = useDelayedOn(
    shouldHideIfComplete.value,
    shouldHideIfComplete.delayed ? HIDE_STEP_DELAY_MS : 0
  );

  const { checklistFormFactorStyle } = useMemo(
    () => getParsedFormFactorStyle(guide?.formFactorStyle),
    [guide?.formFactorStyle]
  );

  const { isBordered } = getStepSeparationFlags(stepSeparationStyle.type);
  const hideStepGroupTitle =
    !isSidebarEmbed && checklistFormFactorStyle?.hideStepGroupTitle;
  const hideCompletedSteps = checklistFormFactorStyle?.hideCompletedSteps;

  const isToggleCompletionDisabledMap = useMemo(
    () =>
      Object.fromEntries(
        steps.map((step) => [
          step.entityId,
          getIsToggleCompletionDisabled(step),
        ])
      ),
    [steps]
  );

  const stepSelectedHandlers = useMemo(
    () =>
      Object.fromEntries(
        steps.map((step) => [
          step.entityId,
          (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            const isSelected = step.entityId === selectedStep?.entityId;

            if (isSelected && singleStep) return;

            dispatch({
              type: 'stepSelected',
              step: isSelected ? undefined : step.entityId,
              formFactor,
            });
          },
        ])
      ),
    [dispatch, steps, selectedStep?.entityId, singleStep]
  );

  const stepCompletionChangedHandlers = useMemo(
    () =>
      Object.fromEntries(
        steps.map((step) => [
          step.entityId,
          (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();

            // this is inverted because we wanna toggle the state
            /** @todo replace by step?.state */
            const newIsComplete = !step?.isComplete;

            dispatch({
              type: 'stepChanged',
              step: {
                entityId: step.entityId,
                isComplete: newIsComplete,
                state: newIsComplete
                  ? StepState.complete
                  : StepState.incomplete,
              },
            });
          },
        ])
      ),
    [dispatch, steps]
  );

  return (
    <div
      className={cx({
        hidden: hide,
        'mb-3 last:mb-0': multiModule && module?.name,
      })}
    >
      {module?.name && multiModule && !hideStepGroupTitle && (
        <div className="text-md mb-3">{module.name}</div>
      )}
      <div className={cx('flex', 'flex-col')}>
        {/* @todo Adds support for flat layouts within `FlatStepListItem` and remove logic from `FlatStep` */}
        {steps.map((step) => {
          const isSelected = step.entityId === selectedStep?.entityId;
          const isComplete = step.isComplete;
          const tipId = `tip-${step.entityId}`;
          const completionTipLabel =
            step.manualCompletionDisabled && !step.isComplete
              ? `This step will automatically complete when you've taken the action`
              : step.isComplete
              ? step.manualCompletionDisabled
                ? null
                : 'Mark as incomplete'
              : 'Mark as complete';
          const Arrow = isSelected ? ArrowUp : ArrowDown;

          return (
            <StepSeparator
              key={step.entityId}
              theme={Theme.compact}
              entityId={step?.entityId}
              isComplete={step.isComplete}
              enabled={showSeparator}
              cardColorOverride={
                isBordered
                  ? backgroundColor
                  : hideCompletedSteps && isFinishedStep(step.state)
                  ? stepSeparationStyle?.boxCompleteBackgroundColor
                  : undefined
              }
              isSelected={isSelected}
              sidebarContentWrapperRef={sidebarContentWrapperRef}
            >
              <div
                className={cx(
                  'grid gap-x-2 pt-4 w-full align-center overflow-x-hidden',
                  { 'gap-y-4': !isSelected, 'gap-y-2': isSelected }
                )}
                style={{
                  gridTemplateColumns: singleStep ? undefined : 'auto 1fr',
                }}
              >
                {!singleStep && (
                  <div
                    className={cx(
                      'bento-onboarding-checklist-checkbox',
                      'rounded-full',
                      'flex',
                      'items-center',
                      'border-2',
                      'w-8 h-8',
                      'py-0 px-1',
                      {
                        'cursor-pointer': !step.manualCompletionDisabled,
                        'hover:opacity-80': isComplete,
                        completed: step.isComplete,
                      }
                    )}
                    style={{
                      ...(!isComplete && { backgroundColor: 'transparent' }),
                      ...(isComplete && { backgroundColor: primaryColorHex }),
                      borderColor: primaryColorHex,
                    }}
                    onClick={
                      isToggleCompletionDisabledMap[step.entityId]
                        ? stepSelectedHandlers[step.entityId]
                        : stepCompletionChangedHandlers[step.entityId]
                    }
                    role="checkbox"
                    aria-checked={isComplete}
                    aria-label="Completion indicator"
                    data-for={tipId}
                    data-tip={completionTipLabel}
                    data-place="right"
                  >
                    <div className={`text-base font-medium m-auto w-full`}>
                      <Done
                        className="w-auto fill-current"
                        style={{
                          color: isComplete ? 'white' : primaryColorHex,
                        }}
                      />
                    </div>
                  </div>
                )}
                <div
                  className={cx('flex', 'items-center', 'truncate', {
                    'cursor-pointer': !singleStep,
                    /**
                     * WARNING: The below is needed to make the step title fill two columns
                     * instead of just one, since wrapper element is creating a 2-column grid.
                     * Should only be aplied for single step modules, which do not contain
                     * the step controls (completion checkbox, open/close).
                     */
                    'col-span-2': singleStep,
                  })}
                  onClick={stepSelectedHandlers[step.entityId]}
                >
                  <div className="flex grow truncate items-center">
                    <h4
                      className={cx(
                        'bento-step-title',
                        'truncate',
                        'font-semibold',
                        'text-xl',
                        {
                          [COMPLETION_STYLE_CLASSES[stepCompletionStyle]]:
                            isComplete,
                        }
                      )}
                      data-for={tipId}
                      data-tip={step.name}
                      data-place="top"
                    >
                      <EmojiSpacingFixWrapper text={step.name || ''} />
                    </h4>
                    {isSkippedStep(step?.state) && (
                      <div className="text-sm italic ml-1">(Skipped)</div>
                    )}
                  </div>
                  {!singleStep && (
                    <Arrow className="w-6 h-6 fill-current my-auto ml-2 shrink-0" />
                  )}
                </div>
                <div
                  className={cx('overflow-y-hidden', {
                    '-mx-4': isSidebarEmbed && isSidebarRendered,
                    'col-span-2': isSidebarRendered,
                  })}
                  style={{
                    gridColumn: isSidebarRendered || singleStep ? undefined : 2,
                  }}
                >
                  <StepBody
                    step={step}
                    isSelected={isSelected}
                    theme={Theme.compact}
                  />
                </div>
              </div>
              <Tooltip id={tipId} delayShow={500} className="toggle-tooltip" />
            </StepSeparator>
          );
        })}
      </div>
    </div>
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withCustomUIContext,
  withUIState,
  withMainStoreData<BeforeMainStoreDataProps, MainStoreData>(
    (state, { module, formFactor, showSuccess }) => {
      return {
        steps: stepsSelectorOfModule(module?.entityId, state),
        shouldHideIfComplete: shouldHideCompleteModuleSelector(
          state,
          module?.entityId,
          showSuccess
        ),
        selectedStep: selectedStepForFormFactorSelector(state, formFactor),
        dispatch: state.dispatch,
      };
    }
  ),
])(CompactModuleCard);
