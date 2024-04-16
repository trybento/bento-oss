import loaderFactory from '../../loaderFactory';
import {
  AvailableGuidesQuery,
  AvailableGuidesQueryVariables,
  AvailableGuidesQueryDocument,
} from './../../../graphql/queries/generated/AvailableGuides';

// TODO: Add return type definition
const availableGuidesLoader = loaderFactory<
  AvailableGuidesQueryVariables,
  AvailableGuidesQuery
>('available guides', AvailableGuidesQueryDocument);

export default availableGuidesLoader;
