import { ModalProps, Modal as ChakraModal } from '@chakra-ui/react';
import React from 'react';
import { usePortalRef } from '../providers/PortalRefProvider';

export const Modal: React.FC<ModalProps> = ({ children, ...props }) => {
  const portalRef = usePortalRef();

  return (
    <ChakraModal
      portalProps={{ containerRef: portalRef }}
      /**
       * Chakra modals by default will attempt to trap focus, but we shouldn't use that in order to allow
       * the WYSIWYG to work properly when we want to target elements within the modal (i.e. add tooltips or cards).
       */
      trapFocus={false}
      {...props}
    >
      {children}
    </ChakraModal>
  );
};
