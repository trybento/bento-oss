import useRandomKey from 'bento-common/hooks/useRandomKey';
import React from 'react';

export default function FiftyPercentWidth(
  props: React.PropsWithChildren<React.SVGProps<SVGSVGElement>>
) {
  /** Filter ids must be unique in order to work. */
  const ranKey = useRandomKey();

  return (
    <svg
      width="108"
      height="34"
      viewBox="0 0 108 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter={`url(#filter0${ranKey})`}>
        <g clipPath={`url(#clip0${ranKey})`}>
          <rect
            x="4"
            y="3.5"
            width="100.5"
            height="26.5"
            rx="1.5"
            fill="white"
          />
          <rect x="53" y="7" width="48" height="19" rx="2" fill="#E1ECFF" />
          <rect
            x="9"
            y="8.5"
            width="24"
            height="3.5"
            rx="1.75"
            fill="#F7F7F7"
          />
          <rect
            x="9"
            y="21.5"
            width="11"
            height="3.5"
            rx="1.75"
            fill="#F7F7F7"
          />
          <rect
            x="9"
            y="14"
            width="39.5"
            height="3.5"
            rx="1.75"
            fill="#F7F7F7"
          />
        </g>
      </g>
      <defs>
        <filter
          id={`filter0${ranKey}`}
          x="0.5"
          y="0"
          width="107.5"
          height="34"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="1.75" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_983_41435"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1.5" />
          <feGaussianBlur stdDeviation="1.25" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_983_41435"
            result="effect2_dropShadow_983_41435"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_983_41435"
            result="shape"
          />
        </filter>
        <clipPath id={`clip0${ranKey}`}>
          <rect
            x="4"
            y="3.5"
            width="100.5"
            height="26.5"
            rx="1.5"
            fill="white"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
