import React, { useCallback, useEffect } from 'react';
import {
  Button,
  ButtonGroup,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import ModalBody from '../../../ModalBody';

import Select from '../../../Select';
import { CalloutTypes } from 'bento-common/types/slate';
import { TYPE_BG_COLOR, TYPE_COLOR } from './CalloutElement';
import { Modal } from '../../../Modal';

interface CalloutModalProps {
  isOpen: boolean;
  initialCalloutType?: CalloutTypes;
  initialShouldCollapseSidebar?: boolean;
  onCallout: (calloutType: CalloutTypes) => void;
  onCancel: () => void;
}

export const TYPE_NAME = {
  [CalloutTypes.Tip]: 'Value Proposition',
  [CalloutTypes.Info]: 'Value Proposition',
  [CalloutTypes.Warning]: 'Warning',
  [CalloutTypes.Error]: 'Error',
  [CalloutTypes.Themeless]: 'General',
};

const CALLOUT_OPTIONS = Object.values(CalloutTypes).map((type) => ({
  label: TYPE_NAME[type],
  value: type,
}));

const DEFAULT_CALLOUT_TYPE = CalloutTypes.Info;

export default function CalloutModal({
  isOpen,
  onCallout,
  initialCalloutType,
  onCancel,
}: CalloutModalProps): JSX.Element {
  const [calloutType, setCalloutType] = React.useState(
    initialCalloutType || DEFAULT_CALLOUT_TYPE
  );
  const initialRef = React.useRef();

  const clearInputs = (): void => {
    if (!initialCalloutType) {
      setCalloutType(DEFAULT_CALLOUT_TYPE);
    }
  };

  const cancelAndClear = (): void => {
    clearInputs();
    onCancel();
  };

  const handleAdd = useCallback(() => {
    onCallout(calloutType);
  }, [calloutType, onCallout]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && calloutType) {
        handleAdd();
      }
    },
    [handleAdd, calloutType]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, isOpen]);

  const getStyle = (provided, state) => {
    const value = state?.data?.value;
    return {
      ...provided,
      borderLeft: `4px solid ${TYPE_COLOR[value]}`,
      background: state.isSelected ? undefined : TYPE_BG_COLOR[value],
      padding: '0.2em 1em',
    };
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={cancelAndClear}
      size="md"
      initialFocusRef={initialRef}
    >
      <ModalOverlay />
      <ModalContent display="table">
        <ModalHeader>Callout</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Select
            value={CALLOUT_OPTIONS.find((opt) => opt.value === calloutType)}
            options={CALLOUT_OPTIONS}
            onChange={(opt) => setCalloutType(opt.value)}
            styles={{
              singleValue: getStyle,
              menu: getStyle,
              option: getStyle,
            }}
          />
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button variant="secondary" onClick={cancelAndClear}>
              Cancel
            </Button>
            <Button isDisabled={false} onClick={handleAdd}>
              Add
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
