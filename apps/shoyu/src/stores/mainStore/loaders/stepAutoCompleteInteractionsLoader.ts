import loaderFactory from '../../loaderFactory';
import {
  StepAutoCompleteInteractionsQuery,
  StepAutoCompleteInteractionsQueryDocument,
  StepAutoCompleteInteractionsQueryVariables,
} from '../../../graphql/queries/generated/StepAutoCompleteInteractions';

const stepAutoCompleteInteractionsLoader = loaderFactory<
  StepAutoCompleteInteractionsQueryVariables,
  StepAutoCompleteInteractionsQuery
>('stepAutoCompleteInteractions', StepAutoCompleteInteractionsQueryDocument);

export default stepAutoCompleteInteractionsLoader;
