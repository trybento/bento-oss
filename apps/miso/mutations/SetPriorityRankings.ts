import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import {
  SetPriorityRankingsInput,
  SetPriorityRankingsMutation,
} from 'relay-types/SetPriorityRankingsMutation.graphql';

const mutationName = 'setPriorityRankings';
const mutation = graphql`
  mutation SetPriorityRankingsMutation($input: SetPriorityRankingsInput!) {
    setPriorityRankings(input: $input) {
      targets {
        entityId
        priorityRanking
        type
      }
    }
  }
`;

export function commit({
  targets,
}: SetPriorityRankingsInput): Promise<SetPriorityRankingsMutation['response']> {
  const variables: SetPriorityRankingsMutation['variables'] = {
    input: {
      targets,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
