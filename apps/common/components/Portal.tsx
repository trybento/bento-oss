import React from 'react';
import { Portal as ChakraPortal } from '@chakra-ui/react';
import { usePortalRef } from '../providers/PortalRefProvider';

const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = usePortalRef();

  return <ChakraPortal containerRef={ref}>{children}</ChakraPortal>;
};

export default Portal;
