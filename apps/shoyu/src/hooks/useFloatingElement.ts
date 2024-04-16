import { useCallback, useEffect, useMemo, useState } from 'react';
import { ClientStorage } from 'bento-common/utils/clientStorage';
import useClientStorage from 'bento-common/hooks/useClientStorage';
import usePrevious from 'bento-common/hooks/usePrevious';
import { stopEvent } from 'bento-common/utils/dom';
import { throttleWithExtraCall } from 'bento-common/utils/functions';
import useResizeObserver from 'bento-common/hooks/useResizeObserver';
import useCallbackRef, {
  useWrappedCallbackRef,
} from 'bento-common/hooks/useCallbackRef';
import { debounce, throttle } from 'bento-common/utils/lodash';

import useEventListener from './useEventListener';

export enum FloatingElementUIPosition {
  bottomRight,
  bottomLeft,
}

type MinMax = { min: number; max: number };

type MinMaxCoordinates = { x: MinMax; y: MinMax };

export type PersistedPosition = {
  left?: number;
  right?: number;
  bottom: number;
};

export type DraggedTo = PersistedPosition & {
  windowWidth: number;
  windowHeight: number;
};

type UseFloatingElementProps = {
  dragTriggerElement: any;
  draggableIdentifier: string;
  draggableElement: HTMLElement | null;
  resetTriggers?: any[]; // Values should be truthy to reset.
  uiPosition?: FloatingElementUIPosition;
  xAnchorOffset?: number;
  yAnchorOffset?: number;
  disabled?: boolean;
  container?: HTMLElement | null;
};

type ContainerDimensions = {
  width: number;
  height: number;
  scale: number;
};

export const WINDOW_PADDING_PX = 20;

export default function useFloatingElement({
  dragTriggerElement,
  draggableIdentifier,
  draggableElement,
  resetTriggers = [],
  uiPosition,
  xAnchorOffset = 0,
  yAnchorOffset = 0,
  disabled,
  container,
}: UseFloatingElementProps): DraggedTo {
  const sidebarOnRight = uiPosition === FloatingElementUIPosition.bottomRight;
  const { value: persistedPosition, setValue: setPersistedPosition } =
    useClientStorage<PersistedPosition>(
      ClientStorage.sessionStorage,
      `bento-persistedPosition-${draggableIdentifier}`
    );
  const [position, setPosition] = useState<PersistedPosition | undefined>(
    persistedPosition?.bottom != null ? persistedPosition : undefined
  );
  const prevPosition = usePrevious(position);

  const [maxElementPos, setMaxElementPos] = useState<MinMaxCoordinates>();
  const [initialMousePos, setInitialMousePos] = useState<{
    x: number;
    y: number;
  }>();
  const [isDragging, setIsDragging] = useState(false);
  const [draggableDimensions, setDraggableDimensions] = useState<DOMRect>();
  const prevDraggableDimensions = usePrevious(draggableDimensions);

  const [containerDimensions, setContainerDimensions] =
    useState<ContainerDimensions>();

  const updatePosition = useWrappedCallbackRef(
    { fn: throttle, args: [16, { leading: true }] },
    ({ left: maybeLeft, right: maybeRight, bottom }: PersistedPosition) => {
      const scale = containerDimensions?.scale || 1;
      setPosition({
        left: maybeLeft != null ? maybeLeft * scale : undefined,
        right: maybeRight != null ? maybeRight * scale : undefined,
        bottom: bottom * scale,
      });
    },
    [containerDimensions?.scale]
  );

  const getVisiblePosition = useCallbackRef(
    ({
      left: newLeft,
      right: newRight,
      bottom: newBottom,
    }: PersistedPosition) => {
      if (!maxElementPos) {
        return { left: WINDOW_PADDING_PX, bottom: WINDOW_PADDING_PX };
      }
      let left = newLeft;
      let right = newRight;
      let bottom = newBottom;

      if (left != null) {
        if (left > maxElementPos.x.max) {
          left = maxElementPos.x.max;
        } else if (left < maxElementPos.x.min) {
          left = maxElementPos.x.min;
        }
      }

      if (right != null) {
        if (right > maxElementPos.x.max) {
          right = maxElementPos.x.max;
        } else if (right < maxElementPos.x.min) {
          right = maxElementPos.x.min;
        }
      }

      if (bottom > maxElementPos.y.max) {
        bottom = maxElementPos.y.max;
      } else if (bottom < maxElementPos.y.min) {
        bottom = maxElementPos.y.min;
      }

      return { left, right, bottom };
    },
    [maxElementPos]
  );

  const resetPosition = useWrappedCallbackRef(
    { fn: debounce, args: [100] },
    () => {
      updatePosition({
        [sidebarOnRight ? 'right' : 'left']: WINDOW_PADDING_PX + xAnchorOffset,
        bottom: WINDOW_PADDING_PX + yAnchorOffset,
      });
    },
    [sidebarOnRight, xAnchorOffset, yAnchorOffset]
  );

  const onMouseDown = useCallbackRef(
    (e: MouseEvent) => {
      if (draggableElement && !disabled) {
        e.preventDefault();
        e.stopPropagation();

        // Trigger onMenuClose for dropdowns.
        document.dispatchEvent(new Event('click'));

        draggableElement.classList.add('bento-dragging');

        setInitialMousePos({ x: e.clientX, y: e.clientY });
        setIsDragging(true);
      }
    },
    [disabled, draggableElement]
  );

  const onMouseUp = useCallbackRef(
    (e: MouseEvent) => {
      if (draggableElement && !disabled && isDragging) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        draggableElement.classList.remove('bento-dragging');
        draggableElement.removeEventListener('click', stopEvent);
        setInitialMousePos(undefined);
      }
    },
    [draggableElement, isDragging]
  );

  const onDragStart = useCallback(() => false, []);

  const onMouseMove = useCallbackRef(
    (e: MouseEvent) => {
      if (
        initialMousePos &&
        persistedPosition &&
        draggableElement &&
        !disabled &&
        isDragging
      ) {
        updatePosition(
          getVisiblePosition({
            left:
              persistedPosition.left != null
                ? persistedPosition.left + (e.pageX - initialMousePos.x)
                : undefined,
            right:
              persistedPosition.right != null
                ? persistedPosition.right - (e.pageX - initialMousePos.x)
                : undefined,
            bottom: persistedPosition.bottom - (e.pageY - initialMousePos.y),
          })
        );
        e.preventDefault();
        e.stopPropagation();
        draggableElement.addEventListener('click', stopEvent, {
          once: true,
        });
      }
    },
    [initialMousePos, persistedPosition, isDragging]
  );

  const handleDomChange = useWrappedCallbackRef(
    {
      fn: throttleWithExtraCall,
      args: [{ throttleArgs: [16], extraDelay: 250 }],
    },
    () => {
      setContainerDimensions(
        container === null
          ? { width: 0, height: 0, scale: 1 }
          : container
          ? {
              width: container.clientWidth,
              height: container.clientHeight,
              // NOTE: the preview "window" is scaled to 80% which causes the sidebar
              // to show up in a weird place since the container reports its original
              // size but the scaled size is used when positioning which causes the
              // sidebar to be much further to the left. Similarly scaling the
              // position using the actual scale makes the sidebar appear outside of
              // the preview window. So after some experimentation splitting the
              // difference turned out to produce the best result. It's not perfect
              // but it's not too bad.
              scale:
                (container.getBoundingClientRect().width /
                  container.clientWidth +
                  1) /
                2,
            }
          : {
              width: window.innerWidth,
              height: window.innerHeight,
              scale: 1,
            }
      );
      if (isDragging || disabled) return;
      // If it is the first time loading and there is no position, reset to default position.
      if (!position) {
        resetPosition();
      }
      if (draggableElement) {
        setDraggableDimensions(draggableElement.getBoundingClientRect());
      }
    },
    [draggableElement, disabled, isDragging, container],
    { callOnDepsChange: true }
  );

  // handle resetting the position based on whatever triggers are passed in
  const prevResetTriggers = usePrevious(resetTriggers);
  useEffect(() => {
    if (prevResetTriggers && !isDragging) {
      resetPosition();
    }
    // intentially only including the reset triggers here
  }, [...resetTriggers]);

  useEffect(() => {
    if (container) {
      resetPosition();
    }
  }, [container]);

  // handle updating the draggable dimensions when the dragged element changes
  useEffect(() => {
    if (!isDragging) {
      handleDomChange();
    }
  }, [draggableElement]);

  // handle updating the draggable bounds
  useEffect(() => {
    if (draggableDimensions && containerDimensions) {
      setMaxElementPos({
        x: {
          min: WINDOW_PADDING_PX,
          max: Math.max(
            containerDimensions.width -
              draggableDimensions.width -
              WINDOW_PADDING_PX,
            WINDOW_PADDING_PX
          ),
        },
        y: {
          min: WINDOW_PADDING_PX,
          max: Math.max(
            containerDimensions.height -
              draggableDimensions.height -
              WINDOW_PADDING_PX,
            WINDOW_PADDING_PX
          ),
        },
      });
    }
  }, [
    containerDimensions?.width,
    containerDimensions?.height,
    draggableDimensions?.width,
    draggableDimensions?.height,
  ]);

  // handle correcting or persisting the position
  useEffect(() => {
    if (position) {
      if (
        (sidebarOnRight && position.right == null) ||
        (!sidebarOnRight && position.left == null)
      ) {
        resetPosition();
      } else if (!isDragging) {
        setPersistedPosition(position);
      }
    }
  }, [
    position?.left,
    position?.right,
    position?.bottom,
    sidebarOnRight,
    isDragging,
  ]);

  // handle keeping the sidebar in the visible window
  useEffect(() => {
    if (
      position &&
      (position.left !== prevPosition?.left ||
        position.right !== prevPosition?.right ||
        position.bottom !== prevPosition?.bottom) &&
      maxElementPos &&
      draggableDimensions &&
      prevDraggableDimensions &&
      prevDraggableDimensions.height === draggableDimensions.height
    ) {
      updatePosition(getVisiblePosition(position));
    }
  }, [position, maxElementPos, draggableDimensions]);

  // handle updating the position when the container and sidebar size changes
  useResizeObserver(handleDomChange, { element: container });
  useResizeObserver(handleDomChange, { element: draggableElement });

  // @ts-ignore
  useEventListener(dragTriggerElement, 'mousedown', onMouseDown, {
    disable: disabled,
  });
  useEventListener(dragTriggerElement, 'dragstart', onDragStart, {
    disable: disabled,
  });
  useEventListener(
    container === undefined ? 'window' : container,
    'mousemove',
    // @ts-ignore
    onMouseMove
  );
  useEventListener(
    container === undefined ? 'window' : container,
    'mouseup',
    // @ts-ignore
    onMouseUp
  );

  return useMemo(
    () => ({
      ...(position ?? { left: undefined, right: undefined, bottom: 0 }),
      windowHeight: containerDimensions?.height ?? 0,
      windowWidth: containerDimensions?.width ?? 0,
    }),
    [position, containerDimensions]
  );
}
