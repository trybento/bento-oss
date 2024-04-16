import useRandomKey from 'bento-common/hooks/useRandomKey';

const FlatLayout = (props) => {
  /** Filter ids must be unique in order to work. */
  const ranKey = useRandomKey();

  return (
    <svg
      width="99"
      height="123"
      viewBox="6 6 99 123"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter={`url(#filter0${ranKey})`}>
        <rect x="8" y="8" width="82.5" height="105.6" rx="4.4" fill="#CBD5E0" />
      </g>
      <rect
        x="9.10001"
        y="19"
        width="80.3"
        height="93.5"
        rx="4.4"
        fill="white"
      />
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
        height="51.7"
        rx="1.65"
        fill="white"
        stroke="#E2E8F0"
        strokeWidth="1.1"
      />
      <rect
        x="35.2809"
        y="61.3501"
        width="41.25"
        height="2.2"
        rx="1.1"
        fill="#E2E8F0"
      />
      <rect
        x="56.4"
        y="66.8501"
        width="20.35"
        height="2.2"
        rx="1.1"
        fill="#E2E8F0"
      />
      <rect
        x="56.4"
        y="72.3501"
        width="20.35"
        height="2.2"
        rx="1.1"
        fill="#E2E8F0"
      />
      <rect
        x="56.4"
        y="77.8501"
        width="20.35"
        height="2.2"
        rx="1.1"
        fill="#E2E8F0"
      />
      <rect
        x="35.5"
        y="66.3"
        width="16.5"
        height="15.4"
        rx="2.2"
        fill="#E2E8F0"
      />
      <circle cx="25.05" cy="33.85" r="4.95" fill="#CBD5E0" />
      <circle cx="25.05" cy="55.85" r="4.95" fill="#CBD5E0" />
      <rect
        x="20.1004"
        y="28.9"
        width="9.9"
        height="9.9"
        rx="4.95"
        fill="#CBD5E0"
      />
      <g clipPath={`url(#clip0${ranKey})`}>
        <path
          d="M24.8238 34.709C24.5895 35.0992 24.0239 35.0991 23.7898 34.7088L23.5311 34.2777C23.4147 34.0837 23.1336 34.0832 23.0166 34.2769C22.959 34.3721 22.9589 34.4913 23.0161 34.5867L23.3633 35.1655C23.7906 35.8776 24.8226 35.8776 25.2498 35.1655L27.1842 31.9416C27.2411 31.8468 27.2411 31.7283 27.1842 31.6335C27.0679 31.4398 26.7872 31.4398 26.6709 31.6334L24.8238 34.709Z"
          fill="white"
        />
      </g>
      <rect
        x="20.1004"
        y="50.9"
        width="9.9"
        height="9.9"
        rx="4.95"
        fill="#49A9F8"
      />
      <g clipPath="url(#clip1_1178_4584)">
        <path
          d="M24.8238 56.709C24.5895 57.0992 24.0239 57.0991 23.7898 56.7088L23.5311 56.2777C23.4147 56.0837 23.1336 56.0832 23.0166 56.2769C22.959 56.3721 22.9589 56.4913 23.0161 56.5867L23.3633 57.1655C23.7906 57.8776 24.8226 57.8776 25.2498 57.1655L27.1842 53.9416C27.2411 53.8468 27.2411 53.7283 27.1842 53.6335C27.0679 53.4398 26.7872 53.4398 26.6709 53.6334L24.8238 56.709Z"
          fill="white"
        />
      </g>
      <g clipPath={`url(#clip2${ranKey})`}>
        <path
          d="M80.1159 53.9207C79.9297 53.6725 79.5575 53.6723 79.3712 53.9203L78.7297 54.7737C78.2897 55.3591 77.4111 55.3591 76.9711 54.7737L76.3296 53.9203C76.1432 53.6723 75.7711 53.6725 75.5849 53.9207C75.4608 54.0862 75.4608 54.3139 75.5849 54.4794L76.9704 56.3267C77.4104 56.9134 78.2904 56.9134 78.7304 56.3267L80.1159 54.4794C80.24 54.3139 80.24 54.0862 80.1159 53.9207Z"
          fill="#CBD5E0"
        />
      </g>
      <g clipPath={`url(#clip3${ranKey})`}>
        <rect
          x="15.1496"
          y="103.15"
          width="69.3"
          height="17.6"
          rx="1.65"
          fill="white"
          stroke="#EDF2F7"
          strokeWidth="1.1"
        />
        <circle cx="25.0496" cy="111.95" r="4.95" fill="#CBD5E0" />
      </g>
      <rect
        x="56.4"
        y="87.2001"
        width="19.8"
        height="5.5"
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
            result="effect1_dropShadow_1178_4584"
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
            in2="effect1_dropShadow_1178_4584"
            result="effect2_dropShadow_1178_4584"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_1178_4584"
            result="shape"
          />
        </filter>
        <clipPath id={`clip0${ranKey}`}>
          <rect
            width="5.94"
            height="9.89999"
            fill="white"
            transform="translate(22.0791 28.9)"
          />
        </clipPath>
        <clipPath id={`clip1${ranKey}`}>
          <rect
            width="5.94"
            height="9.89999"
            fill="white"
            transform="translate(22.0791 50.9)"
          />
        </clipPath>
        <clipPath id={`clip2${ranKey}`}>
          <rect
            width="9.89999"
            height="13.2"
            fill="white"
            transform="translate(72.9004 48.7001)"
          />
        </clipPath>
        <clipPath id={`clip3${ranKey}`}>
          <rect
            width="72.6"
            height="15.4"
            fill="white"
            transform="translate(12.4 96)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default FlatLayout;
