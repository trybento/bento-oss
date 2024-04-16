import useRandomKey from 'bento-common/hooks/useRandomKey';

const Tooltip = (props) => {
  /** Filter ids must be unique in order to work. */
  const ranKey = useRandomKey();

  return (
    <svg width="216" height="147" viewBox="0 0 216 147" fill="none" {...props}>
      <g filter={`url(#filter${ranKey})`}>
        <rect
          x="7.5"
          y="8"
          width="201.5"
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
        <rect x="9" y="26.333" width="200" height="1" fill="#F7F7F7" />
        <rect
          x="184.312"
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
        <g filter={`url(#filter2${ranKey})`}>
          <path
            d="M57.6232 35.6835C56.3964 34.8965 56.3964 33.1037 57.6232 32.3167L65.4191 27.3156C66.7502 26.4617 68.499 27.4175 68.499 28.999V39.0012C68.499 40.5826 66.7502 41.5385 65.4191 40.6846L57.6232 35.6835Z"
            fill="#EDF2F7"
          />
        </g>
        <g filter={`url(#filter3${ranKey})`}>
          <rect x="62" y="13" width="72" height="42" rx="5" fill="#EDF2F7" />
          <rect x="68" y="19" width="50" height="31" rx="5" fill="white" />
          <rect x="73" y="26" width="40" height="6" rx="3" fill="#E2E8F0" />
          <rect x="73" y="36" width="40" height="6" rx="3" fill="#E2E8F0" />
          <path
            d="M129.051 20.26C129.414 19.8979 129.414 19.3107 129.051 18.9486C128.689 18.5865 128.102 18.5865 127.74 18.9486L126.844 19.8443C126.378 20.3106 125.622 20.3106 125.156 19.8443L124.26 18.9486C123.898 18.5865 123.311 18.5865 122.949 18.9486C122.586 19.3107 122.586 19.8979 122.949 20.26L123.844 21.1557C124.311 21.622 124.311 22.378 123.844 22.8443L122.949 23.74C122.586 24.1022 122.586 24.6893 122.949 25.0514C123.311 25.4135 123.898 25.4135 124.26 25.0514L125.156 24.1557C125.622 23.6894 126.378 23.6894 126.844 24.1557L127.74 25.0514C128.102 25.4135 128.689 25.4135 129.051 25.0514L128.698 24.6979L129.051 25.0514C129.414 24.6893 129.414 24.1021 129.051 23.74L128.156 22.8443C127.689 22.378 127.689 21.622 128.156 21.1557L129.051 20.26Z"
            fill="#CBD5E0"
            stroke="#CBD5E0"
          />
          <path
            d="M57.6232 35.6835C56.3964 34.8965 56.3964 33.1037 57.6232 32.3167L65.4191 27.3156C66.7502 26.4617 68.499 27.4175 68.499 28.999V39.0012C68.499 40.5826 66.7502 41.5385 65.4191 40.6846L57.6232 35.6835Z"
            fill="#EDF2F7"
          />
        </g>
        <circle cx="42" cy="33" r="6" fill="#F5A34E" />
        <circle cx="42" cy="33" r="11" fill="#F5A34E" fillOpacity="0.3" />
      </g>
      <defs>
        <filter
          id={`filter${ranKey}`}
          x="0.5"
          y="0"
          width="215.5"
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
            result="effect1_dropShadow_1_14310"
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
            in2="effect1_dropShadow_1_14310"
            result="effect2_dropShadow_1_14310"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_1_14310"
            result="shape"
          />
        </filter>
        <filter
          id={`filter2${ranKey}`}
          x="49.7031"
          y="19.9957"
          width="25.7959"
          height="29.0087"
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
            result="effect1_dropShadow_1_14310"
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
            in2="effect1_dropShadow_1_14310"
            result="effect2_dropShadow_1_14310"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_1_14310"
            result="shape"
          />
        </filter>
        <filter
          id={`filter3${ranKey}`}
          x="49.7031"
          y="6"
          width="91.2969"
          height="57"
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
            result="effect1_dropShadow_1_14310"
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
            in2="effect1_dropShadow_1_14310"
            result="effect2_dropShadow_1_14310"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_1_14310"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default Tooltip;
