import {
  GraphQLEnumType,
  GraphQLScalarType,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { enumToGraphqlEnum } from 'bento-common/utils/graphql';
import {
  StepType,
  VisualBuilderSessionType,
  WebhookType,
  VisualBuilderSessionState,
} from 'bento-common/types';
import { IntegrationState } from 'bento-common/types/integrations';
import { WebhookState } from 'src/data/models/Integrations/Webhook.model';
import { EventHookType } from 'src/interactions/webhooks/webhook.types';
import { isBoolean, isDate, isFinite, isString } from 'lodash';
import { isValid } from 'date-fns';
import {
  RuleTypeEnum,
  TargetingType,
  TargetValueType,
} from 'bento-common/types/targeting';

export const StepTypeEnumType = enumToGraphqlEnum({
  name: 'StepTypeEnum',
  enumType: StepType,
  description: 'What kind of step this is. e.g. required, optional',
});

/**
 * @deprecated Tag "state" is deprecated.
 */
export const TagStateEnumType = new GraphQLEnumType({
  name: 'TagStateEnum',
  description: 'Tag state',
  values: {
    draft: { value: 'draft' },
    active: { value: 'active' },
    published: { value: 'published' },
  },
});

export const BranchingEntityEnumType = new GraphQLEnumType({
  name: 'BranchingEntityTypeEnum',
  description: 'Branching Entity Type',
  values: {
    template: { value: 'template' },
    guide: { value: 'guide' },
    module: { value: 'module' },
  },
});

export const BranchingFormFactorEnumType = new GraphQLEnumType({
  name: 'BranchingFormFactorEnumType',
  description: 'How branching will be displayed on the embeddable',
  values: {
    dropdown: { value: 'dropdown' },
    cards: { value: 'cards' },
  },
});

export const WebhookStateTypeEnum = enumToGraphqlEnum({
  name: 'WebhookStateTypeEnum',
  enumType: WebhookState,
});

export const WebhookTypeTypeEnum = enumToGraphqlEnum({
  name: 'WebhookTypeTypeEnum',
  enumType: WebhookType,
});

export const IntegrationStateEnum = enumToGraphqlEnum({
  name: 'IntegrationStateEnum',
  enumType: IntegrationState,
});

export const WebhookTypeEnum = enumToGraphqlEnum({
  name: 'EventHookTypeEnum',
  enumType: EventHookType,
  description: 'Type of event to listen for',
});

const serializeTargetValue = (value: any) => {
  if (isFinite(value)) return value;
  if (isString(value)) return value;
  if (isBoolean(value)) return value;
  if (isDate(value)) return value.toISOString();
  if (value === null || value === undefined) return value;

  throw Error(
    `TargetValueScalarType Scalar serializer expected either a number, string, boolean, Date, null or undefined, but received: ${value}`
  );
};

const parseTargetValue = (value: any) => {
  if (isFinite(value)) return value;
  if (isString(value)) return value;
  if (isBoolean(value)) return value;
  if (isValid(value)) return new Date(value);
  if (value === null || value === undefined) return value;

  throw Error(
    `TargetValueScalarType Scalar parser expected either a number, string, boolean, Date, null or undefined, but received: ${value}`
  );
};

export const TargetValueScalarType = new GraphQLScalarType({
  name: 'TargetValueScalarType',
  description:
    'Represent all possible values of a target rule (number, string, boolean, date, null or undefined)',
  serialize(value) {
    if (Array.isArray(value)) {
      return value.map((item) => serializeTargetValue(item));
    }

    return serializeTargetValue(value);
  },
  parseValue(value) {
    if (Array.isArray(value)) {
      return value.map((item) => parseTargetValue(item));
    }

    return parseTargetValue(value);
  },
});

export const TargetRuleTypeEnumType = enumToGraphqlEnum({
  name: 'TargetRuleTypeEnumType',
  enumType: RuleTypeEnum,
});

export const AttributeValueTypeEnumType = enumToGraphqlEnum({
  name: 'AttributeValueTypeEnumType',
  enumType: TargetValueType,
});

export const TargetTypeEnumType = enumToGraphqlEnum({
  name: 'TargetTypeEnumType',
  enumType: TargetingType,
});

const TargetRuleType = new GraphQLObjectType({
  name: 'TargetRuleType',
  description: 'Determines the audience targeting criteria',
  fields: {
    attribute: {
      type: new GraphQLNonNull(GraphQLString),
    },
    ruleType: {
      type: new GraphQLNonNull(TargetRuleTypeEnumType),
    },
    valueType: {
      type: new GraphQLNonNull(AttributeValueTypeEnumType),
    },
    value: {
      type: new GraphQLNonNull(TargetValueScalarType),
    },
  },
});

const TargetGroupType = new GraphQLObjectType({
  name: 'TargetGroupType',
  description: 'A single group of targeting rules',
  fields: {
    rules: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(TargetRuleType))
      ),
    },
  },
});

const TargetType = new GraphQLObjectType({
  name: 'TargetType',
  description: 'Determines a given target criteria',
  fields: {
    type: {
      type: new GraphQLNonNull(TargetTypeEnumType),
    },
    groups: {
      type: new GraphQLList(new GraphQLNonNull(TargetGroupType)),
    },
  },
});

export const TargetsType = new GraphQLObjectType({
  name: 'TargetsType',
  description: 'Determines targeting criteria',
  fields: {
    account: {
      type: new GraphQLNonNull(TargetType),
    },
    accountUser: {
      type: new GraphQLNonNull(TargetType),
    },
    audiences: {
      type: TargetType,
    },
  },
});

export const VisualBuilderSessionTypeEnum = enumToGraphqlEnum({
  name: 'VisualBuilderSessionType',
  enumType: VisualBuilderSessionType,
});

export const VisualBuilderSessionStateEnum = enumToGraphqlEnum({
  name: 'VisualBuilderSessionState',
  enumType: VisualBuilderSessionState,
});
