import {
  AirTrafficControlCallbackReturn,
  airTrafficControlFactory,
} from './factory';

/**
 * @deprecated currently not in use, but leaving for now
 */
export const notImplementedAirTraffic = airTrafficControlFactory<any>(
  'notImplementedAirTraffic',
  (_acc, item): AirTrafficControlCallbackReturn => {
    const details = {
      __typename: item.__typename,
      formFactor: item.formFactor,
    };

    // eslint-disable-next-line no-console
    console.error(
      '[BENTO] [airTrafficControl] needs implementation for:',
      details
    );

    return [false, false, { scope: 'notImplemented', ...details }];
  },
  undefined
);
