import React, { useCallback, useMemo, useState } from 'react';
import { FieldArray, useFormikContext } from 'formik';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Box, BoxProps, Flex } from '@chakra-ui/react';

import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import DragIndicator from '@mui/icons-material/DragIndicator';

import AddButton from 'components/AddButton';
import TextField from 'components/common/InputFields/TextField';

import { DropdownInputOption } from 'bento-common/types';
import DragAndDropProvider from 'providers/DragAndDropProvider';
import { StepInputFieldFormValues } from './StepInputFieldModal';
import { formatChoiceKey } from 'bento-common/data/helpers';

interface Props extends BoxProps {}

const DEFAULT_OPTION: DropdownInputOption = { label: '', value: '' };
const formKey = 'settings.options';
const getRowKey = (option: DropdownInputOption, idx: number) =>
  `option-${option.label}-${option.value}-${idx}`;

const InputModalOptions: React.FC<Props> = ({ ...boxProps }) => {
  // Step input field modal context.
  const { values, setFieldValue } =
    useFormikContext<StepInputFieldFormValues>();
  const options = useMemo(
    () => values.settings.options,
    [values.settings?.options]
  );

  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleBeforeDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const rowKeys = useMemo(() => {
    const rowKeys: string[] = [];
    options.forEach((option, idx) => {
      rowKeys.push(getRowKey(option, idx));
    });
    return rowKeys;
  }, [options.length, isDragging]);

  const showControls = useMemo(() => options.length > 1, [options.length]);

  return (
    <FieldArray
      name={formKey}
      render={({ push, remove }) => (
        <Flex flexDir="column" gap="1" {...boxProps}>
          <Flex w="full" gap="2">
            <Box color="gray.600" fontWeight="semibold" flex="1">
              Options
            </Box>
          </Flex>
          <DragAndDropProvider
            formItemsKey={formKey}
            dragEndCallback={handleDragEnd}
            onBeforeDragStart={handleBeforeDragStart}
          >
            {/* @ts-ignore */}
            <Droppable droppableId={formKey}>
              {(provided) => (
                <Box ref={provided.innerRef} {...provided.droppableProps}>
                  <>
                    {options.map((option, idx) => {
                      const optionKey = `${formKey}[${idx}]`;

                      return (
                        // @ts-ignore
                        <Draggable
                          // Note: keeping 'key' and 'draggableId' separate to avoid
                          // a conflict between input focus and drag logic.
                          key={rowKeys[idx]}
                          draggableId={getRowKey(option, idx)}
                          index={idx}
                        >
                          {(provided) => (
                            <Box
                              ref={provided.innerRef}
                              className="row-container hoverable-row"
                              display="flex"
                              flexWrap="wrap"
                              gap="2"
                              mb="1"
                              {...provided.draggableProps}
                            >
                              <Box flex="1" position="relative">
                                {showControls && (
                                  <Box
                                    className="hoverable-row-hidden"
                                    position="absolute"
                                    left="-22px"
                                    top="8px"
                                    color="gray.600"
                                    w="24px"
                                    {...provided.dragHandleProps}
                                  >
                                    <DragIndicator />
                                  </Box>
                                )}
                                <TextField
                                  onChange={(newLabel) => {
                                    setFieldValue(
                                      `${optionKey}.label`,
                                      newLabel
                                    );
                                    setFieldValue(
                                      `${optionKey}.value`,
                                      formatChoiceKey(newLabel)
                                    );
                                  }}
                                  defaultValue={option.label}
                                  variant="secondary"
                                  fontSize="sm"
                                />
                                {showControls && (
                                  <Box
                                    className="row-hoverable-btn-80"
                                    position="absolute"
                                    right="-20px"
                                    top="8px"
                                    color="gray.600"
                                    cursor="pointer"
                                    w="20px"
                                    my="auto"
                                    ml="2"
                                    onClick={() => {
                                      remove(idx);
                                    }}
                                  >
                                    <DeleteIcon />
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </>
                </Box>
              )}
            </Droppable>
          </DragAndDropProvider>
          <AddButton
            onClick={() => {
              push({ ...DEFAULT_OPTION });
            }}
            fontSize="xs"
            iconSize="sm"
          >
            Add option
          </AddButton>
        </Flex>
      )}
    />
  );
};

export default InputModalOptions;
