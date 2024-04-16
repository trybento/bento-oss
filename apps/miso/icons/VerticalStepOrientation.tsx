import useRandomKey from 'bento-common/hooks/useRandomKey';

export default function VerticalStepOrientation() {
  /** Filter ids must be unique in order to work. */
  const ranKey = useRandomKey();

  return (
    <svg
      width="47"
      height="61"
      viewBox="0 0 47 61"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter={`url(#filter0${ranKey})`}>
        <g clipPath={`url(#clip0${ranKey})`}>
          <rect
            x="4.25"
            y="3.75"
            width="38.5"
            height="52.5"
            rx="1.5"
            fill="white"
          />
          <rect
            x="9.25"
            y="20.25"
            width="22.5"
            height="16.5"
            rx="2"
            fill="#F7F7F7"
          />
          <rect
            x="9.25"
            y="8.75"
            width="24"
            height="3.5"
            rx="1.75"
            fill="#F7F7F7"
          />
          <rect
            x="9.25"
            y="41.75"
            width="16.5"
            height="3.5"
            rx="1.75"
            fill="#F7F7F7"
          />
          <rect
            x="9.25"
            y="14.25"
            width="29.5"
            height="3.5"
            rx="1.75"
            fill="#F7F7F7"
          />
        </g>
      </g>
      <defs>
        <filter
          id={`filter0${ranKey}`}
          x="0.75"
          y="0.25"
          width="45.5"
          height="60"
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
            result="effect1_dropShadow_1156_61064"
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
            in2="effect1_dropShadow_1156_61064"
            result="effect2_dropShadow_1156_61064"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_1156_61064"
            result="shape"
          />
        </filter>
        <clipPath id={`clip0${ranKey}`}>
          <rect
            x="4.25"
            y="3.75"
            width="38.5"
            height="52.5"
            rx="1.5"
            fill="white"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
