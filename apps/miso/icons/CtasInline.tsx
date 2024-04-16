import useRandomKey from 'bento-common/hooks/useRandomKey';
import React, { SVGProps } from 'react';

export default function CtasInline(
  props: React.PropsWithChildren<SVGProps<SVGSVGElement>>
) {
  /** Filter ids must be unique in order to work. */
  const ranKey = useRandomKey();

  return (
    <svg
      width="108"
      height="35"
      viewBox="0 0 108 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter={`url(#filter0${ranKey})`}>
        <g clipPath={`url(#clip0${ranKey})`}>
          <rect
            x="3.5"
            y="3.75"
            width="100.5"
            height="26.5"
            rx="1.5"
            fill="white"
          />
          <rect x="10" y="13" width="62" height="7" rx="2" fill="#DCDCE4" />
          <rect x="75" y="13" width="21" height="7" rx="2" fill="#B8D0FE" />
        </g>
      </g>
      <defs>
        <filter
          id={`filter0${ranKey}`}
          x="0"
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
            result="effect1_dropShadow_523_64519"
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
            in2="effect1_dropShadow_523_64519"
            result="effect2_dropShadow_523_64519"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_523_64519"
            result="shape"
          />
        </filter>
        <clipPath id={`clip0${ranKey}`}>
          <rect
            x="3.5"
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
