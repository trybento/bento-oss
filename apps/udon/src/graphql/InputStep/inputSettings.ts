import {
  GraphQLBoolean,
  GraphQLFieldConfig,
  GraphQLInputFieldConfig,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLUnionType,
} from 'graphql';

import {
  DropdownInputVariation,
  StepInputFieldSettings,
  StepInputFieldType,
} from 'bento-common/types';
import {
  InputFieldConfigMap,
  FieldConfigMap,
} from 'bento-common/types/graphql';

import { InputStepBase } from 'src/data/models/inputStepBase.model';
import { InputStepPrototype } from 'src/data/models/InputStepPrototype.model';
import { EntityId } from '../helpers/types';
import { EmbedContext, GraphQLContext } from '../types';
import {
  DropdownInputVariationEnumType,
  InputStepFieldTypeEnumType,
} from './types';

const DropdownInputOptionType = new GraphQLObjectType<
  StepInputFieldSettings['options'],
  GraphQLContext
>({
  name: 'DropdownInputOption',
  fields: () => ({
    label: {
      type: GraphQLString,
    },
    value: {
      type: GraphQLString,
    },
  }),
});

const DropdownInputOptionInputType = new GraphQLInputObjectType({
  name: 'DropdownInputOptionInput',
  fields: {
    label: {
      type: GraphQLString,
    },
    value: {
      type: GraphQLString,
    },
  },
});

// Input types

const BaseSettingsInputFields: InputFieldConfigMap = {
  required: {
    type: GraphQLBoolean,
  },
  helperText: {
    type: GraphQLString,
  },
};

const TextOrSettingsInputFields: InputFieldConfigMap = {
  placeholder: {
    type: GraphQLString,
  },
  maxValue: {
    type: GraphQLInt,
  },
};

const NpsSettingsInputFields: InputFieldConfigMap = {
  minValue: {
    type: GraphQLInt,
  },
  minLabel: {
    type: GraphQLString,
  },
  maxValue: {
    type: GraphQLInt,
  },
  maxLabel: {
    type: GraphQLString,
  },
};

const DropdownSettingsInputFields: InputFieldConfigMap = {
  options: {
    type: new GraphQLList(new GraphQLNonNull(DropdownInputOptionInputType)),
  },
  multiSelect: {
    type: GraphQLBoolean,
  },
  variation: {
    type: DropdownInputVariationEnumType,
  },
};

export const InputSettingsInputType = new GraphQLInputObjectType({
  name: 'InputSettingsInput',
  fields: {
    ...BaseSettingsInputFields,
    ...TextOrSettingsInputFields,
    ...NpsSettingsInputFields,
    ...DropdownSettingsInputFields,
  },
});

export const InputFieldFactoryItemInput = new GraphQLInputObjectType({
  name: 'InputFieldFactoryItemInput',
  fields: {
    entityId: {
      type: EntityId,
    },
    label: {
      type: new GraphQLNonNull(GraphQLString),
    },
    type: {
      type: new GraphQLNonNull(InputStepFieldTypeEnumType),
    },
    settings: {
      type: new GraphQLNonNull(InputSettingsInputType),
    },
  },
});

export const InputFieldFactoryListInput: GraphQLInputFieldConfig = {
  description: 'The input fields for this step prototype, if any',
  type: new GraphQLList(new GraphQLNonNull(InputFieldFactoryItemInput)),
};

export const InputFieldAnswerInput = new GraphQLInputObjectType({
  name: 'InputFieldAnswerInput',
  fields: {
    entityId: {
      type: new GraphQLNonNull(EntityId),
    },
    answer: {
      type: GraphQLString,
    },
  },
});

export const InputFieldAnswersInputType: GraphQLInputFieldConfig = {
  description: 'The list of each input answer provided for the step, if any',
  type: new GraphQLList(new GraphQLNonNull(InputFieldAnswerInput)),
};

// Resolution types

/**
 * This should contain all the common properties between
 * every input type and always be available under the input settings.
 */
const BaseSettingsTypeFields: FieldConfigMap<
  StepInputFieldSettings,
  GraphQLContext
> = {
  required: {
    type: new GraphQLNonNull(GraphQLBoolean),
    resolve: (settings, _args, _ctx) => !!settings?.required,
  },
  helperText: {
    type: GraphQLString,
  },
};

const TextOrEmailSettingsType = new GraphQLObjectType<
  StepInputFieldSettings,
  GraphQLContext
>({
  name: 'TextOrEmailSettings',
  fields: {
    ...BaseSettingsTypeFields,
    placeholder: {
      type: GraphQLString,
      resolve: (settings, _args, _ctx) => settings?.placeholder || null,
    },
    maxValue: {
      type: GraphQLInt,
    },
  },
});

const NpsSettingsType = new GraphQLObjectType<
  StepInputFieldSettings,
  GraphQLContext
>({
  name: 'NpsSettings',
  fields: {
    ...BaseSettingsTypeFields,
    minLabel: {
      deprecationReason: 'Value is not editable',
      type: GraphQLString,
    },
    minValue: {
      deprecationReason: 'Value is not editable',
      type: GraphQLInt,
    },
    maxLabel: {
      deprecationReason: 'Value is not editable',
      type: GraphQLString,
    },
    maxValue: {
      deprecationReason: 'Value is not editable',
      type: GraphQLInt,
    },
  },
});

const NumberPollSettingsType = new GraphQLObjectType<
  StepInputFieldSettings,
  GraphQLContext
>({
  name: 'NumberPollSettings',
  fields: {
    ...BaseSettingsTypeFields,
    minLabel: {
      type: GraphQLString,
    },
    minValue: {
      type: GraphQLInt,
    },
    maxLabel: {
      type: GraphQLString,
    },
    maxValue: {
      type: GraphQLInt,
    },
  },
});

const DropdownSettingsType = new GraphQLObjectType<
  StepInputFieldSettings,
  GraphQLContext
>({
  name: 'DropdownSettings',
  fields: {
    ...BaseSettingsTypeFields,
    options: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(DropdownInputOptionType))
      ),
      resolve: (settings) => settings?.options || [],
    },
    multiSelect: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: (settings) => !!settings?.multiSelect,
    },
    variation: {
      type: new GraphQLNonNull(DropdownInputVariationEnumType),
      resolve: (settings) =>
        settings?.variation || DropdownInputVariation.dropdown,
    },
  },
});

export const InputSettingsUnionType = new GraphQLUnionType({
  name: 'InputSettings',
  types: [
    TextOrEmailSettingsType,
    NpsSettingsType,
    NumberPollSettingsType,
    DropdownSettingsType,
  ],
  resolveType: (
    settings: StepInputFieldSettings & { inputType: StepInputFieldType }
  ) => {
    switch (settings.inputType) {
      case StepInputFieldType.text:
      case StepInputFieldType.email:
      case StepInputFieldType.paragraph:
      case StepInputFieldType.date:
        return TextOrEmailSettingsType;

      case StepInputFieldType.nps:
        return NpsSettingsType;

      case StepInputFieldType.numberPoll:
        return NumberPollSettingsType;

      case StepInputFieldType.dropdown:
        return DropdownSettingsType;
    }
  },
});

export const InputSettingsResolverField: GraphQLFieldConfig<
  InputStepPrototype | InputStepBase,
  EmbedContext | GraphQLContext
> = {
  description: 'Settings for the input according to its type',
  type: InputSettingsUnionType,
  resolve: async (input, _args, { loaders }) => {
    let ref = input;
    if (input instanceof InputStepBase) {
      ref = await loaders.inputStepPrototypeLoader.load(
        input.createdFromInputStepPrototypeId || 0
      );
      if (!ref) return null;
    }
    return { ...(ref?.settings || {}), inputType: ref?.type };
  },
};
