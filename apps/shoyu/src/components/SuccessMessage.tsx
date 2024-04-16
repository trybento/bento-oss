import React, { useCallback, useEffect, useState } from 'react';
import cx from 'classnames';
import { StepType } from 'bento-common/types';
import { FormFactorStateKey, Step } from 'bento-common/types/globalShoyuState';
import composeComponent from 'bento-common/hocs/composeComponent';
import usePrevious from 'bento-common/hooks/usePrevious';
import { isCompleteStep, isIncompleteStep } from 'bento-common/utils/steps';

import withCustomUIContext from '../hocs/withCustomUIContext';
import { CustomUIProviderValue } from '../providers/CustomUIProvider';
import { StepAction } from '../../types/global';
import { FormFactorContextValue } from '../providers/FormFactorProvider';
import withFormFactor from '../hocs/withFormFactor';
import withUIState from '../hocs/withUIState';
import { UIStateContextValue } from '../providers/UIStateProvider';

type OuterProps = { step?: Step; formFactor: FormFactorStateKey };

type Props = OuterProps &
  Pick<CustomUIProviderValue, 'cardBackgroundColor' | 'fontColorHex'> &
  Pick<UIStateContextValue, 'showSuccess'> &
  Pick<FormFactorContextValue, 'formFactor'>;

type SuccessMessageContainerProps = Props;

type SuccessText = {
  topMessage?: string;
  bottomMessage?: string;
  emoji?: string;
};

const messages: Record<StepType, Record<StepAction, SuccessText | null>> = {
  [StepType.required]: {
    [StepAction.Completion]: {
      topMessage: 'Step complete',
      bottomMessage: 'Awesome Job!',
      emoji: '🎉',
    },
    [StepAction.Skipped]: {
      bottomMessage: 'Come back later, because this step is required.',
    },
  },
  [StepType.optional]: {
    [StepAction.Completion]: {
      topMessage: 'Nice job',
      bottomMessage: "Let's keep going",
    },
    [StepAction.Skipped]: null,
  },
  [StepType.fyi]: {
    [StepAction.Completion]: { bottomMessage: "Let's keep going" },
    [StepAction.Skipped]: null,
  },
  [StepType.input]: {
    [StepAction.Completion]: { bottomMessage: 'Got it!' },
    [StepAction.Skipped]: null,
  },
  [StepType.branching]: {
    [StepAction.Completion]: { bottomMessage: 'Updating your guide' },
    [StepAction.Skipped]: null,
  },
  [StepType.branchingOptional]: {
    [StepAction.Completion]: { bottomMessage: 'Updating your guide' },
    [StepAction.Skipped]: null,
  },
};

/** Shows step success states */
const SuccessMessage: React.FC<SuccessMessageContainerProps> = ({
  cardBackgroundColor,
  fontColorHex,
  step,
  showSuccess: showSuccessBanner,
}) => {
  const prevStep = usePrevious(step);
  const [message, setMessage] = useState<SuccessText | null>(null);

  useEffect(() => {
    if (!message && step) {
      const actionTaken =
        step &&
        step.entityId === prevStep?.entityId &&
        step.state !== prevStep.state &&
        !isIncompleteStep(step.state)
          ? isCompleteStep(step.state)
            ? StepAction.Completion
            : StepAction.Skipped
          : null;
      if (actionTaken) {
        setMessage(messages[step.stepType][actionTaken]);
      }
    }
  }, [step]);

  const dismissMessage = useCallback(() => {
    setTimeout(() => {
      setMessage(null);
    }, 900);
  }, []);

  if (!message || showSuccessBanner) {
    return null;
  }
  const { topMessage, bottomMessage, emoji } = message;

  return (
    <div
      className="top-0 left-0 bg-transparent absolute w-full h-full backdrop-blur z-10"
      onAnimationEnd={dismissMessage}
      style={{ animation: 'fadeIn 1s' }}
    >
      <div
        className="w-full h-full opacity-70"
        style={{
          backgroundColor: cardBackgroundColor || 'white',
        }}
      ></div>
      <div
        className={cx(
          'flex flex-col h-full w-full justify-center items-center absolute top-0 left-0',
          {
            'text-current': fontColorHex,
            'text-gray-900': !fontColorHex,
          }
        )}
      >
        {emoji && <div className="text-xl">{emoji}</div>}
        {topMessage && (
          <div className="text-lg font-semibold">{topMessage}</div>
        )}
        {bottomMessage && <div className="text-sm">{bottomMessage}</div>}
      </div>
    </div>
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withCustomUIContext,
  withUIState,
])(SuccessMessage);
