import React, { useCallback } from 'react';

import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Text,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import ModalBody from 'system/ModalBody';

import UploadIconForm, { UploadIconFormProps } from './UploadIconForm';

type UploadIconModalProps = UploadIconFormProps & {
  isOpen: boolean;
  onCancel?: () => void;
};

export default function UploadIconModal({
  isOpen,
  onSuccess,
  onCancel,
}: UploadIconModalProps): JSX.Element {
  const onClose = useCallback(() => onCancel?.(), [onCancel]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload custom icon</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="6">
          <Text mb="1" color="gray.600" fontWeight="bold">
            Upload from computer
          </Text>
          <UploadIconForm onSuccess={onSuccess} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
