import { omit } from 'lodash';
import { AsyncReturnType } from 'bento-common/types';

type ListLoaderMethod = (
  ids: number[]
) => Promise<Array<{ [key: string]: number }>>;

type SingleLoaderMethod = (ids: number[]) => Promise<number[]>;

/**
 * Get a single value from a loader-style helper that returns a list
 * @param statLoader the bulk helper
 * @param primaryId the name of the key to index by
 */
export const createSingleListLoader =
  <T extends ListLoaderMethod>(
    statLoader: T,
    primaryId: keyof AsyncReturnType<T>[number]
  ) =>
  async (id: number) => {
    const allRows = await statLoader([id]);

    return allRows.map((row) => omit(row, primaryId));
  };

/**
 * Get a single value from a loader-style helper that returns a single value (e.g. a count)
 * @param statLoader the bulk helper
 */
export const createSingleLoader =
  <T extends SingleLoaderMethod>(statLoader: T) =>
  async (id: number) => {
    const allRows = await statLoader([id]);

    return allRows[0];
  };
