/* Auto-generated by graphql-codegen. Do not edit.  */
/* Make query edits in the corresponding /graphql/*.graphql file */
/* eslint-disable */
import * as Types from '../../schema.types';

import { gql } from 'urql';
import { StepAutoCompleteInteractionsQuery_StepAutoCompleteInteraction } from '../../queries/generated/StepAutoCompleteInteractions';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type StepAutoCompleteInteractionsChangedVariables = Types.Exact<{ [key: string]: never; }>;


export type StepAutoCompleteInteractionsChanged = { __typename?: 'Subscription', stepAutoCompleteInteractionsChanged?: { __typename?: 'EmbedStepAutoCompleteInteractions', stepAutoCompleteInteractions: Array<{ __typename?: 'EmbedStepAutoCompleteInteraction', entityId: any, url: string, wildcardUrl: string, elementSelector: string, type: Types.StepAutoCompleteInteractionTypeEnumType, step: any, guide: any } | null> } | null };


export const StepAutoCompleteInteractionsChangedDocument = gql`
    subscription StepAutoCompleteInteractionsChanged {
  stepAutoCompleteInteractionsChanged {
    stepAutoCompleteInteractions {
      ...StepAutoCompleteInteractionsQuery_stepAutoCompleteInteraction
    }
  }
}
    ${StepAutoCompleteInteractionsQuery_StepAutoCompleteInteraction}`;

export function useStepAutoCompleteInteractionsChanged<TData = StepAutoCompleteInteractionsChanged>(options: Omit<Urql.UseSubscriptionArgs<StepAutoCompleteInteractionsChangedVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<StepAutoCompleteInteractionsChanged, TData>) {
  return Urql.useSubscription<StepAutoCompleteInteractionsChanged, TData, StepAutoCompleteInteractionsChangedVariables>({ query: StepAutoCompleteInteractionsChangedDocument, ...options }, handler);
};