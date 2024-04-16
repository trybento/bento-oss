import { WysiwygEditorType } from 'bento-common/types';

export const IS_TEST = process.env.NODE_ENV === 'test';
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_PROD = process.env.NODE_ENV === 'production';

export const SUCCESS_DELAY_MS = 5000;
export const WYDR_ENABLED = process.env.VITE_WYDR_ENABLED === 'true';

// TODO: Move other similar constants here
export const SIDEBAR_Z_INDEX = 2147482999;
export const SIDEBAR_TOGGLE_Z_INDEX = SIDEBAR_Z_INDEX - 1;
export const BANNER_Z_INDEX = SIDEBAR_Z_INDEX + 10;
export const MODAL_Z_INDEX = BANNER_Z_INDEX + 10;

/**
 * Determines the amount of time the sidebar toggle
 * should wait until first render.
 */
export const SIDEBAR_TOGGLE_RENDER_DELAY = 500;

export enum InlineBreakpoint {
  sm = 600,
  md = 900,
  lg = 1200,
}

export enum CYOACardBreakPoint {
  sm = InlineBreakpoint.sm,
  md = 750,
  lg = InlineBreakpoint.lg,
}

/**
 * Max times sockets should try reconnecting
 *   Raw number itself is pretty low, because exponential backoff
 *   will make the time interval larger
 */
export const SOCKET_RECONNECTION_ATTEMPTS = 15;

export const WYSIWYG_TYPES_TO_ROUTE_MAP = {
  [WysiwygEditorType.tagEditor]: 'tag',
  [WysiwygEditorType.autocompleteElementEditor]: 'autocomplete-element',
  [WysiwygEditorType.inlineInjectionEditor]: 'inline-injection',
  [WysiwygEditorType.autoGuideBuilder]: 'auto-guide-builder',
};

export const WYSIWYG_EDITOR_BASE_URL = `${process.env.VITE_PUBLIC_CLIENT_URL_BASE}/embed/wysiwyg-editor/`;

/**
 * Determines the Id of Bento's embed iframe element.
 * This iframe is responsible for handling the WYSIWYG editor.
 */
export const BENTO_IFRAME_ID = 'bentoIframe';

/**
 * The ID for the WYSIWYG editor chrome extension
 * You can find this information in the Chrome Web Store Developer Dashboard:
 * @see https://chrome.google.com/u/1/webstore/devconsole
 */
export const WYSIWYG_CHROME_EXTENSION_ID =
  process.env.VITE_PUBLIC_WYSIWYG_CHROME_EXTENSION_ID!;
