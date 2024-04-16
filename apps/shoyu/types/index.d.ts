import { BentoInstance, BentoSettings } from 'bento-common/types';

type SidebarToggledEvent = CustomEvent<{
  isOpen: boolean;
}>;
declare global {
  interface Window {
    Bento?: BentoInstance;
    bentoSettings?: BentoSettings;
  }
  interface DocumentEventMap {
    'bento-sidebarToggled': SidebarToggledEvent;
  }
  interface Error {
    /**
     * The internal error that caused this error, if any
     * @see https://docs.sentry.io/platforms/javascript/configuration/integrations/default/#linkederrors
     */
    cause?: Error;
  }
}
