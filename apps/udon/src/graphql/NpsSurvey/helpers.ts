import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLScalarType,
  GraphQLString,
} from 'graphql';
import {
  AttributeValueTypeEnumType,
  NpsEndingTypeEnumType,
  NpsFollowUpQuestionTypeEnumType,
  NpsPageTargetingTypeEnumType,
  NpsStartingTypeEnumType,
  NpsSurveyTargetGroupingEnumType,
  NpsSurveyTargetRuleTypeEnumType,
  NpsSurveyTargetTypeEnumType,
} from 'bento-common/graphql/netPromoterScore';
import { GraphQLDateTime } from 'graphql-iso-date';
import { InputFieldConfigMap } from 'bento-common/types/graphql';
import { isBoolean, isDate, isFinite, isString } from 'lodash';
import { isValid } from 'date-fns';
import GraphQLJSON from 'graphql-type-json';

export const NpsSurveyPageTargetingInputType = new GraphQLInputObjectType({
  name: 'NpsSurveyPageTargetingInputType',
  description: 'Determines the page targeting criteria of a NPS survey',
  fields: {
    type: {
      type: NpsPageTargetingTypeEnumType,
    },
    url: {
      type: GraphQLString,
    },
  },
});

/** @todo extract serializer/parser to allow unit testing */
const NpsSurveyTargetValueScalarType = new GraphQLScalarType({
  name: 'NpsSurveyTargetValue',
  description:
    'Represent all possible values of a target rule (number, string, boolean, date, null or undefined)',
  serialize(value) {
    if (isFinite(value)) return value;
    if (isString(value)) return value;
    if (isBoolean(value)) return value;
    if (isDate(value)) return value.toISOString();
    if (value === null || value === undefined) return value;

    throw Error(
      `NpsSurveyTargetValue Scalar serializer expected either a number, string, boolean, Date, null or undefined, but received: ${value}`
    );
  },
  parseValue(value) {
    if (isFinite(value)) return value;
    if (isString(value)) return value;
    if (isBoolean(value)) return value;
    if (isValid(value)) return new Date(value);
    if (value === null || value === undefined) return value;

    throw Error(
      `NpsSurveyTargetValue Scalar parser expected either a number, string, boolean, Date, null or undefined, but received: ${value}`
    );
  },
});

export const NpsSurveyTargetRuleInputType = new GraphQLInputObjectType({
  name: 'NpsSurveyTargetRuleInputType',
  description: 'Determines the audience targeting criteria of a NPS survey',
  fields: {
    attribute: {
      type: new GraphQLNonNull(GraphQLString),
    },
    ruleType: {
      type: new GraphQLNonNull(NpsSurveyTargetRuleTypeEnumType),
    },
    valueType: {
      type: new GraphQLNonNull(AttributeValueTypeEnumType),
    },
    value: {
      type: new GraphQLNonNull(NpsSurveyTargetValueScalarType),
    },
  },
});

export const NpsSurveyTargetInputType = new GraphQLInputObjectType({
  name: 'NpsSurveyTargetInputType',
  description: 'Determines a given target criteria',
  fields: {
    type: {
      type: new GraphQLNonNull(NpsSurveyTargetTypeEnumType),
    },
    rules: {
      type: new GraphQLNonNull(new GraphQLList(NpsSurveyTargetRuleInputType)),
    },
    grouping: {
      type: new GraphQLNonNull(NpsSurveyTargetGroupingEnumType),
    },
  },
});

export const NpsSurveyTargetsInputType = new GraphQLInputObjectType({
  name: 'NpsSurveyTargetsInputType',
  description: 'Determines the audience targeting criteria',
  fields: {
    account: {
      type: new GraphQLNonNull(NpsSurveyTargetInputType),
    },
    accountUser: {
      type: new GraphQLNonNull(NpsSurveyTargetInputType),
    },
  },
});

export const npsSurveyInputFields: InputFieldConfigMap = {
  name: {
    type: GraphQLString,
  },
  question: {
    type: GraphQLString,
  },
  fupType: {
    type: NpsFollowUpQuestionTypeEnumType,
  },
  fupSettings: {
    type: GraphQLJSON,
  },
  pageTargeting: {
    type: NpsSurveyPageTargetingInputType,
  },
  priorityRanking: {
    type: GraphQLInt,
  },
  startingType: {
    type: NpsStartingTypeEnumType,
  },
  startAt: {
    type: GraphQLDateTime,
  },
  endingType: {
    type: NpsEndingTypeEnumType,
  },
  endAt: {
    type: GraphQLDateTime,
  },
  endAfterTotalAnswers: {
    type: GraphQLInt,
  },
  repeatInterval: {
    type: GraphQLInt,
  },
  targets: {
    type: NpsSurveyTargetsInputType,
  },
};
