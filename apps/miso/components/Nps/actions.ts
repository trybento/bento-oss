import { FormikHelpers } from 'formik';
import omit from 'lodash/omit';
import { MainFormKeys } from 'helpers/constants';
import { LaunchOrPauseNpsSurveyResponse, NpsFormValue } from 'types';
import {
  NpsEndingType,
  NpsFollowUpQuestionType,
  NpsPageTargetingType,
  NpsStartingType,
} from 'bento-common/types/netPromoterScore';
import * as EditNpsSurveyMutation from 'mutations/EditNpsSurvey';
import * as LaunchNpsSurveyMutation from 'mutations/LaunchNpsSurvey';
import * as PauseNpsSurveyMutation from 'mutations/PauseNpsSurvey';
import { CommonTargeting } from 'bento-common/types/targeting';
import { commonTargetingToMutationArgs } from 'components/EditorCommon/targeting.helpers';
import { EditNpsSurveyMutation$variables } from 'relay-types/EditNpsSurveyMutation.graphql';
import {
  GenericPriorityFormValues,
  sanitizePriorityRankingsInput,
} from 'components/Templates/Tabs/PriorityRankingForm/helpers';

/** Main form submit handler. */
export const formSubmit = async (values: NpsFormValue) => {
  const ommitted = omit(values.npsSurveyData, [
    'deletedAt',
    'state',
    'launchedAt',
  ] as (keyof typeof values.npsSurveyData)[]) as NpsFormValue['npsSurveyData'];

  const sanitizedInput = {
    npsSurveyData: {
      ...ommitted,
      targets: commonTargetingToMutationArgs(values.npsSurveyData.targets, {
        forceUnifiedValue: true,
      }),
    },
    priorityRankings: sanitizePriorityRankingsInput(values.priorityRankings),
  } as unknown as EditNpsSurveyMutation$variables['input'];

  await EditNpsSurveyMutation.commit(sanitizedInput);
  return;
};

export const launchOrPauseSurvey = async ({
  npsSurveyData,
}: NpsFormValue): Promise<LaunchOrPauseNpsSurveyResponse> => {
  const { entityId, launchedAt } = npsSurveyData;

  const npsSurvey = launchedAt
    ? (await PauseNpsSurveyMutation.commit({ entityId }))?.pauseNpsSurvey
        ?.npsSurvey
    : (await LaunchNpsSurveyMutation.commit({ entityId }))?.launchNpsSurvey
        ?.npsSurvey;

  return npsSurvey as LaunchOrPauseNpsSurveyResponse;
};

const actionsFactory = (
  setFieldValue: FormikHelpers<NpsFormValue>['setFieldValue']
) => {
  const setterFactory =
    <T>(key: string) =>
    (value: T) => {
      setFieldValue(`${MainFormKeys.nps}.${key}`, value);
    };

  const nameChange = setterFactory<string>('name');

  const questionChange = setterFactory<string>('question');

  const fupTypeChange = setterFactory<NpsFollowUpQuestionType>('fupType');

  const fupQuestionChange = setterFactory<string>(
    'fupSettings.universalQuestion'
  );

  const pageTargetingTypeChange =
    setterFactory<NpsPageTargetingType>('pageTargeting.type');

  const pageTargetingUrlChange = setterFactory<string | null>(
    'pageTargeting.url'
  );

  const startingTypeChange = setterFactory<NpsStartingType>('startingType');
  const endingTypeChange = setterFactory<NpsEndingType>('endingType');
  const startAtChange = setterFactory<string | null>('startAt');
  const endAtChange = setterFactory<string | null>('endAt');
  const endAfterTotalAnswersChange = setterFactory<number>(
    'endAfterTotalAnswers'
  );
  const repeatIntervalChanged = setterFactory<number | null>('repeatInterval');
  const targetsChanged = setterFactory<CommonTargeting>('targets');

  const priorityRankingsChanged = (newRanks: GenericPriorityFormValues) => {
    setFieldValue('priorityRankings', newRanks);
  };

  return {
    nameChange,
    questionChange,
    fupTypeChange,
    fupQuestionChange,
    pageTargetingTypeChange,
    pageTargetingUrlChange,
    startingTypeChange,
    startAtChange,
    endingTypeChange,
    endAtChange,
    endAfterTotalAnswersChange,
    repeatIntervalChanged,
    priorityRankingsChanged,
    targetsChanged,
  };
};

export type NpsActions = ReturnType<typeof actionsFactory>;

export const defaultNpsActions: NpsActions = actionsFactory((..._args) => {});

export default actionsFactory;
