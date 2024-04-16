import {
  Attribute,
  VisualBuilderSessionState,
  VisualBuilderSessionType,
  WysiwygEditorMode,
  WysiwygEditorState,
} from 'bento-common/types';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Session } from '~types';

interface SessionProviderContext<D = unknown> {
  accessToken: string;
  progressData: WysiwygEditorState<D>;
  setProgressData: React.Dispatch<React.SetStateAction<WysiwygEditorState<D>>>;
  previewData: any;
  setPreviewData: (previewData: any) => void;
  featureFlagEnabled: (featureFlag: string) => boolean;
  enabledFeatureFlags: string[];
  closeEditor: (completed: boolean) => Promise<void>;
  uiSettings: Session['uiSettings'];
  organizationDomain: Session['organizationDomain'];
  attributes: Attribute[];
  type: VisualBuilderSessionType;
  returnMode: WysiwygEditorMode | undefined;
  setReturnMode: React.Dispatch<
    React.SetStateAction<WysiwygEditorMode | undefined>
  >;
  changeMode: (newMode: WysiwygEditorMode) => void;
}

const VisualBuilderSessionContext = createContext<SessionProviderContext>(null);

export function useSession<D = unknown>() {
  const context = useContext(
    VisualBuilderSessionContext,
  ) as SessionProviderContext<D>;

  return context;
}

const VisualBuilderSessionProvider: React.FC<{
  session: Session;
  children: React.ReactNode;
}> = ({ session, children }) => {
  const [progressData, setProgressData] = useState<WysiwygEditorState<unknown>>(
    session.visualBuilderSession.progressData,
  );

  const [previewData, setPreviewData] = useState(
    session.visualBuilderSession.previewData,
  );

  const [returnMode, setReturnMode] = useState<WysiwygEditorMode>();

  const changeMode = useCallback(
    (newMode: WysiwygEditorMode) => {
      if (progressData.modes.includes(newMode)) {
        setProgressData((prev) => {
          return {
            ...prev,
            mode: newMode,
          };
        });
      }
    },
    [progressData.modes],
  );

  const saveProgress = useCallback(() => {
    const redirectTo = progressData.redirectTo;

    if (redirectTo !== undefined) {
      progressData.redirectTo = undefined;
    }

    chrome.runtime.sendMessage({
      action: 'saveSession',
      payload: {
        immediate: !!redirectTo,
        progressData,
        previewData,
      },
    });

    if (redirectTo) {
      window.location.href = redirectTo;
    }
  }, [progressData, previewData]);

  const closeEditor = useCallback(
    async (complete: boolean) => {
      await chrome.runtime.sendMessage({
        action: 'closeSession',
        payload: {
          progressData,
          state: complete
            ? VisualBuilderSessionState.Complete
            : VisualBuilderSessionState.Cancelled,
        },
      });
    },
    [progressData],
  );

  useEffect(() => {
    saveProgress();
  }, [progressData, previewData]);

  const featureFlagEnabled = useCallback(
    (featureFlag: string) =>
      (session.enabledFeatureFlags || []).includes(featureFlag),
    [session.enabledFeatureFlags],
  );

  return (
    <VisualBuilderSessionContext.Provider
      value={{
        accessToken: session.accessToken,
        progressData,
        setProgressData,
        previewData,
        setPreviewData,
        enabledFeatureFlags: session.enabledFeatureFlags,
        featureFlagEnabled,
        closeEditor,
        uiSettings: session.uiSettings,
        organizationDomain: session.organizationDomain,
        type: session.visualBuilderSession.type,
        attributes: session.attributes as unknown as Attribute[],
        returnMode,
        setReturnMode,
        changeMode,
      }}>
      {children}
    </VisualBuilderSessionContext.Provider>
  );
};

export default VisualBuilderSessionProvider;
