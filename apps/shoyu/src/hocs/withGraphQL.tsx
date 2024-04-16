import React from 'react';
import GraphQLProvider from '../providers/GraphQLProvider';

const WithGraphQL =
  <P extends object>(WrappedComponent: React.ComponentType<P>): React.FC<P> =>
  (props) => {
    return (
      <GraphQLProvider>
        <WrappedComponent {...props} />
      </GraphQLProvider>
    );
  };
export default WithGraphQL;
