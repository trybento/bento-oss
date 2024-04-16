import React, { forwardRef } from 'react';
import cx from 'classnames';
import BookmarkOutline from '../icons/BookmarkOutline';
import { px } from '../utils/dom';
import {
  FormFactorStateKey,
  StepCTA,
  StepEntityId,
} from '../types/globalShoyuState';
import { parseCtaColors } from '../data/helpers';
import {
  CtasStyle,
  GuideFormFactor,
  StepCtaStyle,
  StepCtaType,
} from '../types';
import useRandomKey from '../hooks/useRandomKey';
import { isBannerGuide } from '../utils/formFactor';

export type CtaComponentProps = {
  formFactor: FormFactorStateKey;
  cta: StepCTA;
  beforeCompletionHandler?: (
    cb: (...args: any[]) => void
  ) => (...a: any[]) => void;
  stepEntityId: StepEntityId | undefined;
  parentColor?: string;
  ctaColors?: ReturnType<typeof parseCtaColors>;
  /** Determine if the CTA should expand to full width. */
  fullWidth?: boolean;
  strong?: boolean;
  ctasStyle: CtasStyle;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading?: boolean;
  /**
   * Determines whether this CTA can mark an already-completed step as incomplete.
   * If not, then we simply ignore the state change if the step is already complete.
   */
  canIncomplete?: boolean;
};

const CtaComponent = forwardRef<HTMLButtonElement, CtaComponentProps>(
  (
    {
      formFactor,
      cta,
      onClick,
      stepEntityId,
      fullWidth,
      strong,
      isLoading,
      ctaColors,
      parentColor,
      ctasStyle,
    },
    ref
  ) => {
    const stepKey = useRandomKey([stepEntityId]);
    const { style, text, type, disabled } = cta || {};
    const isBanner = isBannerGuide(formFactor as GuideFormFactor);
    const isLink = style === StepCtaStyle.link;
    const isOutline = style === StepCtaStyle.outline;
    const isSolid = style === StepCtaStyle.solid;

    const color = isSolid ? ctaColors.color : ctaColors.background;

    return (
      <button
        ref={ref}
        className={cx(
          'bento-step-cta-button',
          'flex',
          'justify-center',
          'align-center',
          'items-center',
          'focus:opacity-30',
          'focus:outline-none',
          'transition',
          'enabled:cursor-pointer',
          {
            'font-semibold': !isLink || strong,
            'text-right': isLink,
            'first:pl-0': isLink && !fullWidth,
            'w-full m-auto': fullWidth,
            border: isOutline,
            underline: isLink && isBanner,
            'opacity-60 cursor-not-allowed': disabled,
            'hover:opacity-80': !disabled,
            'cursor-progress': !disabled && isLoading,
          }
        )}
        style={{
          color,
          background: isSolid
            ? ctaColors.background || parentColor
            : 'transparent',
          borderColor: isOutline
            ? ctaColors.background || 'currentcolor'
            : undefined,
          fontSize: px(ctasStyle.fontSize),
          padding: `${px(ctasStyle.paddingY)} ${px(
            isLink ? 0 : ctasStyle.paddingX
          )}`,
          lineHeight: px(ctasStyle.lineHeight),
          borderRadius: isLink ? undefined : px(ctasStyle.borderRadius),
        }}
        onClick={onClick}
        key={stepKey}
        disabled={disabled || isLoading}
      >
        {type === StepCtaType.save && (
          <BookmarkOutline
            className="mr-2 h-4 my-auto shrink-0"
            style={{ fill: color }}
          />
        )}
        <span>{text}</span>
      </button>
    );
  }
);

export default CtaComponent;
