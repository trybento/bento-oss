import { GuideFormFactor, Theme } from '../types';

/**
 * Allow list that determines the form factors that can have its step groups
 * reused across other guides and form factors.
 */
export const REUSABLE_STEP_GROUP_FORM_FACTORS = [
  GuideFormFactor.legacy,
  GuideFormFactor.inline,
  GuideFormFactor.sidebar,
];

/**
 * Block list that determines the themes that can have its step groups
 * reused across other guides and form factors.
 */
export const NON_REUSABLE_STEP_GROUP_THEMES = [Theme.card, Theme.videoGallery];
