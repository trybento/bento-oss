import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} from 'graphql';
import { enumToGraphqlEnum } from 'bento-common/utils/graphql';
import {
  GroupCondition,
  InjectionAlignment,
  InjectionPosition,
  InlineEmbedState,
  TargetingType,
} from 'bento-common/types';
import { TargetAttributeRuleFields } from 'bento-common/graphql/targeting';
import { entityIdField } from 'bento-common/graphql/EntityId';

import { GraphQLContext } from 'src/graphql/types';
import OrganizationInlineEmbed from 'src/data/models/OrganizationInlineEmbed.model';
import TemplateType from 'src/graphql/Template/Template.graphql';

export const InlineEmbedPositionType = enumToGraphqlEnum({
  name: 'InlineEmbedPosition',
  description:
    'The position where the inline should be injected relative to the selected element',
  enumType: InjectionPosition,
});

export const InlineEmbedAlignmentType = enumToGraphqlEnum({
  name: 'InlineEmbedAlignment',
  description: 'Alignment of the injected inline',
  enumType: InjectionAlignment,
});

export const InlineEmbedTargetingTypeType = enumToGraphqlEnum({
  name: 'InlineEmbedTargetingType',
  description: 'The rule type of rules for an inline embed',
  enumType: TargetingType,
});

export const InlineEmbedTargetingGrouping = enumToGraphqlEnum({
  name: 'InlineEmbedTargetingGrouping',
  description: 'The grouping of the inline embed targeting rules',
  enumType: GroupCondition,
});

export const InlineEmbedTargetingRuleType = new GraphQLObjectType({
  name: 'InlineEmbedTargetingRule',
  description: 'An inline embed targeting attribute rule',
  fields: TargetAttributeRuleFields,
});

export const InlineEmbedTargetingSegmentType = new GraphQLObjectType({
  name: 'InlineEmbedTargetingSegment',
  description: 'Inline embed targeting segment',
  fields: {
    type: {
      type: new GraphQLNonNull(InlineEmbedTargetingTypeType),
    },
    rules: {
      type: new GraphQLList(InlineEmbedTargetingRuleType),
    },
    grouping: {
      type: GraphQLString,
    },
  },
});

export const InlineEmbedTargetingType = new GraphQLObjectType({
  name: 'InlineEmbedTargeting',
  description: 'Account and account user targeting for inline embeds',
  fields: {
    account: {
      type: new GraphQLNonNull(InlineEmbedTargetingSegmentType),
    },
    accountUser: {
      type: new GraphQLNonNull(InlineEmbedTargetingSegmentType),
    },
  },
});

export const InlineEmbedStateType = enumToGraphqlEnum({
  name: 'InlineEmbedState',
  description: 'The launched state of the inline embed',
  enumType: InlineEmbedState,
});

export const inlineEmbedBaseFields = {
  ...entityIdField(),
  url: {
    type: new GraphQLNonNull(GraphQLString),
  },
  wildcardUrl: {
    type: new GraphQLNonNull(GraphQLString),
  },
  elementSelector: {
    type: new GraphQLNonNull(GraphQLString),
  },
  position: {
    type: new GraphQLNonNull(InlineEmbedPositionType),
  },
  topMargin: {
    type: new GraphQLNonNull(GraphQLInt),
  },
  rightMargin: {
    type: new GraphQLNonNull(GraphQLInt),
  },
  bottomMargin: {
    type: new GraphQLNonNull(GraphQLInt),
  },
  leftMargin: {
    type: new GraphQLNonNull(GraphQLInt),
  },
  alignment: {
    type: InlineEmbedAlignmentType,
  },
  maxWidth: {
    type: GraphQLInt,
  },
  padding: {
    type: new GraphQLNonNull(GraphQLInt),
  },
  borderRadius: {
    type: new GraphQLNonNull(GraphQLInt),
  },
  targeting: {
    type: new GraphQLNonNull(InlineEmbedTargetingType),
  },
  state: {
    type: new GraphQLNonNull(InlineEmbedStateType),
  },
};

const InlineEmbedType = new GraphQLObjectType<
  OrganizationInlineEmbed,
  GraphQLContext
>({
  name: 'OrganizationInlineEmbed',
  fields: () => ({
    ...inlineEmbedBaseFields,
    template: {
      type: TemplateType,
      description: 'The template associated with this inline embed',
      resolve: async (inlineEmbed, _, { loaders }) => {
        if (inlineEmbed.templateId) {
          return loaders.templateLoader.load(inlineEmbed.templateId);
        }
        return null;
      },
    },
  }),
});

export default InlineEmbedType;
