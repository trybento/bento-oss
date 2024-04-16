import { useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type RequestIdHelper = {
  value: string | null;
  /** Sets a new ID, returns it */
  get: () => string;
  clear: () => void;
};

type Hooks = {
  onClear?: () => void;
};

/**
 * Generate and manage a requestId to track context across events
 */
export const useRequestId = ({ onClear }: Hooks = {}) => {
  const [requestId, setRequestId] = useState<string | null>(null);
  const requestIdObj: RequestIdHelper = useMemo(
    () => ({
      value: requestId,
      get: () => {
        const id = uuidv4();
        setRequestId(id);
        return id;
      },
      clear: () => {
        setRequestId(null);
        onClear?.();
      },
    }),
    [requestId]
  );

  return requestIdObj;
};
