import loaderFactory from '../../loaderFactory';
import {
  TaggedElementsQuery,
  TaggedElementsQueryDocument,
  TaggedElementsQueryVariables,
} from '../../../graphql/queries/generated/TaggedElements';

const taggedElementsLoader = loaderFactory<
  TaggedElementsQueryVariables,
  TaggedElementsQuery
>('taggedElements', TaggedElementsQueryDocument, {
  /**
   * This needs to be set to network-only to enable
   * multiple hydrations on the same session to have an effect.
   * (i.e. currently being needed by the destination guide launched action)
   */
  requestPolicy: 'network-only',
});

export default taggedElementsLoader;
