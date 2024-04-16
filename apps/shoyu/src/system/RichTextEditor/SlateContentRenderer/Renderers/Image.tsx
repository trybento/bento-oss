import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cx from 'classnames';
import ReactDOM from 'react-dom';
import {
  AlignmentEnum,
  EmbedFormFactor,
  FillEnum,
  Theme,
  VerticalAlignmentEnum,
} from 'bento-common/types';
import {
  PerformantImageProps,
  SlateRendererProps,
} from 'bento-common/types/slate';
import { px } from 'bento-common/utils/dom';
import { aspectRatio, isEdgeToEdge } from 'bento-common/utils/image';

import { getNodeStyle } from '../helpers';
import { isCardTheme } from 'bento-common/data/helpers';

interface ImageNode extends Partial<PerformantImageProps> {
  type: 'image';
  url: string;
  children: any;
  alignment?: AlignmentEnum;
  fill?: FillEnum;
  hyperlink?: string;
  lightboxDisabled?: boolean;
}

type ImageProps = SlateRendererProps & {
  node: ImageNode;
};

interface ImageVariationsProps extends Partial<PerformantImageProps> {
  handleClose?: () => void;
  handleExpand?: () => void;
  imgElement?: any;
  imageAlt: string;
  url: string;
  fill?: FillEnum;
  hyperlink?: string;
  allowExpand?: boolean;
  maxHeight?: string | number;
  verticalMediaAlignment: VerticalAlignmentEnum | undefined;
  horizontalMediaAlignment: AlignmentEnum | undefined;
  theme?: Theme;
  allowMarginless: boolean;
  /** Determines if a plaholcer area/img should be used */
  withPlaceholder?: boolean;
}

// Get actual rendered size.
const getContainedSize = (
  imgElement
): { width: number; height: number; x: number; y: number } => {
  if (!imgElement) return { width: 0, height: 0, x: 0, y: 0 };
  const ratio = imgElement.naturalWidth / imgElement.naturalHeight;
  let width = imgElement.height * ratio;
  let height = imgElement.height;
  if (width > imgElement.width) {
    width = imgElement.width;
    height = imgElement.width / ratio;
  }
  const { x, y } = imgElement.getBoundingClientRect();

  return {
    width,
    height,
    x,
    y,
  };
};

const ImageLightbox = ({ children, handleClose, imgElement }) => {
  const original = useMemo(() => getContainedSize(imgElement), [imgElement]);

  const [expanded, setExpanded] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState<{
    scale: number;
    left: string;
    top: string;
  }>({
    scale: 1,
    left: px(original.x),
    top: px(original.y),
  });

  useEffect(() => {
    const yMultiplier =
      imgElement.naturalHeight > window.innerHeight * 0.8
        ? window.innerHeight * 0.8
        : imgElement.naturalHeight;
    const xMultiplier =
      imgElement.naturalWidth > window.innerWidth * 0.8
        ? window.innerWidth * 0.8
        : imgElement.naturalWidth;

    const yMultFactor = yMultiplier / original.height;
    const xMultFactor = xMultiplier / original.width;

    const multiplier = xMultFactor < yMultFactor ? xMultFactor : yMultFactor;

    const centerY = window.innerHeight / 2 - original.height / 2;
    const centerX = window.innerWidth / 2 - original.width / 2;
    setTimeout(() => {
      setDimensions({ scale: multiplier, left: px(centerX), top: px(centerY) });
      setExpanded(true);
    }, 100);
  }, []);

  /**
   * Since this component renders outside of the shadowRoot
   * context, tailwind classes should not be used.
   */
  return (
    <div
      style={useMemo(
        () => ({
          top: 0,
          left: 0,
          position: 'fixed',
          height: '100%',
          width: '100%',
          transition: 'background-color 0.3s ease-out',
          zIndex: 999999999999999,
          backgroundColor: expanded ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0)',
        }),
        [expanded]
      )}
      onClick={handleClose}
    >
      <div
        style={useMemo(
          () => ({
            position: 'absolute',
            transitionProperty: 'transform, left, top',
            transitionDuration: '0.3s',
            transitionTimingFunction: 'ease-out',
            width: original.width,
            height: original.height,
            transform: `scale(${dimensions.scale})`,
            top: dimensions.top,
            left: dimensions.left,
          }),
          [dimensions, original, dimensions]
        )}
      >
        {children}
      </div>
    </div>
  );
};

const InlineImg = forwardRef<HTMLImageElement, ImageVariationsProps>(
  (
    {
      imageAlt,
      hyperlink,
      url,
      handleExpand = () => {},
      fill,
      allowExpand = true,
      maxHeight,
      allowMarginless,
      withPlaceholder,
      naturalWidth,
      naturalHeight,
      verticalMediaAlignment,
      horizontalMediaAlignment,
    },
    ref
  ) => {
    const hoverMessage = hyperlink
      ? 'Open link'
      : allowExpand
      ? 'Click to expand'
      : '';
    const handleClick = useCallback(
      hyperlink
        ? () => {
            const openInNewWindow = !(
              hyperlink && hyperlink.includes(window.location.host)
            );
            window.open(hyperlink, openInNewWindow ? '_blank' : '_self');
          }
        : handleExpand,
      [hyperlink, handleExpand]
    );

    const isMarginless = allowMarginless && isEdgeToEdge(fill);
    const shouldFillWidth = fill === FillEnum.full;
    const fullWidth = isMarginless || shouldFillWidth;

    /**
     * When enabled, determines the img placeholder styles as an attempt
     * to prevent cumulative layout shift (CLS) due to unknown image dimensions.
     *
     * @see https://web.dev/cls/
     */
    const placeholderStyles = useMemo<React.CSSProperties | undefined>(() => {
      if (!withPlaceholder || !naturalWidth || !naturalHeight) {
        return undefined;
      }

      const imageMaxHeight = maxHeight
        ? typeof maxHeight === 'string'
          ? maxHeight
          : px(maxHeight)
        : undefined;

      return {
        height: 'auto',
        maxWidth: '100%',
        // placeholder's maxHeight should be at most equal to the img maxHeight
        // thus preventing undesirable white-space for very tall images
        maxHeight: imageMaxHeight,
        aspectRatio: aspectRatio(naturalWidth, naturalHeight, 'css'),
      };
    }, [withPlaceholder, fill, maxHeight, naturalWidth, naturalHeight]);

    const isTopAligned =
      !verticalMediaAlignment ||
      verticalMediaAlignment === VerticalAlignmentEnum.top;
    const isBottomAligned =
      verticalMediaAlignment === VerticalAlignmentEnum.bottom;
    const isVerticalCenterAligned =
      verticalMediaAlignment === VerticalAlignmentEnum.center;

    const isLeftAligned = horizontalMediaAlignment === AlignmentEnum.left;
    const isRightAligned = horizontalMediaAlignment === AlignmentEnum.right;

    return (
      <div className="relative w-full h-full select-none">
        <div
          className={cx('h-full', 'w-full', {
            'overflow-hidden': shouldFillWidth,
            'inline-block': !isBottomAligned && !isVerticalCenterAligned,
            'text-left': isLeftAligned,
            'text-right': isRightAligned,
          })}
          style={placeholderStyles}
        >
          <img
            ref={ref}
            loading="eager"
            className={cx('inline-block', 'max-w-full', {
              'object-contain h-full': !isMarginless,
              'w-full': fullWidth,
              'object-cover h-full': isMarginless,
              'object-top': isTopAligned,
              'object-bottom': isBottomAligned,
              'object-center': isVerticalCenterAligned,
            })}
            alt={imageAlt}
            src={url}
            style={{ maxHeight }}
          />
        </div>

        {hoverMessage && (
          <div
            onClick={handleClick}
            className={`
            grid
            absolute
            w-full
            h-full
            top-0
            left-0
            transition
            opacity-0
            hover:opacity-100
            cursor-pointer
            text-center
            text-white
            bg-black
            bg-opacity-30
          `}
          >
            <div className="m-auto w-2/3">{hoverMessage}</div>
          </div>
        )}
      </div>
    );
  }
);

const AnimatedImg = ({
  imgElement,
  handleClose,
  imageAlt,
  url,
}: ImageVariationsProps) =>
  imgElement ? (
    <ImageLightbox imgElement={imgElement} handleClose={handleClose}>
      <img
        onClick={handleClose}
        alt={imageAlt}
        src={url}
        style={{
          maxWidth: '100%',
          height: 'auto',
          display: 'inline-block',
          transition: 'opacity 300ms ease-out',
          cursor: 'pointer',
        }}
      />
    </ImageLightbox>
  ) : null;

const Image: React.FC<ImageProps> = ({ node, options }) => {
  const style = getNodeStyle(node, options);
  const imageAlt = node.children?.[0]?.text;
  const url = node.url.includes('http')
    ? node.url
    : `${process.env.VITE_PUBLIC_CLIENT_URL_BASE}${node.url}`;
  const [isFocused, setIsFocused] = React.useState(false);
  const imgRef: any = useRef(null);

  useEffect(() => {
    if (isFocused) {
      imgRef.current.classList.remove('hover');
    }
  }, [isFocused]);

  const handleExpand = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsFocused(false);
  }, []);

  /**
   * Determines which form factors should enable image placeholders
   * to prevent cumulative layout shift (CLS) due to unknown image dimensions.
   */
  const withPlaceholder = useMemo<boolean>(() => {
    switch (options?.formFactor) {
      case EmbedFormFactor.modal:
      case EmbedFormFactor.tooltip:
        return true;

      case EmbedFormFactor.inline:
        return isCardTheme(options?.theme);

      default:
        return false;
    }
  }, [options?.formFactor, options?.theme]);

  return (
    <div
      className={cx('text-center w-full', {
        'h-full': options?.carousel,
      })}
      style={style}
    >
      {isFocused &&
        ReactDOM.createPortal(
          <AnimatedImg
            handleClose={handleClose}
            imageAlt={imageAlt}
            url={url}
            allowMarginless={options?.allowMarginlessImages!}
            imgElement={imgRef.current}
            verticalMediaAlignment={undefined}
            horizontalMediaAlignment={undefined}
          />,
          document.body
        )}
      <InlineImg
        handleExpand={handleExpand}
        imageAlt={imageAlt}
        url={url}
        allowMarginless={options?.allowMarginlessImages!}
        ref={imgRef}
        fill={node.fill}
        hyperlink={node.hyperlink}
        allowExpand={
          (options?.allowExpand?.image ?? true) && !node.lightboxDisabled
        }
        maxHeight={
          options?.allowMarginlessImages && isEdgeToEdge(node.fill)
            ? undefined
            : options?.maxDimensions?.image?.height
        }
        verticalMediaAlignment={
          isEdgeToEdge(node.fill) ? undefined : options?.verticalMediaAlignment
        }
        horizontalMediaAlignment={
          isEdgeToEdge(node.fill)
            ? undefined
            : options?.horizontalMediaAlignment
        }
        naturalWidth={node.naturalWidth}
        naturalHeight={node.naturalHeight}
        withPlaceholder={withPlaceholder}
      />
    </div>
  );
};

export default Image;
