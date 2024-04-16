import React, { useCallback, useRef } from 'react';
import {
  DragDropContext,
  DragStart,
  ResponderProvided,
} from 'react-beautiful-dnd';
import { useFormikContext } from 'formik';
import get from 'lodash/get';

interface DragAndDropProviderProps {
  children: React.ReactNode;
  formItemsKey?: string;
  clearSelected?: () => void;
  dragEndCallback?: (_result: any) => void;
  dragStartCallback?: (initial: DragStart, provided: ResponderProvided) => void;
  onBeforeDragStart?: (initial: DragStart) => void;
  dragShadow?: string;
}

/**
 * To be used within a Formik context.
 */
export default function DragAndDropProvider({
  formItemsKey,
  clearSelected,
  children,
  dragStartCallback,
  onBeforeDragStart,
  dragEndCallback,
  dragShadow,
}: DragAndDropProviderProps) {
  const originalShadow = useRef<string>('');
  const elementDragged = useRef<HTMLElement>(null);
  const { values, setFieldValue } = useFormikContext();

  const handleDragEnd = (result) => {
    // Clear drag shadow.
    if (elementDragged.current) {
      elementDragged.current.style.boxShadow = originalShadow.current;
      elementDragged.current = null;
      originalShadow.current = '';
    }

    if (!result.destination || !result.source) {
      return;
    }

    const formKey = formItemsKey || result.source.droppableId;
    const items = get(values, formKey);

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    const reorderedItems = Array.from(items);

    const [removed] = reorderedItems.splice(startIndex, 1);
    reorderedItems.splice(endIndex, 0, removed);

    setFieldValue(formKey, reorderedItems);
    clearSelected && clearSelected();

    dragEndCallback && dragEndCallback(result);
  };

  const handleDragStart = useCallback(
    (initial: DragStart, provided: ResponderProvided) => {
      // Search element if a shadow was provided.
      const element = dragShadow
        ? (document.querySelector(
            `[data-rbd-draggable-id="${initial.draggableId}"]`
          ) as HTMLElement)
        : null;

      // Add drag shadow.
      if (element) {
        originalShadow.current = element.style.boxShadow;
        element.style.boxShadow = dragShadow;
        elementDragged.current = element;
      }

      dragStartCallback?.(initial, provided);
    },
    [dragStartCallback, dragShadow]
  );

  return (
    // @ts-ignore
    <DragDropContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onBeforeDragStart={onBeforeDragStart}
    >
      {children}
    </DragDropContext>
  );
}
