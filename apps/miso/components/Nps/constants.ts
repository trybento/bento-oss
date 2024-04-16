import {
  NpsEndingType,
  NpsFollowUpQuestionType,
  NpsPageTargetingType,
  NpsStartingType,
  NpsSurveyState,
} from 'bento-common/types/netPromoterScore';
import { DEFAULT_PRIORITY_RANKING } from 'bento-common/utils/constants';
import { defaultCommonTargeting } from 'components/EditorCommon/common';
import { NpsFormValue } from 'types';

export const defaultValues: NpsFormValue['npsSurveyData'] = {
  entityId: '',
  name: '',
  question: '',
  deletedAt: null,
  state: NpsSurveyState.draft,
  fupType: NpsFollowUpQuestionType.none,
  fupSettings: {},
  pageTargeting: { type: NpsPageTargetingType.anyPage },
  startingType: NpsStartingType.manual,
  startAt: null,
  endingType: NpsEndingType.manual,
  endAt: null,
  endAfterTotalAnswers: null,
  targets: defaultCommonTargeting(),
  repeatInterval: null,
  launchedAt: null,
  priorityRanking: DEFAULT_PRIORITY_RANKING,
};
