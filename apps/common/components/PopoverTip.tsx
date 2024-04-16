import React, { useCallback } from 'react';
import {
  Box,
  Kbd,
  PopoverProps,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  KbdProps,
  BoxProps,
} from '@chakra-ui/react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Portal from './Portal';

export const TipKdb: React.FC<KbdProps> = ({ children, ...props }) => (
  <Kbd p={1} fontSize="1em" background="none" border="none" {...props}>
    {children}
  </Kbd>
);

/**
 * Intended to be used to place tooltips alongside labels.
 */
const PopoverTip: React.FC<
  {
    iconBoxProps?: BoxProps;
    /**
     * Prevent popover from being covered by other elements.
     * Does not work on Modals.
     */
    withPortal?: boolean;
    children?: React.ReactNode;
  } & PopoverProps
> = ({
  children,
  trigger = 'hover',
  placement = 'right',
  iconBoxProps,
  withPortal,
  ...props
}) => {
  const Wrapper: React.FC<{ children?: React.ReactNode }> = useCallback(
    ({ children }) =>
      withPortal ? <Portal>{children}</Portal> : <>{children}</>,
    [withPortal]
  );

  return (
    <Popover trigger={trigger} placement={placement} {...props}>
      <PopoverTrigger>
        <Box ml="1" fontSize="15px" display="inline" {...iconBoxProps}>
          <InfoOutlinedIcon fontSize="inherit" />
        </Box>
      </PopoverTrigger>
      {/* Base styles should be kept in sync with `system/Tooltip` */}
      <Wrapper>
        <PopoverContent
          maxWidth="200px"
          bgColor="#000000"
          borderRadius="6px"
          fontSize="12px"
          lineHeight="16px"
          fontWeight="normal"
          color="white"
          border="none"
        >
          <PopoverBody>{children}</PopoverBody>
        </PopoverContent>
      </Wrapper>
    </Popover>
  );
};

export default PopoverTip;
