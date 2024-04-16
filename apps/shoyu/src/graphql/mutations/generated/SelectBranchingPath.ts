/* Auto-generated by graphql-codegen. Do not edit.  */
/* Make query edits in the corresponding /graphql/*.graphql file */
/* eslint-disable */
import * as Types from '../../schema.types';

import { gql } from 'urql';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SelectBranchingPathMutationVariables = Types.Exact<{
  input: Types.SelectBranchingPathInput;
}>;


export type SelectBranchingPathMutation = { __typename?: 'Mutation', selectBranchingPath?: { __typename?: 'selectBranchingPathPayload', errors?: Array<string> | null } | null };


export const SelectBranchingPathMutationDocument = gql`
    mutation SelectBranchingPathMutation($input: selectBranchingPathInput!) {
  selectBranchingPath(input: $input) {
    errors
  }
}
    `;

export function useSelectBranchingPathMutation() {
  return Urql.useMutation<SelectBranchingPathMutation, SelectBranchingPathMutationVariables>(SelectBranchingPathMutationDocument);
};