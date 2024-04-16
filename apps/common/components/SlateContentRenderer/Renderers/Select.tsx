import React from 'react';

import { Box } from '@chakra-ui/react';
import { Select } from '@chakra-ui/react';

interface Option {
  type: 'option';
  value: string;
  label: string;
}

interface SelectNode {
  type: 'select';
  placeholder?: string;
  options: Option[];
  children: any;
}

export interface SelectProps {
  node: SelectNode;
  children?: any;
  onChange?: () => void;
}

export default function SelectRenderer({
  node,
  onChange,
  children,
  ...restProps
}: SelectProps) {
  const { placeholder } = node;

  const options = (node.options || []).map((option) => ({
    value: option.value,
    label: option.label,
  }));

  const handleChange = () => {
    onChange && onChange();
  };

  return (
    <Box
      width="100%"
      textAlign="center"
      mt="24px"
      mb="32px"
      display="flex"
      justifyContent="center"
      {...restProps}
    >
      <Select
        fontSize="14px"
        width="80%"
        textOverflow="ellipsis"
        zIndex={1500}
        placeholder={placeholder}
        onChange={handleChange}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>
      {children}
    </Box>
  );
}
