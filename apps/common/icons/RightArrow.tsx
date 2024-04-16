import React from 'react';

export default function RightArrow(
  props: React.PropsWithChildren<React.HTMLAttributes<SVGElement>>
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      focusable="false"
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"
      />
    </svg>
  );
}
