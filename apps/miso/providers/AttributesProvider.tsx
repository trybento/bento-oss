import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { graphql } from 'react-relay';

import QueryRenderer from 'components/QueryRenderer';
import { AttributesProviderQuery } from 'relay-types/AttributesProviderQuery.graphql';
import UserCache from 'helpers/UserCache';
import { attributesFilter } from 'components/EditorCommon/targeting.helpers';
import { AttributeType, Writable } from 'bento-common/types';

const AttributesContext = createContext({
  initialized: false,
  attributes: [],
  accountAttributes: [],
  accountUserAttributes: [],
});

type AttributesProviderContextValue = {
  attributes: AttributesQuery_attributes;
  initialized: boolean;
  accountAttributes: AttributesQuery_attributes;
  accountUserAttributes: AttributesQuery_attributes;
};

export type AttributesQuery_attributes =
  AttributesProviderQuery['response']['attributes'];

export function useAttributes(): Writable<AttributesProviderContextValue> {
  const { attributes, initialized, accountAttributes, accountUserAttributes } =
    useContext(AttributesContext);

  return {
    attributes: attributes || [],
    initialized,
    accountAttributes: accountAttributes || [],
    accountUserAttributes: accountUserAttributes || [],
  };
}

function AttributesProviderComponent({ children, attributes, initialized }) {
  const accountAttributes = useMemo(
    () => attributesFilter(attributes, AttributeType.account),
    [attributes]
  );
  const accountUserAttributes = useMemo(
    () => attributesFilter(attributes, AttributeType.accountUser),
    [attributes]
  );

  return (
    <AttributesContext.Provider
      value={{
        attributes,
        initialized,
        accountAttributes,
        accountUserAttributes,
      }}
    >
      {children}
    </AttributesContext.Provider>
  );
}

const ATTRIBUTES_QUERY = graphql`
  query AttributesProviderQuery {
    attributes {
      type
      name
      valueType
    }
  }
`;

const AttributesProvider: React.FC<{ children: ReactNode }> = ({
  children: containerChildren,
}) => {
  const infoCache = UserCache.getAttributesResponse();

  return (
    <QueryRenderer<AttributesProviderQuery>
      query={ATTRIBUTES_QUERY}
      render={({ props }: { props: AttributesProviderQuery['response'] }) => {
        if (props || infoCache) {
          if (props) UserCache.setAttributesResponse(props);
          const { attributes } = props || {};
          return (
            <AttributesProviderComponent
              attributes={attributes || infoCache.attributes}
              children={containerChildren}
              initialized
            />
          );
        }
      }}
    />
  );
};

export default AttributesProvider;
