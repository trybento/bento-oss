import { GroupCondition, RuleTypeEnum, TargetingType } from '.';

export enum NpsFormFactor {
  banner = 'banner',
}

/** @todo finish flashing out this type for v1.1 */
export type NpsFormFactorStyle = {};

export enum NpsFollowUpQuestionType {
  /** Wont show a follow-up question */
  none = 'none',
  /** Will show a single follow-up question */
  universal = 'universal',
  /** Will show a follow-up question depending on the score */
  scoreBased = 'score_based',
}

/** @todo finish flashing out this type for v2 */
export type NpsFollowUpQuestionSettings = {
  /** Universal follow-up question */
  universalQuestion?: string;
};

export enum NpsStartingType {
  /** Depends on the admin acting to "pause" it */
  manual = 'manual',
  /** Based on a specific date */
  dateBased = 'date_based',
}

export enum NpsEndingType {
  /** Depends on the admin acting to "pause" it */
  manual = 'manual',
  /** Based on a specific date */
  dateBased = 'date_based',
  /** Based on a specific number of answers being achieved */
  answerBased = 'answer_based',
}

export enum NpsPageTargetingType {
  anyPage = 'any_page',
  specificPage = 'specific_page',
}

export enum NpsSurveyInstanceState {
  /** Actively launching or scheduled to launch */
  active = 'active',
  /** Finished after reaching the ending criteria */
  finished = 'finished',
  /** Manually terminated without reaching the ending criteria */
  terminated = 'terminated',
}

export enum NpsSurveyState {
  /** Not yet launched */
  draft = 'draft',
  /** Was previously launched, but now stopped (paused) */
  stopped = 'stopped',
  /** When launched (already active or scheduled) */
  live = 'live',
}

export type NpsSurveyPageTargeting = {
  /** Page targeting behavior */
  type: NpsPageTargetingType;
  /** Page targeting url, when targeting is set to a specific page */
  url?: string | null;
};

/**
 * WARNING: This currently wont support matching against templates or branching paths.
 *
 * @todo unifying targeting types and logic to support all things everywhere?
 */
export enum NpsSurveyAttributeValueType {
  boolean = 'boolean',
  number = 'number',
  text = 'text',
  date = 'date',
  stringArray = 'stringArray',
}

export type NpsSurveyTargetRule = {
  attribute: string;
  ruleType: RuleTypeEnum;
  valueType: NpsSurveyAttributeValueType;
  value?: number | string | boolean | Date | null | undefined;
};

export type NpsSurveyTarget = {
  type: TargetingType;
  rules: NpsSurveyTargetRule[];
  grouping: GroupCondition;
};

export type NpsSurveyTargets = {
  account: NpsSurveyTarget;
  accountUser: NpsSurveyTarget;
};

/**
 * Input type used to create or update a NPS Survey instance.
 *
 * NOTE: This is currently limited to only the features scoped for the v1.
 *
 * @todo add audience targeting support
 */
export type NpsSurveyInput = {
  /**
   * NPS survey's name
   * @default "DateString:YYYYMMDD" current date in a friendly format
   **/
  name?: string;
  /** The question to be asked */
  question?: string;
  /** Follow-up question-type */
  fupType?: Exclude<
    NpsFollowUpQuestionType,
    NpsFollowUpQuestionType.scoreBased
  >;
  /** Follow-up question settings */
  fupSettings?: NpsFollowUpQuestionSettings;
  /** Page targeting criteria */
  pageTargeting?: NpsSurveyPageTargeting;
  /** Priority ranking amongst Guides and NPS surveys */
  priorityRanking?: number;
  /** Determines the "starting" behavior for the NPS survey */
  startingType?: NpsStartingType;
  /** Determines when the NPS survey should start launching to end-users */
  startAt?: Date | null;
  /** Determines the "ending" behavior for the NPS survey */
  endingType?: NpsEndingType;
  /** Determines when the NPS survey should stop launching to end-users */
  endAt?: Date | null;
  /** Audience targeting criteria */
  targets?: NpsSurveyTargets;
  /** Auto-relaunch survey in this number of days */
  repeatInterval?: number;
};

export type NpsSurveyAnswerInput = {
  answer: number;
  fupAnswer?: string | null;
};
