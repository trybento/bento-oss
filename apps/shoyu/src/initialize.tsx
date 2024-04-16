import shallow from 'zustand/shallow';
import { BentoUI } from 'bento-common/types/preview';
import { pick } from 'bento-common/utils/lodash';
import {
  Account,
  AccountUser,
  Organization,
} from 'bento-common/types/globalShoyuState';
import { View } from 'bento-common/types/shoyuUIState';

import useSessionStore from './stores/sessionStore/hooks/useSessionStore';

export type UseInitializeReturnType = {
  isPreview?: boolean;
  organization?: Organization;
  uiSettings?: BentoUI;
  sidebarAlwaysExpanded?: boolean;
  sidebarInitiallyExpanded?: boolean;
  view?: View;
};

type SessionData = {
  isPreview?: true;
  account?: Account;
  accountUser?: AccountUser;
  organization?: Organization;
  uiSettings?: BentoUI;
  sidebarAlwaysExpanded?: boolean;
  sidebarInitiallyExpanded?: boolean;
  view?: View;
};

export function useInitialize(uiPreviewId?: string): UseInitializeReturnType {
  const sessionData: SessionData = useSessionStore((state) => {
    const previewSessionData =
      uiPreviewId && state.previewSessions[uiPreviewId];
    if (previewSessionData) {
      return {
        isPreview: true,
        organization: state.organization,
        // @ts-expect-error,
        uiSettings: {
          ...state.uiSettings,
          ...previewSessionData.uiSettings,
        },
        ...pick(previewSessionData, [
          'sidebarAlwaysExpanded',
          'sidebarInitiallyExpanded',
          'view',
        ]),
      } as SessionData;
    }
    return pick(state, [
      'account',
      'accountUser',
      'organization',
      'uiSettings',
    ]);
  }, shallow);

  if (!sessionData.organization) return {};

  return sessionData;
}
