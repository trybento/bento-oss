import {
  ClientStorage,
  saveToClientStorage,
} from 'bento-common/utils/clientStorage';
import { SIDEBAR_EXPANDED_PERSISTED_KEY } from '../constants';
import { WorkingSidebarState } from '../types';

/**
 * @todo investigate why this is being called for other previewIds
 */
export default function sidebarToggled(
  state: WorkingSidebarState,
  /** Sidebar id */
  id: string,
  /** New sidebar open state */
  open?: boolean,
  /** Whether to record if the sidebar was toggled off the first time */
  recordToggle = true
) {
  const sidebar = state.sidebars[id];
  if (sidebar) {
    const newOpenValue = open != null ? open : !sidebar.open;
    sidebar.open = newOpenValue;
    // record the sidebar as being told to go off the first time...
    if (recordToggle && !newOpenValue && !sidebar.toggledOffAtLeastOnce) {
      sidebar.toggledOffAtLeastOnce = true;
    }
    if (!sidebar.isPreview) {
      saveToClientStorage(
        ClientStorage.sessionStorage,
        SIDEBAR_EXPANDED_PERSISTED_KEY,
        sidebar.open
      );
    }
  }
}
