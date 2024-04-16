import {
  getAllowedStepCtaTypes,
  getDefaultCtaSetting,
  getDefaultStyleForCtaType,
  getDefaultTextForCtaType,
  getMaxStepCtaCount,
  isNavigationCta,
} from 'bento-common/data/helpers';
import {
  BranchingEntityType,
  CtaInput,
  GuideFormFactor,
  StepCtaType,
  StepType,
  Theme,
} from 'bento-common/types';

export const createCtaWithDefaults = (
  type: StepCtaType | undefined,
  formFactor: GuideFormFactor,
  stepType: StepType
): CtaInput | undefined => {
  if (!type) return undefined;

  const defaultStyle = getDefaultStyleForCtaType({
    type,
    guideFormFactor: formFactor,
  });

  const defaultText = getDefaultTextForCtaType({
    type,
    stepType,
    guideFormFactor: formFactor,
  });

  const defaultSettings = getDefaultCtaSetting(formFactor);

  return {
    type,
    style: defaultStyle,
    text: defaultText,
    settings: defaultSettings,
    url: null,
    destinationGuide: undefined,
  };
};

/**
 * Filters out blocklisted CTA types
 */
export const filterBlocklistedCtaTypes =
  (blocklist: StepCtaType[] = []) =>
  (type: StepCtaType): boolean => {
    return !blocklist.includes(type);
  };

export const computeCtaAllowance = ({
  stepType,
  branchingMultiple,
  branchingType,
  formFactor,
  theme,
  existingCtas = [],
  blocklist = [],
}: {
  stepType: StepType;
  branchingMultiple: boolean;
  branchingType: BranchingEntityType;
  formFactor: GuideFormFactor;
  theme: Theme;
  existingCtas?: CtaInput[];
  blocklist?: StepCtaType[];
}) => {
  const allowedCtaTypes = getAllowedStepCtaTypes({
    stepType,
    branchingMultiple,
    branchingType,
    guideFormFactor: formFactor,
    theme,
  }).filter(filterBlocklistedCtaTypes(blocklist));

  const canAdd =
    !!allowedCtaTypes.length &&
    existingCtas.filter(
      // Do not count navigation CTAs for the limit.
      (cta) => ![StepCtaType.back, StepCtaType.next].includes(cta.type)
    ).length <
      getMaxStepCtaCount({ stepType, branchingMultiple, branchingType });

  const forcedCtaTypes = canAdd
    ? []
    : allowedCtaTypes.filter((t) => isNavigationCta(t));

  return {
    canAdd,
    allowedCtaTypes,
    forcedCtaTypes,
  };
};

export const createCtaOptionValue = (input: CtaInput, index: number) => {
  return input.entityId || `new-${index}`;
};
