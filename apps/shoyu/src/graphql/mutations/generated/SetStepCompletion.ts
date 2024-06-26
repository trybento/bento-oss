/* Auto-generated by graphql-codegen. Do not edit.  */
/* Make query edits in the corresponding /graphql/*.graphql file */
/* eslint-disable */
import * as Types from '../../schema.types';

import { gql } from 'urql';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SetStepCompletionMutationVariables = Types.Exact<{
  input: Types.SetStepCompletionInput;
}>;


export type SetStepCompletionMutation = { __typename?: 'Mutation', setStepCompletion?: { __typename?: 'SetStepCompletionPayload', errors?: Array<string> | null, step?: { __typename: 'EmbedStep', entityId: any, isComplete: boolean } | null } | null };


export const SetStepCompletionMutationDocument = gql`
    mutation SetStepCompletionMutation($input: SetStepCompletionInput!) {
  setStepCompletion(input: $input) {
    errors
    step {
      __typename
      entityId
      isComplete
    }
  }
}
    `;

export function useSetStepCompletionMutation() {
  return Urql.useMutation<SetStepCompletionMutation, SetStepCompletionMutationVariables>(SetStepCompletionMutationDocument);
};