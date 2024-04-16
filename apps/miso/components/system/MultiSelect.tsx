import { ActionMeta, components, OptionProps } from 'react-select';
import colors from 'helpers/colors';
import Checkbox from 'system/Checkbox';
import { noop } from 'bento-common/utils/functions';
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuList,
} from '@chakra-ui/react';
import SearchIcon from '@mui/icons-material/Search';
import UnfoldMore from '@mui/icons-material/UnfoldMore';
import Select from './Select';
import { uniq } from 'lodash';
import { useCallback, useEffect, useState } from 'react';

const menuItemBg = colors.bento.pale;

export type MultiSelectOption = { value: string; label: string };

/**
 * Sort the available options in alphabetical order based on their
 * label. Also put selected values at the top of the list.
 */
const sortOptions = (
  selected: MultiSelectOption[],
  options: MultiSelectOption[]
) => {
  const selectedValues = new Set(selected.map((s) => s.value));

  return [
    // Sort currently selected values to the top
    ...(selected || []).sort((a, b) => a.label.localeCompare(b.label)),
    // Unselected values are sent to the bottom
    ...uniq([...options, ...selected])
      .filter((option) => !selectedValues.has(option.label))
      .sort((a, b) => a.label.localeCompare(b.value)),
  ];
};

export const OptionWithCheckbox: React.FC<OptionProps> = ({
  getStyles,
  isDisabled,
  isFocused,
  isMulti,
  isSelected,
  children,
  innerProps,
  ...rest
}) => {
  const selected = isSelected;

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
    </components.Option>
  );
};

const DropdownIndicator = () => <SearchIcon fontSize="small" sx={{ mr: 1 }} />;

interface MultiSelectProps {
  selectedValues: MultiSelectOption[];
  options: MultiSelectOption[];
  loading?: boolean;
  disabled?: boolean;
  searchTerm?: string;
  setSearchTerm?: (searchTerm: string) => void;
  onChange: (
    newValue: string,
    actionMeta: ActionMeta<MultiSelectOption>
  ) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  selectedValues,
  options,
  loading,
  disabled,
  searchTerm,
  setSearchTerm,
  onChange,
}) => {
  const [sortedOptions, setSortedOptions] = useState(
    sortOptions(selectedValues, options)
  );

  const onDropdownClose = useCallback(() => {
    setSortedOptions(sortOptions(selectedValues, options));
  }, [selectedValues, options]);

  useEffect(() => {
    setSortedOptions(sortOptions(selectedValues, options));
  }, [options]);

  return (
    <Menu onClose={onDropdownClose}>
      <MenuButton
        as={Button}
        rightIcon={<UnfoldMore />}
        width="235px"
        fontSize="sm"
        variant="dropdown"
        paddingStart={3}
        paddingEnd={0}
      >
        <Flex gap={1}>
          <Box
            flex="1"
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            textAlign="left"
          >
            {selectedValues.map((s) => s.label).join(', ')}
          </Box>
          {selectedValues.length > 0 && (
            <Box>
              <strong>{selectedValues.length}</strong>
            </Box>
          )}
        </Flex>
      </MenuButton>
      <MenuList pt={0} width="235px">
        <Select
          backspaceRemovesValue={false}
          isClearable={false}
          inputValue={searchTerm}
          isCreatable
          value={selectedValues}
          placeholder="Search values"
          isDisabled={disabled}
          onChange={onChange}
          onInputChange={setSearchTerm}
          options={sortedOptions}
          isLoading={loading}
          isMulti
          asyncFilter
          closeMenuOnSelect={false}
          components={{
            Option: OptionWithCheckbox,
            DropdownIndicator,
          }}
          hideSelectedOptions={false}
          controlShouldRenderValue={false}
          menuIsOpen
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
              display: provided.display,
              margin: '12px',
              borderColor: colors.gray[200],
            }),
            placeholder: (provided) => {
              return {
                ...provided,
                color: colors.text.placeholder,
              };
            },
          }}
        />
      </MenuList>
    </Menu>
  );
};

export default MultiSelect;
