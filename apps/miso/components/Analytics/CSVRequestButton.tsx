import React, { ReactNode, useCallback, useState } from 'react';
import { Box, BoxProps, Flex, Spinner } from '@chakra-ui/react';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import Link from 'system/Link';
import useToast from 'hooks/useToast';
import Tooltip from 'system/Tooltip';

type SetGeneratingCb = () => void;

type CSVRequestButtonProps = {
  label?: ReactNode;
  onRequest: (
    onStart: SetGeneratingCb,
    onEnd: SetGeneratingCb
  ) => Promise<void> | void;
  as?: CSVRequestButtonStyle;
  tooltipLabel?: ReactNode;
} & Omit<BoxProps, 'as'>;

export enum CSVRequestButtonStyle {
  text = 'text',
  icon = 'icon',
}

/**
 * Link component that swaps to spinner when loading
 */
const CSVRequestButton: React.FC<CSVRequestButtonProps> = ({
  label,
  onRequest,
  tooltipLabel,
  as = CSVRequestButtonStyle.text,
  ...boxProps
}) => {
  const [generating, setGenerating] = useState(false);
  const toast = useToast();

  const startSpinner = useCallback(() => setGenerating(true), []);
  const stopSpinner = useCallback(() => setGenerating(false), []);

  const handleRequest = useCallback(async () => {
    try {
      await onRequest(startSpinner, stopSpinner);
    } catch (e: any) {
      toast.closeAll();
      toast({
        title: e.message || 'Something went wrong',
        isClosable: true,
        status: 'error',
      });

      setGenerating(false);
    }
  }, [onRequest]);

  return (
    <Tooltip label={tooltipLabel} placement="top">
      <Box h="auto" {...boxProps}>
        {generating ? (
          <Spinner />
        ) : as === CSVRequestButtonStyle.icon ? (
          <Flex
            onClick={handleRequest}
            color="blue.500"
            w="40px"
            h="40px"
            bg="bento.pale"
            borderRadius="md"
            cursor="pointer"
            _hover={{ opacity: 0.8 }}
          >
            <DownloadOutlinedIcon style={{ margin: 'auto', color: '' }} />
          </Flex>
        ) : (
          <Link onClick={handleRequest} color="blue.500">
            {label}
          </Link>
        )}
      </Box>
    </Tooltip>
  );
};

export default CSVRequestButton;
