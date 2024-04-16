import React from 'react';
import { forwardRef, Box, BoxProps } from '@chakra-ui/react';
import { Element } from 'react-scroll';

export const SettingsWithPreviewRow = forwardRef<
  BoxProps & {
    /** Spy id used for anchoring the vertical menu */
    spyId?: string;
  },
  'div'
>(({ children, spyId, ...props }, ref) => {
  const Content = (
    <Box
      display="flex"
      flexDirection="row"
      gap={10}
      flex={1}
      ref={ref}
      py={24}
      {...props}
    >
      {children}
    </Box>
  );

  return spyId ? <Element name={spyId}>{Content}</Element> : Content;
});

export const SettingsColumn = forwardRef<BoxProps, 'div'>(
  ({ children, ...props }, ref) => (
    <Box w="350px" ref={ref} {...props}>
      {children}
    </Box>
  )
);

export const PreviewColumn = forwardRef<BoxProps, 'div'>(
  ({ children, ...props }, ref) => (
    <Box
      maxW="900px"
      display="flex"
      flexDir="column"
      flex="2"
      ref={ref}
      {...props}
    >
      {children}
    </Box>
  )
);
