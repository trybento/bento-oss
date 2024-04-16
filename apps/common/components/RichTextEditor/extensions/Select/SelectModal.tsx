import React, { useReducer } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import ModalBody from '../../../ModalBody';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import cloneDeep from 'lodash/cloneDeep';

import Input from '../../../Input';
import Text from '../../../Text';
import Select from '../../../Select';

import { SelectSettings } from './withSelect';
import { AttributeType } from 'bento-common/types';
import { Modal } from '../../../Modal';

interface SelectModalProps {
  isOpen: boolean;
  onSelect: (settings: SelectSettings) => void;
  onCancel: () => void;
  isCreating?: boolean;
  initialPlaceholder?: string;
  initialAttributeType?: AttributeType;
  initialAttributeValueType?: AttributeValueType;
  initialAttributeKey?: string;
  initialOptions?: { label: string; value: string }[];
}

enum AttributeValueType {
  Text = 'text',
  Boolean = 'boolean',
  Number = 'number',
}

const NEW_OPTION = {
  label: '',
  value: '',
  touched: true,
};

const optionsReducer = (state, action) => {
  const copiedState = cloneDeep(state);
  const index = action.index;

  if (action.type === 'delete') {
    copiedState.splice(index, 1);

    return copiedState;
  } else if (action.type === 'create') {
    copiedState.push({ ...NEW_OPTION });

    return copiedState;
  } else if (action.type === 'change') {
    const option = copiedState[index];
    if (!option) return copiedState;

    const field = action.field;
    if (!field) return copiedState;

    const value = action.value;

    option[field] = value;
    option.touched = true;

    return copiedState;
  } else if (action.type === 'reset') {
    return [{ ...NEW_OPTION }];
  }
};

export default function SelectModal({
  isOpen,
  isCreating,
  onSelect,
  onCancel,
  initialPlaceholder,
  initialAttributeKey,
  initialAttributeType,
  initialAttributeValueType,
  initialOptions,
}: SelectModalProps): JSX.Element {
  const [placeholder, setPlaceholder] = React.useState(
    initialPlaceholder || ''
  );
  const [attributeType, setAttributeType] = React.useState<AttributeType>(
    initialAttributeType || AttributeType.account
  );
  const [attributeValueType, setAttributeValueType] =
    React.useState<AttributeValueType>(
      initialAttributeValueType || AttributeValueType.Text
    );
  const [attributeKey, setAttributeKey] = React.useState<string>(
    initialAttributeKey || ''
  );

  const [options, dispatch] = useReducer(
    optionsReducer,
    initialOptions
      ? initialOptions.map((o) => ({ label: o.label, value: o.value }))
      : [{ ...NEW_OPTION }]
  );

  const initialRef = React.useRef();

  const clearInputs = (): void => {
    setPlaceholder('');
    setAttributeType(AttributeType.account);
    setAttributeValueType(AttributeValueType.Text);
    setAttributeKey('');
    dispatch({ type: 'reset' });
  };

  const attributeTypeOptions = [
    {
      label: 'Account',
      value: AttributeType.account,
    },
    {
      label: 'Account user',
      value: AttributeType.accountUser,
    },
  ];

  const selectedAttributeTypeOption = attributeTypeOptions.find(
    (option) => option.value === attributeType
  );

  const handleAttributeTypeChange = (option) => {
    setAttributeType(option.value);
  };

  const attributeValueTypeOptions = [
    {
      label: 'Text',
      value: AttributeValueType.Text,
    },
    {
      label: 'Number',
      value: AttributeValueType.Number,
    },
    {
      label: 'Boolean',
      value: AttributeValueType.Boolean,
    },
  ];

  const selectedAttributeValueTypeOption = attributeValueTypeOptions.find(
    (option) => option.value === attributeValueType
  );

  const handleAttributeValueTypeChange = (option) => {
    setAttributeValueType(option.value);
  };

  const cancelAndClear = (): void => {
    if (isCreating) {
      clearInputs();
    }
    onCancel();
  };

  const handleSubmit = () => {
    /**
     * Leaving this here to avoid the need of
     * iterating through all nodes in the backend.
     */
    const _options = options.map((option, idx) => {
      const { label, value: origValue, touched } = option;

      const _option = {
        label,
        value: touched
          ? label
              .replace(/\s/g, '_')
              .replace(/[^a-zA-Z0-9_.-]/g, '')
              .toLowerCase()
          : origValue,
      };

      if (touched) {
        dispatch({
          type: 'change',
          index: idx,
          field: 'value',
          value: _option.value,
        });
      }

      return _option;
    });

    onSelect({
      placeholder,
      attributeType,
      valueType: attributeValueType,
      attributeKey,
      options: _options,
    });

    if (isCreating) {
      clearInputs();
    }
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
        <ModalHeader>Option dropdown</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb="4">
            <Text mb="1" color="gray.600" fontWeight="semibold">
              Placeholder text
            </Text>
            <Input
              value={placeholder}
              ref={initialRef}
              size="sm"
              placeholder="i.e., which workflow do you want to use?"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const text = e.target.value;
                if (text.length > 45) return;
                setPlaceholder(text);
              }}
            />
          </Box>

          <Box mb="4">
            <Text mb="1" color="gray.600" fontWeight="semibold">
              Attribute type
            </Text>
            <Select
              placeholder="Attribute type"
              value={selectedAttributeTypeOption}
              options={attributeTypeOptions}
              onChange={handleAttributeTypeChange}
            />
          </Box>

          <Box mb="4">
            <Text mb="1" color="gray.600" fontWeight="semibold">
              Value type
            </Text>
            <Select
              placeholder="Value type"
              value={selectedAttributeValueTypeOption}
              options={attributeValueTypeOptions}
              onChange={handleAttributeValueTypeChange}
            />
          </Box>

          <Box mb="4">
            <Text mb="1" color="gray.600" fontWeight="semibold">
              Attribute key
            </Text>
            <Input
              value={attributeKey}
              size="sm"
              placeholder="i.e., workflow_type"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setAttributeKey(e.target.value);
              }}
            />
          </Box>

          <Box mb="4">
            <Text mb="1" color="gray.600" fontWeight="semibold">
              Set options
            </Text>
            {options.map((option, idx) => (
              <HStack spacing={2} mb="8px" key={idx}>
                <Input
                  defaultValue=""
                  key={`option-label-${idx}`}
                  value={option.label}
                  size="sm"
                  placeholder={`i.e. Set up something`}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    dispatch({
                      type: 'change',
                      index: idx,
                      field: 'label',
                      value: e.target.value,
                    });
                  }}
                />
                <Box
                  color="gray.600"
                  opacity=".4"
                  _hover={{ opacity: '.8' }}
                  cursor="pointer"
                  onClick={() => dispatch({ type: 'delete', index: idx })}
                >
                  <DeleteIcon />
                </Box>
              </HStack>
            ))}
            <Box display="inline-block">
              <Box
                display="flex"
                alignItems="center"
                color="gray.600"
                cursor="pointer"
                opacity=".8"
                _hover={{ opacity: '1' }}
                onClick={() => dispatch({ type: 'create' })}
              >
                <AddIcon fontSize="small" color="inherit" />
                <Text fontSize="12px">Add option</Text>
              </Box>
              <Box mt="2" fontSize="xs" color="gray.600" opacity=".8">
                Note: Modified options will have their branching selection
                reset.
              </Box>
            </Box>
          </Box>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button variant="secondary" onClick={cancelAndClear}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Add</Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
