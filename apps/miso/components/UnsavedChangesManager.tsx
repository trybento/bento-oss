import React, { useCallback, useState } from 'react';

import useWarnUnsavedChanges from 'hooks/useWarnUnsavedChanges';
import UnsavedChangesModal from './UnsavedChangesModal';

type UrlException = RegExp | string;

interface UnsavedChangesManagerProps {
  warningEnabled: boolean;
  onContinue: () => Promise<void> | void;
  onDiscard?: () => Promise<void> | void;
  exceptionUrlRegExp?: UrlException | UrlException[];
}

export default function UnsavedChangesManager({
  warningEnabled,
  onContinue,
  onDiscard,
  exceptionUrlRegExp,
}: UnsavedChangesManagerProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { goAwayIfIntended } = useWarnUnsavedChanges(
    warningEnabled,
    () => setIsOpen(true),
    exceptionUrlRegExp
      ? Array.isArray(exceptionUrlRegExp)
        ? exceptionUrlRegExp
        : [exceptionUrlRegExp]
      : []
  );

  const handleClose = useCallback(() => setIsOpen(false), []);

  const handleContinue = useCallback(async () => {
    onContinue && (await onContinue());
  }, [onContinue]);

  const handleDiscard = useCallback(async () => {
    onDiscard && (await onDiscard());
    goAwayIfIntended();
  }, [onDiscard]);

  return (
    <UnsavedChangesModal
      isOpen={isOpen}
      onClose={handleClose}
      onDiscard={handleDiscard}
      onContinue={handleContinue}
    />
  );
}
