import { FullGuide } from 'bento-common/types/globalShoyuState';

import mutatorFactory from './factory';
import {
  SaveGuideForLaterInput,
  SaveGuideForLaterPayload,
} from '../../../graphql/schema.types';
import { SaveGuideForLaterMutationDocument } from '../../../graphql/mutations/generated/SaveGuideForLater';
import mainStore from '..';

const saveGuideForLater = mutatorFactory<
  SaveGuideForLaterInput,
  SaveGuideForLaterPayload
>('saveGuideForLater', SaveGuideForLaterMutationDocument, {
  onSuccess: (data: SaveGuideForLaterPayload) => {
    if (data.guide) {
      // needed to have the store mirroring the server's state
      // for the saved guide, meaning the `savedAt` value will be
      // the same as the server's
      mainStore.getState().dispatch({
        type: 'guideChanged',
        guide: data.guide as unknown as FullGuide,
      });
    }
  },
});
export default saveGuideForLater;
