import { WorkingSidebarState } from '../types';

/**
 * @todo investigate why this is being called for other previewIds
 */
export default function sidebarAutoOpenToggled(
  state: WorkingSidebarState,
  id: string,
  autoOpen?: boolean
) {
  const sidebar = state.sidebars[id];
  if (sidebar) {
    sidebar.shouldAutoOpen =
      autoOpen != null ? autoOpen : !sidebar.shouldAutoOpen;
  }
}
