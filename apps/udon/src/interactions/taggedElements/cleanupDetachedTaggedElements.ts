import { StepTaggedElement } from 'src/data/models/StepTaggedElement.model';

/**
 * Cleanup detached tagged elements of all Orgs.
 * See StepTaggedElement's "inactive" scope for more details on what is considered "detached".
 *
 * @returns Promise the number of destroyed rows
 */
export default async function cleanupDetachedTaggedElements(): Promise<number> {
  return StepTaggedElement.scope(['inactive']).destroy();
}
