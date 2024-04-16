import useRandomKey from 'bento-common/hooks/useRandomKey';
import React, { SVGProps } from 'react';

export default function TimelineLayout(
  props: React.PropsWithChildren<SVGProps<SVGSVGElement>>
) {
  /** Filter ids must be unique in order to work. */
  const ranKey = useRandomKey();

  return (
    <svg
      width="99"
      height="123"
      viewBox="0 0 99 123"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter={`url(#filter0${ranKey})`}>
        <rect x="8" y="8" width="82.5" height="105.6" rx="4.4" fill="#CBD5E0" />
      </g>
      <rect
        x="9.1001"
        y="19"
        width="80.3"
        height="93.5"
        rx="4.4"
        fill="white"
      />
      <circle cx="48.6999" cy="31.0998" r="3.3" fill="#CBD5E0" />
      <circle cx="58.5998" cy="31.0998" r="3.3" fill="#CBD5E0" />
      <rect
        x="36.6001"
        y="27.7998"
        width="6.6"
        height="6.6"
        rx="3.3"
        fill="#49A9F8"
      />
      <g clipPath={`url(#clip0${ranKey})`}>
        <path
          d="M39.7515 31.6723C39.5953 31.9324 39.2183 31.9323 39.0622 31.6722L38.8897 31.3848C38.8121 31.2554 38.6247 31.2551 38.5467 31.3842C38.5084 31.4477 38.5082 31.5272 38.5464 31.5908L38.7292 31.8954C39.0361 32.4069 39.7774 32.4069 40.0843 31.8954L41.3251 29.8273C41.363 29.7641 41.363 29.6852 41.3251 29.622C41.2476 29.4928 41.0605 29.4928 40.9829 29.6219L39.7515 31.6723Z"
          fill="white"
        />
      </g>
      <rect
        x="17.8999"
        y="44.2998"
        width="62.7"
        height="2.2"
        rx="1.1"
        fill="#E2E8F0"
      />
      <rect
        x="49.7998"
        y="52"
        width="30.8"
        height="2.2"
        rx="1.1"
        fill="#E2E8F0"
      />
      <rect
        x="49.7998"
        y="59.7002"
        width="30.8"
        height="2.2"
        rx="1.1"
        fill="#E2E8F0"
      />
      <rect
        x="49.7998"
        y="67.3999"
        width="30.8"
        height="2.2"
        rx="1.1"
        fill="#E2E8F0"
      />
      <rect
        x="17.8999"
        y="52"
        width="26.4"
        height="17.6"
        rx="2.2"
        fill="#E2E8F0"
      />
      <rect
        x="58.6001"
        y="96"
        width="22"
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
            result="effect1_dropShadow_1134_30067"
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
            in2="effect1_dropShadow_1134_30067"
            result="effect2_dropShadow_1134_30067"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_1134_30067"
            result="shape"
          />
        </filter>
        <clipPath id={`clip0${ranKey}`}>
          <rect
            width="3.96"
            height="6.59999"
            fill="white"
            transform="translate(37.9214 27.7998)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
