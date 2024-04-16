type GenericObject = Record<string, unknown>;

/**
 * Add the values from an object to another.
 * Mutates the original object.
 * @param original Object to patch.
 * @param source Object with values to add to original.
 */
export function patchObject(original: GenericObject, source: GenericObject) {
  if (typeof original !== 'object' || typeof source !== 'object') return;
  Object.entries(source).forEach(([k, v]) => {
    original[k] = v;
  });
}

/**
 * Get a list of all the primitive values under a certain key in an obj
 */
export function crawlForKey<T>(obj: any, key: string, results: T[] = []): T[] {
  if (Array.isArray(obj)) {
    obj.forEach((el) => crawlForKey(el, key, results));
  } else if (typeof obj === 'object') {
    Object.keys(obj).forEach((objKey) => {
      const val = obj[objKey];

      if (typeof val === 'object') {
        /* non-primitive */
        crawlForKey(val, key, results);
        /** if an array of primitives, let's not handle that for now */
      } else {
        /* primitive */
        if (objKey === key) results.push(obj[objKey]);
      }
    });
  }

  /* Someone called this method on a primitive. bad */
  return results;
}
