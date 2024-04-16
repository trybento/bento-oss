import React from 'react';

import { Textarea } from '@chakra-ui/react';

import { Box } from '@chakra-ui/react';
import DefaultInput from '../../Input';

export interface InputProps {
  node: any;
  children?: any;
  onChange?: () => void;
}

export default function Input({ node, onChange, ...restProps }: InputProps) {
  const handleChange = () => {
    onChange && onChange();
  };

  const placeholder = node.children?.[0]?.text;
  const isMultiline = !!node.isMultiline;

  return (
    <Box
      width="100%"
      mt="24px"
      mb="32px"
      display="flex"
      justifyContent="center"
      {...restProps}
    >
      {isMultiline ? (
        <Textarea
          width="280px"
          borderColor="border"
          placeholder={placeholder}
          _placeholder={{ fontSize: '14px', color: 'gray.600' }}
        />
      ) : (
        <DefaultInput
          width="280px"
          borderColor="border"
          placeholder={placeholder}
          onChange={handleChange}
          _placeholder={{ fontSize: '14px', color: 'gray.600' }}
        />
      )}
    </Box>
  );
}
