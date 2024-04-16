import React from 'react';

export default function Error(
  props: React.PropsWithChildren<React.HTMLAttributes<SVGElement>>
) {
  return (
    <svg focusable="false" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
    </svg>
  );
}
