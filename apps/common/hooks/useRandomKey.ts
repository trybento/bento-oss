import { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

const useRandomKey = (dependencies: any[] = []): string => {
  const firstRender = useRef(true);
  const key = useRef(uuidv4());

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      key.current = uuidv4();
    }
  }, dependencies);

  return key.current;
};

export default useRandomKey;
