import React from 'react';
import {
  ListItem,
  UnorderedList,
  Box,
  Text,
  BoxProps,
} from '@chakra-ui/layout';

import InfoCard from 'system/InfoCard';
import colors from 'helpers/colors';

type Props = {
  reason: string;
  recommendations: (React.ReactNode | string)[];
} & BoxProps;

/**
 * Layout for a fail state in troubleshooter.
 * Any child element provided is rendered under the default cards. Make sure to wrap
 * in an InfoCard for consistency.
 */
const TroubleshootFailState: React.FC<React.PropsWithChildren<Props>> = ({
  reason,
  recommendations,
  children,
  ...boxProps
}) => {
  return (
    <Box w="full" {...boxProps}>
      <InfoCard w="full">
        <Text fontWeight="semibold">Why:</Text>
        <Text color={colors.warning.text}>{reason}</Text>
      </InfoCard>
      <InfoCard w="full">
        <Text mb="2" fontWeight="semibold">
          Recommendations
        </Text>
        <Box>
          <UnorderedList>
            {recommendations.map((rec, i) => (
              <ListItem key={`diag-fail-rec-${i}`}>{rec}</ListItem>
            ))}
          </UnorderedList>
        </Box>
      </InfoCard>
      {children}
    </Box>
  );
};

export default TroubleshootFailState;
