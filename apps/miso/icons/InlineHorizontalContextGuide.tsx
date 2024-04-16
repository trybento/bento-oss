import useRandomKey from 'bento-common/hooks/useRandomKey';

export default function InlineHorizontalContextGuide(props) {
  /** Filter ids must be unique in order to work. */
  const ranKey = useRandomKey();

  return (
    <svg
      width="215"
      height="147"
      viewBox="0 0 215 147"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter={`url(#filter0${ranKey})`}>
        <rect
          x="7"
          y="8"
          width="201"
          height="130"
          rx="3"
          fill="white"
          shapeRendering="crispEdges"
        />
        <rect
          x="11.5098"
          y="33.2568"
          width="27.0953"
          height="7"
          rx="3.5"
          fill="#F7F7F7"
        />
        <rect
          x="11.5098"
          y="9.4082"
          width="8"
          height="8"
          rx="4"
          fill="#F7F7F7"
        />
        <rect
          x="42.8203"
          y="7"
          width="1"
          height="131.782"
          rx="0.5"
          fill="#F7F7F7"
        />
        <rect x="8.5" y="26.333" width="199" height="1" fill="#F7F7F7" />
        <rect
          x="182.812"
          y="10.6123"
          width="21.0741"
          height="7"
          rx="3.5"
          fill="#F7F7F7"
        />
        <rect
          x="11.5098"
          y="55.2568"
          width="27.0953"
          height="7"
          rx="3.5"
          fill="#F7F7F7"
        />
        <rect
          x="11.5098"
          y="44.2568"
          width="27.0953"
          height="7"
          rx="3.5"
          fill="#F7F7F7"
        />
        <rect x="50" y="69" width="127" height="25" rx="4" fill="#F7F7F7" />
        <rect
          x="50.0469"
          y="97.1787"
          width="49.6747"
          height="7"
          rx="3.5"
          fill="#F7F7F7"
        />
        <rect
          x="50.0469"
          y="108.179"
          width="108.381"
          height="7"
          rx="3.5"
          fill="#F7F7F7"
        />
        <rect
          x="50.0469"
          y="119.179"
          width="108.381"
          height="7"
          rx="3.5"
          fill="#F7F7F7"
        />
        <rect
          x="12.7148"
          y="79.75"
          width="21.0741"
          height="7"
          rx="3.5"
          fill="#F7F7F7"
        />
        <g clipPath={`url(#clip0${ranKey})`}>
          <rect x="52" y="36" width="125" height="27" rx="1.5" fill="white" />
          <rect x="61" y="40.5" width="33" height="18" rx="2" fill="#E2E8F0" />
          <rect
            x="99"
            y="41"
            width="34"
            height="5.5"
            rx="2.75"
            fill="#E2E8F0"
          />
          <rect
            x="99"
            y="49.5"
            width="69.5"
            height="5.5"
            rx="2.75"
            fill="#E2E8F0"
          />
        </g>
        <rect
          x="50.75"
          y="34.75"
          width="127.5"
          height="29.5"
          rx="2.75"
          stroke="#73A4FC"
          strokeWidth="2.5"
        />
      </g>
      <defs>
        <filter
          id={`filter0${ranKey}`}
          x="0"
          y="0"
          width="215"
          height="146.782"
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
          <feGaussianBlur stdDeviation="3.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_284_15921"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="3" />
          <feGaussianBlur stdDeviation="2.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_284_15921"
            result="effect2_dropShadow_284_15921"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_284_15921"
            result="shape"
          />
        </filter>
        <clipPath id={`clip0${ranKey}`}>
          <rect x="52" y="36" width="125" height="27" rx="1.5" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
