import {
  GuideBaseStepAutoCompleteInteraction,
  GuideBaseStepAutoCompleteInteractionModelScopes,
} from 'src/data/models/GuideBaseStepAutoCompleteInteraction.model';

/**
 * Cleanup detached guide base step auto-complete interactions of all Orgs.
 *
 * See {@link GuideBaseStepAutoCompleteInteractionModelScopes.orphan} for more details on what is considered "detached".
 *
 * @returns Promise the number of destroyed rows
 */
export default async function cleanupDetachedGuideBaseAutoCompleteInteractions(): Promise<number> {
  return GuideBaseStepAutoCompleteInteraction.scope(
    GuideBaseStepAutoCompleteInteractionModelScopes.orphan
  ).destroy();
}
