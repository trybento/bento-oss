import React, { createContext, useContext, useCallback } from 'react';
import {
  ElementType,
  ElementTypesMap,
  FormattingType,
  Mark,
} from 'bento-common/types/slate';
import { Location, BaseRange } from 'slate';

interface RichTextEditorProviderValue {
  persistedSelection: Location | null;
  setPersistedSelection: (selection: Location | BaseRange | null) => void;
  isTypeEnabled: (type: FormattingType) => boolean;
  isReadonly: boolean | undefined;
  zIndex?: number;
}

export const RichTextEditorProviderContext =
  createContext<RichTextEditorProviderValue>({
    persistedSelection: null,
    setPersistedSelection: (_) => {},
    isTypeEnabled: (_) => false,
    isReadonly: false,
  });

export function useRichTextEditorProvider() {
  const {
    persistedSelection,
    setPersistedSelection,
    isTypeEnabled,
    isReadonly,
    zIndex,
  } = useContext(RichTextEditorProviderContext);

  return {
    persistedSelection,
    setPersistedSelection,
    isTypeEnabled,
    isReadonly,
    zIndex,
  };
}

type RTEProviderProps = {
  persistedSelection: Location | null;
  setPersistedSelection: (value: Location | null) => void;
  disallowedElementTypes?: ElementTypesMap;
  isReadonly: boolean | undefined;
  allowedElementTypes?: ElementTypesMap;
  zIndex?: number;
};

export const isRteElementTypeAllowed =
  (
    allowedElementTypes: ElementTypesMap,
    disallowedElementTypes: ElementTypesMap
  ) =>
  (type: ElementType | Mark | 'videos') =>
    allowedElementTypes
      ? allowedElementTypes[type]
      : !disallowedElementTypes?.[type];

export const RichTextEditorProvider: React.FC<
  React.PropsWithChildren<RTEProviderProps>
> = ({
  persistedSelection,
  setPersistedSelection,
  disallowedElementTypes = {},
  allowedElementTypes,
  isReadonly,
  zIndex,
  children,
}) => {
  const isTypeEnabled = useCallback(
    isRteElementTypeAllowed(allowedElementTypes, disallowedElementTypes),
    [allowedElementTypes, disallowedElementTypes]
  );

  return (
    <RichTextEditorProviderContext.Provider
      value={{
        persistedSelection,
        setPersistedSelection,
        isTypeEnabled,
        isReadonly,
        zIndex,
      }}
    >
      {children}
    </RichTextEditorProviderContext.Provider>
  );
};

export default RichTextEditorProvider;
