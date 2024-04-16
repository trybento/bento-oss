import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { ArrayToCsvReportMutation } from 'relay-types/ArrayToCsvReportMutation.graphql';

const mutationName = 'arrayToCsvReport';
const mutation = graphql`
  mutation ArrayToCsvReportMutation($input: ArrayToCsvReportInput!) {
    arrayToCsvReport(input: $input) {
      errors
    }
  }
`;

type Args = ArrayToCsvReportMutation['variables']['input'];

export function commit({
  data,
  filename,
  subject,
  text,
  html,
}: Args): Promise<ArrayToCsvReportMutation['response']> {
  const variables: ArrayToCsvReportMutation['variables'] = {
    input: {
      data,
      filename,
      subject,
      text,
      html,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
