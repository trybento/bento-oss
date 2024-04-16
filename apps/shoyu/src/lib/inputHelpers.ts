import isEmail from 'is-email';
import { StepInputFieldType } from 'bento-common/types';
import { Step, StepInput } from 'bento-common/types/globalShoyuState';
import { isValidDate } from 'bento-common/utils/dates';

const isAnswerLengthExceeded = (
  answer: string | null,
  maxValue: number | undefined
) => answer && maxValue && answer.length >= maxValue;

export const NO_MESSAGE_INPUT_ERROR = '--';

/** Returns error message if input is invalid */
export const validateInput = (input: StepInput): string => {
  if (!input) return '';
  const { type, answer, settings } = input;

  switch (type) {
    case StepInputFieldType.date:
      return answer && isValidDate(answer) ? '' : NO_MESSAGE_INPUT_ERROR;
    case StepInputFieldType.text:
    case StepInputFieldType.paragraph: {
      return isAnswerLengthExceeded(answer, settings?.maxValue)
        ? `Maximum of ${settings?.maxValue} characters allowed`
        : '';
    }
    case StepInputFieldType.email: {
      if (isAnswerLengthExceeded(answer, settings?.maxValue))
        return `Maximum of ${settings?.maxValue} characters allowed`;
      /** TODO: Delete is-email and consolidate validation library with miso */
      return answer && !isEmail(answer) ? 'Please provide a valid email' : '';
    }
    default: {
      return '';
    }
  }
};

export const getAreInputsAnswered = (step: Step | undefined): boolean =>
  step?.inputs?.length
    ? step.inputs.every(
        (input) =>
          (input.settings?.required
            ? input.answer !== null &&
              input.answer !== undefined &&
              input.answer !== ''
            : true) && !validateInput(input)
      )
    : true;
