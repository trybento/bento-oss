import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import { withTransaction } from 'src/data';
import { StepPrototype } from 'src/data/models/StepPrototype.model';

import generateMutation from 'src/graphql/helpers/generateMutation';

import StepEventMappingType from 'src/graphql/StepEventMapping/StepEventMapping.graphql';
import {
  ValueType,
  RuleType,
} from 'src/graphql/StepEventMappingRule/StepEventMappingRule.graphql';
import { setStepAutoCompleteMapping } from 'src/interactions/setStepAutoCompleteMapping';
import { getIsAnyStepAutoCompleteRuleIncomplete } from 'src/utils/stepAutoCompleteHelpers';

export const StepEventMappingRuleInputType = new GraphQLInputObjectType({
  name: 'StepEventMappingRuleInputType',
  fields: {
    propertyName: {
      type: GraphQLString,
    },
    valueType: {
      type: ValueType,
    },
    ruleType: {
      type: RuleType,
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
      type: GraphQLString,
    },
  },
});

export const StepEventMappingInputType = new GraphQLInputObjectType({
  name: 'StepEventMappingInputType',
  fields: {
    eventName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    completeForWholeAccount: {
      type: GraphQLBoolean,
    },
    rules: {
      type: new GraphQLList(new GraphQLNonNull(StepEventMappingRuleInputType)),
    },
  },
});

export default generateMutation({
  name: 'SetStepAutoCompleteMapping',
  description: 'Sets an event + conditions that auto-complete a step',
  inputFields: {
    stepPrototypeEntityId: {
      type: new GraphQLNonNull(GraphQLString),
    },
    eventName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    completeForWholeAccount: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    rules: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(StepEventMappingRuleInputType))
      ),
    },
  },
  outputFields: {
    stepEventMapping: {
      type: StepEventMappingType,
    },
  },
  mutateAndGetPayload: async ({
    stepPrototypeEntityId,
    eventName,
    completeForWholeAccount,
    rules,
  }) => {
    try {
      const stepEventMapping = await withTransaction(async () => {
        const stepPrototype = await StepPrototype.findOne({
          where: {
            entityId: stepPrototypeEntityId,
          },
        });

        if (!stepPrototype) return { errors: ['Step prototype not found'] };

        const isAnyRuleIncomplete = getIsAnyStepAutoCompleteRuleIncomplete(
          rules || []
        );

        if (eventName && rules && !isAnyRuleIncomplete) {
          await setStepAutoCompleteMapping({
            stepPrototype,
            eventName,
            completeForWholeAccount,
            rules,
          });
        }
      });

      return { stepEventMapping };
    } catch (e) {
      // @ts-ignore
      return { errors: [e.message] };
    }
  },
});
