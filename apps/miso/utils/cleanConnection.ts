import { cleanArray } from './cleanArray';

/**
 * Clear out all extra properties resulting from a pagination query
 */
export function cleanConnection<T>(connection: { edges: { node: T }[] }): T[] {
  if (!connection) return [];

  return cleanArray(cleanArray(connection.edges).map((e) => e.node));
}
