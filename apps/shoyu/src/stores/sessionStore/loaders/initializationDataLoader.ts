import loaderFactory from '../../loaderFactory';
import {
  InitializationQuery,
  InitializationQueryDocument,
  InitializationQueryVariables,
} from '../../../graphql/queries/generated/Initialization';

const initializationDataLoader = loaderFactory<
  InitializationQueryVariables,
  InitializationQuery
>('identity', InitializationQueryDocument, {
  requestPolicy: 'cache-and-network',
});
export default initializationDataLoader;
