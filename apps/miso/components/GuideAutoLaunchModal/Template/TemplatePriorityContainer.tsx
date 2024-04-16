import React, { useState } from 'react';
import { Text } from '@chakra-ui/react';
import Box from 'system/Box';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { guideComponentIcon, GuideShape } from 'helpers/presentational';
import DragIndicator from '@mui/icons-material/DragIndicator';

const TemplatePriorityContainer = (props) => {
  const { currentTemplate, onTemplateSorted, templates } = props;
  const [rowDraggingId, setRowDraggingId] = useState<string>('');

  const handleDragEnd = (result) => {
    setRowDraggingId('');

    if (!result.destination) {
      return;
    }

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    const reorderedItems = Array.from(templates);

    const [removed] = reorderedItems.splice(startIndex, 1);
    reorderedItems.splice(endIndex, 0, removed);

    onTemplateSorted(reorderedItems);
  };

  const handleDragStart = (start, _provided) => {
    setRowDraggingId(start.draggableId);
  };

  return (
    // @ts-ignore
    <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      {/* @ts-ignore */}
      <Droppable droppableId={'template-priority'}>
        {(provided) => (
          <Box ref={provided.innerRef} {...provided.droppableProps}>
            {templates.map((template, idx) => {
              const rowId = `template-${template.entityId}`;
              const isCurrent = template.entityId === currentTemplate?.entityId;

              const Icon = guideComponentIcon({
                formFactor: template.formFactor,
                designType: template.designType,
                theme: template.theme,
                isCyoa: template.isCyoa,
              } as GuideShape);

              return (
                // @ts-ignore
                <Draggable key={rowId} draggableId={rowId} index={idx}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      p={3}
                      display="flex"
                      shadow={rowId === rowDraggingId ? 'md' : null}
                      background="white"
                    >
                      <Box color="gray.500">
                        <DragIndicator />
                      </Box>
                      <Box paddingTop="2px">
                        <Icon fontSize="small" role="presentation" />
                      </Box>
                      <Box ml={2} fontWeight="semibold">
                        {template.name || template.displayTitle}{' '}
                        {isCurrent && (
                          <Text
                            fontWeight="normal"
                            fontStyle="italic"
                            display="inline"
                          >
                            (this guide)
                          </Text>
                        )}
                      </Box>
                    </Box>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TemplatePriorityContainer;
