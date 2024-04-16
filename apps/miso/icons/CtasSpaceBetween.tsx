import useRandomKey from 'bento-common/hooks/useRandomKey';
import React, { SVGProps } from 'react';

export default function CtasSpaceBetween(
  props: React.PropsWithChildren<SVGProps<SVGSVGElement>>
) {
  /** Filter ids must be unique in order to work. */
  const ranKey = useRandomKey();

  return (
    <svg
      width="109"
      height="35"
      viewBox="0 0 109 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter={`url(#filter0${ranKey})`}>
        <g clipPath={`url(#clip0${ranKey})`}>
          <rect
            x="4.25"
            y="3.75"
            width="100.5"
            height="26.5"
            rx="1.5"
            fill="white"
          />
          <rect x="13.25" y="11" width="23" height="11" rx="2" fill="#DCDCE4" />
          <rect x="73.25" y="11" width="23" height="11" rx="2" fill="#DCDCE4" />
        </g>
      </g>
      <defs>
        <filter
          id={`filter0${ranKey}`}
          x="0.75"
          y="0.25"
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
            result="effect1_dropShadow_480_63230"
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
            in2="effect1_dropShadow_480_63230"
            result="effect2_dropShadow_480_63230"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_480_63230"
            result="shape"
          />
        </filter>
        <clipPath id={`clip0${ranKey}`}>
          <rect
            x="4.25"
            y="3.75"
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
