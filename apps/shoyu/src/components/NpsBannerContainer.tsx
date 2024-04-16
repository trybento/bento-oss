import React, { useCallback, useEffect, useState } from 'react';
import composeComponent from 'bento-common/hocs/composeComponent';
import {
  NpsFormFactor,
  NpsSurveyAnswerInput,
} from 'bento-common/types/netPromoterScore';
import { BannerPosition, BannerTypeEnum } from 'bento-common/types';
import {
  isFinishedSurvey,
  isIncompleteSurvey,
} from 'bento-common/data/helpers';
import Banner from 'bento-common/components/Banner';
import NpsSurvey from 'bento-common/components/NpsSurvey';

import withMainStoreData from '../stores/mainStore/withMainStore';
import withCustomUIContext from '../hocs/withCustomUIContext';
import withFormFactor from '../hocs/withFormFactor';
import withNpsSurveyContext from '../hocs/withNpsSurveyContext';
import useVisibilityExposure from '../hooks/useVisibilityExposure';
import { CustomUIProviderValue } from '../providers/CustomUIProvider';
import { NpsSurveyProviderValue } from '../providers/NpsSurveyProvider';
import { BANNER_Z_INDEX } from '../lib/constants';

type OuterProps = {
  /**
   * Target container element to which apply the margin necessary for "inline" banners.
   * Mostly used for previews.
   */
  containerEl: HTMLElement | null;
};

type BeforeMainStoreDataProps = OuterProps &
  CustomUIProviderValue &
  NpsSurveyProviderValue;

type MainStoreData = Pick<
  NpsSurveyProviderValue,
  | 'survey'
  | 'answerSurvey'
  | 'dismissSurvey'
  | 'onSurveyShown'
  | 'onSurveyHidden'
>;

type NpsBannerContainerProps = BeforeMainStoreDataProps & MainStoreData;

const NpsBannerContainer: React.FC<NpsBannerContainerProps> = (
  {
    containerEl,
    primaryColorHex,
    fontColorHex,
    bannersStyle,
    survey,
    answerSurvey,
    dismissSurvey,
    onSurveyShown,
    onSurveyHidden,
  },
  _ref: React.Ref<HTMLDivElement>
) => {
  /**
   * Determines whether the banner is supposed to show.
   */
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenAnswered, setHasBeenAnswered] = useState(false);

  /**
   * This only actually dismisses the survey if still incomplete.
   * This is needed because the banner can still be dismissed after seeing the success message.
   */
  const handleDismiss = useCallback(() => {
    setIsOpen(false);
    if (isIncompleteSurvey(survey) && !hasBeenAnswered) {
      dismissSurvey();
    }
  }, [dismissSurvey, survey, hasBeenAnswered]);

  /**
   * Records the answers.
   *
   * Toggling the visibility state will result in calling the `onSurveyHidden` callback fn,
   * which should then automatically end the journey on NpsSurveyProvider.
   */
  const handleAnswer = useCallback(
    (input: NpsSurveyAnswerInput) => {
      setHasBeenAnswered(true);
      answerSurvey(input.answer, input.fupAnswer);
      // only toggles visibility state after 2s to allow showing the success message
      window.setTimeout(() => setIsOpen(false), 2000);
    },
    [answerSurvey, survey]
  );

  useEffect(() => {
    if (survey) {
      // toggle visibility of the banner
      const isOpen = !isFinishedSurvey(survey);
      setIsOpen(isOpen);
    }
  }, [survey?.entityId]);

  const isContentVisible = !!survey && isOpen;

  useVisibilityExposure({
    visible: isContentVisible,
    component: NpsFormFactor.banner,
    onChange: (visible: boolean) => {
      if (visible) onSurveyShown(true);
    },
  });

  useEffect(() => {
    if (!isContentVisible) onSurveyHidden(true);
    return () => void onSurveyHidden(true);
  }, [isContentVisible]);

  if (!survey) return null;

  return (
    <Banner
      containerEl={containerEl}
      display={BannerTypeEnum.floating}
      isOpen={isOpen}
      onDismiss={handleDismiss}
      placement={BannerPosition.bottom}
      styles={{
        bgColor: '#F5F9FF',
        textColor: fontColorHex || '#2E0B34',
        ...bannersStyle,
      }}
      zIndex={BANNER_Z_INDEX}
    >
      <div className="my-auto flex-auto">
        <NpsSurvey
          question={survey.question}
          fupSettings={survey.fupSettings}
          fupType={survey.fupType}
          answeredAt={survey.answeredAt}
          onSubmit={handleAnswer}
          styles={{
            submitColor: '#FFFFFF',
            submitBackgroundColor: primaryColorHex,
          }}
          showSuccess={hasBeenAnswered}
        />
      </div>
    </Banner>
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withCustomUIContext,
  withNpsSurveyContext,
  withMainStoreData<BeforeMainStoreDataProps, MainStoreData>(
    (
      _state,
      { survey, answerSurvey, dismissSurvey, onSurveyShown, onSurveyHidden }
    ): MainStoreData => ({
      answerSurvey,
      dismissSurvey,
      onSurveyShown,
      onSurveyHidden,
      survey,
    })
  ),
])(NpsBannerContainer);
