import { graphql } from 'react-relay';

import { UserWhoEditedATemplateQuery } from 'relay-types/UserWhoEditedATemplateQuery.graphql';
import fetchQuery from 'queries/fetchQuery';

const query = graphql`
  query UserWhoEditedATemplateQuery {
    usersWhoEditedATemplate {
      entityId
      fullName
      email
    }
  }
`;

type Args = UserWhoEditedATemplateQuery['variables'];

export default function commit(): Promise<
  UserWhoEditedATemplateQuery['response']
> {
  return fetchQuery({
    query,
    variables: {},
    doNotRetain: true,
  });
}
