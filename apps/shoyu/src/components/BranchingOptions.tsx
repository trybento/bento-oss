import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BranchingChoiceKey,
  BranchingData,
  BranchingFormFactor,
  BranchingTargetData,
  Guide,
  GuideEntityId,
  Step,
  StepEntityId,
} from 'bento-common/types/globalShoyuState';
import composeComponent from 'bento-common/hocs/composeComponent';
import { BranchingEntityType, BranchingStyle, Theme } from 'bento-common/types';
import { debugMessage } from 'bento-common/utils/debugging';

import { MainStoreState } from '../stores/mainStore/types';
import withMainStoreData from '../stores/mainStore/withMainStore';
import { branchingAlignment } from '../lib/helpers';
import {
  branchedGuidesOfGuideSelector,
  isBranchingCompletedByCtaSelector,
  selectedGuideForFormFactorSelector,
} from '../stores/mainStore/helpers/selectors';
import {
  isFinishedGuide,
  isFlatTheme,
  isSerialCyoa,
} from 'bento-common/data/helpers';
import BranchingCards from './BranchingCards';
import BranchingDropdown from './BranchingDropdown';
import { FormFactorContextValue } from '../providers/FormFactorProvider';
import withFormFactor from '../hocs/withFormFactor';

type OuterProps = {
  step: Step;
};

type Props = OuterProps &
  Pick<FormFactorContextValue, 'formFactor' | 'renderedFormFactorFlags'>;

type MainStoreData = {
  dispatch: MainStoreState['dispatch'];
  theme: Theme | undefined;
  completedBranchedGuidesCount: number;
  isBranchingCompletedByCta: boolean;
  branchedGuides: Guide[];
};

type BranchingOptionsContainerProps = Props & MainStoreData;

export interface BranchingCommonProps {
  formFactor: string;
  options: BranchingOption[];
  selectedValues: BranchingChoiceKey[];
  question: string;
  onChange: (choiceKeys: BranchingChoiceKey[]) => void;
  onBranchTargetSelected: (targetData: BranchingTargetData) => void;
  showReset: boolean;
  onReset: () => void;
  disabled?: boolean;
  isMulti?: boolean;
}

export type BranchingOption = {
  value: BranchingChoiceKey;
  label: string;
  style: BranchingStyle;
  targetData?: BranchingTargetData;
};

export const getShouldCyoaStepHideContent = (
  stepIsComplete: boolean | undefined,
  isSerialCyoa: boolean | undefined
) => isSerialCyoa && stepIsComplete;

const BranchingOptionsContainer: React.FC<BranchingOptionsContainerProps> = ({
  step,
  formFactor,
  dispatch,
  theme,
  branchedGuides,
  completedBranchedGuidesCount,
  isBranchingCompletedByCta,
  renderedFormFactorFlags: { isInline },
}) => {
  const isFlat = isFlatTheme(theme);

  const alignment = branchingAlignment(step.bodySlate);
  const branching: BranchingData | undefined = step.branching;
  const branches = branching?.branches || [];

  const branchingSerialCyoa = useMemo(
    () => isSerialCyoa(branching?.type, branching?.multiSelect),
    [branching]
  );

  const multiSelectionEnabled = branching?.multiSelect && !branchingSerialCyoa;

  const [selectedValues, setSelectedValues] = useState<BranchingChoiceKey[]>(
    []
  );

  const dropdownKey = useMemo(
    () => `${step.entityId}-${JSON.stringify(selectedValues)}`,
    [step.entityId, selectedValues]
  );

  const isStepContentHidden = getShouldCyoaStepHideContent(
    step.isComplete,
    branchingSerialCyoa
  );

  const handleCardChange = useCallback(
    (choiceKeys: BranchingChoiceKey[]) => {
      const newChoices = branchingSerialCyoa
        ? choiceKeys.reduce((acc: BranchingChoiceKey[], choice) => {
            // Filter already selected choices.
            if (!selectedValues.includes(choice)) {
              acc.push(choice);
            }
            return acc;
          }, [])
        : choiceKeys;

      // Discard action if no new options were selected.
      if (branchingSerialCyoa && !newChoices.length) return;

      setSelectedValues(
        branchingSerialCyoa ? [...newChoices, ...selectedValues] : choiceKeys
      );

      const choiceLabels = branches
        ?.filter((branch) => newChoices.includes(branch.key))
        .map((o) => o.label);

      if (!branching?.key) {
        debugMessage('[BENTO] Keyless branching path selected');
        return;
      }

      dispatch({
        type: 'branchingPathSelected',
        branchingKey: branching!.key,
        choiceLabels,
        choiceKeys: newChoices,
        stepEntityId: step.entityId as StepEntityId,
        updateCompletionOnServer: !isBranchingCompletedByCta,
      });
    },
    [
      step,
      isBranchingCompletedByCta,
      branching,
      selectedValues,
      branchingSerialCyoa,
      multiSelectionEnabled,
    ]
  );

  const handleBranchTargetSelection = useCallback(
    (targetData: BranchingTargetData) => {
      if (targetData.type === BranchingEntityType.Guide) {
        dispatch({
          type: 'guideSelected',
          formFactor,
          guide: targetData.entityId as GuideEntityId,
        });
      }
    },
    [dispatch, formFactor]
  );

  const handleResetDropdown = useCallback(() => {
    dispatch({
      type: 'moduleBranchingReset',
      stepEntityId: step.entityId,
    });
  }, [step, dispatch]);

  const options = useMemo(() => {
    const branchOptions: BranchingOption[] = branches.map((branch) => {
      let branchType: BranchingEntityType | undefined;
      const branchTarget = branchedGuides.find((g) => {
        const guideMatch = g.branchedFromChoice?.choiceKey === branch.key;
        if (guideMatch) branchType = BranchingEntityType.Guide;
        return guideMatch;
      });
      return {
        value: branch.key,
        label: branch.label,
        style: branch.style,
        targetData: {
          entityId: branchTarget?.entityId,
          type: branchType,
          name: branchTarget?.name,
          completedAt: branchTarget?.completedAt,
        },
      };
    });

    // Remove selected options until multi dropdown is adapted
    // to show selections with a better UX.
    if (branchingSerialCyoa && branching && branching.formFactor !== 'cards') {
      return branchOptions.reduce((acc: BranchingOption[], option) => {
        if (!selectedValues.includes(option.value)) {
          acc.push(option);
        }
        return acc;
      }, []);
    }

    return branchOptions;
  }, [
    branches,
    branching,
    branchedGuides,
    selectedValues,
    branchingSerialCyoa,
  ]);

  useEffect(() => {
    const newSelectedValues = branches
      .filter((o) => o.selected)
      .map((o) => o.key);
    // Prevents infinite render loop.
    if (newSelectedValues.length === 0 && selectedValues.length === 0) return;
    setSelectedValues(newSelectedValues);
  }, [branches]);

  const showReset =
    !!selectedValues?.length &&
    !multiSelectionEnabled &&
    !completedBranchedGuidesCount;

  const questionShown = isStepContentHidden
    ? 'Do you want to pick another path?'
    : branching?.question || '';

  const commonProps: BranchingCommonProps = {
    onChange: handleCardChange,
    onBranchTargetSelected: handleBranchTargetSelection,
    formFactor,
    options,
    selectedValues,
    question: questionShown,
    disabled: false,
    onReset: handleResetDropdown,
    showReset,
    isMulti: multiSelectionEnabled,
  };

  return branches.length === 0 ? null : branching?.formFactor ===
    BranchingFormFactor.cards ? (
    <BranchingCards key={step.entityId} {...commonProps} />
  ) : (
    <BranchingDropdown
      key={dropdownKey}
      alignment={alignment}
      fullWidth={isFlat && !isInline}
      theme={theme}
      {...commonProps}
    />
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withMainStoreData<Props, MainStoreData>((state, { formFactor, step }) => ({
    dispatch: state.dispatch,
    theme: selectedGuideForFormFactorSelector(state, formFactor)?.theme,
    completedBranchedGuidesCount: branchedGuidesOfGuideSelector(
      state,
      formFactor,
      step.guide
    ).filter((g) => isFinishedGuide(g)).length,
    isBranchingCompletedByCta: isBranchingCompletedByCtaSelector(
      state,
      step?.entityId
    ),
    branchedGuides: branchedGuidesOfGuideSelector(
      state,
      formFactor,
      step.guide
    ),
  })),
])(BranchingOptionsContainer);
