import mutatorFactory from './factory';
import {
  ResetOnboardingInput,
  ResetOnboardingPayload,
} from '../../../graphql/schema.types';
import { ResetOnboardingMutationDocument } from '../../../graphql/mutations/generated/ResetOnboarding';

const resetOnboarding = mutatorFactory<
  ResetOnboardingInput,
  ResetOnboardingPayload
>('resetOnboarding', ResetOnboardingMutationDocument);
export default resetOnboarding;
