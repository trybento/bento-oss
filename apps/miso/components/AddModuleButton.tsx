import {
  ButtonGroup,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
} from '@chakra-ui/react';
import { MODULE_ALIAS_SINGULAR } from 'helpers/constants';
import React, { forwardRef, useCallback, useMemo, useRef } from 'react';
import {
  components,
  OptionProps,
  Props as ReactSelectProps,
} from 'react-select';

import Box from 'system/Box';
import Button from 'system/Button';
import Select from 'system/Select';
import BranchingIcon from 'components/common/BranchingIcon';
import { ModuleOption } from 'types';
import SearchIcon from '@mui/icons-material/Search';
import { useTemplate } from 'providers/TemplateProvider';
import { ChevronDownIcon } from '@chakra-ui/icons';
import colors from 'helpers/colors';
import useToggleState from 'hooks/useToggleState';
import { NEW_MODULE_OPTION } from 'helpers';

type Props = {
  id?: string;
  allowedModules: ModuleOption[];
  handleAddModule: (moduleData: ModuleOption) => void;
};

const searchIconSize = '15px';
const DropdownIndicatorComponent = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <SearchIcon style={{ width: searchIconSize, height: searchIconSize }} />
    </components.DropdownIndicator>
  );
};

const AddModuleButton = forwardRef(
  (
    { allowedModules: options, handleAddModule }: Props,
    ref: React.Ref<HTMLDivElement>
  ) => {
    // @see https://react-select.com/props
    const dropdownRef = useRef(null);
    const menuState = useToggleState(['open']);

    const { branchingStepGroupIds } = useTemplate();

    const isOptionDisabled = useCallback<ReactSelectProps['isOptionDisabled']>(
      (option: ModuleOption) => branchingStepGroupIds.includes(option.value),
      [branchingStepGroupIds]
    );

    const handleOnChange = useCallback(
      (data: ModuleOption | React.MouseEvent<HTMLButtonElement>) => {
        const isNew = !!(data as React.MouseEvent<HTMLButtonElement>)
          .currentTarget;
        handleAddModule(isNew ? NEW_MODULE_OPTION : (data as ModuleOption));
        menuState.open.off();
      },
      [handleAddModule, menuState]
    );

    const componentsOption = useMemo(() => {
      return {
        DropdownIndicator: DropdownIndicatorComponent,
        Option: ({
          children: _children,
          ...props
        }: OptionProps<ModuleOption, false>) => {
          const { value, label, description } = props.data as ModuleOption;
          const isBranching = branchingStepGroupIds.includes(value);

          return (
            <components.Option {...props}>
              <Box display="flex" flexDirection="column">
                <Box display="flex" flexDirection="row" gap={2}>
                  {isBranching && <BranchingIcon />}
                  <Box
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                    overflow="hidden"
                  >
                    {label}
                  </Box>
                </Box>
                <Box
                  color="gray.600"
                  fontSize="xs"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                  overflow="hidden"
                  w="full"
                >
                  {description}
                </Box>
              </Box>
            </components.Option>
          );
        },
      };
    }, [branchingStepGroupIds]);

    const styles = useMemo(
      () => ({
        menu: (provided) => ({
          ...provided,
          position: 'relative',
          margin: '0',
          maxHeight: '250px',
          boxShadow: 'none',
        }),
        control: (provided) => ({
          ...provided,
          marginBottom: '4px',
          borderColor: colors.gray[200],
        }),
        menuList: (provided) => ({
          ...provided,
          maxHeight: '250px',
        }),
      }),
      []
    );

    return (
      <Box mt={4} minW="200px" maxWidth="360px" ref={ref}>
        <ButtonGroup isAttached variant="outline">
          <Button
            variant="secondary"
            borderRightColor="gray.200"
            borderRightWidth="1px"
            data-test="add-module-button"
            onClick={handleOnChange}
          >
            Add new {MODULE_ALIAS_SINGULAR}
          </Button>

          <Menu
            placement="bottom-start"
            isOpen={menuState.open.isOn}
            lazyBehavior="unmount"
            onOpen={menuState.open.on}
            onClose={menuState.open.off}
            closeOnBlur={true}
            isLazy
          >
            <MenuButton
              as={IconButton}
              aria-label="Use step group"
              variant="secondary"
              icon={
                <ChevronDownIcon
                  transform={menuState.open.isOn ? 'rotate(180deg)' : null}
                />
              }
            />
            <MenuList w="320px" px="3" pt="3">
              <Select
                ref={dropdownRef}
                defaultMenuIsOpen
                placeholder="Search step groups..."
                value={null}
                options={options}
                onChange={handleOnChange}
                components={componentsOption}
                isOptionDisabled={isOptionDisabled}
                styles={styles}
                menuIsOpen
              />
            </MenuList>
          </Menu>
        </ButtonGroup>
      </Box>
    );
  }
);

export default AddModuleButton;
