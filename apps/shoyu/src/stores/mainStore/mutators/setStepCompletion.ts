import mutatorFactory from './factory';
import { SetStepCompletionMutationDocument } from '../../../graphql/mutations/generated/SetStepCompletion';
import {
  SetStepCompletionInput,
  SetStepCompletionPayload,
} from '../../../graphql/schema.types';

type Options = Parameters<typeof mutatorFactory>[2];

const setStepCompletion = async (
  input: SetStepCompletionInput,
  options: Options = {}
): Promise<void> => {
  return mutatorFactory<SetStepCompletionInput, SetStepCompletionPayload>(
    'setStepCompletion',
    SetStepCompletionMutationDocument,
    options
  )(input);
};

export default setStepCompletion;
