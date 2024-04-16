import { StepInputFieldType } from '../../types';
import { StepInput, StepInputEntityId } from '../../types/globalShoyuState';

export const sampleInputs: StepInput[] = [
  {
    entityId: '92e8e146-e64b-4a5c-81d2-3b16c16fc291' as StepInputEntityId,
    label: 'Sample input',
    type: StepInputFieldType.text,
    settings: {
      placeholder: 'Placeholder',
      required: false,
      helperText: '',
      maxValue: null,
    },
    answer: '',
  },
];
