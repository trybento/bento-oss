import React, { createContext, useCallback, useContext, useState } from 'react';
import { GroupTargeting } from 'bento-common/types/targeting';

import { RequestIdHelper, useRequestId } from 'hooks/useRequestId';
import { TemplateForm } from 'components/Templates/EditTemplate';

type Props = {
  /** Present if form used in template context */
  template?: TemplateForm;
  /** If parent wants to expose a done-editing hook */
  onEditingDone?: () => void;
  /** If parent form wants a change handler */
  onTargetingChange?: (
    targeting: GroupTargeting,
    /** Pass dirty up so we don't need to track separately */
    dirty?: boolean
  ) => Promise<void> | void;
  /** Behavior on "Save" button */
  onTargetingSubmit?: (targeting: GroupTargeting) => void;
};

type TargetingEditorContextValue = Props & {
  /** Preserves prompt across steps and informs us AI was used */
  persistedPrompt: string | null;
  setPersistedPrompt: (prompt: string) => void;
  /** Toolkit used to track AI request funnels */
  requestId: RequestIdHelper;
  persistedTargeting: GroupTargeting | null;
  setPersistedTargeting: (targeting: GroupTargeting | null) => void;
  /** Resets all cached items for AI */
  resetAiCache: () => void;
};

const TargetingEditorContext = createContext<TargetingEditorContextValue>({
  persistedPrompt: null,
  setPersistedPrompt: (_) => {},
  requestId: {
    value: null,
    get: () => '',
    clear: () => {},
  },
  persistedTargeting: null,
  setPersistedTargeting: (_) => {},
  resetAiCache: () => {},
});

export function useTargetingEditorContext() {
  return useContext(TargetingEditorContext);
}

export default function TargetingEditorProvider({
  children,
  onTargetingChange,
  onTargetingSubmit,
  ...restProps
}: React.PropsWithChildren<Props>) {
  const [persistedPrompt, setPersistedPrompt] = useState<string | null>(null);
  const [persistedTargeting, setPersistedTargeting] =
    useState<GroupTargeting | null>(null);
  const requestIdObj = useRequestId();

  const resetAiCache = useCallback(() => {
    setPersistedPrompt(null);
    setPersistedTargeting(null);
    requestIdObj.clear();
  }, []);

  const handleCommitTargeting = useCallback(
    (targeting: GroupTargeting) => {
      onTargetingSubmit?.(targeting);
    },
    [onTargetingSubmit]
  );

  return (
    <TargetingEditorContext.Provider
      value={{
        requestId: requestIdObj,
        persistedPrompt,
        setPersistedPrompt,
        persistedTargeting,
        setPersistedTargeting,
        resetAiCache,
        onTargetingChange,
        onTargetingSubmit: handleCommitTargeting,
        ...restProps,
      }}
    >
      {children}
    </TargetingEditorContext.Provider>
  );
}
