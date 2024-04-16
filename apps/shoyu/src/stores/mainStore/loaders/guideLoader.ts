import loaderFactory from '../../loaderFactory';
import {
  GuideQuery,
  GuideQueryDocument,
  GuideQueryVariables,
} from '../../../graphql/queries/generated/Guide';

const guideLoader = loaderFactory<GuideQueryVariables, GuideQuery>(
  'guide',
  GuideQueryDocument,
  { rethrow: true }
);
export default guideLoader;
