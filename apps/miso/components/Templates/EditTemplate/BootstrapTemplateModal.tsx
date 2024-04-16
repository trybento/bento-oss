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
import { DEFAULT_COLORS } from 'helpers/uiDefaults';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (eId: string) => void;
};

export default function BootstrapTemplateModal({
  isOpen,
  onClose,
  onCreate,
}: Props): JSX.Element {
  const [isSetting, setSetting] = useState(false);
  const [target, setTarget] = useState<string>('');
  const isRenameDisabled = target.length === 0;

  const handleOnConfig = useCallback(() => {
    setSetting(true);
    onCreate(target);
    onClose();
  }, [onClose, onCreate, target]);

  const handleTargetChange = useCallback(
    (e: FormEvent<HTMLInputElement>) => setTarget(e.currentTarget.value),
    []
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') handleOnConfig();
    },
    [handleOnConfig]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSetting ? noop : onClose}
      closeOnOverlayClick={false}
      size="lg"
      id="confirm-bootstrap"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create new guide from template</ModalHeader>
        <ModalBody color={DEFAULT_COLORS.secondaryText}>
          <>
            <Text marginBottom="4" mt="4" color={DEFAULT_COLORS.primaryText}>
              Make this guide yours by giving it a name 🚀
            </Text>
            <Input
              size="lg"
              value={target}
              onChange={handleTargetChange}
              onKeyDown={onKeyDown}
            />
          </>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button
              isDisabled={isRenameDisabled}
              isLoading={isSetting}
              onClick={handleOnConfig}
            >
              Confirm
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
