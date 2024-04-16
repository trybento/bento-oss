import React, { forwardRef, useCallback } from 'react';
import {
  ModalBody as DefaultModalBody,
  ModalBodyProps,
} from '@chakra-ui/react';

const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  (props: ModalBodyProps, ref) => {
    /** Prevent proagation to elements behind modal. */
    const stopPropagation = useCallback((e: React.KeyboardEvent) => {
      e.stopPropagation();
    }, []);
    return (
      <DefaultModalBody onKeyDown={stopPropagation} {...props} ref={ref} />
    );
  }
);

export default ModalBody;
