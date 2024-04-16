/* Auto-generated by graphql-codegen. Do not edit.  */
/* Make query edits in the corresponding /graphql/*.graphql file */
/* eslint-disable */
import * as Types from '../../schema.types';

import { gql } from 'urql';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type DismissNpsSurveyMutationVariables = Types.Exact<{
  input: Types.DismissNpsSurveyInput;
}>;


export type DismissNpsSurveyMutation = { __typename?: 'Mutation', dismissNpsSurvey?: { __typename?: 'DismissNpsSurveyPayload', errors?: Array<string> | null, npsSurvey?: { __typename?: 'EmbedNpsSurvey', entityId: any, dismissedAt?: any | null } | null } | null };


export const DismissNpsSurveyMutationDocument = gql`
    mutation DismissNpsSurveyMutation($input: DismissNpsSurveyInput!) {
  dismissNpsSurvey(input: $input) {
    errors
    npsSurvey {
      entityId
      dismissedAt
    }
  }
}
    `;

export function useDismissNpsSurveyMutation() {
  return Urql.useMutation<DismissNpsSurveyMutation, DismissNpsSurveyMutationVariables>(DismissNpsSurveyMutationDocument);
};