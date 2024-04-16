import {
  WysiwygEditorMode,
  WysiwygEditorRecorderType,
} from 'bento-common/types';
import { throttleWithExtraCall } from 'bento-common/utils/functions';
import { convert } from 'html-to-text';
import { throttle } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';

import { CSUI_ELEMENT_ID, MAX_Z_INDEX } from '~src/constants';
import { useElementSelector } from '~src/providers/ElementSelectorProvider';
import { useSession } from '~src/providers/VisualBuilderSessionProvider';

import ElementMissingPopup from './ElementMissingPopup';
import {
  DEFAULT_MIN_LENGTH,
  generateHighlightPosition,
  getEffectiveZIndex,
  getElementInformation,
  getVisibleElement,
} from './helpers';

interface Position {
  left: string;
  top: string;
  width: string;
  height: string;
}

const UPDATE_ELEMENT_DELAY_MS = 200;
const SEARCH_ELEMENT_DELAY_MS = 3000;

const Highlighter: React.FC = () => {
  const { progressData, setProgressData, setReturnMode, changeMode } =
    useSession();
  const [position, setPosition] = useState<Position | undefined>();
  const [zIndex, setZIndex] = useState<number | undefined>();
  const [showElementMissingWarning, setShowElementMissingWarning] =
    useState(false);

  const { hoveredElement, setHoveredElement, clearSelectorOmissions } =
    useElementSelector();

  useEffect(() => {
    if (
      hoveredElement &&
      [
        WysiwygEditorMode.customize,
        WysiwygEditorMode.customizeContent,
      ].includes(progressData.mode)
    ) {
      setZIndex(getEffectiveZIndex(hoveredElement));
    } else {
      setZIndex(MAX_Z_INDEX);
    }
  }, [hoveredElement, progressData.mode]);

  const onElementMissingWarningClosed = useCallback(
    (ignore?: boolean) => {
      setShowElementMissingWarning(false);

      if (!ignore && progressData.mode !== WysiwygEditorMode.preview) {
        setReturnMode(progressData.mode);
        changeMode(WysiwygEditorMode.navigate);
      }
    },
    [progressData.mode],
  );

  const selectElement = useCallback(() => {
    if (!hoveredElement) {
      return;
    }

    const info = getElementInformation(hoveredElement, [], DEFAULT_MIN_LENGTH);

    if (progressData.recorderType === WysiwygEditorRecorderType.auto) {
      setProgressData((prev) => {
        return {
          ...prev,
          recordedActions: [
            ...prev.recordedActions,
            {
              action: `Clicked ${info.elementType}: ${info.elementText}`,
              ...info,
            },
          ],
        };
      });

      // Separately update page text if needed, as it could take slightly longer to process
      if (!progressData.pageText) {
        const pageText = convert(document.body.innerHTML, {
          wordwrap: 130,
        })
          // Remove empty new lines.
          .replace(/\n\s*\n/g, '')
          // Avoid sending long strings.
          .substring(0, 8000);

        setProgressData((prev) => {
          return {
            ...prev,
            pageText,
          };
        });
      }
    } else {
      setProgressData((prev) => {
        return {
          ...prev,
          mode: WysiwygEditorMode.confirmElement,
          ...info,
        };
      });
    }

    /**
     * Seeing as we've deliberately selected an element, clear any existing class
     * omissions used for regenerating selectors.
     */
    clearSelectorOmissions();
  }, [window.location.href, hoveredElement]);

  const handleHighlightElement = useCallback(
    throttleWithExtraCall(
      (ev: MouseEvent) => {
        const element = ev.target! as HTMLElement;

        if (!element) {
          return;
        }

        setHoveredElement(element);
        setPosition(generateHighlightPosition(element));
      },
      { throttleArgs: [16], extraDelay: 250 },
    ),
    [],
  );

  const noClicks = useCallback(
    (e: Event) => {
      if ((e.target as HTMLElement).id === CSUI_ELEMENT_ID) {
        return;
      }

      if (progressData.recorderType !== WysiwygEditorRecorderType.auto) {
        e.stopPropagation();
        e.preventDefault();
      }

      if (e.target === hoveredElement) {
        selectElement();
      }
    },
    [progressData.recorderType, hoveredElement, selectElement],
  );

  useEffect(() => {
    if (progressData.mode === WysiwygEditorMode.selectElement) {
      document.addEventListener('click', noClicks, true);
    }

    return () => {
      document.removeEventListener('click', noClicks, true);
    };
  }, [progressData.mode, hoveredElement, noClicks]);

  const findElement = useCallback(
    throttle(
      () => {
        if (
          progressData.mode !== WysiwygEditorMode.selectElement &&
          progressData.elementSelector
        ) {
          const element = getVisibleElement(progressData.elementSelector);

          if (element && element !== hoveredElement) {
            setHoveredElement(element);
          } else if (!element) {
            setHoveredElement(undefined);
          }
        }
      },
      UPDATE_ELEMENT_DELAY_MS,
      { trailing: true, leading: false },
    ),
    [hoveredElement, progressData.elementSelector, progressData.mode],
  );

  useEffect(() => {
    //Trigger immediately
    findElement();

    // Then run on an interval to periodically check/update
    const interval = setInterval(findElement, UPDATE_ELEMENT_DELAY_MS);

    return () => {
      clearInterval(interval);
    };
  }, [findElement]);

  useEffect(() => {
    const wrapper = async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, SEARCH_ELEMENT_DELAY_MS),
      );

      /**
       * If after SEARCH_ELEMENT_DELAY_MS the element isn't on the page
       * this likely means the selected element is somewhere in a modal or something.
       */
      if (
        [
          WysiwygEditorMode.customize,
          WysiwygEditorMode.confirmElement,
        ].includes(progressData.mode) &&
        !hoveredElement
      ) {
        setShowElementMissingWarning(true);
      }
    };

    wrapper();
  }, []);

  useEffect(() => {
    if (progressData.mode === WysiwygEditorMode.selectElement) {
      setZIndex(MAX_Z_INDEX);
      setHoveredElement(undefined);

      document.body.addEventListener('mouseover', handleHighlightElement);
    }

    return () => {
      document.body.removeEventListener('mouseover', handleHighlightElement);
    };
  }, [progressData.mode]);

  useEffect(() => {
    const refreshHighlightInterval = setInterval(() => {
      if (hoveredElement) {
        setPosition(generateHighlightPosition(hoveredElement));
      } else {
        setPosition(undefined);
      }
    }, 100);

    return () => clearInterval(refreshHighlightInterval);
  }, [hoveredElement]);

  if (
    [WysiwygEditorMode.navigate, WysiwygEditorMode.preview].includes(
      progressData.mode,
    )
  ) {
    return null;
  }

  return (
    <>
      <div
        id="bentoSelectorHighlighter"
        style={{
          display: 'block',
          border: '2px solid magenta',
          position: 'fixed',
          transition: 'all 0.1s',
          pointerEvents: 'none',
          zIndex,
          ...position,
        }}
      />

      {showElementMissingWarning && (
        <ElementMissingPopup onClose={onElementMissingWarningClosed} />
      )}
    </>
  );
};

export default Highlighter;
