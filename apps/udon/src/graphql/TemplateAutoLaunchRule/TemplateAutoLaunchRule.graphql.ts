import { GraphQLObjectType, GraphQLList, GraphQLNonNull } from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import { enumToGraphqlEnum } from 'bento-common/utils/graphql';
import { TargetingType } from 'bento-common/types';

import TemplateType from 'src/graphql/Template/Template.graphql';
import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import { entityIdField } from 'bento-common/graphql/EntityId';
import { TemplateAutoLaunchRule } from 'src/data/models/TemplateAutoLaunchRule.model';
import { GraphQLContext } from 'src/graphql/types';

export const RuleType = enumToGraphqlEnum({
  name: 'TemplateAutoLaunchRuleRuleType',
  description: 'The rule type of auto launch rule for a template',
  enumType: TargetingType,
});

const TemplateAutoLaunchRuleType = new GraphQLObjectType<
  TemplateAutoLaunchRule,
  GraphQLContext
>({
  name: 'TemplateAutoLaunchRule',
  description: 'An autolaunch rule for a template',
  fields: () => ({
    ...globalEntityId('TemplateTarget'),
    ...entityIdField(),
    ruleType: {
      type: new GraphQLNonNull(RuleType),
      description: 'What type of rule is the auto launch rule',
    },
    rules: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLJSON))
      ),
      description:
        'The account user targeting rules, if the targetType is "attributeRules"',
    },
    template: {
      type: new GraphQLNonNull(TemplateType),
      resolve: (templateTarget, _, { loaders }) =>
        loaders.templateLoader.load(templateTarget.templateId),
    },
  }),
});

export default TemplateAutoLaunchRuleType;
