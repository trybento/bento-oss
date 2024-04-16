import loaderFactory from '../../loaderFactory';
import {
  NpsSurveysQuery,
  NpsSurveysQueryDocument,
  NpsSurveysQueryVariables,
} from '../../../graphql/queries/generated/NpsSurveys';

const npsSurveysLoader = loaderFactory<
  NpsSurveysQueryVariables,
  NpsSurveysQuery
>('npsSurveys', NpsSurveysQueryDocument);

export default npsSurveysLoader;
