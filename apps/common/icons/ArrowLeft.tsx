import React from 'react';

export default function ArrowLeft(
  props: React.PropsWithChildren<React.HTMLAttributes<SVGElement>>
) {
  return (
    <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z"></path>
    </svg>
  );
}
