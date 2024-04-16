import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { MockedAttributes } from 'hooks/useMockAttributes';
import debounce from 'lodash/debounce';
import { extractAttributesInString } from 'bento-common/data/helpers';
import {
  ClientStorage,
  saveToClientStorage,
} from 'bento-common/utils/clientStorage';
import { WYSIWYG_EDITOR_MOCKED_ATTRIBUTES } from 'components/WysiwygEditor/constants';

interface MockedAttributesContextValue {
  trackAttributes: (v: any, k: string, defaultMock?: any) => void;
  mockedAttributes: MockedAttributes;
  updateAttributeMock: (
    valueKey: string,
    attributeKey: string
  ) => (mockValue: string | number) => void;
}

const MockedAttributesContext = createContext<MockedAttributesContextValue>({
  trackAttributes: (_v, _k, _d) => {},
  mockedAttributes: {},
  updateAttributeMock: (_v, _a) => (_mv) => {},
});

export function useMockedAttributesProvider() {
  return useContext(MockedAttributesContext);
}

export default function MockedAttributesProviderComponent({ children }) {
  const [mockedAttributes, setMockedAttributes] = useState<MockedAttributes>(
    {}
  );

  const updateAttributeMock = useCallback(
    (valueKey: string, attributeKey: string) =>
      (mockValue: string | number) => {
        setMockedAttributes((s) => ({
          ...s,
          [valueKey]: {
            ...(s[valueKey] || {}),
            [attributeKey]: String(mockValue),
          },
        }));
      },
    []
  );

  const trackAttributes = useCallback(
    debounce((v: any, k: string, defaultMock?: any) => {
      setMockedAttributes((s) => ({
        ...s,
        [k]: extractAttributesInString(v).reduce((a2, attrKey) => {
          const sanitizedAttrKey = attrKey.replace(/{|}/g, '');
          a2[sanitizedAttrKey] = String(
            s[k]?.[sanitizedAttrKey] || defaultMock || ''
          );
          return a2;
        }, {}),
      }));
    }, 500),
    []
  );

  const persistWysiwygAttributes = useCallback(
    debounce((ma: MockedAttributes) => {
      saveToClientStorage(
        ClientStorage.sessionStorage,
        WYSIWYG_EDITOR_MOCKED_ATTRIBUTES,
        Object.entries(ma).reduce((acc, [k, v]) => {
          acc[k.replace('templateData.', '')] = v;
          return acc;
        }, {})
      );
    }, 1000),
    []
  );

  useEffect(() => {
    persistWysiwygAttributes(mockedAttributes);
  }, [mockedAttributes]);

  return (
    <MockedAttributesContext.Provider
      value={{
        mockedAttributes,
        updateAttributeMock,
        trackAttributes,
      }}
    >
      {children}
    </MockedAttributesContext.Provider>
  );
}
