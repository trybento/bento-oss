import { keyBy } from 'lodash';
import { RankableType } from 'bento-common/types';
import { PRIORITY_RANK_MODIFIER } from 'bento-common/utils/constants';

import { logger } from 'src/utils/logger';

export type RankableObject = {
  /** Which rankable object id */
  id: number;
  /** Which rankable object type */
  type: RankableType;
  /**
   * Priority ranking
   * NOTE: When set `DEFAULT_PRIORITY_RANKING` it means it was manually launched.
   **/
  rank: number;
  /**
   * Moment when this guide was auto/manually-launched
   * @deprecated we no longer consider this
   */
  launchedAt: Date;
  /** The guide from which this guide was originated in case of branching */
  branchedFrom?: RankableObject['id'];
};

export type RankableObjectWith<T> = RankableObject & { instance: T };

/**
 * Guides/NPS surveys should always be in the order they were launched to the user,
 * with the exception of branching destination guides, which should always come immediately
 * after the guide from which they were originated.
 *
 * If 2 guides have the same launched at time, it means they were launched in the same batch,
 * therefore the priority ranking number is used to offset from the time (highest priority number
 * should be first).
 *
 * Add a higher value to place it later, so for branching destination 1 should be minimum
 *
 * NOTE: This might break the case of account-level guides branched from user-level guides.
 */
const computeSortValue = (
  object: RankableObject,
  objectsById: Record<string, RankableObject>
): number => {
  // if object was branched from another object, place it right after it
  if (!!object.branchedFrom) {
    const root = objectsById[`${object.type}:${object.branchedFrom}`];
    if (!root) {
      logger.debug(
        'Failed to compute sort value of branching guide due to missing root',
        { root: `${object.type}:${object.branchedFrom}` }
      );
      return -1;
    }
    return computeSortValue(root, objectsById) + 1;
  }

  return object.rank * PRIORITY_RANK_MODIFIER;
};

/**
 * Sorts a collection of "rankable" objects in the context of the end-user based on each object's
 * priority ranking settings as well as manually launch information.
 *
 * WARNING: This was meant to be used exclusively within the end-user context.
 *
 * Please note that:
 *
 * - Results are sorted in ASCENDING order
 * - Branching guides should come right AFTER the guide from which they were originated
 * - Guides can be auto-launched (w/ priority ranking) or manually launched (defauls to DEFAULT_PRIORITY_RANKING)
 * - Surveys can't be manually launched therefore will always have a priority ranking set
 */
export default function sortAvailableObjects<T extends object = any>(
  objects: RankableObjectWith<T>[]
): typeof objects {
  const objectsById = keyBy(objects, (o) => `${o.type}:${o.id}`);

  return objects.sort((a, b) => {
    return computeSortValue(a, objectsById) - computeSortValue(b, objectsById);
  });
}
