import {
  Button,
  Flex,
  ListItem,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
  VStack,
} from '@chakra-ui/react';
import { Modal } from 'bento-common/components/Modal';
import React from 'react';

type Props = {
  onClose: (ignore?: boolean) => void;
};

const ElementMissingPopup = ({ onClose }: React.PropsWithChildren<Props>) => {
  return (
    <Modal isOpen onClose={() => onClose(true)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Find the element you're tracking</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack gridGap={2} alignItems="flex-start">
            <Text>
              You're tracking an element which is not currently visible. It may
              be that:
            </Text>
            <UnorderedList pl={6}>
              <ListItem>It's in a modal</ListItem>
              <ListItem>You have to access it in a menu</ListItem>
              <ListItem>It's a few clicks into a flow</ListItem>
              <ListItem>It's still loading</ListItem>
            </UnorderedList>
            <Text>No worries, click "Okay" to go find the element!</Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Flex gap="2" alignItems="center">
            <Button variant="secondary" onClick={() => onClose(true)}>
              Ignore
            </Button>
            <Button onClick={() => onClose(false)}>Okay</Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ElementMissingPopup;
