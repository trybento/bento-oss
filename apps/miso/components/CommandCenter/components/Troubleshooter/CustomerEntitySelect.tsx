import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import debounce from 'lodash/debounce';

import Select, { SelectOptions } from 'system/Select';
import AccountSelectQuery from './queries/AccountSelectQuery';
import {
  AccountSelectQuery$data,
  AccountSelectQuery$variables,
} from 'relay-types/AccountSelectQuery.graphql';
import AccountUserSelectQuery from './queries/AccountUserSelectQuery';
import {
  AccountUserSelectQuery$data,
  AccountUserSelectQuery$variables,
} from 'relay-types/AccountUserSelectQuery.graphql';
import { QUERY_DEBOUNCE_DELAY } from 'helpers/constants';

export type AccountSelection = AccountSelectQuery$data['entities'][number];
export type AccountUserSelection =
  AccountUserSelectQuery$data['entities'][number];

type SelectorType = 'account' | 'accountUser';

type Props<T extends SelectorType> = {
  /** Pass entityId as it is most unique */
  value?: string;
  placeholder?: string;
  queryField: T extends 'account'
    ? AccountSelectQuery$variables['queryField']
    : AccountUserSelectQuery$variables['queryField'];
  onChange: (selected: EntitySelection<T>) => void;
  /** If Account, filters by AccountUser and vice versa */
  filterEntityId?: string;
  isDisabled?: boolean;
  /** Auto select option if only one available */
  autoSelect?: boolean;
  selectFormat?: (base: string, entity: EntitySelection<T>) => string;
};

type EntitySelection<T extends SelectorType> = T extends 'account'
  ? AccountSelection
  : AccountUserSelection;

/**
 * Dynamic, searchable dropdown for accounts and account users
 */
function entitySelectFactory<T extends SelectorType>(
  type: T
): React.FC<Props<T>> {
  return function ({
    isDisabled,
    queryField,
    filterEntityId,
    onChange,
    placeholder,
    value,
    autoSelect = false,
    selectFormat,
  }) {
    const [query, setQuery] = useState<string>(null);
    const [loading, setLoading] = useState(false);
    const [entities, setEntities] = useState<Array<EntitySelection<T>>>([]);
    /** Persistence makes sure the selected option is always available */
    const persistedSelection = useRef<SelectOptions>();

    const search = useCallback(
      debounce(
        async (query: string) => {
          try {
            setLoading(true);
            const response = await (type === 'account'
              ? AccountSelectQuery
              : AccountUserSelectQuery)({
              variables: {
                queryField,
                query,
                filterEntityId,
              } as any,
            });
            setEntities(response.entities as EntitySelection<T>[]);
          } finally {
            setLoading(false);
          }
        },
        QUERY_DEBOUNCE_DELAY,
        {
          leading: false,
        }
      ),
      [queryField, filterEntityId]
    );

    useEffect(() => {
      /* Prevent re-search when menu closes */
      if (query || !value) search(query);
    }, [query, value]);

    const options = useMemo(() => {
      const persistedValue = query ? null : persistedSelection.current?.value;

      return entities.reduce<SelectOptions[]>(
        (a, entity) => {
          if (entity.entityId !== persistedValue) {
            const base = entity[queryField as string];
            a.push({
              value: entity.entityId,
              label: selectFormat ? selectFormat(base, entity) : base,
            });
          }

          return a;
        },
        persistedSelection.current && !query ? [persistedSelection.current] : []
      );
    }, [entities, persistedSelection.current?.value, query, selectFormat]);

    const clearSearch = useCallback(() => setQuery(''), []);

    const handleInput = useCallback((input: string) => setQuery(input), []);

    const selectedMenuItem = useMemo(
      () => options.find((o) => o.value === value),
      [value, queryField, options]
    );

    const handleSelect = useCallback(
      (selected: SelectOptions) => {
        onChange(entities.find((o) => o.entityId === selected.value));
        persistedSelection.current = selected;
      },
      [entities]
    );

    const handleReset = useCallback(() => onChange(null), []);

    /** Handle manual select from menu to enable deselect */
    const handleMenuSelect = useCallback(
      (selected: SelectOptions) => {
        /** Deselect */
        if (selected.value === value) return handleReset();

        handleSelect(selected);
        search('');
        clearSearch();
      },
      [entities, value]
    );

    useEffect(() => {
      /** Prevent empty state */
      if (query === null && options.length === 0) {
        setQuery('');
        search('');
      }
    }, [query, options]);

    useEffect(() => {
      if (autoSelect && options.length === 1) handleSelect(options[0]);
    }, [autoSelect, options, handleSelect]);

    return (
      <Select
        key={selectedMenuItem?.value}
        options={options}
        value={selectedMenuItem}
        isDisabled={isDisabled}
        onChange={handleMenuSelect}
        onMenuClose={clearSearch}
        placeholder={placeholder}
        onInputChange={handleInput}
        isLoading={loading}
        asyncFilter
        isSearchable={!selectedMenuItem}
        onClear={selectedMenuItem && !isDisabled ? handleReset : undefined}
      />
    );
  };
}

export const AccountSelect = entitySelectFactory('account');
export const AccountUserSelect = entitySelectFactory('accountUser');
