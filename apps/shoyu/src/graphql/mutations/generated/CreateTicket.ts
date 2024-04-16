/* Auto-generated by graphql-codegen. Do not edit.  */
/* Make query edits in the corresponding /graphql/*.graphql file */
/* eslint-disable */
import * as Types from '../../schema.types';

import { gql } from 'urql';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type CreateTicketMutationVariables = Types.Exact<{
  input: Types.CreateTicketInput;
}>;


export type CreateTicketMutation = { __typename?: 'Mutation', createTicket?: { __typename?: 'CreateTicketPayload', errors?: Array<string> | null } | null };


export const CreateTicketMutationDocument = gql`
    mutation CreateTicketMutation($input: CreateTicketInput!) {
  createTicket(input: $input) {
    errors
  }
}
    `;

export function useCreateTicketMutation() {
  return Urql.useMutation<CreateTicketMutation, CreateTicketMutationVariables>(CreateTicketMutationDocument);
};