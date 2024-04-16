import useRandomKey from 'bento-common/hooks/useRandomKey';
import React from 'react';

export default function Checklist(
  props: React.PropsWithChildren<React.SVGProps<SVGSVGElement>>
) {
  /** Filter ids must be unique in order to work. */
  const ranKey = useRandomKey();

  return (
    <svg width="215" height="145" viewBox="0 0 215 145" fill="none" {...props}>
      <g filter={`url(#filter${ranKey})`}>
        <g clip-path={`url(#clip${ranKey})`}>
          <rect x="7" y="7" width="201" height="130" rx="3" fill="white" />
          <rect
            x="11.0098"
            y="32.2568"
            width="27.0953"
            height="7"
            rx="3.5"
            fill="#F7F7F7"
          />
          <rect
            x="11.0098"
            y="8.4082"
            width="8"
            height="8"
            rx="4"
            fill="#F7F7F7"
          />
          <rect
            x="42.3203"
            y="6"
            width="1"
            height="131.782"
            rx="0.5"
            fill="#F7F7F7"
          />
          <rect x="8" y="25.333" width="199" height="1" fill="#F7F7F7" />
          <rect
            x="182.312"
            y="9.6123"
            width="21.0741"
            height="7"
            rx="3.5"
            fill="#F7F7F7"
          />
          <rect
            x="11.0098"
            y="54.2568"
            width="27.0953"
            height="7"
            rx="3.5"
            fill="#F7F7F7"
          />
          <rect
            x="11.0098"
            y="43.2568"
            width="27.0953"
            height="7"
            rx="3.5"
            fill="#F7F7F7"
          />
          <rect
            x="12.2148"
            y="78.75"
            width="21.0741"
            height="7"
            rx="3.5"
            fill="#F7F7F7"
          />
          <rect x="54" y="34" width="111" height="116" rx="5" fill="#F7FAFC" />
          <rect
            x="66.0996"
            y="44.5"
            width="88.8"
            height="93"
            rx="2.5"
            fill="white"
            stroke="#73A4FC"
          />
          <rect
            x="95.8008"
            y="81.5"
            width="38.5"
            height="4"
            rx="2"
            fill="#E2E8F0"
          />
          <rect
            x="79.3008"
            y="77"
            width="11"
            height="10"
            rx="2"
            fill="#73A4FC"
          />
          <rect
            x="95.8008"
            y="96"
            width="38.5"
            height="4"
            rx="2"
            fill="#E2E8F0"
          />
          <rect
            x="95.8008"
            y="111"
            width="38.5"
            height="4"
            rx="2"
            fill="#E2E8F0"
          />
          <rect
            x="79.8008"
            y="92.5"
            width="10"
            height="9"
            rx="1.5"
            fill="white"
            stroke="#CBD5E0"
          />
          <rect
            x="79.8008"
            y="107.5"
            width="10"
            height="9"
            rx="1.5"
            fill="white"
            stroke="#CBD5E0"
          />
          <g clip-path="url(#clip1_114_22021)">
            <path
              d="M84.6206 83.0413C84.1675 83.5846 83.3329 83.5844 82.88 83.0409L82.3593 82.4161C82.1786 82.1993 81.8458 82.1987 81.6644 82.4149C81.5235 82.5828 81.523 82.8276 81.6634 82.996L82.3775 83.8529C83.0918 84.7101 84.4083 84.7101 85.1227 83.8529L88.5092 79.789C88.6487 79.6216 88.6487 79.3784 88.5092 79.211C88.3288 78.9945 87.9962 78.9944 87.8157 79.2108L84.6206 83.0413Z"
              fill="white"
            />
          </g>
          <rect x="80" y="63" width="58" height="6" rx="3" fill="#E2E8F0" />
          <g filter="url(#filter1_dd_114_22021)">
            <path
              d="M175 58C175 55.2386 177.239 53 180 53H208V87H180C177.239 87 175 84.7614 175 82V58Z"
              fill="#73A4FC"
            />
            <rect
              x="180"
              y="58"
              width="23"
              height="23"
              rx="11.5"
              fill="white"
            />
            <path
              d="M191.5 59.725C191.5 58.7723 192.277 57.9868 193.219 58.1291C194.435 58.313 195.618 58.6915 196.721 59.2534C198.338 60.0773 199.737 61.2722 200.804 62.7405C201.87 64.2087 202.575 65.9085 202.858 67.701C203.142 69.4935 202.998 71.3277 202.437 73.0537C201.876 74.7797 200.915 76.3485 199.632 77.6317C198.348 78.915 196.78 79.8763 195.054 80.4371C193.328 80.998 191.493 81.1423 189.701 80.8584C188.478 80.6648 187.299 80.2757 186.207 79.7094C185.361 79.2709 185.194 78.1789 185.754 77.4081C186.314 76.6374 187.389 76.4866 188.261 76.8698C188.891 77.1466 189.556 77.3425 190.241 77.4509C191.495 77.6496 192.779 77.5486 193.988 77.156C195.196 76.7634 196.294 76.0905 197.192 75.1922C198.09 74.2939 198.763 73.1958 199.156 71.9876C199.549 70.7794 199.65 69.4954 199.451 68.2407C199.252 66.986 198.759 65.7961 198.013 64.7683C197.266 63.7406 196.287 62.9041 195.155 62.3274C194.537 62.0129 193.884 61.7804 193.212 61.6341C192.281 61.4315 191.5 60.6777 191.5 59.725Z"
              fill="#B8D0FE"
              stroke="#B8D0FE"
            />
            <rect
              x="184"
              y="62"
              width="15"
              height="15"
              rx="7.5"
              fill="#73A4FC"
            />
          </g>
        </g>
      </g>
      <defs>
        <filter
          id={`filter${ranKey}`}
          x="0"
          y="0"
          width="215"
          height="145"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
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
            result="effect1_dropShadow_114_22021"
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
            in2="effect1_dropShadow_114_22021"
            result="effect2_dropShadow_114_22021"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_114_22021"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_dd_114_22021"
          x="163"
          y="51"
          width="57"
          height="58"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
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
            result="effect1_dropShadow_114_22021"
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
            result="effect1_dropShadow_114_22021"
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
            result="effect2_dropShadow_114_22021"
          />
          <feOffset dy="10" />
          <feGaussianBlur stdDeviation="7.5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_114_22021"
            result="effect2_dropShadow_114_22021"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_114_22021"
            result="shape"
          />
        </filter>
        <clipPath id={`clip${ranKey}`}>
          <rect x="7" y="7" width="201" height="130" rx="3" fill="white" />
        </clipPath>
        <clipPath id="clip1_114_22021">
          <rect
            width="9.99999"
            height="12"
            fill="white"
            transform="translate(80 76)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
