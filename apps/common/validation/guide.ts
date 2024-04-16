import { CtaInput, StepCtaType } from '../types';

/**
 * Checks whether all CTAs of a given Step of a Flow-type guide are compliant,
 * which means we won't allow a Link-type CTA that marks the step as completed but
 * takes the user to a URL different than the next Step, since that would break the flow.
 *
 * WARNING: This is exclusive for Flow-type guides, so you need to conditionally use it.
 */
export const areFlowCtasCompliant = (
  /**
   * List of ctas for the current Step, or inputs in case not yet persisted.
   */
  currentStepCtas: CtaInput[],
  /**
   * The URL of the next Step of the Flow, where the user should be taken to.
   * WARNING: If a wildcardUrl is available, make sure you provide that.
   */
  nextStepUrl?: string
): boolean => {
  if (!nextStepUrl || !currentStepCtas.length) return true;

  const conflictingCta = currentStepCtas.find(
    (cta) =>
      cta?.type === StepCtaType.urlComplete && !cta?.settings?.opensInNewTab
  );

  return (
    !conflictingCta || !conflictingCta.url || conflictingCta.url === nextStepUrl
  );
};
