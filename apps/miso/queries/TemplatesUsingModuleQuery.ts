import { graphql } from 'react-relay';
import fetchQuery from 'queries/fetchQuery';
import { TemplatesUsingModuleQuery } from 'relay-types/TemplatesUsingModuleQuery.graphql';

const commit = (moduleEntityId: string) => {
  return fetchQuery<
    TemplatesUsingModuleQuery['variables'],
    TemplatesUsingModuleQuery['response']
  >({
    query: graphql`
      query TemplatesUsingModuleQuery($entityId: EntityId!) {
        module: findModule(entityId: $entityId) {
          templates {
            name
            entityId
          }
        }
      }
    `,
    variables: { entityId: moduleEntityId },
    doNotRetain: true,
  });
};

export default commit;
