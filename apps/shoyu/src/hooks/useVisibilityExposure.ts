import { useCallback, useEffect, useRef } from 'react';
import { EmbedFormFactor } from 'bento-common/types';
import { debugMessage } from 'bento-common/utils/debugging';
import { NpsFormFactor } from 'bento-common/types/netPromoterScore';

type Args = {
  /** Whether the component is visible */
  visible: boolean;
  /** Which component type this is about */
  component: EmbedFormFactor | NpsFormFactor;
  /** Func to be called whenever the visibility state has changed */
  onChange?: (visible: boolean) => void;
};

/**
 * Dispatches a document event (`bento-onComponentVisibilityChange`) whenever a specific
 * component visibility has changed.
 *
 * WARNING: This isn't aware of which content is being displayed, but whether a specific component is visible.
 */
export default function useVisibilityExposure({
  visible: passedInVisible,
  component,
  onChange,
}: Args) {
  const previouslyVisible = useRef<boolean>(false);

  const dispatchEvent = useCallback(
    (visible: boolean) => {
      // updates ref to prevent dupes
      previouslyVisible.current = visible;

      onChange?.(visible);

      document.dispatchEvent(
        new CustomEvent('bento-onComponentVisibilityChange', {
          detail: {
            component,
            visible,
          },
        })
      );

      debugMessage('[BENTO] Component visibility changed', {
        component,
        visible,
      });
    },
    [component, onChange]
  );

  useEffect(() => {
    // nothing has changed
    if (passedInVisible === previouslyVisible.current) return;
    // record ref and dispatch document event
    dispatchEvent(passedInVisible);

    return () => {
      if (previouslyVisible.current) dispatchEvent(false);
    };
  }, [passedInVisible]);
}
