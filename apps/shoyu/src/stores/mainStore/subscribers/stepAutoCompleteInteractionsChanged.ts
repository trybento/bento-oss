import { pipe, subscribe } from 'wonka';
import { debugMessage } from 'bento-common/utils/debugging';

import { getGraphqlInstance } from '../../../lib/graphqlClient';
import {
  StepAutoCompleteInteractionsChanged,
  StepAutoCompleteInteractionsChangedDocument,
} from '../../../graphql/subscriptions/generated/StepAutoCompleteInteractionsChanged';

import mainStore from '..';
import catchException from '../../../lib/catchException';

/** @todo figure out how to improve typings  */
const stepAutoCompleteInteractionsChangedSubscriber = () => {
  debugMessage('[BENTO] Subscribing to stepAutoCompleteInteractionsChanged');

  const client = getGraphqlInstance();

  // @ts-ignore-error
  const { unsubscribe } = pipe(
    // @ts-ignore-error
    client.subscription<StepAutoCompleteInteractionsChanged>(
      StepAutoCompleteInteractionsChangedDocument
    ),
    subscribe<{ data?: StepAutoCompleteInteractionsChanged; error: Error }>(
      ({ error, data }) => {
        if (error) {
          catchException(
            error,
            'stepAutoCompleteInteractionsChangedSubscriber'
          );
          return;
        }

        if (
          data?.stepAutoCompleteInteractionsChanged
            ?.stepAutoCompleteInteractions != null
        ) {
          mainStore.getState().dispatch({
            type: 'stepAutoCompleteInteractionsChanged',
            // @ts-ignore
            stepAutoCompleteInteractions:
              data.stepAutoCompleteInteractionsChanged
                .stepAutoCompleteInteractions,
          });
        }
      }
    )
  );

  return unsubscribe;
};

export default stepAutoCompleteInteractionsChangedSubscriber;
