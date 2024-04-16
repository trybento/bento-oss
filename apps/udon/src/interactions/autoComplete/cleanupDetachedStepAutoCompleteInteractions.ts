import {
  StepAutoCompleteInteraction,
  StepAutoCompleteInteractionModelScopes,
} from 'src/data/models/StepAutoCompleteInteraction.model';

/**
 * Cleanup detached step auto-complete interactions of all Orgs.
 *
 * See {@link StepAutoCompleteInteractionModelScopes.orphan} for more details on what is considered "detached".
 *
 * @returns Promise the number of destroyed rows
 */
export default async function cleanupDetachedStepAutoCompleteInteractions(
  /**
   * How many rows to remove at a time.
   * @default 1000
   */
  chunkSize = 1000
): Promise<number> {
  let overallAffectedRows = 0;
  let affectedRows: number;

  while (
    (affectedRows = await StepAutoCompleteInteraction.scope(
      StepAutoCompleteInteractionModelScopes.orphan
    ).destroy({
      limit: chunkSize,
    })) > 0
  ) {
    overallAffectedRows += affectedRows;
  }

  return overallAffectedRows;
}
