import {
  array,
  boolean,
  date,
  Describe,
  dynamic,
  enums,
  literal,
  nullable,
  number,
  object,
  optional,
  string,
  Struct,
  type,
  union,
} from 'superstruct';
import { $enum } from 'ts-enum-util';
import {
  NpsEndingType,
  NpsFollowUpQuestionType,
  NpsSurveyInput,
  NpsPageTargetingType,
  NpsFollowUpQuestionSettings,
  NpsSurveyPageTargeting,
  NpsStartingType,
  NpsSurveyTarget,
  NpsSurveyTargetRule,
  NpsSurveyTargets,
  NpsSurveyAttributeValueType,
} from 'bento-common/types/netPromoterScore';
import {
  GroupCondition,
  RankableObject,
  RankableType,
  RuleTypeEnum,
  TargetingType,
} from 'bento-common/types';

const npsSurveyFupSettingsSchema: Describe<NpsFollowUpQuestionSettings> =
  object({
    universalQuestion: optional(string()),
  });

/**
 * @todo strictly validate the URL field
 */
const npsSurveyPageTargetingSchema: Describe<NpsSurveyPageTargeting> = object({
  type: enums($enum(NpsPageTargetingType).getValues()),
  url: dynamic((_value, context) => {
    switch (context.branch[context.branch.length - 1]?.type) {
      case NpsPageTargetingType.specificPage:
        return string() as Struct<any, any>; // casted to not fail the describe

      default:
        return optional(nullable(string()));
    }
  }),
});

const npsSurveyTargetRuleSchema: Describe<NpsSurveyTargetRule> = object({
  attribute: string(),
  ruleType: enums($enum(RuleTypeEnum).getValues()),
  valueType: enums($enum(NpsSurveyAttributeValueType).getValues()),
  value: union([
    number(),
    string(),
    boolean(),
    date(),
    literal(null),
    literal(undefined),
  ]),
});

const npsSurveyTargetSchema: Describe<NpsSurveyTarget> = object({
  type: enums($enum(TargetingType).getValues()),
  grouping: enums($enum(GroupCondition).getValues()),
  rules: array(npsSurveyTargetRuleSchema),
});

const npsSurveyTargetsSchema: Describe<NpsSurveyTargets> = object({
  account: npsSurveyTargetSchema,
  accountUser: npsSurveyTargetSchema,
});

export const npsSurveyCreateOrUpdateSchema: Describe<NpsSurveyInput> = type({
  name: optional(string()),
  question: optional(string()),
  fupType: optional(
    enums([NpsFollowUpQuestionType.none, NpsFollowUpQuestionType.universal])
  ),
  fupSettings: optional(npsSurveyFupSettingsSchema),
  pageTargeting: optional(npsSurveyPageTargetingSchema),
  priorityRanking: optional(number()),
  startingType: optional(enums($enum(NpsStartingType).getValues())),
  startAt: optional(nullable(date())),
  endingType: optional(enums($enum(NpsEndingType).getValues())),
  endAt: optional(nullable(date())),
  targets: optional(npsSurveyTargetsSchema),
});

const priorityRankingSetSchema: Describe<RankableObject> = type({
  entityId: string(),
  priorityRanking: number(),
  type: enums($enum(RankableType).getValues()),
});

export const priorityRankingsSetSchema: Describe<{
  priorityRankings: RankableObject[];
}> = type({
  priorityRankings: array(priorityRankingSetSchema),
});
