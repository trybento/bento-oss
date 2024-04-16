import { WorkingSidebarState } from '../types';

/**
 * @todo investigate why this is being called for other previewIds
 */
export default function transitionsToggled(
  state: WorkingSidebarState,
  id: string,
  enabled: boolean
) {
  const sidebar = state.sidebars[id];
  if (sidebar) {
    sidebar.transitionBetweenViews = enabled;
  }
}
