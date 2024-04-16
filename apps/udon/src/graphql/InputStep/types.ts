import { enumToGraphqlEnum } from 'bento-common/utils/graphql';
import {
  DropdownInputVariation,
  StepInputFieldSettings,
  StepInputFieldType,
} from 'bento-common/types';

export type InputWithAnswer = {
  label: string;
  value: string;
};

export const InputStepFieldTypeEnumType = enumToGraphqlEnum({
  name: 'InputStepFieldTypeEnumType',
  description: 'The type of the input prototype',
  enumType: StepInputFieldType,
});

export const DropdownInputVariationEnumType = enumToGraphqlEnum({
  name: 'DropdownInputVariationEnumType',
  description: 'The variation for an input of type dropdown',
  enumType: DropdownInputVariation,
});
