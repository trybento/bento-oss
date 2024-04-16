import React from 'react';
import { Box, BoxProps, Icon } from '@chakra-ui/react';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';

import { GuideTypeEnum } from 'bento-common/types';
import { getGuideTypeString } from 'helpers';
import Tooltip from 'system/Tooltip';
import { BadgeStyle, BadgeStyleConfig, BadgeStyles } from 'system/Badge';
import { GuideTypeEnumType } from 'relay-types/EditTemplateMutation.graphql';

type GuideScopeProps = {
  type: GuideTypeEnum | GuideTypeEnumType;
} & BoxProps;

const GuideScope: React.FC<GuideScopeProps> = ({ type, ...boxProps }) => {
  const ScopeIcon = type === GuideTypeEnum.account ? BusinessIcon : PersonIcon;
  const badgeStyle: BadgeStyleConfig = BadgeStyles[BadgeStyle.inactive];

  return (
    <Box display="flex" alignItems="center" {...boxProps}>
      <Tooltip
        label={getGuideTypeString(type as GuideTypeEnum, '')}
        placement="top"
      >
        <Icon
          as={ScopeIcon}
          mr="1"
          color={badgeStyle.iconColor.normal}
          transform="scale(0.7)"
        />
      </Tooltip>
    </Box>
  );
};

export default GuideScope;
