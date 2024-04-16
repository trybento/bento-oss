import { WorkingSidebarState } from '../types';

export default function sidebarStateRemoved(
  state: WorkingSidebarState,
  id: string
) {
  delete state.sidebars[id];
}
