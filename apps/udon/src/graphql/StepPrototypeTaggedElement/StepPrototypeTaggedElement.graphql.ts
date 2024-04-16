import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql';
import { enumToGraphqlEnum } from 'bento-common/utils/graphql';
import { VisualTagStyleSettingsType } from 'bento-common/graphql/visualTags';
import {
  ContextTagType,
  ContextTagAlignment,
  ContextTagTooltipAlignment,
} from 'bento-common/types/globalShoyuState';
import { entityIdField } from 'bento-common/graphql/EntityId';
import {
  DEFAULT_TAG_TEXT,
  FAKE_ELEMENT_HTML,
} from 'bento-common/utils/constants';

import { StepPrototypeTaggedElement } from 'src/data/models/StepPrototypeTaggedElement.model';
import StepPrototypeType from '../StepPrototype/StepPrototype.graphql';
import { GraphQLContext } from '../types';
import globalEntityId from '../helpers/types/globalEntityId';
import TemplateType from 'src/graphql/Template/Template.graphql';

export const ContextTagTypeEnumType = enumToGraphqlEnum({
  name: 'ContextualTagTypeEnumType',
  description: 'The style of the context tag',
  enumType: ContextTagType,
});

export const ContextTagAlignmentEnumType = enumToGraphqlEnum({
  name: 'ContextualTagAlignmentEnumType',
  description: 'The position of the context tag relative to the tagged element',
  enumType: ContextTagAlignment,
});

export const ContextTagTooltipAlignmentEnumType = enumToGraphqlEnum({
  name: 'ContextualTagTooltipAlignmentEnumType',
  description: "The position of the context tag's tooltip relative to the tag",
  enumType: ContextTagTooltipAlignment,
});

const StepPrototypeTaggedElementType = new GraphQLObjectType<
  StepPrototypeTaggedElement,
  GraphQLContext
>({
  name: 'StepPrototypeTaggedElement',
  fields: () => ({
    ...globalEntityId('StepPrototypeTaggedElement'),
    ...entityIdField(),
    stepPrototype: {
      type: StepPrototypeType,
      resolve: (taggedElement, _, { loaders }) =>
        taggedElement.stepPrototypeId
          ? loaders.stepPrototypeLoader.load(taggedElement.stepPrototypeId)
          : null,
    },
    url: {
      type: new GraphQLNonNull(GraphQLString),
    },
    wildcardUrl: {
      type: new GraphQLNonNull(GraphQLString),
    },
    elementSelector: {
      type: new GraphQLNonNull(GraphQLString),
    },
    elementText: {
      type: GraphQLString,
    },
    elementHtml: {
      type: GraphQLString,
      /**
       * Note: Temporarily disabled.
       */
      resolve: (ste) => (ste.elementHtml ? FAKE_ELEMENT_HTML : ''),
    },
    type: {
      type: new GraphQLNonNull(ContextTagTypeEnumType),
    },
    alignment: {
      type: new GraphQLNonNull(ContextTagAlignmentEnumType),
    },
    xOffset: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    yOffset: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    relativeToText: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    style: {
      type: VisualTagStyleSettingsType,
      resolve: (ste) =>
        ste.style
          ? {
              ...ste.style,
              opacity: ste.style.opacity ?? 0.2,
              text: ste.style.text ?? DEFAULT_TAG_TEXT,
            }
          : undefined,
    },
    tooltipAlignment: {
      type: new GraphQLNonNull(ContextTagTooltipAlignmentEnumType),
    },
    template: {
      type: new GraphQLNonNull(TemplateType),
      resolve: (templateTarget, _, { loaders }) =>
        loaders.templateLoader.load(templateTarget.templateId),
    },
  }),
});

export default StepPrototypeTaggedElementType;
