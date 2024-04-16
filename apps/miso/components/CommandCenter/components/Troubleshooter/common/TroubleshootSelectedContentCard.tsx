import React from 'react';
import { Text, Tag, Box } from '@chakra-ui/react';

import H5 from 'system/H5';
import InfoCard from 'system/InfoCard';
import TroubleshootInputSection from './TroubleshootInputSection';
import { useTroubleshooterContext } from '../TroubleshooterProvider';

const TroubleshootSelectedContentCard = () => {
  const { contentSelection } = useTroubleshooterContext();
  const { Icon, name } = contentSelection || {};

  return (
    <InfoCard w="full">
      <TroubleshootInputSection showArrow>
        <H5>Which guide?</H5>
        <Tag color="gray.50" py="2" px="4" w="fit-content">
          <Box color="text.primary" display="flex" alignItems="center">
            {Icon} <Text ml="2">{name}</Text>
          </Box>
        </Tag>
      </TroubleshootInputSection>
    </InfoCard>
  );
};

export default TroubleshootSelectedContentCard;
