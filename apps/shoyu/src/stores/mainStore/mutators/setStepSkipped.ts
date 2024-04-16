import mutatorFactory from './factory';
import {
  SetStepSkippedInput,
  SetStepSkippedPayload,
} from '../../../graphql/schema.types';
import { SetStepSkippedMutationDocument } from '../../../graphql/mutations/generated/SetStepSkipped';

const setStepSkipped = mutatorFactory<
  SetStepSkippedInput,
  SetStepSkippedPayload
>('setStepSkipped', SetStepSkippedMutationDocument);
export default setStepSkipped;
