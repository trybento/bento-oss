import { TaggedElementEntityId } from 'bento-common/types/globalShoyuState';
import { INJECTABLES_CONTAINER_ID } from 'bento-common/utils/constants';
import { isNil } from 'bento-common/utils/lodash';

const VTAG_ELEMENT_NAME = 'bento-visual-tag';

export const VTAG_WRAPPER_CLASSNAME = 'visual-tag-wrapper';

/**
 * Returns the highest zIndex found among tag siblings.
 * Returns -1 if no siblings were found.
 */
export const getSiblingTagHighestZIndex = (
  /** Optionally pass an id that you may want to exclude from the search */
  excludedTagId?: TaggedElementEntityId | null
): number => {
  let highestZIndex = -1;
  const injectablesContainer = document.getElementById(
    INJECTABLES_CONTAINER_ID
  );

  if (!injectablesContainer) return highestZIndex;

  Array.from<HTMLElement>(
    injectablesContainer.querySelectorAll(
      `${VTAG_ELEMENT_NAME}${
        excludedTagId ? `:not([id="${excludedTagId}"])` : ''
      }`
    )
  ).forEach((tagSibling) => {
    const tagWrapper: HTMLElement | null | undefined =
      tagSibling.shadowRoot?.querySelector(`.${VTAG_WRAPPER_CLASSNAME}`);
    if (!tagWrapper) return;
    const zIndexStr = window
      .getComputedStyle(tagWrapper)
      .getPropertyValue('z-index');
    if (!isNil(zIndexStr) && Number(zIndexStr) > highestZIndex)
      highestZIndex = Number(zIndexStr);
  });

  return highestZIndex;
};
