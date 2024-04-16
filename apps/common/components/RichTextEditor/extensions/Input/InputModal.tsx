import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import ModalBody from '../../../ModalBody';

import Input from '../../../Input';
import Text from '../../../Text';
import { Modal } from '../../../Modal';

interface SelectModalProps {
  isOpen: boolean;
  onInput: (placeholder: string) => void;
  onCancel: () => void;
}

const DEFAULT_PLACEHOLDER_TEXT = 'Enter a value';

/** Deprecated because it basically does nothing */
export default function SelectModal({
  isOpen,
  onInput,
  onCancel,
}: SelectModalProps): JSX.Element {
  const [placeholder, setPlaceholder] = React.useState(
    DEFAULT_PLACEHOLDER_TEXT
  );

  const initialRef = React.useRef();

  const clearInputs = (): void => {
    setPlaceholder(DEFAULT_PLACEHOLDER_TEXT);
  };

  const cancelAndClear = (): void => {
    clearInputs();
    onCancel();
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={cancelAndClear}
      size="md"
      initialFocusRef={initialRef}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Input field</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb="32px">
            <Text mb="8px" color="gray.600" fontWeight="semibold">
              Modify placeholder text
            </Text>
            <Input
              value={placeholder}
              ref={initialRef}
              placeholder="Enter a value"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPlaceholder(e.target.value);
              }}
            />
          </Box>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button variant="secondary" onClick={cancelAndClear}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onInput(placeholder);
                clearInputs();
              }}
            >
              Add
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
