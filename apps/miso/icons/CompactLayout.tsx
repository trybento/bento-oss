import useRandomKey from 'bento-common/hooks/useRandomKey';
import React, { SVGProps } from 'react';

export default function CompactLayout(
  props: React.PropsWithChildren<SVGProps<SVGSVGElement>>
) {
  /** Filter ids must be unique in order to work. */
  const ranKey = useRandomKey();

  return (
    <svg
      width="185"
      height="103"
      viewBox="0 0 185 103"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter={`url(#filter0${ranKey})`}>
        <rect x="8" y="8" width="82.5" height="75.9" rx="4.4" fill="#CBD5E0" />
      </g>
      <rect
        x="9.1001"
        y="19"
        width="80.3"
        height="63.8"
        rx="4.4"
        fill="white"
      />
      <rect
        x="49.7998"
        y="67.3999"
        width="30.8"
        height="7.7"
        rx="2.2"
        fill="#A0AEC0"
      />
      <rect
        x="17.8999"
        y="33.2998"
        width="62.7"
        height="2.2"
        rx="1.1"
        fill="#E2E8F0"
      />
      <rect
        x="49.7998"
        y="41"
        width="30.8"
        height="2.2"
        rx="1.1"
        fill="#E2E8F0"
      />
      <rect
        x="49.7998"
        y="48.7002"
        width="30.8"
        height="2.2"
        rx="1.1"
        fill="#E2E8F0"
      />
      <rect
        x="49.7998"
        y="56.3999"
        width="30.8"
        height="2.2"
        rx="1.1"
        fill="#E2E8F0"
      />
      <rect
        x="17.8999"
        y="41"
        width="26.4"
        height="17.6"
        rx="2.2"
        fill="#E2E8F0"
      />
      <g clipPath={`url(#clip0${ranKey})`}>
        <path
          d="M19.7437 25.7052C19.9636 25.5249 19.9635 25.1884 19.7433 25.0083C19.5774 24.8725 19.3388 24.8725 19.1729 25.0083L17.4736 26.3985C16.9357 26.8387 16.9357 27.6611 17.4736 28.1013L19.1729 29.4915C19.3388 29.6273 19.5774 29.6273 19.7433 29.4915C19.9635 29.3114 19.9636 28.9749 19.7437 28.7946L18.8973 28.1005C18.3606 27.6604 18.3606 26.8394 18.8973 26.3993L19.7437 25.7052Z"
          fill="#CBD5E0"
        />
      </g>
      <g filter={`url(#filter1${ranKey})`}>
        <rect
          x="94.5"
          y="8"
          width="82.5"
          height="85.8"
          rx="4.4"
          fill="#CBD5E0"
        />
      </g>
      <rect
        x="95.6001"
        y="19"
        width="80.3"
        height="73.7"
        rx="4.4"
        fill="white"
      />
      <rect
        x="101.1"
        y="24.5"
        width="70.4"
        height="18.7"
        rx="2.2"
        fill="#F7FAFC"
      />
      <rect
        x="101.65"
        y="47.05"
        width="69.3"
        height="17.6"
        rx="1.65"
        fill="white"
        stroke="#E2E8F0"
        strokeWidth="1.1"
      />
      <rect
        x="106.601"
        y="50.8999"
        width="9.9"
        height="9.9"
        rx="4.95"
        fill="#49A9F8"
      />
      <g clipPath={`url(#clip1${ranKey})`}>
        <path
          d="M111.324 56.7086C111.089 57.0988 110.524 57.0987 110.29 56.7084L110.031 56.2774C109.914 56.0833 109.633 56.0829 109.516 56.2766C109.459 56.3718 109.459 56.491 109.516 56.5864L109.863 57.1651C110.29 57.8772 111.322 57.8772 111.75 57.1651L113.684 53.9412C113.741 53.8464 113.741 53.728 113.684 53.6332C113.568 53.4394 113.287 53.4394 113.171 53.6331L111.324 56.7086Z"
          fill="white"
        />
      </g>
      <rect
        x="101.65"
        y="69.05"
        width="69.3"
        height="17.6"
        rx="1.65"
        fill="white"
        stroke="#EDF2F7"
        strokeWidth="1.1"
      />
      <circle cx="111.55" cy="33.8499" r="4.95" fill="#CBD5E0" />
      <rect
        x="106.601"
        y="28.8999"
        width="9.9"
        height="9.9"
        rx="4.95"
        fill="#CBD5E0"
      />
      <g clipPath={`url(#clip2${ranKey})`}>
        <path
          d="M111.324 34.7086C111.089 35.0988 110.524 35.0987 110.29 34.7084L110.031 34.2774C109.914 34.0833 109.633 34.0829 109.516 34.2766C109.459 34.3718 109.459 34.491 109.516 34.5864L109.863 35.1651C110.29 35.8772 111.322 35.8772 111.75 35.1651L113.684 31.9412C113.741 31.8464 113.741 31.728 113.684 31.6332C113.568 31.4394 113.287 31.4394 113.171 31.6331L111.324 34.7086Z"
          fill="white"
        />
      </g>
      <circle cx="111.55" cy="77.8499" r="4.95" fill="#CBD5E0" />
      <g clipPath={`url(#clip3${ranKey})`}>
        <path
          d="M162.527 53.6084C162.361 53.4726 162.122 53.4726 161.956 53.6084C161.736 53.7885 161.736 54.125 161.956 54.3053L162.802 54.9994C163.339 55.4395 163.339 56.2605 162.802 56.7006L161.956 57.3947C161.736 57.575 161.736 57.9115 161.956 58.0916C162.122 58.2274 162.361 58.2274 162.527 58.0916L164.226 56.7014C164.764 56.2612 164.764 55.4388 164.226 54.9986L162.527 53.6084Z"
          fill="#CBD5E0"
        />
      </g>
      <defs>
        <filter
          id={`filter0${ranKey}`}
          x="0.3"
          y="0.3"
          width="97.9"
          height="92.3999"
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
            result="effect1_dropShadow_1134_30020"
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
            in2="effect1_dropShadow_1134_30020"
            result="effect2_dropShadow_1134_30020"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_1134_30020"
            result="shape"
          />
        </filter>
        <filter
          id={`filter1${ranKey}`}
          x="86.8"
          y="0.3"
          width="97.9"
          height="102.3"
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
            result="effect1_dropShadow_1134_30020"
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
            in2="effect1_dropShadow_1134_30020"
            result="effect2_dropShadow_1134_30020"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_1134_30020"
            result="shape"
          />
        </filter>
        <clipPath id={`clip0${ranKey}`}>
          <rect
            width="12.1"
            height="9.89999"
            fill="white"
            transform="translate(12.3999 22.2998)"
          />
        </clipPath>
        <clipPath id={`clip1${ranKey}`}>
          <rect
            width="5.94"
            height="9.89999"
            fill="white"
            transform="translate(108.579 50.8999)"
          />
        </clipPath>
        <clipPath id={`clip2${ranKey}`}>
          <rect
            width="5.94"
            height="9.89999"
            fill="white"
            transform="translate(108.579 28.8999)"
          />
        </clipPath>
        <clipPath id={`clip3${ranKey}`}>
          <rect
            width="12.1"
            height="9.89999"
            fill="white"
            transform="translate(157.2 50.8999)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
