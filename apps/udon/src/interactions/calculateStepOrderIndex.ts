import { Step } from 'src/data/models/Step.model';

/**
 * Calculates the Step orderIndex relative to the Guide,
 * meaning it takes into account all previous modules and steps.
 *
 * orderIndex starts on 0 (zero).
 */
export function calculateStepOrderIndex(
  /** The step for which you wanna find the orderIndex */
  targetStep: Step,
  /** All the steps of the related guide including the targetStep */
  steps: Step[]
): number {
  const orderIndex = steps.findIndex((s) => s.id === targetStep.id);

  if (orderIndex === -1) {
    throw new Error('Step not found');
  }

  return orderIndex;
}
