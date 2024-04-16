import { WorkingSidebarState } from '../types';
export default function sidebarStateCreated(
  state: WorkingSidebarState,
  id: string,
  isPreview?: boolean
) {
  state.sidebars[id] = {
    open: false,
    isPreview: !!isPreview,
    transitionBetweenViews: false,
    shouldAutoOpen: false,
    toggledOffAtLeastOnce: false,
  };
}
