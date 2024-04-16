import { BoxProps } from '@chakra-ui/react';
import React from 'react';
import Box from 'system/Box';

export type EmptyTablePlaceholderProps = {
  // graphic can be any component that renders, e.g., an SVG or an icon.
  Graphic?: React.FC;
  text?: string | React.ReactNode;
  Button?: React.FC;
} & BoxProps;

const EmptyTablePlaceholder: React.FC<EmptyTablePlaceholderProps> = ({
  Graphic,
  text,
  Button,
  pt = 11,
  ...boxProps
}) => (
  <Box pt={pt} m="auto" {...boxProps}>
    {Graphic && (
      <Box display="flex" justifyContent="center" alignItems="center" pt={5}>
        <Graphic />
      </Box>
    )}
    <Box mt={Graphic ? 8 : 0} textAlign="center" fontSize="16px" maxW="xl">
      {text || 'Nothing to see here (yet)'}
    </Box>
    {Button && (
      <Box display="flex" justifyContent="center" alignItems="center" pt={5}>
        <Button />
      </Box>
    )}
  </Box>
);

export default EmptyTablePlaceholder;
