import React, { useContext, useCallback, useState, useMemo } from 'react';
import cx from 'classnames';

import {
  BranchingCardStyle,
  CYOABackgroundImagePosition,
  DropdownInputOption,
} from 'bento-common/types';
import {
  BranchingChoiceKey,
  BranchingTargetData,
  Guide,
} from 'bento-common/types/globalShoyuState';
import BranchingCard from 'bento-common/components/BranchingCard';

import { CustomUIContext } from '../providers/CustomUIProvider';
import { CYOACardBreakPoint } from '../lib/constants';
import useResponsiveCards from '../hooks/useResponsiveCards';
import composeComponent from 'bento-common/hocs/composeComponent';
import withFormFactor from '../hocs/withFormFactor';
import { FormFactorContextValue } from '../providers/FormFactorProvider';
import withMainStoreData from '../stores/mainStore/withMainStore';
import { selectedGuideForFormFactorSelector } from '../stores/mainStore/helpers/selectors';
import { getGuideThemeFlags } from 'bento-common/data/helpers';
import { BranchingOption } from './BranchingOptions';

type OuterProps = {
  options: BranchingOption[] | DropdownInputOption[];
  selectedOptions: BranchingChoiceKey[] | string[];
  handleSelection: (s: BranchingChoiceKey[]) => void;
  handleBranchTargetSelection?: (targetData: BranchingTargetData) => void;
  disabled?: boolean;
  isMulti?: boolean;
};

type MainStoreData = {
  guide: Guide | undefined;
};

type Props = OuterProps &
  MainStoreData &
  Pick<
    FormFactorContextValue,
    | 'formFactor'
    | 'embedFormFactor'
    | 'renderedFormFactorFlags'
    | 'renderedFormFactor'
  >;

const PreGuideCards = ({
  isMulti,
  options,
  selectedOptions = [],
  handleSelection,
  handleBranchTargetSelection,
  embedFormFactor,
  renderedFormFactor,
  renderedFormFactorFlags: { isInline },
  disabled = false,
  guide,
}: React.PropsWithChildren<Props>) => {
  const { isCarousel } = getGuideThemeFlags(guide?.theme);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  const hasImages = useMemo(
    () =>
      (options as BranchingOption[]).some(
        (card) =>
          (card.style as BranchingCardStyle)?.backgroundImageUrl &&
          (card.style as BranchingCardStyle)?.backgroundImagePosition !==
            CYOABackgroundImagePosition.background
      ),
    [options]
  );

  const {
    cyoaOptionBackgroundColor,
    isCyoaOptionBackgroundColorDark,
    cyoaTextColor,
  } = useContext(CustomUIContext);

  const updateSelection = useCallback(
    (option: BranchingOption) => {
      if (disabled) return;
      if (isMulti) {
        handleSelection(
          (selectedOptions.includes(option.value)
            ? selectedOptions.filter((o) => o !== option.value)
            : selectedOptions.concat([option.value])) as BranchingChoiceKey[]
        );
      } else {
        if (option.targetData?.entityId && handleBranchTargetSelection) {
          handleBranchTargetSelection(option.targetData);
        } else {
          handleSelection([option.value]);
        }
      }
    },
    [
      selectedOptions,
      isMulti,
      disabled,
      handleBranchTargetSelection,
      handleSelection,
    ]
  );

  const { colsClass, fontSizeClass, minWidth } = useResponsiveCards({
    containerRef,
    formFactor:
      !isInline && isCarousel ? embedFormFactor! : renderedFormFactor!,
    hasImages,
    inlineBreakPoint: CYOACardBreakPoint,
  });

  return (
    <div
      className={cx(
        'grid',
        'mb-4',
        'mr-2',
        'content-start',
        'gap-4',
        colsClass
      )}
      ref={setContainerRef}
    >
      {options.map((option, idx) => {
        const isSelected = selectedOptions.includes(option.value);

        return (
          <BranchingCard
            key={`branching-card-${idx}-${option.value}`}
            backgroundColor={cyoaOptionBackgroundColor}
            choice={{
              key: option.value,
              label: option.label,
              selected: isSelected,
              style: option.style as BranchingCardStyle,
              targetData: option.targetData,
            }}
            disabled={disabled}
            fontSizeClass={fontSizeClass}
            isBackgroundColorDark={isCyoaOptionBackgroundColorDark}
            isInline={isInline}
            maxWidth={CYOACardBreakPoint.sm}
            minWidth={minWidth}
            textColor={cyoaTextColor}
            onClick={() => updateSelection(option)}
          />
        );
      })}
    </div>
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withMainStoreData<Props, MainStoreData>((state, { formFactor }) => {
    return {
      guide: selectedGuideForFormFactorSelector(state, formFactor),
    };
  }),
])(PreGuideCards);
