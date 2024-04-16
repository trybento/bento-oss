import { v1 as uuidv1 } from 'uuid';

import {
  FullGuide,
  GuideEntityId,
  ModuleEntityId,
  Step,
  StepEntityId,
} from '../types/globalShoyuState';

/**
 * Creates associations between guides, modules and steps (i.e. next module)
 * and computes order indexes and other linked data.
 */
export function transformedFullGuideAssociations(
  guide: Omit<FullGuide, 'steps'> & { steps?: Step[] },
  refreshEntityIds = false
): FullGuide {
  const steps: Step[] = [];
  let accStepOrderIndex = 0;

  if (refreshEntityIds) {
    guide.entityId = uuidv1() as GuideEntityId;
    guide.modules.forEach((module) => {
      module.entityId = uuidv1() as ModuleEntityId;
      module.steps.forEach((step) => {
        step.entityId = uuidv1() as StepEntityId;
      });
    });
  }

  guide.modules = guide.modules.map((module, moduleIndex) => {
    const previousModule = guide.modules[moduleIndex - 1];
    const nextModule = guide.modules[moduleIndex + 1];

    module.previousModule = previousModule?.entityId;
    module.nextModule = nextModule?.entityId;
    module.guide = guide.entityId;

    module.steps = module.steps.map((step, stepIndex) => {
      const previousStep = module.steps[stepIndex - 1];
      const nextStep = module.steps[stepIndex + 1];

      step.previousStep = previousStep?.entityId;
      step.nextStep = nextStep?.entityId;
      step.orderIndex = accStepOrderIndex;
      step.module = module.entityId;
      step.guide = guide.entityId;
      steps.push(step);

      accStepOrderIndex++;
      return step;
    });

    return module;
  });

  guide.totalSteps = steps.length;
  guide.steps = steps;

  if (refreshEntityIds && guide?.firstIncompleteStep) {
    guide.firstIncompleteStep = guide.steps.find(
      (step) => !step.isComplete
    )?.entityId;
  }

  return guide as FullGuide;
}

/** Values used for previews. */
export const mockedTooltipValues = {
  x: 443,
  y: 92,
};

export const isPreviewContent = <T extends { isPreview?: boolean } | undefined>(
  objectWithIsPreview: T
) => {
  return !!objectWithIsPreview?.isPreview;
};
