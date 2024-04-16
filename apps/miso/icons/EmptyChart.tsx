import useRandomKey from 'bento-common/hooks/useRandomKey';

export default function EmptyTable() {
  /** Filter ids must be unique in order to work. */
  const ranKey = useRandomKey();

  return (
    <svg
      width="215"
      height="136"
      viewBox="0 0 215 136"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter={`url(#filter0${ranKey})`}>
        <rect x="7" y="7" width="201" height="121" rx="5" fill="#F7FAFC" />
        <rect
          x="10.5"
          y="10.5"
          width="194"
          height="114"
          rx="2.5"
          fill="white"
        />
        <path
          d="M38.944 84L51.7297 56.5L61.7756 68L77.7577 32H90.0868L99.2195 84H118.855L128.444 52L139.403 84H163.605L172.281 41.5L186.436 84H163.605H139.403H118.855H99.2195H38.944Z"
          fill="#EEF9FB"
        />
        <rect
          x="16"
          y="83.4483"
          width="180.336"
          height="2.30172"
          rx="1.15086"
          fill="#E2E8F0"
        />
        <rect
          x="20.1651"
          y="93"
          width="13.0172"
          height="5.2069"
          rx="2.60345"
          transform="rotate(30 20.1651 93)"
          fill="#E2E8F0"
        />
        <rect
          x="42.0418"
          y="93"
          width="20.0172"
          height="5.2069"
          rx="2.60345"
          transform="rotate(30 42.0418 93)"
          fill="#E2E8F0"
        />
        <rect
          x="69.9807"
          y="93"
          width="13.0172"
          height="5.2069"
          rx="2.60345"
          transform="rotate(30 69.9807 93)"
          fill="#E2E8F0"
        />
        <rect
          x="91.8574"
          y="93"
          width="13.0172"
          height="5.2069"
          rx="2.60345"
          transform="rotate(30 91.8574 93)"
          fill="#E2E8F0"
        />
        <rect
          x="113.734"
          y="93"
          width="13.0172"
          height="5.2069"
          rx="2.60345"
          transform="rotate(30 113.734 93)"
          fill="#E2E8F0"
        />
        <rect
          x="135.611"
          y="93"
          width="20.0172"
          height="5.2069"
          rx="2.60345"
          transform="rotate(30 135.611 93)"
          fill="#E2E8F0"
        />
        <rect
          x="163.55"
          y="93"
          width="13.0172"
          height="5.2069"
          rx="2.60345"
          transform="rotate(30 163.55 93)"
          fill="#E2E8F0"
        />
        <rect
          x="185.426"
          y="93"
          width="13.0172"
          height="5.2069"
          rx="2.60345"
          transform="rotate(30 185.426 93)"
          fill="#E2E8F0"
        />
        <path
          opacity="0.65"
          d="M16.569 81H38.944L51.7297 53.5L61.7756 65L77.7577 29H90.0868L99.2195 81H118.855L128.444 49L139.403 81H163.605L172.281 38.5L186.436 81H195.569"
          stroke="#3CB8D7"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <rect
          x="10.5"
          y="10.5"
          width="194"
          height="114"
          rx="2.5"
          stroke="#E2E8F0"
        />
      </g>
      <defs>
        <filter
          id={`filter0${ranKey}`}
          x="0"
          y="0"
          width="215"
          height="136"
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
            result="effect1_dropShadow_932_3250"
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
            in2="effect1_dropShadow_932_3250"
            result="effect2_dropShadow_932_3250"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_932_3250"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
