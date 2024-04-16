import * as React from 'react';
import { Provider } from 'urql';
import { getGraphqlInstance } from '../lib/graphqlClient';

export default function GraphQLProvider({ children }) {
  const graphqlClient = getGraphqlInstance();
  return <Provider value={graphqlClient}>{children}</Provider>;
}
