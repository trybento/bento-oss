import { GlobalStateActionPayloads } from 'bento-common/types/globalShoyuState';
import { taggedElementSelector } from '../helpers/selectors';

import { WorkingState } from '../types';

/**
 * Patches the given tagged element state adding client-side exclusive flags.
 * Useful to determine whether the tag should be forced to open or scroll into view.
 *
 * NOTE: This relies on customers having client-side persistence enabled, otherwise will
 * fail when redirecting users between pages (i.e. after launching destination guides).
 */
export default function taggedElementFlagSet(
  state: WorkingState,
  {
    taggedElementEntityId,
    ...flags
  }: GlobalStateActionPayloads['taggedElementFlagSet']
) {
  const previousTag = taggedElementSelector(taggedElementEntityId, state);

  if (!previousTag) return;

  state.taggedElements[taggedElementEntityId] = {
    ...previousTag,
    ...flags,
  };
}
