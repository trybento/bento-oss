import React from 'react';

export default function WarningOutline(
  props: React.PropsWithChildren<React.SVGProps<SVGSVGElement>>
) {
  return (
    <svg
      width="22"
      height="19"
      viewBox="0 0 22 19"
      fill="current"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11 3.99L18.53 17H3.47L11 3.99ZM11 0L0 19H22L11 0ZM12 14H10V16H12V14ZM12 8H10V12H12V8Z"
        fill="currentColor"
      />
    </svg>
  );
}
