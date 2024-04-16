import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import cx from 'classnames';

import {
  AnnouncementShadow,
  BannerPadding,
  BannerPosition,
  BannersStyle,
  BannerTypeEnum,
} from '../types';
import { px } from '../utils/dom';
import Close from '../icons/Close';
import { ANNOUNCEMENT_ANIMATION_TIME_TAKEN } from '../frontend/constants';

export type BannerProps = {
  /**
   * Target container element to which apply the margin necessary for "inline" banners.
   * Mostly used for previews.
   */
  containerEl: HTMLElement | null;
  /** How should this banner be displayed? */
  display: BannerTypeEnum;
  /** Visibility is controlled from the ouside and this is used to show/hide the banner */
  isOpen: boolean;
  /** In which part of the page the banner needs to be positioned */
  placement: BannerPosition;
  /** Determines the look and feel of the banner */
  styles: BannersStyle & {
    /** Background color (HEX format) */
    bgColor: string;
    /** Text and links color (HEX format) */
    textColor: string;
  };
  /** Which `z-index` to use for the banner */
  zIndex: number;
  /**
   * The dismissal callback when the end-user can dismiss the banner.
   * When set, this will render the close button alongside the content inside the banner.
   */
  onDismiss?: () => void;
};

const Banner = ({
  children,
  containerEl,
  display,
  isOpen,
  onDismiss,
  placement,
  styles,
  zIndex,
}: React.PropsWithChildren<BannerProps>) => {
  const ref = useRef<HTMLDivElement>(null);
  const [bannerHeight, setBannerHeight] = useState(0);

  const setBodyMargin = useCallback(
    (margin: number) => {
      if (display !== BannerTypeEnum.inline || !containerEl) return;
      containerEl.style[
        placement === BannerPosition.top ? 'marginTop' : 'marginBottom'
      ] = px(margin);
    },
    [display, containerEl, placement]
  );

  const handleDismiss = useCallback(
    (e?: React.MouseEvent) => {
      e && e.stopPropagation();
      setBodyMargin(0);
      onDismiss?.();
    },
    [onDismiss]
  );

  const DismissButton = useMemo(() => {
    return (
      onDismiss && (
        <div className="order-2 flex-shrink-0 ml-3">
          <button
            className="flex p-2 rounded-md hover:bg-black focus:outline-none focus:ring-2"
            role="button"
            aria-label="Dismiss"
            style={{
              // @ts-ignore TODO: is there a better way?!
              '--tw-ring-color': styles.textColor,
              '--tw-bg-opacity': 0.2,
            }}
            onClick={handleDismiss}
          >
            <span className="sr-only">Dismiss</span>
            <Close
              className="w-4 h-4"
              style={{ fill: styles.textColor, stroke: styles.textColor }}
            />
          </button>
        </div>
      )
    );
  }, [onDismiss, styles.textColor]);

  /**
   * This updates the banner size whenever the reference
   * or the display type changes.
   */
  useLayoutEffect(() => {
    if (ref.current) {
      const { height } = ref.current.getBoundingClientRect();
      setBannerHeight(height);
    }
  }, [ref.current, display]);

  /**
   * This updates the body margin whenever the banner height
   * or the placement changes.
   */
  useEffect(() => {
    setBodyMargin(bannerHeight);
    return () => setBodyMargin(0);
  }, [placement, bannerHeight, containerEl, display]);

  return (
    <>
      {display === BannerTypeEnum.floating ? (
        <div
          ref={ref}
          className={cx(
            'fixed',
            'overflow-hidden',
            'w-11/12',
            'max-w-screen-md',
            'my-2',
            'transition-opacity',
            `duration-${ANNOUNCEMENT_ANIMATION_TIME_TAKEN}`,
            {
              'top-0': placement === BannerPosition.top,
              'bottom-0': placement === BannerPosition.bottom,
              'shadow-xl': styles.shadow === AnnouncementShadow.standard,
              'opacity-0': !isOpen,
              'opacity-100': isOpen,
              hidden: !isOpen,
            }
          )}
          role="dialog"
          aria-modal="true"
          style={{
            zIndex,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: styles.bgColor,
            borderRadius: px(styles.borderRadius),
          }}
        >
          <div
            className={cx('flex items-start justify-between flex-wrap', {
              'p-4': styles.padding === BannerPadding.small,
              'p-6': styles.padding === BannerPadding.medium,
              'p-8': styles.padding === BannerPadding.large,
            })}
          >
            {children}
            {DismissButton}
          </div>
        </div>
      ) : (
        <div
          ref={ref}
          className={cx(
            'flex',
            'fixed',
            'overflow-hidden',
            'w-full',
            'justify-center',
            'transition-opacity',
            'duration-500',
            {
              'top-0': placement === BannerPosition.top,
              'bottom-0': placement === BannerPosition.bottom,
              'opacity-0': !isOpen,
              'opacity-100': isOpen,
              hidden: !isOpen,
            }
          )}
          role="dialog"
          aria-modal="true"
          style={{
            zIndex,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: styles.bgColor,
          }}
        >
          <div
            className={cx(
              'w-11/12 max-w-screen-lg flex items-start justify-between flex-wrap',
              {
                'p-4': styles.padding === BannerPadding.small,
                'p-6': styles.padding === BannerPadding.medium,
                'p-8': styles.padding === BannerPadding.large,
              }
            )}
          >
            {children}
            {DismissButton}
          </div>
        </div>
      )}
    </>
  );
};

export default Banner;
