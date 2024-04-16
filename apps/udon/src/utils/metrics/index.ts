import { FilterFn, ResolverFn, withFilter } from 'graphql-subscriptions';

export function withSubscriptionCounter(
  /** The resolver fn, responsible for providing the results */
  resolverFn: ResolverFn,
  /** The filter fn, responsible for filtering the messages to the destinations  */
  filterFn: FilterFn,
  /**
   * Previously served as the metric name
   * @deprecated not implemented, soon to be removed
   */
  _name?: string
): ResolverFn {
  const wrappedFilter: FilterFn = async (...args) => {
    return filterFn(...args);
  };
  return withFilter(resolverFn, wrappedFilter);
}
