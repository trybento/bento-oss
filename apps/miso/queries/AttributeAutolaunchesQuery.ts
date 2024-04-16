import { graphql } from 'react-relay';
import fetchQuery from 'queries/fetchQuery';
import { AttributeAutolaunchesQuery } from 'relay-types/AttributeAutolaunchesQuery.graphql';

const commit = (
  name: string,
  type: AttributeAutolaunchesQuery['variables']['type']
) => {
  return fetchQuery<
    AttributeAutolaunchesQuery['variables'],
    AttributeAutolaunchesQuery['response']
  >({
    query: graphql`
      query AttributeAutolaunchesQuery($name: String!, $type: AttributeType!) {
        attribute: findAttribute(name: $name, type: $type) {
          entityId
          autolaunches {
            name
            entityId
            createdFromTemplate {
              entityId
              name
              privateName
            }
          }
        }
      }
    `,
    variables: { name, type },
    doNotRetain: true,
    options: {
      fetchPolicy: 'store-or-network',
    },
  });
};

export default commit;
