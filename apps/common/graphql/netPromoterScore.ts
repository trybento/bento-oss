import { GroupCondition, RuleTypeEnum, TargetingType } from '../types';
import {
  NpsEndingType,
  NpsFollowUpQuestionType,
  NpsFormFactor,
  NpsPageTargetingType,
  NpsStartingType,
  NpsSurveyAttributeValueType,
  NpsSurveyInstanceState,
  NpsSurveyState,
} from '../types/netPromoterScore';
import { enumToGraphqlEnum } from '../utils/graphql';

export const NpsFormFactorEnumType = enumToGraphqlEnum({
  name: 'NpsFormFactorEnumType',
  enumType: NpsFormFactor,
  description: 'Form factor of NPS survey',
});

export const NpsFollowUpQuestionTypeEnumType = enumToGraphqlEnum({
  name: 'NpsFollowUpQuestionTypeEnumType',
  enumType: NpsFollowUpQuestionType,
  description: 'Follow-up question-type of NPS survey',
});

export const NpsStartingTypeEnumType = enumToGraphqlEnum({
  name: 'NpsStartingTypeEnumType',
  enumType: NpsStartingType,
  description: 'Determines the criteria to start the NPS survey',
});

export const NpsEndingTypeEnumType = enumToGraphqlEnum({
  name: 'NpsEndingTypeEnumType',
  enumType: NpsEndingType,
  description: 'Determines the criteria to end the NPS survey',
});

export const NpsPageTargetingTypeEnumType = enumToGraphqlEnum({
  name: 'NpsPageTargetingTypeEnumType',
  enumType: NpsPageTargetingType,
  description: 'Page targeting type of NPS survey',
});

export const NpsSurveyInstanceStateEnumType = enumToGraphqlEnum({
  name: 'NpsSurveyInstanceStateEnumType',
  enumType: NpsSurveyInstanceState,
  description: 'State of NPS survey instance',
});

export const NpsSurveyStateEnumType = enumToGraphqlEnum({
  name: 'NpsSurveyStateEnumType',
  enumType: NpsSurveyState,
  description: 'State of NPS survey',
});

export const NpsSurveyTargetRuleTypeEnumType = enumToGraphqlEnum({
  name: 'NpsSurveyTargetRuleTypeEnumType',
  enumType: RuleTypeEnum,
});

export const AttributeValueTypeEnumType = enumToGraphqlEnum({
  name: 'NpsSurveyAttributeValueTypeEnumType',
  enumType: NpsSurveyAttributeValueType,
});

export const NpsSurveyTargetTypeEnumType = enumToGraphqlEnum({
  name: 'NpsSurveyTargetTypeEnumType',
  enumType: TargetingType,
});

export const NpsSurveyTargetGroupingEnumType = enumToGraphqlEnum({
  name: 'NpsSurveyTargetGroupingEnumType',
  enumType: GroupCondition,
});
