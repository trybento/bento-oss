import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  BoxProps,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuProps,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';
import CloseIcon from '@mui/icons-material/Close';
import Checkbox from 'system/Checkbox';
import SearchIcon from '@mui/icons-material/Search';
import colors from 'helpers/colors';
import Select from 'system/Select';
import { components, OptionProps } from 'react-select';
import ChevronRight from '@mui/icons-material/ChevronRight';
import {
  TableFilter,
  TableFilterLabel,
  TableFilters,
} from 'bento-common/types/filters';
import Tooltip from 'system/Tooltip';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import useToggleState from 'hooks/useToggleState';
import { noop } from 'bento-common/utils/functions';
import { STANDARD_SHADOW } from 'bento-common/frontend/styles';

// TODO: Make dynamic based on viewport width.
const maxPillCount = 2;

const menuItemBg = colors.bento.pale;
export type FilterSelection =
  | TableFilter['options']
  | TableFilter['options'][number];

const SubFilterHeader: React.FC<
  {
    selectedCount: number;
    clearLabel: string;
    toggleLabelColor: string;
    selectAllLabel?: string;
    onClear: () => void;
    isMulti?: boolean;
  } & BoxProps
> = ({
  selectedCount,
  clearLabel,
  selectAllLabel,
  toggleLabelColor,
  onClear,
  isMulti,
  ...boxProps
}) => {
  const settings = useMemo(() => {
    const disabled = selectedCount === 0 && !selectAllLabel;
    const label =
      selectedCount === 0 ? selectAllLabel ?? clearLabel : clearLabel;
    const hidden = disabled && !isMulti;

    return {
      disabled,
      label,
      hidden,
    };
  }, [selectedCount, selectAllLabel, clearLabel, isMulti]);

  if (settings.hidden) return null;

  return (
    <Flex fontSize="xs" {...boxProps}>
      {!settings.hidden && (
        <>
          {isMulti && <Box flex="1">{selectedCount} applied</Box>}
          <Box
            onClick={onClear}
            fontWeight="bold"
            color={toggleLabelColor}
            opacity={settings.disabled ? 0.5 : 1}
            pointerEvents={settings.disabled ? 'none' : undefined}
            _hover={{
              opacity: 0.7,
            }}
            cursor="pointer"
          >
            {settings.label}
          </Box>
        </>
      )}
    </Flex>
  );
};

const searchIconSize = '15px';
const DropdownIndicatorComponent = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <SearchIcon style={{ width: searchIconSize, height: searchIconSize }} />
    </components.DropdownIndicator>
  );
};

const OptionComponent = ({
  getStyles,
  isDisabled,
  isFocused,
  isMulti,
  isSelected,
  children,
  innerProps,
  ...rest
}: OptionProps<TableFilter['options'][number], false>) => {
  const selected = isSelected || rest.data.isSelected;
  return (
    <components.Option
      {...rest}
      isDisabled={isDisabled}
      isFocused={isFocused}
      isSelected={selected}
      isMulti={isMulti}
      getStyles={getStyles}
      innerProps={{
        ...innerProps,
        style: {
          cursor: 'pointer',
          alignItems: 'center',
          position: 'relative',
          overflowX: 'hidden',
          backgroundColor: isMulti
            ? isFocused
              ? menuItemBg
              : 'transparent'
            : isFocused && !selected
            ? menuItemBg
            : undefined,
          color: isMulti || !selected ? 'inherit' : 'white',
          display: 'flex ',
        },
      }}
    >
      {isMulti && (
        <Checkbox
          isChecked={selected}
          pointerEvents="none"
          mr="2.5"
          borderColor="gray.300"
          onChange={noop}
          animationDisabled
        />
      )}
      <Box flex="1" isTruncated>
        {children}
      </Box>
      {(rest.data as any).element}
    </components.Option>
  );
};

const FilterMenuItem: React.FC<
  {
    label: TableFilterLabel;
    onChange: (
      label: TableFilterLabel,
      selection?: FilterSelection,
      newOptions?: TableFilter['options']
    ) => void;
    onOptionsChange?: (
      label: TableFilterLabel,
      newOptions: TableFilter['options']
    ) => void;
  } & TableFilter
> = ({
  label,
  isSelected,
  options,
  isDisabled,
  isMulti,
  noOptionsMessage,
  searchable,
  searchPlaceholder,
  disabledTooltip,
  onChange,
  asyncSearch,
  hydrated,
  asyncHydrate,
}) => {
  const menuState = useToggleState(['loading', 'open']);
  const selectedOptions = useMemo(
    () => options.filter((o) => o.isSelected),
    [options]
  );

  const [resetCount, setResetCount] = useState<number>(0);

  useEffect(() => {
    (async () => {
      if (asyncHydrate && menuState.open.isOn && !hydrated) {
        try {
          menuState.loading.on();
          onChange(label, [], await asyncHydrate());
        } finally {
          menuState.loading.off();
        }
      }
    })();
  }, [hydrated, menuState.open.isOn]);

  const handleChange = useCallback(
    (selection: FilterSelection) => {
      onChange(label, selection);
    },
    [label, onChange]
  );

  const handleToggleAll = useCallback(() => {
    const clearAll = selectedOptions.length > 0;
    onChange(label, clearAll ? undefined : options);
    handleSearch('');
    setResetCount((v) => v + 1);
  }, [label, onChange, options, selectedOptions.length]);

  // Fixes a bug in the Select component where the input
  // just won't refresh the select value.
  useEffect(() => {
    if (searchable && selectedOptions.length > 0) setResetCount((v) => v + 1);
  }, [selectedOptions.length, searchable]);

  useEffect(() => {
    if (!isSelected && selectedOptions.length > 0) {
      handleToggleAll();
    }
  }, [isSelected]);

  const noOptionsComponent = useCallback(
    () => noOptionsMessage,
    [noOptionsMessage]
  );

  const handleSearch = useCallback(
    debounce(async (input: string, action?: any) => {
      if (
        asyncSearch &&
        (action === undefined || action.action === 'input-change')
      ) {
        try {
          menuState.loading.on();
          onChange(label, [], await asyncSearch(input));
        } finally {
          menuState.loading.off();
        }
      }
    }, 1000),
    [label, menuState]
  );

  useEffect(() => {
    handleSearch('');
  }, []);

  return (
    <Menu
      placement="right-start"
      closeOnSelect={false}
      closeOnBlur={true}
      offset={[0, 0]}
      onClose={menuState.open.off}
      onOpen={menuState.open.on}
      lazyBehavior="keepMounted"
      isLazy
    >
      <Tooltip
        placement="bottom-start"
        label={disabledTooltip}
        offset={[10, 0]}
      >
        {/**
         * "Box" Added to bypass pointerEvents="none"
         * not triggering hover events.
         */}
        <Box>
          <MenuButton
            w="full"
            px="3"
            py="3.5"
            bg={isDisabled ? 'gray.100' : undefined}
            pointerEvents={isDisabled ? 'none' : undefined}
            _hover={{ bg: menuItemBg }}
            _expanded={{ bg: menuItemBg }}
            cursor="pointer"
          >
            <MenuItem
              p="0"
              className="no-background"
              opacity={isDisabled ? 0.5 : undefined}
              closeOnSelect={false}
            >
              <Flex w="full">
                <Box isTruncated mr="1">
                  {label}
                </Box>
                {selectedOptions.length > 0 && <>({selectedOptions.length})</>}
                <ChevronRight
                  style={{ marginLeft: 'auto', color: colors.gray[600] }}
                />
              </Flex>
            </MenuItem>
          </MenuButton>
        </Box>
      </Tooltip>
      <MenuList
        fontSize="sm"
        p="0"
        zIndex={3}
        left="0"
        bg="white"
        boxShadow={STANDARD_SHADOW}
        borderRadius="md"
        /**
         * Prevents hidden sub menus blocking click.
         */
        display={menuState.open.isOn ? 'flex' : 'none'}
        flexDir="column"
        w="240px"
      >
        <SubFilterHeader
          selectedCount={selectedOptions.length}
          clearLabel="Clear"
          selectAllLabel={isMulti ? 'Select all' : undefined}
          toggleLabelColor={colors.bento.bright}
          onClear={handleToggleAll}
          isMulti={isMulti}
          px="3"
          pt="3"
        />
        <Box flex="1" py="1">
          <Select
            key={`filter-select-${label}-${resetCount}`}
            isSearchable={searchable}
            placeholder={searchPlaceholder}
            onInputChange={handleSearch}
            clearInputOnChange={false}
            defaultInputValue={
              /**
               * Has conflict with multi selection
               * if default options are set, meaning that
               * just the first selected option will show.
               */
              searchable && !isMulti ? selectedOptions[0]?.label : undefined
            }
            isLoading={menuState.loading.isOn}
            noOptionsMessage={noOptionsComponent}
            asyncFilter={!!asyncSearch}
            onChange={handleChange}
            isMulti={isMulti}
            hideSelectedOptions={false}
            defaultValue={selectedOptions}
            components={{
              Option: OptionComponent,
              DropdownIndicator: DropdownIndicatorComponent,
            }}
            options={options}
            styles={{
              menu: (provided) => ({
                ...provided,
                position: 'relative',
                margin: '0',
                maxHeight: '250px',
                boxShadow: 'none',
              }),
              menuList: (provided) => ({
                ...provided,
                maxHeight: '250px',
              }),
              control: (provided) => ({
                ...provided,
                display: searchable ? provided.display : 'none',
                margin: '8px 12px 4px 12px',
                borderColor: colors.gray[200],
              }),
              placeholder: (provided) => {
                return {
                  ...provided,
                  color: colors.text.placeholder,
                };
              },
              singleValue: (provided) => {
                return {
                  ...provided,
                  color: colors.text.placeholder,
                };
              },
            }}
            menuIsOpen
          />
        </Box>
      </MenuList>
    </Menu>
  );
};

const Filters: React.FC<
  {
    filters: TableFilters;
    onChange: (selections: TableFilters) => void;
  } & Pick<MenuProps, 'onOpen' | 'onClose'>
> = ({ filters, onOpen, onClose, onChange }) => {
  const [filterSelections, setFilterSelections] =
    useState<TableFilters>(filters);
  const [resetCount, setResetCount] = useState<number>(0);

  const { selectedFilters, selectedCount } = useMemo(() => {
    const result = {
      selectedFilters: Object.entries(filterSelections).reduce(
        (acc, [label, filter]) => {
          if (filter.isSelected) acc[label] = filter;
          return acc;
        },
        {} as TableFilters
      ),
      selectedCount: 0,
    };
    result.selectedCount = Object.keys(result.selectedFilters).length;

    return result;
  }, [filterSelections]);

  const handleClearAll = useCallback(() => {
    const clearedFilters = Object.entries(filters).reduce((acc, [label, f]) => {
      const newF = cloneDeep(f);
      if (newF.isSelected) {
        newF.isSelected = false;
        newF.options.forEach((o) => {
          o.isSelected = false;
        });
      }
      acc[label] = newF;
      return acc;
    }, {} as TableFilters);

    setFilterSelections(clearedFilters);
    onChange(clearedFilters);
    setResetCount((v) => v + 1);
  }, [filters, onChange]);

  const handlePillClear = useCallback((label: TableFilterLabel) => {
    setFilterSelections((s) => ({
      ...s,
      [label]: {
        ...s[label],
        isSelected: false,
      },
    }));
  }, []);

  const handleFilterChange = useCallback(
    (
      label: TableFilterLabel,
      selection: FilterSelection = [],
      newOptions: TableFilter['options']
    ) => {
      const selectionArray = Array.isArray(selection) ? selection : [selection];

      setFilterSelections((state) => {
        const partialState = { [label]: cloneDeep(state[label]) };
        const filter = partialState[label];

        // Set new options from async search/hydration.
        if (newOptions) {
          filter.options = newOptions;
          filter.hydrated = true;
        }

        filter.isSelected = selectionArray.length > 0;
        filter.options.forEach((o) => {
          o.isSelected = selectionArray.some((s) => s.value === o.value);
        });

        // Disable other filters if needed.
        const labelToDisable = filter.disablesField?.label;
        if (
          labelToDisable &&
          /** Skip if disabled state won't change */
          state[labelToDisable].isDisabled !== filter.isSelected
        ) {
          partialState[labelToDisable] = cloneDeep(state[labelToDisable]);
          partialState[labelToDisable].isDisabled = filter.isSelected;
          partialState[labelToDisable].disabledTooltip = filter.isSelected
            ? filter.disablesField.message
            : '';
        }

        const newState = { ...state, ...partialState };
        onChange(newState);
        return newState;
      });
    },
    [filters, onChange]
  );

  return (
    <Flex gap="6">
      <Menu
        placement="bottom-start"
        onOpen={onOpen}
        onClose={onClose}
        closeOnSelect={false}
        closeOnBlur={true}
        lazyBehavior="keepMounted"
        isLazy
      >
        <MenuButton as={Button} variant="secondary" w="20" p="4">
          Filters
        </MenuButton>
        <MenuList
          fontSize="sm"
          p="0"
          zIndex={3}
          w="200px"
          boxShadow={STANDARD_SHADOW}
          borderRadius="base"
          overflow="hidden"
          color={colors.text.primary}
        >
          <SubFilterHeader
            selectedCount={selectedCount}
            clearLabel="Clear filters"
            toggleLabelColor={colors.error.bright}
            borderBottom="1px solid"
            borderColor="gray.200"
            onClear={handleClearAll}
            p="3"
            isMulti
          />
          {Object.entries(filterSelections).map(([label, f]) => (
            <FilterMenuItem
              key={`filter-item-${label}-${resetCount}`}
              {...f}
              label={label as TableFilterLabel}
              onChange={handleFilterChange}
            />
          ))}
        </MenuList>
      </Menu>
      {selectedCount > 0 && (
        <Flex gap="4">
          {Object.entries(selectedFilters)
            .slice(0, maxPillCount)
            .map(([label, f]) => (
              <SelectedFilterPill
                key={`selected-pill-el-${label}`}
                {...f}
                label={label as TableFilterLabel}
                onClear={handlePillClear}
              />
            ))}
          {selectedCount > maxPillCount && (
            <SelectedFiltersOverflow selectedFilters={selectedFilters} />
          )}
        </Flex>
      )}
    </Flex>
  );
};

const SelectedFilterPill: React.FC<
  {
    label: TableFilterLabel | null;
    onClear: (label: TableFilterLabel) => void;
  } & TableFilter
> = ({ label, onClear, options }) => {
  const selectedOptions = useMemo(
    () => options.filter((o) => o.isSelected),
    [options]
  );

  const handleClear = useCallback(() => {
    onClear(label);
  }, [label, onClear]);

  return (
    <Flex
      borderRadius="full"
      bg="gray.100"
      h="40px"
      px="4"
      gap="2"
      color={colors.text.secondary}
    >
      <Box my="auto" maxW="300px" isTruncated>
        <b>{label}:</b>{' '}
        {selectedOptions.length > 1
          ? `${selectedOptions.length} selected`
          : selectedOptions?.[0]?.label || '-'}
      </Box>
      <CloseIcon
        onClick={handleClear}
        style={{
          margin: 'auto',
          width: '20px',
          cursor: 'pointer',
        }}
      />
    </Flex>
  );
};

const SelectedFiltersOverflow: React.FC<{
  selectedFilters: TableFilters;
}> = ({ selectedFilters }) => {
  return (
    <Popover
      trigger="hover"
      placement="bottom-start"
      isLazy
      lazyBehavior="unmount"
    >
      <PopoverTrigger>
        <Flex
          borderRadius="full"
          bg="gray.100"
          h="40px"
          px="2.5"
          gap="3"
          cursor="default"
          whiteSpace="nowrap"
          color={colors.text.secondary}
        >
          <Box m="auto">
            <b>+ {Object.keys(selectedFilters).length - maxPillCount}</b>
          </Box>
        </Flex>
      </PopoverTrigger>
      <PopoverContent
        boxShadow={STANDARD_SHADOW}
        maxW="420px"
        minW="320px"
        w="auto"
      >
        <PopoverBody display="flex" flexDir="column" gap="4" p="4">
          {Object.entries(selectedFilters)
            .slice(maxPillCount)
            .map(([label, f]) => {
              const selectedOptions = f.options.filter((o) => o.isSelected);

              return (
                <Box my="auto" key={`popover-el-${label}`}>
                  <b>{label}:</b>{' '}
                  {selectedOptions.length > 1
                    ? `${selectedOptions.length} selected`
                    : selectedOptions?.[0]?.label || '-'}
                </Box>
              );
            })}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default Filters;
