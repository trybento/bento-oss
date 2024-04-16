import React from 'react';
import {
  Button,
  ButtonGroup,
  ModalCloseButton,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalFooter,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import loadable from '@loadable/component';
const ReactJson = loadable(() => import('react-json-view'));

import ModalBody from 'system/ModalBody';
import Box from 'system/Box';

interface DataDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: object;
  title: string;
}

export default function DataDisplayModal({
  isOpen,
  onClose,
  data,
  title,
}: DataDisplayModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {data && (
            <Box maxH="60vh" overflowY="auto" mt="2">
              <ReactJson
                src={data}
                enableClipboard={false}
                style={{
                  minWidth: '100%',
                }}
              />
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
