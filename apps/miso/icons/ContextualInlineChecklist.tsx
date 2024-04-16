import useRandomKey from 'bento-common/hooks/useRandomKey';
import { SVGProps } from 'react';

export default function ContextualInlineChecklist(
  props: React.PropsWithChildren<SVGProps<SVGSVGElement>>
) {
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
        <rect x="50" y="34" width="70" height="60" rx="4" fill="#F7F7F7" />
        <rect x="50" y="97" width="46" height="7" rx="3.5" fill="#F7F7F7" />
        <rect x="50" y="108" width="68" height="7" rx="3.5" fill="#F7F7F7" />
        <rect x="50" y="119" width="68" height="7" rx="3.5" fill="#F7F7F7" />
        <rect
          x="12.7148"
          y="79.75"
          width="21.0741"
          height="7"
          rx="3.5"
          fill="#F7F7F7"
        />
        <rect
          x="129.25"
          y="35.25"
          width="69.5"
          height="73.5"
          rx="3.75"
          stroke="#73A4FC"
          strokeWidth="2.5"
        />
        <rect x="136" y="43" width="10" height="10" rx="2" fill="#73A4FC" />
        <g clipPath="url(#clip0_114_23253)">
          <path
            d="M140.621 48.8679C140.14 49.3483 139.361 49.3481 138.88 48.8675L138.306 48.2938C138.144 48.1314 137.881 48.1309 137.718 48.2928C137.554 48.4554 137.554 48.7202 137.717 48.8834L138.588 49.7542C139.23 50.3962 140.271 50.3962 140.913 49.7542L144.456 46.2105C144.619 46.0483 144.619 45.7852 144.456 45.6229C144.294 45.4607 144.031 45.4606 143.869 45.6228L140.621 48.8679Z"
            fill="white"
          />
        </g>
        <rect x="150" y="45" width="43" height="6" rx="3" fill="#E2E8F0" />
        <rect
          x="136.5"
          y="59.5"
          width="9"
          height="9"
          rx="1.5"
          fill="white"
          stroke="#CBD5E0"
        />
        <rect x="150" y="61" width="43" height="6" rx="3" fill="#E2E8F0" />
        <rect
          x="136.5"
          y="75.5"
          width="9"
          height="9"
          rx="1.5"
          fill="white"
          stroke="#CBD5E0"
        />
        <rect x="150" y="77" width="43" height="6" rx="3" fill="#E2E8F0" />
        <rect
          x="136.5"
          y="91.5"
          width="9"
          height="9"
          rx="1.5"
          fill="white"
          stroke="#CBD5E0"
        />
        <rect x="150" y="93" width="43" height="6" rx="3" fill="#E2E8F0" />
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
            result="effect1_dropShadow_114_23253"
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
            in2="effect1_dropShadow_114_23253"
            result="effect2_dropShadow_114_23253"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_114_23253"
            result="shape"
          />
        </filter>
        <clipPath id="clip0_114_23253">
          <rect
            width="10"
            height="10"
            fill="white"
            transform="translate(136 43)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
