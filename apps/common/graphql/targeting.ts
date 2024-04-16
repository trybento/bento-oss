import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLScalarType,
  GraphQLString,
} from 'graphql';
import { RuleTypeEnum, TargetValueType } from '../types';
import { enumToGraphqlEnum } from '../utils/graphql';
import EntityIdType from './EntityId';

export const TargetAttributeRuleRuleTypeEnumType = enumToGraphqlEnum({
  name: 'TargetAttributeRuleRuleTypeEnumType',
  enumType: RuleTypeEnum,
});

export const AttributeValueType = enumToGraphqlEnum({
  name: 'AttributeValueType',
  enumType: TargetValueType,
});

const MAX_INT = 2147483647;
const MIN_INT = -2147483648;
const coerceIntString = (value) => {
  if (Array.isArray(value)) {
    if (value.every((v) => typeof v === 'string')) {
      return value;
    }
    throw new TypeError(
      `TargetAttributeRuleValue cannot represent an array value: [${String(
        value
      )}]`
    );
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (Number.isInteger(value)) {
    if (value < MIN_INT || value > MAX_INT) {
      throw new TypeError(
        `Value is integer but outside of valid range for 32-bit signed integer: ${String(
          value
        )}`
      );
    }
    return value;
  }
  if (typeof value !== 'string') {
    throw new TypeError(
      `'Value must be either boolean, integer or string: ${String(value)}`
    );
  }
  return String(value);
};

const TargetAttributeRuleValueType = new GraphQLScalarType({
  name: 'TargetAttributeRuleFields',
  serialize: coerceIntString,
  parseValue: coerceIntString,
});

export const TargetAttributeRuleFields = {
  attribute: {
    type: new GraphQLNonNull(GraphQLString),
  },
  ruleType: {
    type: new GraphQLNonNull(TargetAttributeRuleRuleTypeEnumType),
  },
  valueType: {
    type: new GraphQLNonNull(AttributeValueType),
  },
  value: {
    type: new GraphQLNonNull(TargetAttributeRuleValueType),
  },
};

export const TargetAttributeRuleInputFields = {
  attribute: {
    type: new GraphQLNonNull(GraphQLString),
  },
  ruleType: {
    type: new GraphQLNonNull(TargetAttributeRuleRuleTypeEnumType),
  },
  valueType: {
    type: new GraphQLNonNull(AttributeValueType),
  },
  numberValue: {
    type: GraphQLInt,
  },
  textValue: {
    type: GraphQLString,
  },
  textValues: {
    type: new GraphQLList(GraphQLString),
  },
  booleanValue: {
    type: GraphQLBoolean,
  },
  dateValue: {
    type: GraphQLString,
  },
  templateValue: {
    type: EntityIdType,
  },
  branchingPathValue: {
    type: GraphQLString,
  },
};
