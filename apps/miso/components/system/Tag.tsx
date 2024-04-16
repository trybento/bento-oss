import React from 'react';
import {
  Tag as DefaultTag,
  TagProps as DefaultTagProps,
  Text,
} from '@chakra-ui/react';
import colors from 'helpers/colors';

type TagProps = React.PropsWithChildren<DefaultTagProps> & { text?: string };

/**
 * Text in a pill
 */
function Tag({ children, text, ...props }: TagProps) {
  return (
    <DefaultTag
      color="gray.50"
      borderRadius="full"
      py="2"
      px="4"
      fontSize="sm"
      {...props}
    >
      {text ? (
        <Text color={colors.text.primary} fontWeight="semibold">
          {text}
        </Text>
      ) : (
        children
      )}
    </DefaultTag>
  );
}

export default Tag;
