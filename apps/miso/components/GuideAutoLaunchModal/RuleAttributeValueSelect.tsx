import React, { useCallback, useEffect, useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import { Props as DefaultProps } from 'react-select';
import { CreatableProps } from 'react-select/creatable';

import { AttributeType } from 'bento-common/types';

import Select from 'system/Select';
import RuleAttributeValuesQuery from 'queries/RuleAttributeValuesQuery';
import { RuleAttributeValuesQuery as RuleAttributeValuesQueryType } from 'relay-types/RuleAttributeValuesQuery.graphql';
import MultiSelect from 'system/MultiSelect';
import { QUERY_DEBOUNCE_DELAY } from 'helpers/constants';

type Props = Omit<DefaultProps, 'value' | 'defaultValue' | 'isSearchable'> & {
  attributeName: string;
  attributeType: AttributeType;
  selectKey?: string;
  value?: string | number | boolean | Date | string[];
  defaultValue?: string | number | boolean | Date;
  placeholder?: string;
} & (
    | { isCreatable?: true }
    | ({ isCreatable: false } & CreatableProps<any, any, any>)
  );

const RuleAttributeValueSelect: React.FC<Props> = ({
  attributeName,
  attributeType,
  selectKey: key,
  value,
  defaultValue,
  isDisabled,
  onChange,
  styles,
  placeholder,
  isCreatable = true,
  isMulti,
}) => {
  const [searchTerm, setSearchTerm] = useState<Props['value']>();
  const [attributeValues, setAttributeValues] = useState<
    RuleAttributeValuesQueryType['response']['attributeValues']
  >([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const options = useMemo(
    () =>
      attributeValues.map((attributeValue) => ({
        value: attributeValue,
        label: attributeValue,
      })),
    [attributeValues]
  );

  const search = useCallback(
    debounce(async (name: string, type: string, q?: Props['value']) => {
      try {
        setLoading(true);
        if (name && type) {
          const response = await RuleAttributeValuesQuery({
            name,
            type,
            q: q ? String(q) : undefined,
          });
          setAttributeValues(response?.attributeValues || []);
        } else {
          setAttributeValues([]);
        }
      } catch (innerError) {
        console.error(innerError);
      } finally {
        setLoading(false);
      }
    }, QUERY_DEBOUNCE_DELAY),
    [attributeName, attributeType]
  );

  useEffect(() => {
    search(attributeName, attributeType, searchTerm);
  }, [searchTerm, attributeName, attributeType]);

  const onMenuClose = useCallback(() => {
    setSearchTerm('');
  }, [value]);

  const parsedValue = useMemo(() => {
    const val = (value === undefined && defaultValue) || value;
    return val
      ? Array.isArray(val)
        ? val.map((v) => ({ value: v, label: v }))
        : { value: val, label: val }
      : undefined;
  }, [value]);

  if (isMulti) {
    return (
      <MultiSelect
        selectedValues={Array.isArray(parsedValue) ? parsedValue : []}
        options={options}
        loading={isLoading}
        disabled={isDisabled}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onChange={onChange}
      />
    );
  }

  return (
    <Select
      isCreatable={isCreatable}
      isSearchable
      key={key}
      value={parsedValue}
      placeholder={placeholder || 'Type to search'}
      isDisabled={isDisabled}
      onChange={onChange}
      onInputChange={setSearchTerm}
      onMenuClose={onMenuClose}
      options={options}
      styles={styles}
      isLoading={isLoading}
      asyncFilter
      clearInputOnChange
    />
  );
};

export default RuleAttributeValueSelect;
