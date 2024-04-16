import useRandomKey from 'bento-common/hooks/useRandomKey';

const AnnouncementType = (props) => {
  /** Filter ids must be unique in order to work. */
  const ranKey = useRandomKey();

  return (
    <svg width="215" height="147" viewBox="0 0 215 147" fill="none" {...props}>
      <g filter={`url(#filter0${ranKey})`}>
        <rect x="7" y="8" width="201" height="130" rx="3" fill="white" />
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
        <rect x="9" y="26.333" width="199" height="1" fill="#F7F7F7" />
        <rect
          x="183.312"
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
        <rect
          x="7"
          y="7"
          width="201"
          height="132"
          rx="4"
          fill="black"
          fillOpacity="0.15"
        />
        <g filter={`url(#filter1${ranKey})`}>
          <rect x="57" y="36" width="102" height="74" rx="5" fill="#EDF2F7" />
          <rect x="127" y="94" width="27" height="10" rx="5" fill="#73A4FC" />
          <rect x="64" y="52" width="88" height="36" rx="2" fill="white" />
          <path
            d="M154.051 42.26C154.414 41.8979 154.414 41.3107 154.051 40.9486C153.689 40.5865 153.102 40.5865 152.74 40.9486L151.844 41.8443C151.378 42.3106 150.622 42.3106 150.156 41.8443L149.26 40.9486C148.898 40.5865 148.311 40.5865 147.949 40.9486C147.586 41.3107 147.586 41.8979 147.949 42.26L148.844 43.1557C149.311 43.622 149.311 44.378 148.844 44.8443L147.949 45.74C147.586 46.1022 147.586 46.6893 147.949 47.0514C148.311 47.4135 148.898 47.4135 149.26 47.0514L150.156 46.1557C150.622 45.6894 151.378 45.6894 151.844 46.1557L152.74 47.0514C153.102 47.4135 153.689 47.4135 154.051 47.0514L153.698 46.6979L154.051 47.0514C154.414 46.6893 154.414 46.1021 154.051 45.74L153.156 44.8443C152.689 44.378 152.689 43.622 153.156 43.1557L154.051 42.26Z"
            fill="#CBD5E0"
            stroke="#CBD5E0"
          />
        </g>
      </g>
      <defs>
        <filter
          id={`filter0${ranKey}`}
          x="0"
          y="0"
          width="215"
          height="147"
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
            result="effect1_dropShadow_407_25936"
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
            in2="effect1_dropShadow_407_25936"
            result="effect2_dropShadow_407_25936"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_407_25936"
            result="shape"
          />
        </filter>
        <filter
          id={`filter1${ranKey}`}
          x="45"
          y="34"
          width="126"
          height="98"
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
            result="effect1_dropShadow_407_25936"
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
            result="effect1_dropShadow_407_25936"
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
            result="effect2_dropShadow_407_25936"
          />
          <feOffset dy="10" />
          <feGaussianBlur stdDeviation="7.5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_407_25936"
            result="effect2_dropShadow_407_25936"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_407_25936"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default AnnouncementType;
