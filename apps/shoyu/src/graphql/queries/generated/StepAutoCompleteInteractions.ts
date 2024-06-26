/* Auto-generated by graphql-codegen. Do not edit.  */
/* Make query edits in the corresponding /graphql/*.graphql file */
/* eslint-disable */
import * as Types from '../../schema.types';

import { gql } from 'urql';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type StepAutoCompleteInteractionsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type StepAutoCompleteInteractionsQuery = { __typename?: 'RootType', stepAutoCompleteInteractions: Array<{ __typename?: 'EmbedStepAutoCompleteInteraction', entityId: any, url: string, wildcardUrl: string, elementSelector: string, type: Types.StepAutoCompleteInteractionTypeEnumType, step: any, guide: any } | null> };

export type StepAutoCompleteInteractionsQuery_StepAutoCompleteInteraction = { __typename?: 'EmbedStepAutoCompleteInteraction', entityId: any, url: string, wildcardUrl: string, elementSelector: string, type: Types.StepAutoCompleteInteractionTypeEnumType, step: any, guide: any };

export const StepAutoCompleteInteractionsQuery_StepAutoCompleteInteraction = gql`
    fragment StepAutoCompleteInteractionsQuery_stepAutoCompleteInteraction on EmbedStepAutoCompleteInteraction {
  entityId
  url
  wildcardUrl
  elementSelector
  type
  step
  guide
}
    `;
export const StepAutoCompleteInteractionsQueryDocument = gql`
    query StepAutoCompleteInteractionsQuery {
  stepAutoCompleteInteractions {
    ...StepAutoCompleteInteractionsQuery_stepAutoCompleteInteraction
  }
}
    ${StepAutoCompleteInteractionsQuery_StepAutoCompleteInteraction}`;

export function useStepAutoCompleteInteractionsQuery(options?: Omit<Urql.UseQueryArgs<StepAutoCompleteInteractionsQueryVariables>, 'query'>) {
  return Urql.useQuery<StepAutoCompleteInteractionsQuery, StepAutoCompleteInteractionsQueryVariables>({ query: StepAutoCompleteInteractionsQueryDocument, ...options });
};