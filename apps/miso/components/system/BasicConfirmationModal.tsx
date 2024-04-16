import React, { useCallback } from 'react';
import {
  Button,
  ButtonGroup,
  ModalProps,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Box,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import ModalBody from 'system/ModalBody';

interface BasicConfirmationModalProps extends Omit<ModalProps, 'onClose'> {
  onCancel: () => void;
  handleConfirm: () => void;
  title: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  disableConfirm?: boolean;
}

/**
 * Simple text, title and confirm/cancel
 */
const BasicConfirmationModal: React.FC<
  React.PropsWithChildren<BasicConfirmationModalProps>
> = ({
  isOpen,
  onCancel,
  handleConfirm,
  title,
  children,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  disableConfirm,
  ...modalProps
}): JSX.Element => {
  const onConfirm = useCallback((): void => {
    handleConfirm();
    onCancel();
  }, [onCancel, handleConfirm]);

  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="md" {...modalProps}>
      <ModalOverlay />
      <ModalContent display="table">
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>{children}</Box>
        </ModalBody>
        <ModalFooter
          display="flex"
          justifyContent="space-between"
          alignContent="center"
        >
          <Box />
          <ButtonGroup>
            <Button variant="secondary" onClick={onCancel}>
              {cancelButtonText}
            </Button>
            <Button isDisabled={disableConfirm} onClick={onConfirm}>
              {confirmButtonText}
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BasicConfirmationModal;
