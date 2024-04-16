import { GraphQLObjectType, GraphQLList, GraphQLNonNull } from 'graphql';
import GraphQLJSON from 'graphql-type-json';

import ModuleType from 'src/graphql/Module/Module.graphql';
import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import { entityIdField } from 'bento-common/graphql/EntityId';
import { ModuleAutoLaunchRule } from 'src/data/models/ModuleAutoLaunchRule.model';
import { GraphQLContext } from 'src/graphql/types';
import { enumToGraphqlEnum } from 'bento-common/utils/graphql';
import { ModuleTargetingRuleType } from 'bento-common/types';

const ModuleRuleTypeEnumType = enumToGraphqlEnum({
  name: 'ModuleRuleType',
  enumType: ModuleTargetingRuleType,
});

const ModuleAutoLaunchRuleType = new GraphQLObjectType<
  ModuleAutoLaunchRule,
  GraphQLContext
>({
  name: 'ModuleAutoLaunchRule',
  description: 'An autolaunch rule for a module',
  fields: () => ({
    ...globalEntityId('ModuleTarget'),
    ...entityIdField(),
    ruleType: {
      type: new GraphQLNonNull(ModuleRuleTypeEnumType),
      description: 'What type of rule is the auto launch rule',
      resolve: () => ModuleTargetingRuleType.attributeRules,
    },
    rules: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLJSON))
      ),
      description:
        'The account user targeting rules, if the targetType is "attributeRules"',
    },
    module: {
      type: new GraphQLNonNull(ModuleType),
      resolve: (moduleTarget, _, { loaders }) =>
        loaders.moduleLoader.load(moduleTarget.moduleId),
    },
  }),
});

export default ModuleAutoLaunchRuleType;
