import React from 'react';
import { Text } from '@chakra-ui/react';
import { Highlight } from 'components/common/Highlight';

type Props = {
  audienceName: string;
};

const AudienceUsed: React.FC<Props> = ({ audienceName }) => (
  <Text
    fontSize="sm"
    color="text.secondary"
    fontWeight="bold"
    overflow="hidden"
    textOverflow="ellipsis"
    whiteSpace="nowrap"
    maxW="xs"
  >
    Using audience: <Highlight fontSize="sm">{audienceName}</Highlight>
  </Text>
);

export default AudienceUsed;
