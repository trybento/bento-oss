import React from 'react';
import { Button as DefaultButton } from '@chakra-ui/react';

import SlateContentRendererContext from '../../SlateContentRendererContext';

export default function Button(props) {
  const context = React.useContext(SlateContentRendererContext);
  const primaryColorHex = context.colors.primary;

  return (
    <DefaultButton
      {...props}
      bg={primaryColorHex}
      _hover={{
        bg: primaryColorHex,
        opacity: '0.8',
      }}
      _active={{
        bg: primaryColorHex,
        opacity: '0.6',
      }}
    />
  );
}
