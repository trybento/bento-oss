import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { LongRuleTypeEnum } from 'bento-common/types';

import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import { entityIdField } from 'bento-common/graphql/EntityId';
import StepEventMappingType from 'src/graphql/StepEventMapping/StepEventMapping.graphql';
import { StepEventMappingRule } from 'src/data/models/StepEventMappingRule.model';
import { GraphQLContext } from 'src/graphql/types';

export const ValueType = new GraphQLEnumType({
  name: 'StepEventMappingRuleValueType',
  values: {
    boolean: {
      value: 'boolean',
    },
    text: {
      value: 'text',
    },
    number: {
      value: 'number',
    },
    date: {
      value: 'date',
    },
  },
});

export const RuleType = new GraphQLEnumType({
  name: 'StepEventMappingRuleRuleType',
  values: {
    lt: {
      value: LongRuleTypeEnum.lt,
    },
    lte: {
      value: LongRuleTypeEnum.lte,
    },
    eq: {
      value: LongRuleTypeEnum.equals,
    },
    gte: {
      value: LongRuleTypeEnum.gte,
    },
    gt: {
      value: LongRuleTypeEnum.gt,
    },
  },
});

const StepEventMappingRuleType = new GraphQLObjectType<
  StepEventMappingRule,
  GraphQLContext
>({
  name: 'StepEventMappingRule',
  description: 'A prototype of a step that can be added to an account guide',
  fields: () => ({
    ...globalEntityId('StepEventMappingRule'),
    ...entityIdField(),
    propertyName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    stepEventMappingRule: {
      type: new GraphQLNonNull(StepEventMappingType),
      resolve: (stepEventMappingRule, _, { loaders }) =>
        stepEventMappingRule.stepEventMappingId &&
        loaders.stepEventMappingLoader.load(
          stepEventMappingRule.stepEventMappingId
        ),
    },
    valueType: {
      type: new GraphQLNonNull(ValueType),
    },
    ruleType: {
      type: new GraphQLNonNull(RuleType),
    },
    numberValue: {
      type: GraphQLInt,
    },
    textValue: {
      type: GraphQLString,
    },
    booleanValue: {
      type: GraphQLBoolean,
    },
    dateValue: {
      type: GraphQLDateTime,
    },
  }),
});

export default StepEventMappingRuleType;
