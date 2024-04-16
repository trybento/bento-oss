import useRandomKey from 'bento-common/hooks/useRandomKey';

export default function VideoGalleryContextGuide(props) {
  /** Filter ids must be unique in order to work. */
  const ranKey = useRandomKey();

  return (
    <svg
      width="215"
      height="145"
      viewBox="0 0 215 145"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter={`url(#filter0${ranKey})`}>
        <rect
          x="7"
          y="7"
          width="201"
          height="130"
          rx="3"
          fill="white"
          shapeRendering="crispEdges"
        />
        <rect
          x="11.5098"
          y="32.2568"
          width="27.0953"
          height="7"
          rx="3.5"
          fill="#F7F7F7"
        />
        <rect
          x="11.5098"
          y="8.4082"
          width="8"
          height="8"
          rx="4"
          fill="#F7F7F7"
        />
        <rect
          x="42.8203"
          y="7"
          width="1"
          height="129.782"
          rx="0.5"
          fill="#F7F7F7"
        />
        <rect x="8.5" y="25.333" width="199" height="1" fill="#F7F7F7" />
        <rect
          x="182.812"
          y="9.6123"
          width="21.0741"
          height="7"
          rx="3.5"
          fill="#F7F7F7"
        />
        <rect
          x="11.5098"
          y="54.2568"
          width="27.0953"
          height="7"
          rx="3.5"
          fill="#F7F7F7"
        />
        <rect
          x="11.5098"
          y="43.2568"
          width="27.0953"
          height="7"
          rx="3.5"
          fill="#F7F7F7"
        />
        <rect x="50" y="128" width="129" height="7" rx="3.5" fill="#F7F7F7" />
        <rect x="50" y="105" width="54" height="18" rx="4" fill="#F7F7F7" />
        <rect x="108" y="105" width="71" height="18" rx="4" fill="#F7F7F7" />
        <rect
          x="12.7148"
          y="78.75"
          width="21.0741"
          height="7"
          rx="3.5"
          fill="#F7F7F7"
        />
        <g clipPath={`url(#clip0${ranKey})`}>
          <rect x="52" y="35" width="125" height="62" rx="1.5" fill="white" />
          <rect x="56" y="41" width="91" height="50" rx="2" fill="#E2E8F0" />
          <g clipPath={`url(#clip1${ranKey})`}>
            <path
              d="M101.5 61.9167C98.9701 61.9167 96.9167 63.97 96.9167 66.5C96.9167 69.03 98.9701 71.0833 101.5 71.0833C104.03 71.0833 106.083 69.03 106.083 66.5C106.083 63.97 104.03 61.9167 101.5 61.9167ZM100.583 68.5625V64.4375L103.333 66.5L100.583 68.5625Z"
              fill="#73A4FC"
            />
          </g>
          <rect x="150" y="41" width="24" height="15" rx="2" fill="#E2E8F0" />
          <rect x="150" y="57" width="24" height="15" rx="2" fill="#E2E8F0" />
          <rect x="150" y="73" width="24" height="15" rx="2" fill="#E2E8F0" />
        </g>
        <rect
          x="50.75"
          y="33.75"
          width="127.5"
          height="64.5"
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
          height="145"
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
            result="effect1_dropShadow_4_13176"
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
            in2="effect1_dropShadow_4_13176"
            result="effect2_dropShadow_4_13176"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_4_13176"
            result="shape"
          />
        </filter>
        <clipPath id={`clip0${ranKey}`}>
          <rect x="52" y="35" width="125" height="62" rx="1.5" fill="white" />
        </clipPath>
        <clipPath id={`clip1${ranKey}`}>
          <rect
            width="11"
            height="11"
            fill="white"
            transform="translate(96 61)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
