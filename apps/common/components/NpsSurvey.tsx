import React, { useCallback, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import BuiltWithBento from './BuiltWithBento';
import {
  NpsFollowUpQuestionType,
  NpsSurveyAnswerInput,
} from '../types/netPromoterScore';
import { NpsSurvey } from '../types/globalShoyuState';
import NumberCardsInput from './NumberCardsInput';
import TextInput, { TextInputAs } from './TextInput';

enum NpsSurveyScreens {
  main = 'main',
  followUpQuestion = 'follow-up-question',
  success = 'success',
}

export type NpsSurveyStyles = {
  submitColor: string;
  submitBackgroundColor: string;
};

export type NpsSurveyProps = Pick<
  NpsSurvey,
  'question' | 'fupSettings' | 'fupType' | 'answeredAt'
> & {
  /** Callback func to receive the submitted data */
  onSubmit: (input: NpsSurveyAnswerInput) => void;
  /**
   * Styles used within the component.
   */
  styles: NpsSurveyStyles;
  /**
   * Whether the submit button should be disabled.
   * Useful to lock the button when the data is being sent to the server.
   * @default false
   */
  submitDisabled?: boolean;
  /**
   * Whether to show the success message instead of the input controls.
   * Useful after successfully persisting the answer in the server.
   *
   * @default false
   */
  showSuccess?: boolean;
};

const NpsSurvey: React.FC<NpsSurveyProps> = ({
  question,
  fupSettings,
  fupType,
  styles,
  showSuccess = false,
  submitDisabled = false,
  onSubmit,
}) => {
  const [answer, setAnswer] = useState<number | undefined>(undefined);
  const [fupAnswer, setFupAnswer] = useState<string | null | undefined>(
    undefined
  );

  const [screen, setScreen] = useState(
    showSuccess ? NpsSurveyScreens.success : NpsSurveyScreens.main
  );

  const hasFollowUpQuestion = fupType !== NpsFollowUpQuestionType.none;

  const handleAnswer = useCallback(
    (value: string) => {
      setAnswer(Number(value));
      if (hasFollowUpQuestion) {
        setScreen(NpsSurveyScreens.followUpQuestion);
      }
    },
    [hasFollowUpQuestion]
  );

  const handleFupAnswer = useCallback((text: string) => {
    setFupAnswer(text);
  }, []);

  const handleNavigateBack = useCallback(() => {
    if (screen === NpsSurveyScreens.followUpQuestion) {
      setScreen(NpsSurveyScreens.main);
    }
  }, [screen]);

  /** @todo handle the case of required fup answer */
  const handleSubmit = useCallback(() => {
    if (submitDisabled || !answer) return;
    onSubmit({ answer, fupAnswer });
  }, [answer, fupAnswer]);

  useEffect(() => {
    if (showSuccess) {
      setScreen(NpsSurveyScreens.success);
    }
  }, [showSuccess]);

  /**
   * @todo add specific class name to help with custom CSS
   */
  const SubmitButton = useMemo(() => {
    const disabled = submitDisabled || answer === undefined;
    return (
      <button
        className={cx(
          'flex',
          'justify-center',
          'align-center',
          'focus:opacity-30',
          'focus:outline-none',
          'transition',
          'enabled:cursor-pointer',
          'py-2 px-4',
          'rounded',
          'font-semibold',
          {
            'opacity-60 cursor-not-allowed': disabled,
            'hover:opacity-80': !disabled,
            'cursor-progress': !disabled,
          }
        )}
        style={{
          color: styles.submitColor,
          background: styles.submitBackgroundColor,
        }}
        onClick={handleSubmit}
        disabled={disabled}
      >
        <span>Submit</span>
      </button>
    );
  }, [submitDisabled, answer, handleSubmit]);

  return (
    <div className="bento-nps-survey-wrapper relative">
      {/* Main screen */}
      {screen === NpsSurveyScreens.main && (
        <div className="bento-nps-survey-main-screen">
          <div
            className={cx('flex flex-col gap-2', {
              'pb-4': hasFollowUpQuestion,
              'mb-5': !hasFollowUpQuestion,
            })}
          >
            <div className="bento-input-field-label font-semibold text-sm block">
              {question}
            </div>
            <NumberCardsInput
              name={'survey'}
              max={10}
              min={0}
              onChange={handleAnswer}
              minLabel="Less likely"
              maxLabel="More likely"
              required={false}
              cardColor="#E1ECFF"
              selectedCardColor="#185DDC"
              cardSpacing="space-between"
            />
          </div>

          {!hasFollowUpQuestion && (
            <div className="flex justify-end">{SubmitButton}</div>
          )}
        </div>
      )}

      {/* Follow-up question screen */}
      {screen === NpsSurveyScreens.followUpQuestion && (
        <div className="bento-nps-survey-follow-up-screen">
          {/* Back button */}
          <div
            onClick={handleNavigateBack}
            className="inline-flex mb-4 text-sm hover:opacity-80 cursor-pointer no-underline"
            style={{
              color: styles.submitBackgroundColor,
            }}
          >
            &larr; Back
          </div>
          {/* Question */}
          <div className="flex flex-col gap-2 mb-5">
            <div className="bento-input-field-label font-semibold text-sm block">
              {fupSettings.universalQuestion}
            </div>
            <TextInput
              name="bento-survey-fup-question"
              placeholder={'Optional'}
              maxLength={256}
              onChange={handleFupAnswer}
              required={false}
              as={TextInputAs.textarea}
              inputClassName="rounded-md"
            />
          </div>
          {/* Submit */}
          <div className="flex justify-end">{SubmitButton}</div>
        </div>
      )}

      {/* Success screen */}
      {screen === NpsSurveyScreens.success && (
        <div className="bento-nps-survey-success-screen">
          <div className="w-full text-center text-sm">
            🎉 Your response has been submitted. Thank you for your feedback!
          </div>
        </div>
      )}

      {/* Built with Bento watermark */}
      {!showSuccess && (
        <div className="built-with-bento w-fit absolute m-auto left-0 right-0 bottom-0">
          <BuiltWithBento href="https://www.trybento.co/products/product-feature/nps#enduser" />
        </div>
      )}
    </div>
  );
};

export default NpsSurvey;
