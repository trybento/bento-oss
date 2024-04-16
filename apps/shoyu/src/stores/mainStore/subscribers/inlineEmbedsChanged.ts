import { pipe, subscribe } from 'wonka';
import { debugMessage } from 'bento-common/utils/debugging';
import { InlineEmbed } from 'bento-common/types/globalShoyuState';

import { getGraphqlInstance } from '../../../lib/graphqlClient';
import {
  InlineEmbedsChanged,
  InlineEmbedsChangedDocument,
} from './../../../graphql/subscriptions/generated/InlineEmbedsChanged';
import catchException from '../../../lib/catchException';
import mainStore from '..';

/** @todo figure out how to improve typings  */
const inlineEmbedsChangedSubscriber = () => {
  debugMessage('[BENTO] Subscribing to inlineEmbedsChanged');

  const client = getGraphqlInstance();

  // @ts-ignore-error
  const { unsubscribe } = pipe(
    // @ts-ignore-error
    client.subscription<InlineEmbedsChanged>(InlineEmbedsChangedDocument),
    subscribe<{ data?: InlineEmbedsChanged; error: Error }>(
      ({ error, data }) => {
        if (error) {
          catchException(error, 'inlineEmbedsChangedSubscriber');
          return;
        }

        data?.inlineEmbedsChanged &&
          mainStore.getState().dispatch({
            type: 'inlineEmbedsChanged',
            inlineEmbeds: data.inlineEmbedsChanged as unknown as InlineEmbed[],
          });
      }
    )
  );

  return unsubscribe;
};

export default inlineEmbedsChangedSubscriber;
