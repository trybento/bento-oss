import { useCallback, useEffect, useRef } from 'react';

type EventCallback = (windowEvent?: Event) => void;

/**
 * Add or remove event listeners to the window
 * @param runFirstOnce Only use if event object not required: it will run the callback on mount
 */
export default function useEventListener(
  element: Element | 'window' | Document | undefined | null,
  eventName:
    | keyof WindowEventMap
    | keyof HTMLElementEventMap
    | keyof DocumentEventMap,
  callback: EventCallback,
  options?: {
    runFirstOnce?: boolean;
    bubbles?: boolean;
    disable?: boolean;
  }
): void {
  const handler = useRef<EventCallback>();

  useEffect(() => {
    handler.current = callback;
    if (options?.runFirstOnce) callback();
  }, [callback]);

  const listener = useCallback((event: Event) => handler.current?.(event), []);

  useEffect(() => {
    // @ts-ignore-error
    if (!element || options?.disable) return;

    const useElement = element === 'window' ? window : element;
    // @ts-ignore-error
    if (!useElement?.addEventListener) return;
    const opts: AddEventListenerOptions = {
      passive: ['scroll', 'resize'].includes(eventName),
      capture: options?.bubbles,
    };
    useElement.addEventListener(eventName, listener, opts);
    return () => useElement.removeEventListener(eventName, listener, opts);
  }, [element, eventName, options?.disable]);
}
