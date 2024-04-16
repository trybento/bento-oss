import React, { FC } from 'react';
import {
  IconButton,
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuProps,
} from '@chakra-ui/react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { actionMenuWidthPx } from '../utils/constants';
import { px } from '../utils/dom';

type Props = {
  customHeight?: string;
};

const actionMenuWidth = px(actionMenuWidthPx);

const MoreVertMenu: FC<Props & MenuButtonProps & MenuProps> = ({
  customHeight,
  children,
  placement = 'bottom-start',
  isLazy = true,
  offset,
  onOpen,
  onClose,
  id,
  ...props
}) => (
  <Menu
    placement={placement}
    isLazy={isLazy}
    offset={offset}
    onOpen={onOpen}
    onClose={onClose}
    id={id}
  >
    <MenuButton
      className="overflow-menu-button"
      as={IconButton}
      outline="0"
      color="gray.600"
      display="flex"
      alignItems="baseline"
      w={customHeight ?? actionMenuWidth}
      h={customHeight ?? actionMenuWidth}
      minW={customHeight ?? actionMenuWidth}
      minH={customHeight ?? actionMenuWidth}
      _hover={{ bg: 'gray.100' }}
      _expanded={{ bg: 'gray.200' }}
      _active={{ bg: 'gray.300' }}
      _focus={{ outline: '0' }}
      cursor="pointer"
      variant="ghost"
      {...props}
    >
      <MoreVertIcon style={{ margin: 'auto' }} />
    </MenuButton>
    {children}
  </Menu>
);

export default MoreVertMenu;
