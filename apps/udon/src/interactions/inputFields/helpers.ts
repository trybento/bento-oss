import { pick } from 'lodash';
import { Op } from 'sequelize';

import { StepInputFieldInput } from 'bento-common/types';

import { InputStepAnswer } from 'src/data/models/inputStepAnswer.model';
import { InputStepBase } from 'src/data/models/inputStepBase.model';
import { InputStepPrototype } from 'src/data/models/InputStepPrototype.model';
import { InputWithAnswer } from 'src/graphql/InputStep/types';

export const INPUT_FIELDS_MUTABLE_FIELDS = [
  'label',
  'type',
  'settings',
  'orderIndex',
];

export const getInputMutableFields = (
  input?: StepInputFieldInput | InputStepPrototype | InputStepBase
) => {
  return input ? pick(input, INPUT_FIELDS_MUTABLE_FIELDS) : {};
};

export const formatInputAnswer = (
  label: string | null,
  value: string | null,
  index = 0
): InputWithAnswer => {
  return {
    label: label || `Response${index > 0 ? ` ${index}` : ''}`,
    value: value || '',
  };
};

export const formatInputsWithAnswersForEmail = (
  items: InputWithAnswer[] | undefined
) => {
  if (items?.length) {
    const arraySize = items?.length || 0;
    return items?.reduce((acc, item, index) => {
      const separator =
        index === 0 ? '' : index >= arraySize - 1 ? ' and ' : ', ';
      return `${acc}${separator}${item.label}: '${item.value}'`;
    }, '');
  }
  return undefined;
};

export const cleanupDetachedInputAnswers = async () => {
  return InputStepAnswer.destroy({
    where: {
      [Op.or]: [{ inputStepBaseId: null }, { stepId: null }],
    },
  });
};
