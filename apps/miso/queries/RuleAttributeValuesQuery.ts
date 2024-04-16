import { graphql } from 'react-relay';

import { RuleAttributeValuesQuery } from 'relay-types/RuleAttributeValuesQuery.graphql';
import fetchQuery from 'queries/fetchQuery';

const query = graphql`
  query RuleAttributeValuesQuery(
    $name: String
    $type: String
    $q: String
    $qs: [String!]
  ) {
    attributeValues: findAttributeValues(
      name: $name
      type: $type
      q: $q
      qs: $qs
    )
  }
`;

type Args = RuleAttributeValuesQuery['variables'];

export default function commit({
  name,
  type,
  q,
  qs,
}: Args): Promise<RuleAttributeValuesQuery['response']> {
  const variables: RuleAttributeValuesQuery['variables'] = {
    name,
    type,
    q,
    qs,
  };
  return fetchQuery({ query, variables, doNotRetain: true });
}
