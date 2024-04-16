import {
  FullGuide,
  StepAutoCompleteInteraction,
} from 'bento-common/types/globalShoyuState';

import mutatorFactory from './factory';
import {
  GetDestinationGuideInput,
  GetDestinationGuidePayload,
} from '../../../graphql/schema.types';
import { GetDestinationGuideMutationDocument } from '../../../graphql/mutations/generated/GetDestinationGuide';
import mainStore from '..';

type Options = {
  appLocation: string | undefined;
  onSuccess?: (guide: FullGuide) => void;
  onError?: () => void;
  onComplete?: () => void;
};

const getDestinationGuide = async (
  input: GetDestinationGuideInput,
  { appLocation, onSuccess, onError, onComplete }: Options = {
    appLocation: undefined,
  }
): Promise<void> => {
  return mutatorFactory<GetDestinationGuideInput, GetDestinationGuidePayload>(
    'getDestinationGuide',
    GetDestinationGuideMutationDocument,
    {
      onSuccess: async (data: GetDestinationGuidePayload) => {
        if (data.guide) {
          mainStore
            .getState()
            .launchDestinationGuide(
              input.stepEntityId,
              data.guide as unknown as FullGuide,
              data.stepAutoCompleteInteractions as unknown as StepAutoCompleteInteraction[],
              appLocation
            );

          onSuccess?.(data.guide as unknown as FullGuide);
          return;
        }

        throw new Error('Unable to get the destination guide');
      },
      onError: () => onError?.(),
      onComplete,
    }
  )(input);
};

export default getDestinationGuide;
