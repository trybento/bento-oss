/* Auto-generated by graphql-codegen. Do not edit.  */
/* Make query edits in the corresponding /graphql/*.graphql file */
/* eslint-disable */
import * as Types from '../../schema.types';

import { gql } from 'urql';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type TrackNpsSurveyViewedVariables = Types.Exact<{
  input: Types.TrackNpsSurveyViewedInput;
}>;


export type TrackNpsSurveyViewed = { __typename?: 'Mutation', trackNpsSurveyViewed?: { __typename?: 'TrackNpsSurveyViewedPayload', errors?: Array<string> | null, npsSurvey?: { __typename?: 'EmbedNpsSurvey', entityId: any, firstSeenAt?: any | null } | null } | null };


export const TrackNpsSurveyViewedDocument = gql`
    mutation TrackNpsSurveyViewed($input: TrackNpsSurveyViewedInput!) {
  trackNpsSurveyViewed(input: $input) {
    errors
    npsSurvey {
      entityId
      firstSeenAt
    }
  }
}
    `;

export function useTrackNpsSurveyViewed() {
  return Urql.useMutation<TrackNpsSurveyViewed, TrackNpsSurveyViewedVariables>(TrackNpsSurveyViewedDocument);
};