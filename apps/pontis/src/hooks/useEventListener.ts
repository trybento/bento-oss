import { useEffect, useRef } from 'react';

type EventCallback = (windowEvent?: Event) => void;

/**
 * Add or remove event listeners to the window
 * @param runFirstOnce Only use if event object not required: it will run the callback on mount
 */
export default function useEventListener(
  element: Element | 'window',
  eventName: keyof WindowEventMap | keyof HTMLElementEventMap,
  callback: EventCallback,
  runFirstOnce?: boolean
): void {
  const handler = useRef<EventCallback>();

  useEffect(() => {
    handler.current = callback;
    if (runFirstOnce) callback(null);
  }, [callback]);

  const listener = (event: Event) => handler.current(event);

  useEffect(() => {
    const useElement = element === 'window' ? window : element;
    if (!useElement || !useElement.addEventListener) return;
    useElement.addEventListener(eventName, listener);
    return () => useElement.removeEventListener(eventName, listener);
  }, [element, eventName]);
}
