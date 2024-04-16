import React, { FC, ReactNode, useCallback, useMemo, useState } from 'react';
import cx from 'classnames';
import ErrorIcon from '../icons/Error';
import { px } from '../utils/dom';
import InputHelper from './InputHelper';
import useElementSize from '../hooks/useElementSize';
import InputLabel from './InputLabel';

const CARD_CONFIG = {
  /** Used for the width and height of each number card */
  sizePx: 50,
  /** Used for spacing out the cards when cardSpacing is set to `gap`, otherwise ignored */
  gap: 12,
};

interface Props {
  name: string;
  defaultValue?: string | number | null;
  onChange?: (value: string) => void;
  label?: string;
  minLabel?: string;
  min: string | number | undefined;
  max: string | number | undefined;
  maxLabel?: string;
  disabled?: boolean;
  isValid?: boolean;
  errorMessage?: string;
  helperText?: ReactNode;
  cardColor: string;
  selectedCardColor: string;
  required?: boolean;
  /**
   * How to space out the cards.
   *
   * @default "gap"
   */
  cardSpacing?: 'gap' | 'space-between';
}

/**
 * Presents a range of numbers within cards to the user.
 *
 * NOTE: This component is currently shared across Guides and NPS Surveys, therefore make sure
 * you've verified the changes in both places.
 */
const NumberCardsInput: FC<Props> = ({
  defaultValue = '',
  onChange,
  label,
  disabled,
  isValid = true,
  minLabel = '',
  min: minArg = 0,
  max: maxArg = 0,
  maxLabel = '',
  cardColor,
  selectedCardColor,
  name,
  errorMessage = '',
  helperText,
  required,
  cardSpacing = 'gap',
}) => {
  const [value, setValue] = useState<string | number | null>(defaultValue);
  const [refElement, setRefElement] = useState<HTMLDivElement | null>(null);
  const showError: boolean = !isValid && !!errorMessage && !disabled;
  const id = `number-cards-field-${name}`;
  const helperId = `text-field-helper-${name}`;

  const { min, max, numbers } = useMemo(() => {
    const result = {
      min: Number.isNaN(Number(minArg)) ? 0 : Number(minArg),
      max: Number.isNaN(Number(maxArg)) ? 0 : Number(maxArg) + 1,
      numbers: [],
    };

    const total = result.max - result.min;
    if (total > 0) {
      for (let i = result.min; i < result.max; i++) {
        result.numbers[result.numbers.length] = i;
      }
    }

    return result;
  }, [minArg, maxArg]);

  const { width: refElementWidth } = useElementSize(refElement, 'throttle');

  const [refElementDesiredWidth, isWrapping] = useMemo(() => {
    let desiredWidth: number;
    switch (cardSpacing) {
      case 'gap':
        desiredWidth =
          numbers.length * CARD_CONFIG.sizePx +
          (numbers.length - 1) * CARD_CONFIG.gap;
        break;

      case 'space-between':
      default:
        desiredWidth = numbers.length * CARD_CONFIG.sizePx;
        break;
    }
    return [desiredWidth, desiredWidth > refElementWidth];
  }, [refElementWidth, numbers.length, cardSpacing]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      const newValue = e.currentTarget.dataset.value;
      onChange?.(newValue);
      setValue(newValue);
    },
    [onChange, disabled]
  );

  if (max <= 1 || max <= min) return null;

  return (
    <div className="bento-input-field-wrapper flex flex-col gap-2 w-full">
      {label && (
        <InputLabel htmlFor={id} required={required}>
          {label}
        </InputLabel>
      )}

      <div className="bento-input-field relative px-px">
        {/* Inner wrapper for numbers and labels */}
        <div
          className={cx('flex flex-col gap-2 max-w-full', {
            'w-fit': cardSpacing === 'gap',
            'w-full justify-between': cardSpacing === 'space-between',
          })}
        >
          {/* Number pills */}
          <div
            ref={setRefElement}
            className={cx('flex flex-row flex-wrap', {
              'justify-between': cardSpacing === 'space-between',
            })}
            style={{
              gap: cardSpacing === 'gap' ? px(CARD_CONFIG.gap) : undefined,
            }}
          >
            {numbers.map((num) => {
              const isSelected =
                value !== '' &&
                value !== null &&
                value !== undefined &&
                Number(value) === num;

              return (
                <div
                  key={`number-card-option-${num}`}
                  className={cx(
                    'bento-input-field-option',
                    'flex',
                    'transition',
                    'font-semibold',
                    'rounded',
                    'select-none',
                    {
                      'cursor-pointer': !disabled,
                      'cursor-not-allowed': disabled,
                      'hover:opacity-80': !isSelected && !disabled,
                    }
                  )}
                  data-value={num}
                  onClick={handleClick}
                  style={{
                    background: isSelected ? selectedCardColor : cardColor,
                    color: isSelected ? 'white' : undefined,
                    height: px(CARD_CONFIG.sizePx),
                    width: px(CARD_CONFIG.sizePx),
                  }}
                >
                  <div className="m-auto">{num}</div>
                </div>
              );
            })}
          </div>

          {/* Labels */}
          {(minLabel || maxLabel) && (
            <div
              className={cx(
                'flex justify-items-start justify-between text-xs max-w-full',
                {
                  'flex flex-col': isWrapping,
                  'flex flex-wrap': !isWrapping,
                }
              )}
              style={{
                width:
                  isWrapping || cardSpacing === 'space-between'
                    ? undefined
                    : px(refElementDesiredWidth),
              }}
            >
              {minLabel && (
                <div className="bento-input-field-min flex py-1 mr-8">
                  {min} = {minLabel}
                </div>
              )}
              {maxLabel && (
                <div
                  className={cx('bento-input-field-max flex py-1', {
                    'ml-auto': !isWrapping && !minLabel,
                  })}
                >
                  {max - 1} = {maxLabel}
                </div>
              )}
            </div>
          )}
        </div>
        {/* Ends wrapper of numbers and labels */}

        {!isValid && (
          <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none text-red-500 pr-1">
            <ErrorIcon style={{ width: '20px' }} />
          </div>
        )}
      </div>

      <InputHelper
        id={helperId}
        showError={showError}
        errorText={errorMessage}
        helperText={helperText}
      />
    </div>
  );
};

export default NumberCardsInput;
