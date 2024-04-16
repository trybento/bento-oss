import sessionStore from '..';

export function getToken() {
  return sessionStore.getState().token;
}

export function setEnabledFeatureFlags(flags: string[]) {
  sessionStore.getState().setEnabledFeatureFlags(flags);
}

export function getEnabledFeatureFlags() {
  return sessionStore.getState().enabledFeatureFlags;
}

export function autoInjectSidebar(
  containerRef: HTMLElement | null | undefined
) {
  if (!containerRef) return;
  const existingSidebar = document.querySelector('bento-sidebar');
  if (!existingSidebar) {
    const sidebar = document.createElement('bento-sidebar');
    containerRef?.append(sidebar);
  }
}
