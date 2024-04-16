import { debugMessage } from 'bento-common/utils/debugging';
import { closeZendesk, setupZendesk, resetZendesk } from './zendesk';

/**
 * Sends an event to the DOM for integrations to listen to.
 */
const dispatchBentoEvent = (eventName: string) => {
  const bentoLoadEvent = new Event(`bento-${eventName}`);
  document.dispatchEvent(bentoLoadEvent);
};

export function noGuideLoadedEvent() {
  debugMessage('[BENTO] Sending no guides loaded event');
  dispatchBentoEvent('noGuideFound');
}

export function onSidebarLoaded() {
  setupZendesk();
}

export function onSidebarUnloaded() {
  resetZendesk();
}

export function onSidebarOpened() {
  closeZendesk();
}
