import React from 'react';
import { Box, BoxProps, HStack, VStack, Text } from '@chakra-ui/react';

type Props = React.PropsWithChildren<
  BoxProps & { header?: string; headerOffset?: number }
>;

export const EmojiList: React.FC<Props> = ({
  children,
  header,
  headerOffset = -4,
  ...restProps
}) => (
  <VStack alignItems="flex-start" py="4" px="4" w="full" {...restProps}>
    {!!header && <Text mx={headerOffset}>{header}</Text>}
    {children}
  </VStack>
);

export const EmojiListItem: React.FC<
  React.PropsWithChildren<{ emoji?: string }>
> = ({ children, emoji = '🙈' }) => (
  <HStack alignItems="flex-start" gap="2">
    <Box w="1em">{emoji}</Box>
    <Box>{children}</Box>
  </HStack>
);
