/// <reference types="@types/chrome" />

import { BentoInstance, BentoSettings } from 'bento-common/types';

declare global {
  interface Window {
    /**
     * The Bento instance, which is added to the window object by the Bento script.
     */
    Bento?: BentoInstance;
    /**
     * Which bentoSettings to initialize Bento with.
     */
    bentoSettings?: BentoSettings;
    /**
     * Similar to setting debugBento in localStorage, this makes Bento output debug messages.
     *
     * @see https://docs.trybento.co/docs/guides/troubleshooting#debug-messages
     */
    debugBento?: boolean;
  }
}
