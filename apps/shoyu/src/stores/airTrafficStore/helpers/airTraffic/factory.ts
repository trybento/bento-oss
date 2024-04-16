import { EmbedFormFactorsForGuideFormFactor } from 'bento-common/data/helpers';
import { cloneDeep, get, set } from 'bento-common/utils/lodash';

import catchException from '../../../../lib/catchException';
import {
  AirTrafficContext,
  AirTrafficItem,
  EnrichedDesiredState,
  EvaluationDetails,
} from '../../types';

export type AirTrafficControlCallbackReturn = [
  /** Whether the guide should show. */
  shouldShow: boolean,
  /**
   * Whether to increment the associated counter.
   * Can only be truthy if `shouldShow` is true, otherwise will be ignored.
   */
  shouldIncrementCounter: boolean,
  /**
   * Useful to externalize details about why a content is supposed to show or hide.
   * This is currently used by debugging - see BentoAtrTrafficElement's enrichedDesiredState
   */
  reason: EvaluationDetails,
  /**
   * Changes the handler wants to make to the desired state to affect other
   *   behaviors
   */
  stateModifiers?: Partial<EnrichedDesiredState>
];

export type AirTrafficControlCallback<
  T extends AirTrafficItem,
  R = AirTrafficControlCallbackReturn
> = (
  acc: Readonly<EnrichedDesiredState>,
  item: T,
  context: AirTrafficContext
) => R;

/**
 * Take in different ATC handler plugins and read the results to determine
 *   any updates to the Enriched desired state
 *
 * @todo consider moving debugging to BentoAirTrafficElement and consolidate in a single output
 */
export const airTrafficControlFactory =
  <T extends AirTrafficItem>(
    /** Implementation name (useful for namespacing eventual errors) */
    handler: string,
    /** Callback function that runs the factory logic */
    callbackFn: AirTrafficControlCallback<T>,
    /** Which counter to implement, if any */
    counter?: keyof EnrichedDesiredState['counters']
  ) =>
  (oldAcc: EnrichedDesiredState, item: T, context: AirTrafficContext) => {
    const acc = cloneDeep(oldAcc);

    try {
      const [shouldShow, shouldIncrementCounter, reason, modifiers] =
        callbackFn(oldAcc, item, context);

      const outcome = shouldShow ? 'show' : 'hide';

      const targetEmbedFfs =
        EmbedFormFactorsForGuideFormFactor[item.formFactor];

      targetEmbedFfs.forEach((ff) => {
        const path = [outcome, item.__typename, ff];
        const existing = get(acc, path, []);

        set(acc, path, existing.concat(item.entityId));
      });

      if (shouldShow && counter && shouldIncrementCounter)
        acc.counters[counter]++;

      /** Apply requested acc edits. May want to be more robust in future w/ checks */
      if (modifiers) Object.assign(acc, modifiers);

      acc.logs.push({
        outcome,
        details: {
          handler,
          __typename: item.__typename,
          entityId: item.entityId,
          reason,
          ...(modifiers ? modifiers : {}),
        },
      });
    } catch (e) {
      /**
       * If an error ever occurs, we would capture and potentially log it out but never
       * break the whole processing. The item in question would be simply ignored, effectively
       * not getting marked to show or hide.
       */
      catchException(e as Error, handler);
    }

    return acc;
  };
