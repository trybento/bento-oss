/* Auto-generated by graphql-codegen. Do not edit.  */
/* Make query edits in the corresponding /graphql/*.graphql file */
/* eslint-disable */
import * as Types from '../../schema.types';

import { gql } from 'urql';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type ResetOnboardingMutationVariables = Types.Exact<{
  input: Types.ResetOnboardingInput;
}>;


export type ResetOnboardingMutation = { __typename?: 'Mutation', resetOnboarding?: { __typename?: 'ResetOnboardingPayload', accountUser?: { __typename: 'EmbedAccountUser', id: string } | null } | null };


export const ResetOnboardingMutationDocument = gql`
    mutation ResetOnboardingMutation($input: ResetOnboardingInput!) {
  resetOnboarding(input: $input) {
    accountUser {
      id
      __typename
    }
  }
}
    `;

export function useResetOnboardingMutation() {
  return Urql.useMutation<ResetOnboardingMutation, ResetOnboardingMutationVariables>(ResetOnboardingMutationDocument);
};