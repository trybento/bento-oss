/* Auto-generated by graphql-codegen. Do not edit.  */
/* Make query edits in the corresponding /graphql/*.graphql file */
/* eslint-disable */
import * as Types from '../../schema.types';

import { gql } from 'urql';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type NpsSurveysQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type NpsSurveysQuery = { __typename?: 'RootType', npsSurveys: Array<{ __typename?: 'EmbedNpsSurvey', entityId: any, formFactor: Types.NpsFormFactorEnumType, formFactorStyle: any, question: string, fupType: Types.NpsFollowUpQuestionTypeEnumType, fupSettings: any, orderIndex: number, firstSeenAt?: any | null, answeredAt?: any | null, dismissedAt?: any | null, pageTargeting: { __typename?: 'EmbedNpsSurveyPageTargeting', type: Types.NpsPageTargetingTypeEnumType, url?: string | null } } | null> };

export type NpsSurveysQuery_NpsSurvey = { __typename?: 'EmbedNpsSurvey', entityId: any, formFactor: Types.NpsFormFactorEnumType, formFactorStyle: any, question: string, fupType: Types.NpsFollowUpQuestionTypeEnumType, fupSettings: any, orderIndex: number, firstSeenAt?: any | null, answeredAt?: any | null, dismissedAt?: any | null, pageTargeting: { __typename?: 'EmbedNpsSurveyPageTargeting', type: Types.NpsPageTargetingTypeEnumType, url?: string | null } };

export const NpsSurveysQuery_NpsSurvey = gql`
    fragment NpsSurveysQuery_npsSurvey on EmbedNpsSurvey {
  entityId
  formFactor
  formFactorStyle
  question
  fupType
  fupSettings
  orderIndex
  pageTargeting {
    type
    url
  }
  firstSeenAt
  answeredAt
  dismissedAt
}
    `;
export const NpsSurveysQueryDocument = gql`
    query NpsSurveysQuery {
  npsSurveys {
    ...NpsSurveysQuery_npsSurvey
  }
}
    ${NpsSurveysQuery_NpsSurvey}`;

export function useNpsSurveysQuery(options?: Omit<Urql.UseQueryArgs<NpsSurveysQueryVariables>, 'query'>) {
  return Urql.useQuery<NpsSurveysQuery, NpsSurveysQueryVariables>({ query: NpsSurveysQueryDocument, ...options });
};