import { useCallback } from 'react';
import { UseToastOptions } from '@chakra-ui/react';

import useToast from './useToast';

/**
 * Small helper around useToast to facilitate popup management
 *   and allow easier auto-import
 */
const useToastMessage = (isClosable = true) => {
  const toast = useToast();

  const callToast = useCallback(
    (title: string, status: UseToastOptions['status']) => {
      toast.closeAll();
      toast({
        title,
        status,
        isClosable,
      });
    },
    []
  );

  const successToast = useCallback(
    (title: string) => callToast(title, 'success'),
    []
  );
  const errorToast = useCallback(
    (title = 'Something went wrong') => callToast(title, 'error'),
    []
  );
  const infoToast = useCallback(
    (title: string) => callToast(title, 'info'),
    []
  );

  return {
    success: successToast,
    error: errorToast,
    info: infoToast,
  };
};

export default useToastMessage;
