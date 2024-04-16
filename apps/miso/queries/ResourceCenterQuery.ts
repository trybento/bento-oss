import { graphql } from 'react-relay';

import { ResourceCenterQuery } from 'relay-types/ResourceCenterQuery.graphql';
import fetchQuery from 'queries/fetchQuery';

const query = graphql`
  query ResourceCenterQuery {
    attributes {
      type
      name
      valueType
    }
    organization {
      id
      branchingQuestions {
        id
        question
        branchingKey
        choices {
          id
          choiceKey
          label
        }
      }
    }
    orgSettings {
      integrationApiKeys {
        entityId
        type
        state
        key
      }
    }
  }
`;

export default function commit(): Promise<ResourceCenterQuery['response']> {
  return fetchQuery({ query, variables: {}, doNotRetain: true });
}
