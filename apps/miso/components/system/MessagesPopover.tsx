import {
  Box,
  BoxProps,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';
import { STANDARD_SHADOW } from 'bento-common/frontend/styles';
import colors from 'helpers/colors';
import React, { useMemo } from 'react';
import CircularBadge from './CircularBadge';
import { TYPE_COLOR } from 'bento-common/components/RichTextEditor/extensions/Callout/CalloutElement';
import { CalloutTypes, ExtendedCalloutTypes } from 'bento-common/types/slate';

export interface Notification {
  type: CalloutTypes | ExtendedCalloutTypes;
  text: React.ReactNode;
}

interface Props {
  notifications: Notification[];
}

const INLINE_NOTIFICAITONS = 1;

/**
 * Show multiple notifications at once. Priority order:
 * - Error
 * - Warning
 * - Custom
 * - Branching
 */
const MessagesPopover: React.FC<Props & BoxProps> = ({
  notifications,
  ...boxProps
}) => {
  const firstNotification = useMemo(() => notifications[0], [notifications]);

  const showPopoverBadge = useMemo(
    () => notifications.length > 1,
    [notifications.length]
  );

  if (!firstNotification) return null;

  return (
    <Popover
      trigger="hover"
      placement={showPopoverBadge ? 'right-start' : 'top'}
      isLazy
      lazyBehavior="unmount"
    >
      <PopoverTrigger>
        <Box position="relative" {...boxProps}>
          <CircularBadge calloutType={firstNotification.type} />
          {notifications.length > 1 && (
            <Box
              rounded="full"
              bg={TYPE_COLOR[firstNotification.type] || TYPE_COLOR['themeless']}
              color="white"
              position="absolute"
              top="-6px"
              right="-6px"
              w="16px"
              h="16px"
              textAlign="center"
              fontSize="11px"
            >
              {notifications.length}
            </Box>
          )}
        </Box>
      </PopoverTrigger>
      <PopoverContent
        boxShadow={STANDARD_SHADOW}
        maxW="310px"
        minW="100px"
        w="auto"
        py="2"
        cursor="default"
      >
        <PopoverBody>
          <Box display="flex" flexDir="column" gap="3">
            {notifications.map((notification, idx) => (
              <Box
                key={`message-item-${notification.text}-${idx}`}
                display="flex"
                gap="2"
              >
                {showPopoverBadge && (
                  <CircularBadge calloutType={notification.type} />
                )}
                <Box
                  my="auto"
                  color={colors.text.secondary}
                  whiteSpace="normal"
                >
                  {notification.text}
                </Box>
              </Box>
            ))}
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default MessagesPopover;
