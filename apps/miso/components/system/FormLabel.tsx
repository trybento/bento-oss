import React from 'react';
import { Text, TextProps } from '@chakra-ui/react';

type Props = {
  label: string;
} & TextProps;

/** Header for a form input, without calling for any form context */
const FormLabel: React.FC<Props> = ({ label, ...textProps }) => (
  <Text color="text.secondary" fontWeight="bold" {...textProps}>
    {label}
  </Text>
);

export default FormLabel;
