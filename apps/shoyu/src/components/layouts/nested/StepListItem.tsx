import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Tooltip from 'react-tooltip';
import cx from 'classnames';
import { isRequiredInputStep } from 'bento-common/data/helpers';
import { Step, StepState } from 'bento-common/types/globalShoyuState';
import composeComponent from 'bento-common/hocs/composeComponent';
import { COMPLETION_STYLE_CLASSES } from 'bento-common/utils/constants';
import EmojiSpacingFixWrapper from 'bento-common/components/EmojiSpacingFixWrapper';
import { isSkippedStep } from 'bento-common/utils/steps';

import { CustomUIProviderValue } from '../../../providers/CustomUIProvider';
import ShuffleIcon from '../../../icons/shuffle.svg';
import { isBranching, isRequired } from '../../../lib/helpers';
import withCustomUIContext from '../../../hocs/withCustomUIContext';
import {
  withMainStoreDispatch,
  WithMainStoreDispatchData,
} from '../../../stores/mainStore/withMainStore';
import { getIsToggleCompletionDisabled } from '../../../lib/guideRenderConfig';
import { FormFactorContextValue } from '../../../providers/FormFactorProvider';
import withFormFactor from '../../../hocs/withFormFactor';

type OuterProps = {
  step?: Step;
  isSelected?: boolean;
  isModuleComplete?: boolean;
  onSelect: () => void;
  isNext?: boolean;
};

type Props = OuterProps &
  Pick<
    CustomUIProviderValue,
    'primaryColorHex' | 'fontColorHex' | 'stepCompletionStyle'
  > &
  Pick<FormFactorContextValue, 'renderedFormFactorFlags'>;

type StepProps = Props & WithMainStoreDispatchData;

const NestedStepListItem: React.FC<StepProps> = ({
  isModuleComplete,
  onSelect,
  isSelected,
  renderedFormFactorFlags: { isSidebar },
  step = {} as Step,
  dispatch,
  primaryColorHex,
  fontColorHex,
  isNext,
  stepCompletionStyle,
}) => {
  const stepCheckbox = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const isToggleCompletionDisabled = useMemo(
    () => getIsToggleCompletionDisabled(step),
    [step]
  );

  const handleToggleCompletion = useCallback(
    async (e: React.MouseEvent) => {
      // Branching completion is allowed only for reset.
      if (isToggleCompletionDisabled) return;

      // Allow event to propagate, aka, select the step.
      e.preventDefault();
      e.stopPropagation();

      const newIsComplete = isBranching(step.stepType)
        ? false
        : !step.isComplete;

      dispatch({
        type: 'stepChanged',
        step: {
          entityId: step.entityId,
          isComplete: newIsComplete,
          state: newIsComplete ? StepState.complete : StepState.incomplete,
        } as Step,
      });
    },
    [
      step.isComplete,
      step.entityId,
      step.stepType,
      isToggleCompletionDisabled,
      dispatch,
    ]
  );

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const stopPropagation = useCallback(
    (e: React.MouseEvent) =>
      isToggleCompletionDisabled ? null : e.stopPropagation(),
    [isToggleCompletionDisabled]
  );

  useEffect(() => {
    if (stepCheckbox.current) {
      if (isSkippedStep(step.state) && !step.isComplete) {
        stepCheckbox.current.indeterminate = true;
      } else if (step.state !== StepState.skipped) {
        stepCheckbox.current.indeterminate = false;
      }
    }
  }, [step.isComplete, step.state]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      onSelect();
    },
    [onSelect]
  );

  const showSkippedState = isSkippedStep(step.state);

  const checkboxTooltipMsg = useMemo(() => {
    if (showSkippedState) return 'Previously skipped';
    if (step.manualCompletionDisabled && !step.isComplete)
      return `This step will automatically complete when you've taken the action`;

    return undefined;
  }, [showSkippedState, step]);

  if (!step) return null;

  return (
    <div
      key={step.entityId}
      className="flex cursor-pointer items-center"
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      onMouseLeave={handleMouseLeave}
      style={{
        borderColor: isHovered || isSelected ? primaryColorHex : 'transparent',
      }}
    >
      <div className="py-3.5 pl-2 flex items-center truncate">
        <div
          className={cx('mr-2', 'relative', {
            'opacity-70': isToggleCompletionDisabled,
          })}
          style={{
            color: primaryColorHex,
          }}
          onClick={stopPropagation}
        >
          {isBranching(step.stepType) &&
          !step.isComplete &&
          !showSkippedState ? (
            <ShuffleIcon style={{ width: '20px' }} />
          ) : (
            <input
              type="checkbox"
              className={cx(
                'bento-step-checkbox form-checkbox text-current bg-transparent rounded-sm',
                { completed: step.isComplete }
              )}
              style={{
                minWidth: '18px',
                minHeight: '18px',
                color: showSkippedState ? '#ddd' : undefined,
                borderColor:
                  step.isComplete || showSkippedState ? '' : 'inherit',
              }}
              readOnly
              checked={step.isComplete}
              ref={stepCheckbox}
            />
          )}

          <div
            className={cx(
              'absolute',
              'w-12',
              'h-12',
              'm-auto',
              'top-0',
              'bottom-0',
              '-right-4',
              'cursor-pointer'
            )}
            onClick={handleToggleCompletion}
            data-tip={checkboxTooltipMsg}
            data-delay-show="500"
            data-arrow-color="transparent"
            data-class="toggle-tooltip"
            data-place="right"
            data-offset="{ 'top': 30 }"
          />
        </div>

        <span
          data-tip={step.name}
          data-delay-show="500"
          data-arrow-color="transparent"
          data-place="top"
          data-multiline
          data-class="toggle-tooltip"
          className={cx(
            'bento-step-title',
            'relative',
            'whitespace-nowrap',
            'truncate',
            'text-sm',
            'font-medium',
            'transition',
            {
              [COMPLETION_STYLE_CLASSES[stepCompletionStyle]]: step.isComplete,
              'opacity-60': isHovered,
              'text-current':
                !isModuleComplete && !step.isComplete && fontColorHex,
            }
          )}
        >
          <EmojiSpacingFixWrapper text={step.name} />
          {(isRequired(step.stepType) ||
            isRequiredInputStep(step.stepType, step.inputs)) &&
            '*'}
        </span>
      </div>
      <Tooltip />
      <div className="ml-auto">
        {isSidebar && isNext && (
          <button
            className={`
              relative
              fade-before-20-card
              rounded
              whitespace-nowrap
              ${isHovered ? 'opacity-80' : ''}
              px-2
              font-semibold
              text-sm
              transition
              h-8
              text-white
              `}
            style={{ backgroundColor: primaryColorHex, width: '109px' }}
          >
            Get started
          </button>
        )}
      </div>
    </div>
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withCustomUIContext,
  withMainStoreDispatch,
])(NestedStepListItem);
