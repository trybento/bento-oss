import React, { useCallback, useMemo } from 'react';
import composeComponent from 'bento-common/hocs/composeComponent';
import {
  EmbedTypenames,
  NpsSurvey,
  NpsSurveyEntityId,
} from 'bento-common/types/globalShoyuState';

import withMainStoreData from '../stores/mainStore/withMainStore';
import { npsSurveySelector } from '../stores/mainStore/helpers/selectors';
import { NpsFormFactor } from 'bento-common/types/netPromoterScore';
import withSidebarContext from '../hocs/withSidebarContext';
import withLocation, {
  WithLocationPassedProps,
} from 'bento-common/hocs/withLocation';
import withFormFactor from '../hocs/withFormFactor';
import { SidebarProviderValue } from './SidebarProvider';
import { FormFactorContextValue } from './FormFactorProvider';
import { MainStoreState } from '../stores/mainStore/types';
import withAirTrafficState from '../stores/airTrafficStore/withAirTrafficState';
import { surveysToShowSelector } from '../stores/airTrafficStore/helpers/selectors';
import { AirTrafficStore } from '../stores/airTrafficStore/types';

export type NpsSurveyProviderValue = {
  /** Which NPS survey */
  survey: NpsSurvey | undefined;
  answerSurvey: (answer: number, fupAnswer?: string | null) => void;
  dismissSurvey: () => void;
  onSurveyShown: (withJourney: boolean) => void;
  onSurveyHidden: (withJourney: boolean) => void;
};

type OuterProps = React.PropsWithChildren<{}>;

type BeforeAirTrafficStoreDataProps = OuterProps &
  FormFactorContextValue &
  WithLocationPassedProps &
  SidebarProviderValue;

type AirTrafficData = Pick<
  AirTrafficStore,
  'register' | 'startJourney' | 'endJourney' | 'activeJourney'
> & {
  surveysToShow: NpsSurveyEntityId[];
};

type BeforeMainStoreDataProps = BeforeAirTrafficStoreDataProps & AirTrafficData;

type MainStoreData = {
  dispatch: MainStoreState['dispatch'];
  survey: NpsSurvey | undefined;
};

type Props = BeforeMainStoreDataProps & MainStoreData;

export const NpsSurveyContext = React.createContext<NpsSurveyProviderValue>({
  survey: undefined,
  // ...
  answerSurvey: () => {},
  dismissSurvey: () => {},
  onSurveyShown: () => {},
  onSurveyHidden: () => {},
});

/**
 * Provides the core functionally of NPS across all form factors.
 *
 * WARNING: Needs to be used within the FormFactorProvider and SidebarProvider.
 */
const NpsSurveyProvider: React.FC<Props & MainStoreData> = ({
  children,
  survey,
  dispatch,
  startJourney,
  endJourney,
  activeJourney,
}) => {
  /**
   * Records an answer to the NPS survey (incl. follow-up).
   */
  const answerSurvey = useCallback(
    (answer: number, fupAnswer?: string | null) => {
      if (!survey) return;

      dispatch({
        type: 'npsSurveyAnswered',
        entityId: survey.entityId,
        answer,
        fupAnswer,
      });
    },
    [survey]
  );

  /**
   * Records the NPS survey dismissal
   */
  const dismissSurvey = useCallback(() => {
    if (!survey) return;
    dispatch({
      type: 'npsSurveyDismissed',
      entityId: survey.entityId,
    });
  }, [survey]);

  const onSurveyShown = useCallback(
    (withJourney: boolean) => {
      if (!survey) return;

      // record the NPS survey as seen.
      dispatch({
        type: 'npsSurveySeen',
        entityId: survey.entityId,
      });

      if (withJourney && !activeJourney?.entityId) {
        startJourney({
          type: EmbedTypenames.npsSurvey,
          selectedSurvey: survey.entityId,
          selectedPageUrl: window?.location?.href,
        });
      }
    },
    [survey, activeJourney?.entityId]
  );

  /**
   * Callback function responsible for handling the "going away" interaction of an NPS Survey,
   * which mainly consists in ending an associated journey.
   *
   * NOTE: We heavily rely on `survey.firstSeenAt` to determine whether the survey has already
   * been seen by the end-user, otherwise we could preemptively/wrongly end journeys.
   */
  const onSurveyHidden = useCallback(
    (withJourney: boolean) => {
      if (
        // survey is missing
        !survey ||
        // journey has not yet been seen
        !survey?.firstSeenAt ||
        // if we don't wanna affect journeys
        !withJourney
      )
        return;

      endJourney({
        type: EmbedTypenames.npsSurvey,
        selectedSurvey: survey.entityId,
        reason: { dismissSelection: true },
      });
    },
    [survey]
  );

  const value = useMemo<NpsSurveyProviderValue>(
    () => ({
      survey,
      answerSurvey,
      dismissSurvey,
      onSurveyShown,
      onSurveyHidden,
    }),
    [survey]
  );

  return (
    <NpsSurveyContext.Provider value={value}>
      {children}
    </NpsSurveyContext.Provider>
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withLocation,
  withSidebarContext,
  withAirTrafficState<BeforeAirTrafficStoreDataProps, AirTrafficData>(
    (state, _props) => ({
      register: state.register,
      startJourney: state.startJourney,
      endJourney: state.endJourney,
      surveysToShow: surveysToShowSelector(state, NpsFormFactor.banner),
      activeJourney: state.activeJourney,
    })
  ),
  withMainStoreData<BeforeMainStoreDataProps, MainStoreData>(
    (state, { isPreviewFormFactor, surveysToShow }): MainStoreData => {
      /**
       * NOTE: Previewing surveys is currently not supported,
       * therefore we can simply not return any survey if this is a preview session.
       */
      const survey = !isPreviewFormFactor
        ? npsSurveySelector(state, surveysToShow[0])
        : undefined;
      return {
        dispatch: state.dispatch,
        survey,
      };
    }
  ),
])(NpsSurveyProvider);
