import React, { useCallback, useMemo } from 'react';
import cx from 'classnames';
import DefaultSelect from '../system/Select';
import { BranchingChoiceKey } from 'bento-common/types/globalShoyuState';
import { ResetOnboardingComponent } from './ResetOnboarding';
import { BranchingCommonProps, BranchingOption } from './BranchingOptions';
import { getNodeStyle } from '../system/RichTextEditor/SlateContentRenderer/helpers';
import { AlignmentEnum, Theme } from 'bento-common/types';
import { SlateBodyElement } from 'bento-common/types/slate';
import { isCarouselTheme } from 'bento-common/data/helpers';

interface Props extends BranchingCommonProps {
  alignment: AlignmentEnum;
  fullWidth?: boolean;
  theme: Theme | undefined;
}

export const parseDropdownValues = (
  selectedValues: BranchingChoiceKey[] | string[],
  isMulti?: boolean
) =>
  isMulti
    ? selectedValues
    : selectedValues?.[0]
    ? String(selectedValues?.[0])
    : undefined;

const BranchingDropdown: React.FC<Props> = ({
  question,
  disabled,
  formFactor,
  theme,
  options,
  isMulti,
  alignment,
  selectedValues,
  fullWidth,
  onReset,
  onChange,
  showReset,
}) => {
  const isCarousel = isCarouselTheme(theme);
  const { textStyle, dropdownStyle } = useMemo(
    () => ({
      textStyle: getNodeStyle({ type: 'text', alignment } as SlateBodyElement),
      dropdownStyle: getNodeStyle({
        type: 'select',
        alignment,
      } as SlateBodyElement),
    }),
    [alignment]
  );

  const handleMultiSelectChange = useCallback(
    (selection: BranchingOption[]) => onChange(selection.map((s) => s.value)),
    [onChange]
  );

  const handleSingleSelectChange = useCallback(
    (selection: BranchingChoiceKey) => onChange([selection]),
    [onChange]
  );

  return (
    <>
      <div style={textStyle}>{question}</div>
      <div
        className={cx('text-center mt-4 mb-8 justify-center', {
          'mx-auto': !isCarousel,
          'mr-auto': isCarousel,
          // mx-[2px] prevents outline from being
          // cut when overflow is hidden
          'mx-[2px]': fullWidth,
          'w-10/12': !fullWidth,
        })}
        style={dropdownStyle}
      >
        <DefaultSelect
          isMulti={isMulti}
          options={options}
          value={parseDropdownValues(selectedValues, isMulti)}
          // @ts-ignore
          handleChange={
            isMulti ? handleMultiSelectChange : handleSingleSelectChange
          }
          placeholder="Select an option"
          disabled={disabled}
        />
        <ResetOnboardingComponent
          className="mt-1"
          onClick={onReset}
          formFactor={formFactor}
          show={showReset}
        />
      </div>
    </>
  );
};

export default BranchingDropdown;
