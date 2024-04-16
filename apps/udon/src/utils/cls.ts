import { createNamespace } from 'cls-hooked';

/**
 * Wrap code around runAndReturn call, then call get/set/etc. to
 *   manipulate the context store.
 */
export const clsNamespace = createNamespace('bento-udon-ns');
