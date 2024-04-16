import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  FormControl,
  FormLabel,
  ModalFooter,
  Flex,
  Button,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import { QuickLink } from 'bento-common/types';

import ModalBody from 'system/ModalBody';
import UploadIconForm from './UploadIconForm';
import UrlInput from 'components/common/UrlInput';
import SimpleCharCount from 'bento-common/components/CharCount/SimpleCharCount';
import Input from 'system/Input';

type UploadIconModalProps = {
  isOpen: boolean;
  quickLink: QuickLink;
  onSave: (ql: QuickLink) => void;
  onClose: () => void;
};

const MAX_TITLE_LENGTH = 32;

export default function QuickLinkModal({
  isOpen,
  quickLink: initialQuickLink,
  onSave,
  onClose,
}: UploadIconModalProps): JSX.Element {
  const [quickLink, setQuickLink] = useState<QuickLink>(
    initialQuickLink || { url: '', title: '' }
  );

  const valid = useMemo<boolean>(
    () =>
      !!quickLink?.url &&
      !!quickLink?.title &&
      quickLink.title.length <= MAX_TITLE_LENGTH,
    [quickLink]
  );

  const handleTitleChange = useCallback(
    (ev) => setQuickLink((ql) => ({ ...ql, title: ev.target.value })),
    []
  );
  const handleUrlChange = useCallback(
    (url) => setQuickLink((ql) => ({ ...ql, url })),
    []
  );
  const handleIconChange = useCallback(
    (icon) => setQuickLink((ql) => ({ ...ql, icon })),
    []
  );

  useEffect(() => {
    setQuickLink(initialQuickLink);
  }, [initialQuickLink]);

  const handleSave = useCallback(() => onSave(quickLink), [quickLink]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {initialQuickLink ? 'Edit Link' : 'Add a Link'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="6">
          <FormControl>
            <FormLabel variant="secondary">Title</FormLabel>
            <Input
              fontSize="sm"
              defaultValue={quickLink?.title || ''}
              onChange={handleTitleChange}
              maxLength={MAX_TITLE_LENGTH}
            />
            <SimpleCharCount
              limit={MAX_TITLE_LENGTH}
              text={quickLink?.title || ''}
            />
          </FormControl>
          <FormControl mt="3" bgColor="gray.50" p="2">
            <FormLabel variant="secondary">Destination Url</FormLabel>
            <UrlInput
              onContentChange={handleUrlChange}
              initialUrl={quickLink?.url || ''}
              allowWildcards={false}
            />
          </FormControl>
          <FormControl mt="3">
            <FormLabel variant="secondary">Icon</FormLabel>
            <UploadIconForm
              onSuccess={handleIconChange}
              showIcon
              iconUrl={quickLink?.icon || ''}
              buttonVariant="link"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Flex justifyContent="flex-end" gap="2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button isDisabled={!valid} onClick={handleSave}>
              {initialQuickLink ? 'Save' : 'Add'}
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
