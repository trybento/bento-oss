import React, { ReactNode, useCallback } from 'react';
import { ModalContent, ModalOverlay } from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import CalloutText, { CalloutTypes } from 'bento-common/components/CalloutText';

interface BlockingCalloutProps {
  isOpen: boolean;
  children: ReactNode;
}

const BlockingCallout: React.FC<BlockingCalloutProps> = ({
  isOpen,
  children,
}) => {
  const onClose = useCallback(() => {}, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <CalloutText p="2" calloutType={CalloutTypes.Warning}>
          {children}
        </CalloutText>
      </ModalContent>
    </Modal>
  );
};

export default BlockingCallout;
