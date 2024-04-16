import {
  Button,
  ButtonGroup,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import { DOCS_INSTALLATION_URL } from 'bento-common/utils/docs';
import React, { useCallback } from 'react';

interface Props {
  onClose: () => void;
}

const ScriptInjectionErrorModal: React.FC<Props> = ({ onClose }) => {
  const openInstallationDocs = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement>) => {
      void window.open(DOCS_INSTALLATION_URL, '_blank');
    },
    [],
  );

  return (
    <Modal onClose={onClose} closeOnEsc={false} isOpen trapFocus>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>We can't load the visual builder</ModalHeader>
        <ModalCloseButton tabIndex={-1} />
        <ModalBody>
          <Text mb={4}>
            Your Content Security Policy (CSP) prevents us from injecting Bento
            elements. In order to use Bento, you'll need to first have your
            engineers install a snippet of code.
          </Text>
          <Text>
            You can still play with content and previews in Bento, but won't be
            able to see elements in your app until this snippet is installed.
          </Text>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button onClick={openInstallationDocs} tabIndex={0}>
              See install docs
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ScriptInjectionErrorModal;
