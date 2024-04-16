import React, { ReactNode, useCallback } from 'react';
import {
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Box,
  Flex,
  BoxProps,
  Spinner,
} from '@chakra-ui/react';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';

import Link from 'system/Link';
import useToast from 'hooks/useToast';
import useToggleState from 'hooks/useToggleState';
import Tooltip from 'system/Tooltip';
import { CSVRequestButtonStyle } from './CSVRequestButton';

type SetGeneratingCb = () => void;
type RequestHandlerCb = (
  onStart: SetGeneratingCb,
  onEnd: SetGeneratingCb
) => Promise<void> | void;

type MultiCSVRequestButtonProps = {
  as?: CSVRequestButtonStyle;
  tooltipLabel?: ReactNode;
  textLabel?: string;
  options: {
    label: string;
    onRequest: RequestHandlerCb;
  }[];
} & Omit<BoxProps, 'as'>;

const MultiCSVRequestButton: React.FC<MultiCSVRequestButtonProps> = ({
  tooltipLabel,
  textLabel = 'Download data as CSV',
  as = CSVRequestButtonStyle.text,
  options,
  ...boxProps
}) => {
  const buttonState = useToggleState(['generation']);
  const toast = useToast();
  const [isButtonFocused, setIsButtonFocused] = React.useState<boolean>(false);

  const setFocused = useCallback(
    () => setIsButtonFocused(true),
    [setIsButtonFocused]
  );
  const setUnfocused = useCallback(
    () => setIsButtonFocused(false),
    [setIsButtonFocused]
  );

  const handleRequest = useCallback(
    (handler: RequestHandlerCb) => async () => {
      try {
        await handler(buttonState.generation.on, buttonState.generation.off);
      } catch (e: any) {
        toast.closeAll();
        toast({
          title: e.message || 'Something went wrong',
          isClosable: true,
          status: 'error',
        });

        buttonState.generation.off();
      }
    },
    [options]
  );

  return (
    <Tooltip label={tooltipLabel} placement="top">
      <Box h="30px" {...boxProps}>
        {buttonState.generation.isOn ? (
          <Spinner />
        ) : (
          <Menu placement="bottom-end">
            <MenuButton
              position="relative"
              onMouseEnter={setFocused}
              onMouseLeave={setUnfocused}
            >
              {as === CSVRequestButtonStyle.icon ? (
                <Flex
                  color="blue.500"
                  w="40px"
                  h="40px"
                  bg="bento.pale"
                  borderRadius="md"
                  cursor="pointer"
                  opacity={isButtonFocused ? 0.8 : 1}
                >
                  <DownloadOutlinedIcon style={{ margin: 'auto', color: '' }} />
                </Flex>
              ) : (
                <Link color="blue.500">{textLabel}</Link>
              )}
            </MenuButton>
            <MenuList>
              <MenuGroup marginLeft="3" fontSize="xs" title={textLabel}>
                {options.map(({ label, onRequest }, i) => (
                  <MenuItem
                    key={`csv-option-${i}`}
                    onClick={handleRequest(onRequest)}
                  >
                    {label}
                  </MenuItem>
                ))}
              </MenuGroup>
            </MenuList>
          </Menu>
        )}
      </Box>
    </Tooltip>
  );
};

export default MultiCSVRequestButton;
