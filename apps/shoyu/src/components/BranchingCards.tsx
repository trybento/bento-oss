import React from 'react';

import PreGuideCards from './PreGuideCards';
import { ResetOnboardingComponent } from './ResetOnboarding';
import { BranchingCommonProps } from './BranchingOptions';

type Props = BranchingCommonProps;

const BranchingCards: React.FC<Props> = ({
  onChange,
  onBranchTargetSelected,
  question,
  disabled,
  formFactor,
  options,
  selectedValues,
  isMulti,
  onReset,
  showReset,
}) => {
  return (
    <div className="grid" style={{ animation: 'fadeIn 1s' }}>
      <div className="text-base font-bold mb-5">{question}</div>
      <PreGuideCards
        isMulti={isMulti}
        options={options}
        handleBranchTargetSelection={onBranchTargetSelected}
        handleSelection={onChange}
        selectedOptions={selectedValues!}
        disabled={disabled}
      />
      <ResetOnboardingComponent
        className="mb-3"
        onClick={onReset}
        formFactor={formFactor}
        show={showReset}
      />
    </div>
  );
};

export default BranchingCards;
