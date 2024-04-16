import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';

import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import { entityIdField } from 'bento-common/graphql/EntityId';
import StepPrototypeType from 'src/graphql/StepPrototype/StepPrototype.graphql';
import StepEventMappingRuleType from 'src/graphql/StepEventMappingRule/StepEventMappingRule.graphql';
import { StepEventMapping } from 'src/data/models/StepEventMapping.model';
import { GraphQLContext } from 'src/graphql/types';

const StepEventMappingType = new GraphQLObjectType<
  StepEventMapping,
  GraphQLContext
>({
  name: 'StepEventMapping',
  description:
    'A mapping of an event to an auto-completion of a step prototype',
  fields: () => ({
    ...globalEntityId('StepEventMapping'),
    ...entityIdField(),
    eventName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    stepPrototype: {
      type: new GraphQLNonNull(StepPrototypeType),
      resolve: (stepEventMapping, _, { loaders }) =>
        stepEventMapping.stepPrototypeId &&
        loaders.stepPrototypeLoader.load(stepEventMapping.stepPrototypeId),
    },
    completeForWholeAccount: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    rules: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(StepEventMappingRuleType))
      ),
      resolve: (stepEventMapping, _, { loaders }) =>
        loaders.stepEventMappingRulesOfStepEventMappingLoader.load(
          stepEventMapping.id
        ),
    },
  }),
});

export default StepEventMappingType;
