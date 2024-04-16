import React from 'react';
import { MenuList, MenuItem } from '@chakra-ui/react';

import Text from '../../../Text';
import MoreVertMenu from '../../../MoreVertMenu';

interface SelectOverflowMenuProps {
  menuItems: { action: any; text: string }[];
}

const SelectOverflowMenu = ({ menuItems }: SelectOverflowMenuProps) => {
  return (
    <MoreVertMenu>
      <MenuList>
        {menuItems.map((item) => (
          <MenuItem onClick={item.action}>
            <Text color="blue.500" fontWeight="semibold">
              {item.text}
            </Text>
          </MenuItem>
        ))}
      </MenuList>
    </MoreVertMenu>
  );
};

export default SelectOverflowMenu;
