import React from 'react';
import {
  Button,
  ButtonGroup,
  ButtonGroupProps,
  Menu,
  MenuProps,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  MenuItemProps,
  ButtonProps,
} from '@chakra-ui/react';
import Tooltip from 'system/Tooltip';
import { ChevronDownIcon } from '@chakra-ui/icons';

import useToggleState from 'hooks/useToggleState';

export type MenuOption = {
  label: string;
  onClick: () => void;
  style?: MenuItemProps;
  isDisabled?: boolean;
  tooltip?: string;
};

type Props = {
  options: MenuOption[];
  isLoading?: boolean;
  /** Disables the prime/main part of the button where the text shows */
  isPrimaryDisabled?: boolean;
  /** Add a behavior unique to the main part of the button */
  onPrimaryClick?: () => void;
  isDropdownDisabled?: boolean;
  label?: string;
  size?: ButtonProps['size'];
  placement?: MenuProps['placement'];
} & ButtonGroupProps;

const MultiButton: React.FC<Props> = ({
  options,
  isPrimaryDisabled,
  isLoading,
  onPrimaryClick,
  isDropdownDisabled,
  label = 'Actions',
  size,
  placement,
  ...bgProps
}) => {
  const menuState = useToggleState(['open', 'hover']);
  const variant = bgProps.variant;

  return (
    <ButtonGroup
      isAttached
      {...bgProps}
      onMouseEnter={menuState.hover.on}
      onMouseLeave={menuState.hover.off}
    >
      <Button
        backgroundColor={
          menuState.hover.isOn && variant !== 'secondary' ? 'bento.logo' : null
        }
        onClick={onPrimaryClick ?? menuState.open.on}
        isDisabled={isPrimaryDisabled}
        isLoading={isLoading}
        size={size}
      >
        {label}
      </Button>
      <Menu
        id="thing"
        placement={placement ?? 'bottom-start'}
        offset={[0, 0]}
        isOpen={menuState.open.isOn}
        lazyBehavior="unmount"
        onOpen={menuState.open.on}
        onClose={menuState.open.off}
        closeOnBlur={true}
        isLazy
      >
        <MenuButton
          size={size}
          as={IconButton}
          aria-label="Use step group"
          backgroundColor={
            menuState.hover.isOn && variant !== 'secondary'
              ? 'bento.logo'
              : null
          }
          _active={{
            /** @todo formalize this in ui/theme */
            backgroundColor:
              variant !== 'secondary' ? 'bento.bright' : 'bento-pale',
          }}
          icon={
            <ChevronDownIcon
              transform={menuState.open.isOn ? 'rotate(180deg)' : null}
            />
          }
        />
        <MenuList>
          {options.map((o) => (
            <Tooltip
              label={o.tooltip}
              placement="top"
              key={`menu-item-${o.label}`}
            >
              <MenuItem
                onClick={o.onClick}
                isDisabled={o.isDisabled}
                {...(o.style ?? {})}
              >
                {o.label}
              </MenuItem>
            </Tooltip>
          ))}
        </MenuList>
      </Menu>
    </ButtonGroup>
  );
};

export default MultiButton;
