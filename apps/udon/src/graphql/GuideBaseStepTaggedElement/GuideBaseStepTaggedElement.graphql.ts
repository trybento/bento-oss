import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql';
import { VisualTagStyleSettingsType } from 'bento-common/graphql/visualTags';
import { entityIdField } from 'bento-common/graphql/EntityId';
import { DEFAULT_TAG_TEXT } from 'bento-common/utils/constants';

import { StepPrototypeTaggedElement } from 'src/data/models/StepPrototypeTaggedElement.model';
import { GraphQLContext } from '../types';
import {
  ContextTagTypeEnumType,
  ContextTagAlignmentEnumType,
  ContextTagTooltipAlignmentEnumType,
} from '../StepPrototypeTaggedElement/StepPrototypeTaggedElement.graphql';
import globalEntityId from '../helpers/types/globalEntityId';

const GuideBaseStepTaggedElementType = new GraphQLObjectType<
  StepPrototypeTaggedElement,
  GraphQLContext
>({
  name: 'GuideBaseStepTaggedElement',
  fields: () => ({
    ...globalEntityId('GuideBaseStepTaggedElement'),
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
    type: {
      type: new GraphQLNonNull(ContextTagTypeEnumType),
    },
    style: {
      type: VisualTagStyleSettingsType,
      resolve: (ste) => ({
        ...(ste.style
          ? {
              ...ste.style,
              opacity: ste.style.opacity ?? 0.2,
              text: ste.style.text ?? DEFAULT_TAG_TEXT,
            }
          : {}),
        tagType: ste.type,
      }),
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
    tooltipAlignment: {
      type: new GraphQLNonNull(ContextTagTooltipAlignmentEnumType),
    },
  }),
});

export default GuideBaseStepTaggedElementType;
