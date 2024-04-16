import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

type Props = {
  isDisabled?: boolean;
  label: string;
} & BoxProps;

const CardButton: React.FC<Props> = ({ label, isDisabled, ...boxProps }) => (
  <Box
    background="white"
    borderColor="gray.200"
    borderRadius="sm"
    borderWidth="1px"
    p="4"
    color={isDisabled ? 'text.secondary' : undefined}
    textAlign="center"
    cursor={isDisabled ? 'not-allowed' : 'pointer'}
    {...boxProps}
    onClick={isDisabled ? undefined : boxProps.onClick}
  >
    {label}
  </Box>
);

export default CardButton;
