import { pipe, subscribe } from 'wonka';
import { debugMessage } from 'bento-common/utils/debugging';
import { Guide } from 'bento-common/types/globalShoyuState';

import { getGraphqlInstance } from '../../../lib/graphqlClient';
import {
  AvailableGuidesChanged,
  AvailableGuidesChangedDocument,
} from '../../../graphql/subscriptions/generated/AvailableGuidesChanged';
import mainStore from '..';
import catchException from '../../../lib/catchException';

/** @todo figure out how to improve typings  */
const availableGuidesChangedSubscriber = () => {
  debugMessage('[BENTO] Subscribing to availableGuidesChanged');

  const client = getGraphqlInstance();

  // @ts-ignore-error
  const { unsubscribe } = pipe(
    // @ts-ignore-error
    client.subscription<AvailableGuidesChanged>(AvailableGuidesChangedDocument),
    subscribe<{ data?: AvailableGuidesChanged; error: Error }>(
      ({ error, data }) => {
        if (error) {
          catchException(error, 'availableGuidesChangedSubscriber');
          return;
        }

        if (data?.availableGuidesChanged?.guides != null) {
          mainStore.getState().dispatch({
            type: 'availableGuidesChanged',
            availableGuides: data.availableGuidesChanged
              .guides as unknown as Guide[],
          });
        }
      }
    )
  );

  return unsubscribe;
};

export default availableGuidesChangedSubscriber;
