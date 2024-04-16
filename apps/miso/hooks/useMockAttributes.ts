import { useCallback, useEffect, useState } from 'react';
import {
  extractAttributesInString,
  interpolateAttributes,
} from 'bento-common/data/helpers';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import get from 'lodash/get';
import debounce from 'lodash/debounce';

export type MockedAttributes = Record<string, Record<string, string | number>>;

/** Returns a copy of the provided value. */
export function applyMockedAttributes<T extends object>(
  value: T,
  mockedAttributes: MockedAttributes | null | undefined,
  defaultIfNoMatch?: string
) {
  return Object.entries(mockedAttributes || {}).reduce(
    (patchedValue, [field, attributeValues]) => {
      const setting = get(patchedValue, field);
      set(
        patchedValue,
        field,
        interpolateAttributes(setting, attributeValues, defaultIfNoMatch)
      );
      return patchedValue;
    },
    cloneDeep(value)
  );
}

const useMockAttributes = (value: Record<string, any>, keys: string[]) => {
  const [mockedAttributes, setMockedAttributes] = useState<MockedAttributes>(
    {}
  );

  const trackAttributes = useCallback(
    debounce(
      (
        v: Record<string, any>,
        ks: string[],
        currentMocks: MockedAttributes
      ) => {
        setMockedAttributes(
          ks.reduce((a, k) => {
            a[k] = extractAttributesInString(get(v, k)).reduce(
              (a2, attrKey) => {
                const sanitizedAttrKey = attrKey.replace(/{|}/g, '');
                a2[sanitizedAttrKey] =
                  currentMocks[k]?.[sanitizedAttrKey] || '';
                return a2;
              },
              {}
            );
            return a;
          }, {})
        );
      },
      500
    ),
    []
  );

  const updateAttributeMock = useCallback(
    (valueKey: string, attributeKey: string) => (mockValue: string) => {
      setMockedAttributes((s) => ({
        ...s,
        [valueKey]: {
          ...(s[valueKey] || {}),
          [attributeKey]: mockValue,
        },
      }));
    },
    []
  );

  useEffect(
    () => {
      trackAttributes(value, keys, mockedAttributes);
    },
    keys.map((k) => get(value, k))
  );

  return { mockedAttributes, trackAttributes, updateAttributeMock };
};

export default useMockAttributes;
