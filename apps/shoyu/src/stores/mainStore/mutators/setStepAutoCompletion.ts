import mutatorFactory from './factory';
import { SetStepAutoCompletionMutationDocument } from '../../../graphql/mutations/generated/SetStepAutoCompletion';
import {
  SetStepAutoCompletionInput,
  SetStepAutoCompletionPayload,
} from '../../../graphql/schema.types';

const setStepAutoCompletion = mutatorFactory<
  SetStepAutoCompletionInput,
  SetStepAutoCompletionPayload
>('setStepAutoCompletion', SetStepAutoCompletionMutationDocument);
export default setStepAutoCompletion;
