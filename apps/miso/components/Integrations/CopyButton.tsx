import React from 'react';
import { Text, Button, ButtonProps } from '@chakra-ui/react';
import ContentCopy from 'system/Icon/ContentCopy';

type Props = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  label?: string;
  variant?: ButtonProps['variant'];
};

const CopyButton = ({ onClick, label = 'Copy token', variant }: Props) => (
  <Button
    onClick={onClick}
    variant={variant || 'ghost'}
    {...(!variant ? { color: 'gray.500' } : {})}
  >
    <ContentCopy
      {...(!variant
        ? { color: 'var(--chakra-colors-gray-500)' }
        : { color: 'var(--chakra-colors-bento-bright)' })}
    />
    <Text ml="2">{label}</Text>
  </Button>
);

export default CopyButton;
