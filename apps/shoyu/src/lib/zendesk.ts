import { zendeskPreviewFlag } from 'bento-common/data/helpers';
import { debugMessage } from 'bento-common/utils/debugging';
import sessionStore from '../stores/sessionStore';
import sidebarStore from '../stores/sidebarStore';
import catchException from './catchException';

const maxAttempts = 10;

enum WidgetVersion {
  classic = 'classic',
  messenger = 'messenger',
}

enum WidgetSelector {
  webWidget = 'webWidget',
  messenger = 'messenger',
}

let widget: WidgetSelector;

const w = window as typeof window & {
  zE?: ((
    selector: WidgetSelector | 'webWidget:on' | 'messenger:on',
    action: string,
    callback?: () => void
  ) => void) & {
    widget: WidgetVersion;
  };
};

/** Test for zE widget on the window */
export const hasZendeskChat = (isPreview: boolean | undefined): boolean =>
  !!w.zE || !!(isPreview && zendeskPreviewFlag.get());

const isZendeskChatEnabled = (): boolean => {
  return !!sessionStore.getState().uiSettings?.zendeskChatEnabled;
};

/** Returns true if the widget was succesfully set. */
const setWidget = (): boolean => {
  if (!w.zE?.widget || !isZendeskChatEnabled()) return false;

  switch (w.zE.widget) {
    case WidgetVersion.classic:
      widget = WidgetSelector.webWidget;
      return true;

    case WidgetVersion.messenger:
      widget = WidgetSelector.messenger;
      return true;

    default:
      debugMessage(`[BENTO] Widget ${w.zE.widget} not implemented.`);
      return false;
  }
};

/**
 * Control the Zendesk widgets if available
 *
 * We will need to manage the widget's overall show/hide state to make sure their toggle doesn't conflict
 *   with ours.
 * @docs https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/web/messaging-show-web-widget/
 */

/** To open the chat widget */
export const openZendesk = () => {
  try {
    if (!setWidget()) return;

    w.zE!(widget, 'show');
    w.zE!(widget, 'open');
  } catch (e) {
    catchException(e as Error, 'openZendesk');
  }
};

/** To close the chat widget */
export const closeZendesk = () => {
  try {
    if (!setWidget()) return;

    w.zE!(widget, 'close');
    w.zE!(widget, 'hide');
  } catch (e: any) {
    catchException(e, 'closeZendesk');
  }
};

export const resetZendesk = () => {
  if (!w.zE || !setWidget()) return;

  w.zE(widget, 'show');
  w.zE(`${widget}:on`, 'close', () => {});
};

/** To add appropriate listeners */
export const setupZendesk = (attempts = 0) => {
  if (!isZendeskChatEnabled()) {
    debugMessage('[BENTO] Zendesk chat is not enabled.');
    return;
  } else if (attempts === maxAttempts) {
    debugMessage('[BENTO] Max setup attempts reached for Zendesk widget.');
    return;
  }

  /**
   * Note: Widget might not be available at the time
   * of the setup. Slightly delay initialization if needed
   * to prevent the sidebar toggle from remaininig fully
   * hidden due to listeners not being attached.
   */
  const delay = attempts === 0 ? 0 : 500;

  setTimeout(() => {
    try {
      if (!setWidget()) {
        setupZendesk(attempts + 1);
        return;
      }

      /* Technically an external source (Zendesk) attempting to control Bento */
      const openSidebar = () => {
        sidebarStore.getState().setHiddenViaZendesk(false);
        document.dispatchEvent(new Event('bento-sidebarOpen'));
      };

      w.zE!(widget, 'hide');
      /* Keep ZD hidden */
      w.zE!(`${widget}:on`, 'close', () => {
        w.zE?.(widget, 'hide');
        /* Async required to prevent "should not already be working" error */
        setTimeout(openSidebar, 0);
      });
    } catch (e: any) {
      catchException(e, 'setupZendesk');
    }
  }, delay);
};
