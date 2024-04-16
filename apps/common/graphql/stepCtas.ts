import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { StepCtaStyle, StepCtaType, StepCtaSettings } from '../types';
import { FieldConfigMap } from '../types/graphql';
import { enumToGraphqlEnum } from '../utils/graphql';

export const StepCtaTypeEnumType = enumToGraphqlEnum({
  name: 'StepCtaTypeEnumType',
  description: 'The type of the step CTA',
  enumType: StepCtaType,
});

export const StepCtaStyleEnumType = enumToGraphqlEnum({
  name: 'StepCtaStyleEnumType',
  description: 'The style of the step CTA',
  enumType: StepCtaStyle,
});

const StepCtaSettingsFields = {
  bgColorField: {
    type: new GraphQLNonNull(GraphQLString),
  },
  textColorField: {
    type: new GraphQLNonNull(GraphQLString),
  },
  eventName: {
    type: GraphQLString,
  },
  markComplete: {
    type: GraphQLBoolean,
  },
  implicit: {
    type: GraphQLBoolean,
  },
  opensInNewTab: {
    type: GraphQLBoolean,
  },
};

export const StepCtaSettingsType = new GraphQLObjectType({
  name: 'StepCtaSettingsType',
  description: 'The step CTA settings',
  fields: StepCtaSettingsFields as FieldConfigMap<StepCtaSettings, any>,
});

export const StepCtaSettingsInputType = new GraphQLInputObjectType({
  name: 'StepCtaSettingsInputType',
  fields: StepCtaSettingsFields,
});
