import React from 'react';

export default function Minus(
  props: React.PropsWithChildren<React.HTMLAttributes<SVGElement>>
) {
  return (
    <svg
      width="14"
      height="2"
      viewBox="0 0 14 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.6663 0.166504H0.333008V1.83317H13.6663V0.166504Z"
        fill="currentColor"
      />
    </svg>
  );
}
