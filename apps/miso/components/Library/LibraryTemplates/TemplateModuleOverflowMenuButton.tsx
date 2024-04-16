import React from 'react';
import { MenuList, MenuItem } from '@chakra-ui/react';

import Text from 'system/Text';
import { MODULE_ALIAS_SINGULAR } from 'helpers/constants';
import MoreVertMenu from 'bento-common/components/MoreVertMenu';

interface Props {
  onDelete?: () => void;
  onDuplicate?: () => void;
}

function TemplateModuleOverflowMenuButton({ onDelete, onDuplicate }: Props) {
  // Do not show if all options are disabled.
  if (!onDelete && !onDuplicate) return null;

  return (
    <MoreVertMenu id="inner-template-module-more">
      <MenuList p="0">
        {!!onDuplicate && (
          <MenuItem onClick={onDuplicate}>
            <Text fontWeight="normal">{`Duplicate ${MODULE_ALIAS_SINGULAR}`}</Text>
          </MenuItem>
        )}
        {!!onDelete && (
          <MenuItem onClick={onDelete} borderTop="1px solid #d9d9d9">
            <Text color="bento.errorText">Delete from guide</Text>
          </MenuItem>
        )}
      </MenuList>
    </MoreVertMenu>
  );
}

export default TemplateModuleOverflowMenuButton;
