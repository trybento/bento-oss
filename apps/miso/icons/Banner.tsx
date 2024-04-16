import useRandomKey from 'bento-common/hooks/useRandomKey';

const Banner = (props) => {
  /** Filter ids must be unique in order to work. */
  const ranKey = useRandomKey();

  return (
    <svg width="213" height="147" viewBox="0 0 213 147" fill="none" {...props}>
      <g filter={`url(#filter0${ranKey})`}>
        <rect
          x="7"
          y="8"
          width="199"
          height="130"
          rx="3"
          fill="white"
          shapeRendering="crispEdges"
        />
        <rect
          x="12.0098"
          y="33.2568"
          width="27.0953"
          height="7"
          rx="3.5"
          fill="#F7F7F7"
        />
        <rect
          x="12.0098"
          y="9.4082"
          width="8"
          height="8"
          rx="4"
          fill="#F7F7F7"
        />
        <rect
          x="43.3203"
          y="7"
          width="1"
          height="131.782"
          rx="0.5"
          fill="#F7F7F7"
        />
        <rect x="9" y="26.333" width="197" height="1" fill="#F7F7F7" />
        <rect
          x="181.312"
          y="10.6123"
          width="21.0741"
          height="7"
          rx="3.5"
          fill="#F7F7F7"
        />
        <rect
          x="12.0098"
          y="55.2568"
          width="27.0953"
          height="7"
          rx="3.5"
          fill="#F7F7F7"
        />
        <rect
          x="12.0098"
          y="44.2568"
          width="27.0953"
          height="7"
          rx="3.5"
          fill="#F7F7F7"
        />
        <rect
          x="50.5469"
          y="33.9561"
          width="127.047"
          height="59.9107"
          rx="4"
          fill="#F7F7F7"
        />
        <rect
          x="50.5469"
          y="97.1787"
          width="49.6747"
          height="7"
          rx="3.5"
          fill="#F7F7F7"
        />
        <rect
          x="50.5469"
          y="108.179"
          width="108.381"
          height="7"
          rx="3.5"
          fill="#F7F7F7"
        />
        <rect
          x="50.5469"
          y="119.179"
          width="108.381"
          height="7"
          rx="3.5"
          fill="#F7F7F7"
        />
        <rect
          x="13.2148"
          y="79.75"
          width="21.0741"
          height="7"
          rx="3.5"
          fill="#F7F7F7"
        />
        <g filter={`url(#filter1${ranKey})`}>
          <rect
            x="17.25"
            y="17"
            width="179"
            height="26"
            rx="6"
            fill="#73A4FC"
          />
          <rect
            opacity="0.7"
            x="31.25"
            y="23"
            width="88"
            height="5"
            rx="2"
            fill="white"
          />
          <rect
            opacity="0.7"
            x="31.25"
            y="32"
            width="18"
            height="5"
            rx="2"
            fill="white"
          />
          <path
            opacity="0.8"
            d="M187.301 25.26C187.664 24.8979 187.664 24.3107 187.301 23.9486C186.939 23.5865 186.352 23.5865 185.99 23.9486L185.094 24.8443C184.628 25.3106 183.872 25.3106 183.406 24.8443L182.51 23.9486C182.148 23.5865 181.561 23.5865 181.199 23.9486C180.836 24.3107 180.836 24.8979 181.199 25.26L182.094 26.1557C182.561 26.622 182.561 27.378 182.094 27.8443L181.199 28.74C180.836 29.1022 180.836 29.6893 181.199 30.0514C181.561 30.4135 182.148 30.4135 182.51 30.0514L183.406 29.1557C183.872 28.6894 184.628 28.6894 185.094 29.1557L185.99 30.0514C186.352 30.4135 186.939 30.4135 187.301 30.0514L186.948 29.6979L187.301 30.0514C187.664 29.6893 187.664 29.1021 187.301 28.74L186.406 27.8443C185.939 27.378 185.939 26.622 186.406 26.1557L187.301 25.26Z"
            fill="white"
            stroke="white"
          />
        </g>
      </g>
      <defs>
        <filter
          id={`filter0${ranKey}`}
          x="0"
          y="0"
          width="213"
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
            result="effect1_dropShadow_1_13294"
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
            in2="effect1_dropShadow_1_13294"
            result="effect2_dropShadow_1_13294"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_1_13294"
            result="shape"
          />
        </filter>
        <filter
          id={`filter1${ranKey}`}
          x="5.25"
          y="15"
          width="203"
          height="50"
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
          <feMorphology
            radius="2"
            operator="erode"
            in="SourceAlpha"
            result="effect1_dropShadow_1_13294"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="3" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1_13294"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="3"
            operator="erode"
            in="SourceAlpha"
            result="effect2_dropShadow_1_13294"
          />
          <feOffset dy="10" />
          <feGaussianBlur stdDeviation="7.5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_1_13294"
            result="effect2_dropShadow_1_13294"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_1_13294"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default Banner;
