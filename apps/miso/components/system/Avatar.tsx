import React from 'react';
import DefaultAvatar from 'react-avatar';

interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  src: string | null | undefined;
  hideTitle?: boolean;
}

export default function Avatar({ name, size, src, hideTitle }: AvatarProps) {
  let pxSize: string;
  if (size === 'xl') {
    pxSize = '96';
  } else {
    pxSize = '24';
  }

  return (
    <DefaultAvatar
      size={pxSize}
      round
      textSizeRatio={2.5}
      name={name}
      src={src}
      style={{
        fontFamily: 'inherit',
        ...(hideTitle ? { pointerEvents: 'none' } : {}),
      }}
    />
  );
}
