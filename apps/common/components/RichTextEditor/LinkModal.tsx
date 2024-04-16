import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Text,
  ModalFooter,
  ModalOverlay,
  ModalContent,
  ModalHeader,
} from '@chakra-ui/react';
import ModalBody from '../ModalBody';
import UrlInput, { doUrlChecks } from '../UrlInput';
import { Attribute } from '../../types';
import { Modal } from '../Modal';

interface LinkModalProps {
  attributes: Attribute[];
  isOpen: boolean;
  onLink: (url: string) => void;
  onCancel: () => void;
  initialUrl?: string;
  allowEmpty?: boolean;
}

// NOTE: Actions that handle opening and closing this modal can be found in slate/hooks/useLinkTrigger

export default function LinkModal({
  attributes,
  isOpen,
  onLink,
  initialUrl = '',
  onCancel,
  allowEmpty,
}: LinkModalProps) {
  const [url, setUrl] = useState(initialUrl);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    isOpen && setUrl(initialUrl);
  }, [isOpen]);

  const cancelAndClear = useCallback((): void => {
    onCancel();
    setUrl('');
  }, [onCancel]);

  const onUrlChange = useCallback((newValue: string, valid: boolean) => {
    setUrl(newValue);
    setIsValid(valid);
  }, []);

  const onConfirm = useCallback(() => {
    if (allowEmpty || url.trim() !== '') {
      onLink(doUrlChecks(url));
      setUrl('');
    }
  }, [allowEmpty, url]);

  return (
    <Modal isOpen={isOpen} onClose={cancelAndClear} size="lg" closeOnEsc={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{initialUrl ? 'Update' : 'Add'} Link</ModalHeader>
        <ModalBody>
          <UrlInput
            attributes={attributes}
            initialUrl={initialUrl}
            onContentChange={onUrlChange}
            onEnter={onConfirm}
            autoFocus
            allowWildcards={false}
          />
          <Text fontSize="xs" color="gray.600" mt={2}>
            We recommend using absolute urls (i.e. https://www.acmeco.co) so
            that your links preview correctly
          </Text>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button variant="secondary" onClick={cancelAndClear}>
              Cancel
            </Button>
            <Button
              isDisabled={useMemo(
                () => !isValid || (url.trim() === '' && !allowEmpty),
                [url, allowEmpty, isValid]
              )}
              onClick={onConfirm}
            >
              {initialUrl ? 'Save' : 'Create'}
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
