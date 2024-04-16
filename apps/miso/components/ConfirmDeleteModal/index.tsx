import React, { FormEvent, useCallback, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Input,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import noop from 'lodash/noop';

import ModalBody from 'system/ModalBody';
import Text from 'system/Text';
import HelperText from 'system/HelperText';
import CalloutText from 'bento-common/components/CalloutText';
import { DEFAULT_COLORS } from 'helpers/uiDefaults';

export enum ConfirmModalVariations {
  delete = 'delete',
  unarchive = 'unarchive',
  remove = 'remove',
  action = 'action',
}

const CONFIRM_BUTTON_LABEL = {
  [ConfirmModalVariations.delete]: 'Permanently delete',
  [ConfirmModalVariations.unarchive]: 'Unarchive',
  [ConfirmModalVariations.remove]: 'Remove',
  [ConfirmModalVariations.action]: 'Run action',
};

const MODAL_SIZE = {
  [ConfirmModalVariations.delete]: 'md',
  [ConfirmModalVariations.unarchive]: 'sm',
  [ConfirmModalVariations.remove]: 'md',
  [ConfirmModalVariations.action]: 'sm',
};

export interface DeleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  entityName: React.ReactNode | undefined;
  quoteEntityName?: boolean;
  confirmText?: string;
  variation?: ConfirmModalVariations;
  header?: string;
  callout?: React.ReactNode;
  confirmButtomLabel?: React.ReactNode;
  children?: React.ReactNode;
  modalSize?: string;
  additionalText?: string | React.ReactNode;
}
export default function ConfirmDeleteModal({
  isOpen,
  onClose: rawOnClose,
  onDelete,
  entityName,
  quoteEntityName = true,
  confirmText = '',
  header,
  variation = ConfirmModalVariations.delete,
  children,
  callout,
  confirmButtomLabel,
  modalSize,
  additionalText = '',
}: DeleteProjectModalProps): JSX.Element {
  const [isDeleting, setDeleting] = useState(false);
  const [confirmedText, setConfirmedText] = useState<string>('');
  const isDeleteDisabled = isDeleting || confirmedText !== confirmText;

  const onClose = useCallback(() => {
    setDeleting(false);
    setConfirmedText('');
    rawOnClose();
  }, [rawOnClose]);

  const handleInputKeyUp = useCallback(
    (e) => {
      if (e.key === 'Enter' && !isDeleteDisabled) {
        setDeleting(true);
        onDelete();
        onClose();
      }
    },
    [onDelete, onClose, isDeleteDisabled]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={isDeleting ? noop : onClose}
      size={modalSize || MODAL_SIZE[variation]}
      id="confirm-delete"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {header || `Are you sure you want to ${variation} ${entityName}?`}
        </ModalHeader>
        <ModalBody color={DEFAULT_COLORS.secondaryText}>
          {entityName !== null && (
            <Text>
              You are about to {variation}{' '}
              {quoteEntityName ? (
                <>
                  "<i>{entityName}</i>"
                </>
              ) : (
                entityName
              )}
              {additionalText}
            </Text>
          )}
          {children}
          {callout && (
            <CalloutText mt={4} mb={2}>
              {callout}
            </CalloutText>
          )}
          {!!confirmText && (
            <>
              <Text
                my="1"
                fontWeight="semibold"
                color={DEFAULT_COLORS.primaryText}
              >
                To confirm please type "{confirmText}".
              </Text>
              <Input
                size="lg"
                value={confirmedText}
                onChange={(e: FormEvent<HTMLInputElement>) =>
                  setConfirmedText(e.currentTarget.value)
                }
                onKeyUp={handleInputKeyUp}
              />
              <HelperText>Press Enter to submit</HelperText>
            </>
          )}
        </ModalBody>
        <ModalFooter borderTop="1px solid #d9d9d9">
          <ButtonGroup>
            <Button
              variant="secondary"
              isDisabled={isDeleting}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="red"
              isDisabled={isDeleteDisabled}
              isLoading={isDeleting}
              onClick={async () => {
                setDeleting(true);
                onDelete();
                onClose();
              }}
              id="modal-confirm"
            >
              {confirmButtomLabel || CONFIRM_BUTTON_LABEL[variation]}
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
