import { graphql } from 'react-relay';
import fetchQuery from 'queries/fetchQuery';
import { AttributeAutocompletesQuery } from 'relay-types/AttributeAutocompletesQuery.graphql';

const commit = (
  name: string,
  type: AttributeAutocompletesQuery['variables']['type']
) => {
  return fetchQuery<
    AttributeAutocompletesQuery['variables'],
    AttributeAutocompletesQuery['response']
  >({
    query: graphql`
      query AttributeAutocompletesQuery($name: String!, $type: AttributeType!) {
        attribute: findAttribute(name: $name, type: $type) {
          entityId
          autocompletes {
            entityId
            name
            templates {
              entityId
            }
            module {
              entityId
            }
          }
        }
      }
    `,
    variables: { name, type },
    doNotRetain: true,
  });
};

export default commit;
