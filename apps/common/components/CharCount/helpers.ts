import { ChakraProps, NumberInput } from '@chakra-ui/react';

export interface CharCountProps {
  limit: number;
  text: string | null;
}

export function getCharCountColor(
  limit: number,
  count: number
): ChakraProps['color'] {
  if (!count) return 'transparent';

  const result = count / limit;

  if (result <= 0.7) {
    return null;
  }

  if (result < 1) {
    return 'yellow.500';
  }

  return 'red.500';
}
