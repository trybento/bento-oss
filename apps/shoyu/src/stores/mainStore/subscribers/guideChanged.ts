import { pipe, subscribe } from 'wonka';
import { FullGuide, GuideEntityId } from 'bento-common/types/globalShoyuState';
import { debugMessage } from 'bento-common/utils/debugging';

import { getGraphqlInstance } from '../../../lib/graphqlClient';
import {
  GuideChanged,
  GuideChangedDocument,
} from '../../../graphql/subscriptions/generated/GuideChanged';
import { guideSelector } from '../helpers/selectors';
import catchException from '../../../lib/catchException';
import mainStore from '..';

/** @todo figure out how to improve typings  */
const guideChangedSubscriber = (guideEntityId?: string): (() => void) => {
  if (
    !guideEntityId ||
    guideSelector(guideEntityId as GuideEntityId, mainStore.getState())
      ?.isPreview
  ) {
    return () => {};
  }

  const client = getGraphqlInstance();
  debugMessage('[BENTO] Subscribing to guideChanged', { guideEntityId });

  // @ts-ignore-error
  const { unsubscribe } = pipe(
    // @ts-ignore-error
    client.subscription<GuideChanged>(GuideChangedDocument, {
      guideEntityId,
    }),
    subscribe<{ data?: GuideChanged; error: Error }>(({ error, data }) => {
      if (error) {
        catchException(error, 'guideChangedSubscriber');
        return;
      }

      data?.guideChanged &&
        mainStore.getState().dispatch({
          type: 'guideChanged',
          guide: data.guideChanged as unknown as FullGuide,
        });
    })
  );

  return unsubscribe;
};

export default guideChangedSubscriber;
