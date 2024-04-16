import React from 'react';

import Close from '../icons/close.svg';

type Props = {
  color?: string;
  withBackground?: boolean;
  onDismiss: (e: React.MouseEvent<HTMLButtonElement>) => void;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export default function CloseButton({
  color = 'black',
  onDismiss,
  withBackground,
  ...props
}: React.PropsWithChildren<Props>) {
  const xColor = withBackground ? 'black' : color;
  return (
    <button
      className="absolute z-10 border-transparent p-1 text-sm right-3 top-3"
      onClick={onDismiss}
      data-test-id="close-btn"
      {...props}
    >
      {withBackground && (
        <div className="absolute w-full h-full opacity-60 rounded-full left-0 top-0 bg-white" />
      )}
      <Close
        className="relative z-10 w-4 h-4"
        style={{ fill: xColor, stroke: 'transparent' }}
      />
    </button>
  );
}
