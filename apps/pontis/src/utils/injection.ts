import { logMessage } from './debug';

/**
 * List of URLs in which injecting the Bento script should be blocked at all times,
 * even though we should do our best to detect whether the script is present
 * on the target page.
 */
const blockUrls = [
  'chrome://',
  // Payday
  'https://payday-8bn26g-b87se.herokuapp.com',
  'https://bento-payday-staging.herokuapp.com',
  // Miso
  'https://everboarding.trybento.co',
  'https://staging-everboarding.trybento.co',
  // AcmeCo Demo
  'https://demo.trybento.co/',
  'https://staging-demo.trybento.co/',
];

export function canEnable(tab: chrome.tabs.Tab) {
  return !(
    blockUrls.some((blocked) => tab.url?.startsWith(blocked)) || !tab.id
  );
}

export function addScript(script: HTMLScriptElement) {
  const target =
    document.head ||
    document.getElementsByTagName('head')[0] ||
    document.documentElement;

  if (!target) {
    throw new Error('Failed to add script');
  }

  target.insertBefore(script, target.lastChild);
}

/**
 * Checks whether the current page already has Bento embedded by
 * traversing the DOM looking for a bento-embed.js
 *
 * @returns boolean - true if the page already has Bento embedded
 */
export function pageAlreadyHasBento(embedSrc: string) {
  const scripts = document.querySelectorAll('script');

  for (let i = 0; i < scripts.length; i++) {
    const scriptSrc = scripts[i].src;
    if (scriptSrc === embedSrc) return true;
  }

  return false;
}

export async function canLoadScript(scriptSrc: string) {
  try {
    await fetch(scriptSrc, {
      method: 'HEAD',
      mode: 'no-cors',
    });
    return true;
  } catch (e) {
    return false;
  }
}
