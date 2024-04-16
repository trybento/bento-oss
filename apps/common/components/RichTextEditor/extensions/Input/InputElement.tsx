import React from 'react';
import { Box, Textarea } from '@chakra-ui/react';

import DefaultInput from '../../../Input';

import { useFocused, useSelected } from 'slate-react';

/** Deprecated because it basically does nothing */
export default function InputElement({ attributes, children, element, style }) {
  const selected = useSelected();
  const focused = useFocused();
  const placeholder = element.children?.[0]?.text;
  const isMultiline = !!element.isMultiline;
  const boxShadow = selected && focused ? `0 0 0 1px #cbd5e0` : 'none';

  return (
    <Box
      width="100%"
      textAlign="center"
      pt="24px"
      pb="12px"
      display="flex"
      justifyContent="center"
      cursor="default"
      contentEditable={false}
      boxShadow={boxShadow}
      {...attributes}
    >
      {isMultiline ? (
        <Textarea
          width="280px"
          borderColor="border"
          placeholder={placeholder}
          _placeholder={{ fontSize: '14px', color: 'gray.600' }}
          style={style}
        />
      ) : (
        <DefaultInput
          width="280px"
          borderColor="border"
          placeholder={placeholder}
          _placeholder={{ fontSize: '14px', color: 'gray.600' }}
          style={style}
        />
      )}
      <Box display="none">{children}</Box>
    </Box>
  );
}
