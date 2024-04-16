import { useEffect } from 'react';

export default function useElementVisibility(
  element: HTMLElement | null | undefined,
  onVisible?: () => void,
  onHidden?: () => void,
  options?: IntersectionObserverInit
) {
  useEffect(() => {
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => (entries[0].isIntersecting ? onVisible?.() : onHidden?.()),
      options
    );
    observer.observe(element);
    () => observer.disconnect();
  }, [element, onVisible, onHidden]);
}
