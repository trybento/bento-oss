import { BoxProps } from '@chakra-ui/react';
import useCallbackRef from 'bento-common/hooks/useCallbackRef';
import { Timeout } from 'bento-common/types';
import { stopEvent } from 'bento-common/utils/dom';
import useEventListener from '../../../hooks/useEventListener';
import throttle from 'lodash/throttle';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BaseEditor, BaseText, Transforms } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';
import FloatingControls, {
  FloatingControlAdditionalAction,
} from '../../FloatingControls';

const RTE_SELECTOR = '[data-slate-editor=true]';
const RTE_BOUNDARY_OFFSET_PX = 10;

interface ElementDetailsProps extends Pick<BoxProps, 'zIndex'> {
  additionalActions?: FloatingControlAdditionalAction[];
  element: any;
  top?: number;
  left?: number;
  elRef?: HTMLElement;
  textToDisplay?: string;
  deleteEnabled?: boolean;
}

interface DetailsPos {
  top: number;
  left: number;
}

export const updateNodeField = (
  editor: BaseEditor,
  element: any,
  field: string | null,
  value: any
) => {
  const nodePath = ReactEditor.findPath(editor as ReactEditor, element);
  Transforms.setNodes(
    editor,
    {
      ...element,
      ...(field ? { [field]: value } : value),
    } as Partial<BaseText>,
    {
      at: nodePath,
    }
  );
};

export const updateNodeFields = <KVs extends Record<string, any>>(
  editor: BaseEditor,
  element: any,
  fieldsAndValues: KVs
) => {
  const nodePath = ReactEditor.findPath(editor as ReactEditor, element);
  Transforms.setNodes(
    editor,
    {
      ...element,
      ...fieldsAndValues,
    } as Partial<BaseText>,
    {
      at: nodePath,
    }
  );
};

type ModalHandlers<T> = {
  [key in keyof T]: { open: () => void; close: () => void };
};

type ModalStates<T> = {
  [key in keyof T]?: boolean;
};

export function useElementDetails<T>({
  modalStatesEnum,
  element,
  positionOffsetPx = { x: 0, y: 0 },
}: {
  modalStatesEnum: T;
  element?: HTMLElement;
  positionOffsetPx?: { x?: number; y?: number };
}): {
  detailsPos: DetailsPos;
  isHovered: boolean;
  setIsHovered: (v: boolean) => void;
  isEditing: boolean;
  handleEditFinish: () => void;
  modalHandlers: ModalHandlers<T>;
  modalStates: ModalStates<T>;
  updateDetailsPos: () => void;
  mouseHandlers: {
    enter: (e: React.MouseEvent) => void;
    leave: (e: React.MouseEvent) => void;
  };
} {
  const dismissRef = useRef<Timeout>();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [detailsPos, setDetailsPos] = useState<DetailsPos>({
    top: 0,
    left: 0,
  });

  const [modalStates, setModalStates] = useState<ModalStates<T>>({});

  const handleEditFinish = useCallback(() => {
    setModalStates(
      Object.keys(modalStatesEnum).reduce((acc, field) => {
        acc[field] = false;
        return acc;
      }, {} as ModalStates<T>)
    );
    setIsEditing(false);
    setIsHovered(false);
  }, []);

  const modalHandlers = useMemo<ModalHandlers<T>>(
    () =>
      Object.keys(modalStatesEnum).reduce((acc, field) => {
        acc[field] = {
          open: () => {
            setIsEditing(true);
            setModalStates({ ...modalStates, [field]: true });
          },
          close: () => {
            setModalStates({ ...modalStates, [field]: false });
            handleEditFinish();
          },
        };
        return acc;
      }, {} as ModalHandlers<T>),
    [modalStates]
  );

  const updateDetailsPos = useCallbackRef(
    throttle(
      () => {
        if (!isHovered || !element || isEditing) return;
        const { top, left, width } = element.getBoundingClientRect();
        const newPos = {
          top: top + positionOffsetPx.y,
          left: left + width - positionOffsetPx.x,
        };
        if (newPos.left !== detailsPos.left || newPos.top !== detailsPos.top)
          setDetailsPos(newPos);
      },
      isHovered && !isEditing ? 250 : 10000
    ),
    [isHovered, isEditing, positionOffsetPx, detailsPos],
    { callOnDepsChange: true, callOnLoad: true }
  );

  useEventListener(
    element?.closest(RTE_SELECTOR) || document.querySelector(RTE_SELECTOR),
    'scroll',
    updateDetailsPos
  );

  const mouseHandlers = useMemo(
    () => ({
      enter: (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        clearTimeout(dismissRef.current);
        setIsHovered(true);
      },
      leave: (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (isEditing) return;
        dismissRef.current = setTimeout(() => {
          setIsHovered(false);
        }, 600);
      },
    }),
    [isEditing]
  );

  return {
    detailsPos,
    updateDetailsPos,
    isHovered,
    mouseHandlers,
    setIsHovered,
    isEditing,
    handleEditFinish,
    modalHandlers,
    modalStates,
  };
}

const ElementDetails: React.FC<ElementDetailsProps> = ({
  element,
  top,
  left,
  textToDisplay,
  deleteEnabled,
  elRef,
  additionalActions,
  zIndex,
}) => {
  const [pos, setPos] = useState(null);
  const [selfWidth, setSelfWidth] = useState<number>(0);
  const rteContainerRef = useRef<HTMLDivElement>();
  const editor = useSlate();

  useEffect(() => {
    if (!rteContainerRef.current && element) {
      rteContainerRef.current =
        elRef?.closest(RTE_SELECTOR) || document.querySelector(RTE_SELECTOR);
    }
    const { top: rteTop, left: rteLeft } =
      rteContainerRef.current.getBoundingClientRect();
    const newPos = {
      top: Math.max(top, rteTop + RTE_BOUNDARY_OFFSET_PX),
      left: Math.max(left - selfWidth, rteLeft + RTE_BOUNDARY_OFFSET_PX),
    };
    if (selfWidth && (newPos.left !== pos?.left || newPos.top !== pos?.top))
      setPos(newPos);
  }, [top, left, selfWidth]);

  const handleRef = useCallback((el: HTMLElement) => {
    if (el) {
      setSelfWidth(el.getBoundingClientRect().width);
    }
  }, []);

  const handleDelete = useCallback(() => {
    const nodePath = ReactEditor.findPath(editor as ReactEditor, element);
    Transforms.delete(editor, { at: nodePath });
  }, [editor]);

  return (
    <>
      <FloatingControls
        {...((pos || {}) as DetailsPos)}
        ref={handleRef}
        text={textToDisplay}
        onClick={stopEvent}
        opacity={pos ? 1 : 0}
        onDelete={deleteEnabled ? handleDelete : undefined}
        additionalActions={additionalActions}
        contentEditable="false"
        zIndex={zIndex}
        suppressContentEditableWarning
        withPortal
      />
    </>
  );
};

export default ElementDetails;
