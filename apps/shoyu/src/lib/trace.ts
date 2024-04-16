import { debugMessage } from 'bento-common/utils/debugging';
import {
  BENTO_INIT_ID_HEADER,
  genTraceId,
  REQUEST_ID_HEADER,
} from 'bento-common/utils/trace';

/**
 * Should hold the current Bento initialization ID for as long as it lives.
 * Will be refreshed whenever `window.Bento.initialize()` is called.
 */
let BentoInitID: string | undefined;

/**
 * Returns the current Bento initialization ID
 */
export const getBentoInitID = () => BentoInitID;

/**
 * Refreshes and returns the new Bento initialization ID.
 * Appends accountUser's external id to guarantee uniqueness.
 **/
export const refreshBentoInitID = (accountUserId: string) => {
  BentoInitID = `${genTraceId()}.${accountUserId}`;
  debugMessage(`[BENTO] Init ID: ${BentoInitID}`);
  return BentoInitID;
};

/**
 * Returns a list of request headers that can be used to help trace
 * requests end-to-end (from client to server), including tasks.
 */
export const getTraceHeaders = (): RequestInit['headers'] => {
  const requestId = genTraceId();
  return {
    /**
     * Should be unique per Bento initialization request.
     */
    [BENTO_INIT_ID_HEADER]: getBentoInitID() || 'unknown',
    /**
     * Should be unique per request and help us trace errors end-to-end.
     */
    [REQUEST_ID_HEADER]: requestId,
  };
};
