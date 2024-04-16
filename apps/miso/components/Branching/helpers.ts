import { GuideDesignType } from 'bento-common/types';
import { AllTemplatesQuery } from 'relay-types/AllTemplatesQuery.graphql';

/**
 * Determines if template is eligible to be a branching destination
 * in allowlist format.
 */
export const isTemplateEligible = (
  template: AllTemplatesQuery['response']['templates'][number]
) => {
  /**
   * Should only allow unarchived templates that are either
   * onboarding guides.
   */
  if (
    // archived templates shouldn't be allowed
    !template?.archivedAt &&
    // other onboarding guides
    template?.designType === GuideDesignType.onboarding
  ) {
    return true;
  }

  return false;
};
