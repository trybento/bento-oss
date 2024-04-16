import useRandomKey from 'bento-common/hooks/useRandomKey';
import React, { SVGProps } from 'react';

export default function NestedLayout(
  props: React.PropsWithChildren<SVGProps<SVGSVGElement>>
) {
  /** Filter ids must be unique in order to work. */
  const ranKey = useRandomKey();

  return (
    <svg
      width="185"
      height="123"
      viewBox="0 0 185 123"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter={`url(#filter0${ranKey})`}>
        <rect x="8" y="8" width="82.5" height="105.6" rx="4.4" fill="#CBD5E0" />
      </g>
      <rect x="9.1" y="19" width="80.3" height="93.5" rx="4.4" fill="white" />
      <rect
        x="14.6"
        y="24.5"
        width="70.4"
        height="18.7"
        rx="2.2"
        fill="#F7FAFC"
      />
      <rect
        x="15.15"
        y="47.05"
        width="69.3"
        height="35.2"
        rx="1.65"
        fill="white"
        stroke="#E2E8F0"
        strokeWidth="1.1"
      />
      <rect
        x="31.9809"
        y="65.75"
        width="42.35"
        height="2.2"
        rx="1.1"
        fill="#E2E8F0"
      />
      <rect
        x="31.9809"
        y="73.4501"
        width="20.35"
        height="2.2"
        rx="1.1"
        fill="#E2E8F0"
      />
      <rect
        x="15.15"
        y="87.7501"
        width="69.3"
        height="17.6"
        rx="1.65"
        fill="white"
        stroke="#EDF2F7"
        strokeWidth="1.1"
      />
      <circle cx="25.05" cy="33.85" r="4.95" fill="#CBD5E0" />
      <circle cx="25.05" cy="55.85" r="4.95" fill="#CBD5E0" />
      <circle cx="25.05" cy="96.5501" r="4.95" fill="#CBD5E0" />
      <rect
        x="22.3"
        y="64.1001"
        width="5.5"
        height="5.5"
        rx="1.1"
        fill="#49A9F8"
      />
      <rect
        x="57.5"
        y="71.8"
        width="16.5"
        height="5.5"
        rx="1.1"
        fill="#A0AEC0"
      />
      <rect
        x="22.3"
        y="72.9"
        width="5.5"
        height="5.5"
        rx="1.1"
        fill="#CBD5E0"
      />
      <g clipPath={`url(#clip0${ranKey})`}>
        <path
          d="M24.9252 67.3274C24.795 67.5441 24.4809 67.5441 24.3508 67.3273L24.2071 67.0878C24.1424 66.98 23.9862 66.9797 23.9212 67.0873C23.8893 67.1402 23.8892 67.2065 23.921 67.2594L24.0733 67.5133C24.329 67.9395 24.9468 67.9395 25.2025 67.5133L26.2366 65.7899C26.2682 65.7372 26.2682 65.6715 26.2366 65.6188C26.172 65.5112 26.016 65.5111 25.9514 65.6187L24.9252 67.3274Z"
          fill="white"
        />
      </g>
      <g filter={`url(#filter1${ranKey})`}>
        <rect
          x="94.5"
          y="8"
          width="82.5"
          height="105.6"
          rx="4.4"
          fill="#CBD5E0"
        />
      </g>
      <rect x="95.6" y="19" width="80.3" height="93.5" rx="4.4" fill="white" />
      <g clipPath={`url(#clip1${ranKey})`}>
        <path
          d="M107.344 25.7053C107.563 25.525 107.563 25.1885 107.343 25.0084C107.177 24.8726 106.939 24.8726 106.773 25.0084L105.073 26.3987C104.536 26.8388 104.536 27.6613 105.073 28.1014L106.773 29.4916C106.939 29.6274 107.177 29.6274 107.343 29.4916C107.563 29.3115 107.563 28.975 107.344 28.7947L106.497 28.1006C105.96 27.6605 105.96 26.8395 106.497 26.3994L107.344 25.7053Z"
          fill="#CBD5E0"
        />
      </g>
      <rect
        x="104.4"
        y="38.8"
        width="62.7"
        height="2.2"
        rx="1.1"
        fill="#E2E8F0"
      />
      <rect
        x="136.3"
        y="46.5"
        width="30.8"
        height="2.2"
        rx="1.1"
        fill="#E2E8F0"
      />
      <rect
        x="136.3"
        y="54.2001"
        width="30.8"
        height="2.2"
        rx="1.1"
        fill="#E2E8F0"
      />
      <rect
        x="136.3"
        y="61.9"
        width="30.8"
        height="2.2"
        rx="1.1"
        fill="#E2E8F0"
      />
      <rect
        x="104.4"
        y="46.5"
        width="26.4"
        height="17.6"
        rx="2.2"
        fill="#E2E8F0"
      />
      <rect
        x="136.3"
        y="97.1001"
        width="30.8"
        height="8.8"
        rx="2.2"
        fill="#A0AEC0"
      />
      <defs>
        <filter
          id={`filter0${ranKey}`}
          x="0.3"
          y="0.3"
          width="97.9"
          height="122.1"
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
          <feGaussianBlur stdDeviation="3.85" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1179_4314"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="3.3" />
          <feGaussianBlur stdDeviation="2.75" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_1179_4314"
            result="effect2_dropShadow_1179_4314"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_1179_4314"
            result="shape"
          />
        </filter>
        <filter
          id={`filter1${ranKey}`}
          x="86.8"
          y="0.3"
          width="97.9"
          height="122.1"
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
          <feGaussianBlur stdDeviation="3.85" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1179_4314"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="3.3" />
          <feGaussianBlur stdDeviation="2.75" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_1179_4314"
            result="effect2_dropShadow_1179_4314"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_1179_4314"
            result="shape"
          />
        </filter>
        <clipPath id={`clip0${ranKey}`}>
          <rect
            width="3.3"
            height="5.49999"
            fill="white"
            transform="translate(23.4004 64.1001)"
          />
        </clipPath>
        <clipPath id={`clip1${ranKey}`}>
          <rect
            width="12.1"
            height="9.89999"
            fill="white"
            transform="translate(99.9996 22.3)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
