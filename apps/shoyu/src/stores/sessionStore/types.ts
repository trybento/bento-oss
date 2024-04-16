import { WritableDraft } from 'immer/dist/internal';

import {
  Account,
  AccountUser,
  Organization,
} from 'bento-common/types/globalShoyuState';
import { BentoUI, PreviewDataPack } from 'bento-common/types/preview';
import { KbArticle } from 'bento-common/types/integrations';

export type InitializationDataPayload = {
  account?: Account;
  accountUser?: AccountUser;
  organization?: Organization;
  uiSettings?: BentoUI;
};

type SessionStateData = InitializationDataPayload & {
  token?: string;
  enabledFeatureFlags?: string[];
};

export type KbSessionData = {
  query: string;
  results: KbArticle[];
};

export type GlobalSessionState = SessionStateData & {
  previewSessions: {
    [previewId: string]: PreviewDataPack;
  };
  /** Determines if the store has been fully initialized */
  initialized: Date | undefined;
  kbSessionData: KbSessionData | undefined;
};

export type SessionStoreState = GlobalSessionState & {
  hydrateInitializationData: (
    /**
     * Whether to include session data (account, user and org data)
     * @default true
     */
    withSessionData?: boolean
  ) => Promise<void>;
  setSessionData: (
    token: string | undefined,
    enabledFeatureFlags: string[] | null | undefined
  ) => void;
  setPreviewSession: (previewId: string, data: PreviewDataPack) => void;
  removePreviewSession: (previewId: string) => void;
  setKbSessionData: (kbSessionData: KbSessionData) => void;
  removeKbSessionData: () => void;
  setEnabledFeatureFlags: (flags: string[]) => void;
};

export type WorkingSessionState =
  | WritableDraft<SessionStoreState>
  | SessionStoreState;
