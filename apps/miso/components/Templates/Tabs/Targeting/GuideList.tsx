import React, { useCallback } from 'react';
import { Box, HStack } from '@chakra-ui/react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import OptionGroupBox from 'system/OptionGroupBox';
import { AutoLaunchableTarget } from 'components/EditorCommon/targeting.helpers';

type Props = {
  guides: AutoLaunchableTarget[];
};

/**
 * Guide list display in the same style as the priority ranking sorter
 */
const GuideList: React.FC<Props> = ({ guides }) => {
  const handleOpenInNew = useCallback(
    (url: string) => () => window.open(url, '_blank'),
    []
  );

  if (!guides) return null;

  return (
    <OptionGroupBox w="full">
      <Box background="white">
        {guides.map((g) => (
          <HStack position="relative" p="3" alignItems="center">
            <Box ml="2" display="flex" alignItems="center">
              {g.Icon && (
                <g.Icon
                  fontSize="small"
                  transform="scale(0.9)"
                  role="presentation"
                />
              )}
            </Box>
            <Box fontWeight="semibold">{g.name}</Box>
            <Box
              alignSelf="center"
              position="absolute"
              right="3"
              cursor="pointer"
              color="gray.600"
              onClick={handleOpenInNew(`/library/templates/${g.entityId}`)}
            >
              <OpenInNewIcon fontSize="small" />
            </Box>
          </HStack>
        ))}
      </Box>
    </OptionGroupBox>
  );
};

export default GuideList;
