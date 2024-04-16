import { StepType } from 'bento-common/types';

export const isBranchingStep = (stepType?: StepType | null) =>
  stepType === StepType.branching || stepType === StepType.branchingOptional;
