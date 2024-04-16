import React, { createContext, useCallback, useContext, useState } from 'react';

import {
  DEFAULT_MIN_LENGTH,
  getElementInformation,
} from '~src/components/Highlighter/helpers';

import { useSession } from './VisualBuilderSessionProvider';

interface ElementSelectorContext {
  hoveredElement: HTMLElement | undefined;
  setHoveredElement: React.Dispatch<
    React.SetStateAction<HTMLElement | undefined>
  >;
  regenerateSelector: (reset?: boolean) => void;
  clearSelectorOmissions: () => void;
  allowRegenerateSelector: boolean;
}

const ElementSelectorContext = createContext<ElementSelectorContext>(null);

export const useElementSelector = () => {
  const context = useContext(ElementSelectorContext);

  return context;
};

const ElementSelectorProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { progressData, setProgressData } = useSession();
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | undefined>(
    undefined,
  );
  const [omittedClasses, setOmittedClasses] = useState<string[]>([]);
  const [selectorMinLength, setSelectorMinLength] =
    useState(DEFAULT_MIN_LENGTH);
  const [allowRegenerateSelector, setAllowRegenerateSelector] = useState(true);

  const regenerateSelector = useCallback(
    (reset?: boolean) => {
      if (!hoveredElement) {
        return;
      }

      const elementSelector = progressData.elementSelector;

      if (!elementSelector) {
        return;
      }

      let currentOmittedClasses = omittedClasses;
      let currentSelectorMinLength = selectorMinLength;

      if (reset) {
        currentOmittedClasses = [];
        currentSelectorMinLength = DEFAULT_MIN_LENGTH;
      }

      const parts = elementSelector.split(' ');
      const lastPart = parts.slice(-1)[0];

      if (lastPart.includes('.')) {
        omittedClasses.push(lastPart.split('.').slice(-1)[0]);
      } else {
        currentSelectorMinLength =
          parts
            .filter((part) => part !== '>')
            .flatMap((part) => part.split('.').flatMap((p) => p.split(':')))
            .length + 1;
      }

      const info = getElementInformation(
        hoveredElement,
        currentOmittedClasses,
        currentSelectorMinLength,
      );

      if (info.elementSelector === elementSelector) {
        setAllowRegenerateSelector(false);
      }

      setProgressData((prev) => {
        return {
          ...prev,
          ...info,
        };
      });

      setOmittedClasses(currentOmittedClasses);
      setSelectorMinLength(currentSelectorMinLength);
    },
    [
      hoveredElement,
      progressData.elementSelector,
      omittedClasses,
      selectorMinLength,
    ],
  );

  const clearSelectorOmissions = useCallback(() => {
    setOmittedClasses([]);
    setSelectorMinLength(DEFAULT_MIN_LENGTH);
    setAllowRegenerateSelector(true);
  }, []);

  return (
    <ElementSelectorContext.Provider
      value={{
        hoveredElement,
        setHoveredElement,
        regenerateSelector,
        clearSelectorOmissions,
        allowRegenerateSelector,
      }}>
      {children}
    </ElementSelectorContext.Provider>
  );
};

export default ElementSelectorProvider;
