/**
 * Reloads the current tab
 *
 * @deprecated not currently in use
 */
export async function reloadCurrentTab() {
  const tab = await getCurrentTab();
  if (tab?.id) {
    chrome.tabs.reload(tab.id);
  }
}

/**
 * Finds the current active tab info.
 */
export async function getCurrentTab() {
  const queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await chrome.tabs.query(queryOptions);

  return tab;
}

/**
 * Get the hostname of a tab.
 */
export function getHostnameOfTab(tab: chrome.tabs.Tab) {
  return tab.url ? new URL(tab.url).hostname : undefined;
}
