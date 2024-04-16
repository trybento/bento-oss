import VisualBuilderLoadingModal, {
  VisualBuilderLoadingModalState,
} from 'components/WysiwygEditor/VisualBuilderLoadingModal';
import React, { createContext, useCallback, useContext, useState } from 'react';
import * as CreateVisualBuilderSessionMutation from 'mutations/CreateVisualBuilderSession';
import VisualBuilderSessionQuery from 'queries/VisualBuilderSessionQuery';
import {
  VisualBuilderSessionState,
  VisualBuilderSessionType,
} from 'bento-common/types';
import { WYSIWYG_CHROME_EXTENSION_ID } from 'utils/constants';
import { launchVisualBuilderSession as _launchVisualBuilderSession } from 'bento-common/features/wysiwyg/messaging';
import env from '@beam-australia/react-env';

interface Context {
  loadingState: VisualBuilderLoadingModalState | undefined;
  setLoadingState: React.Dispatch<
    React.SetStateAction<VisualBuilderLoadingModalState | undefined>
  >;
}

const VisualBuilderContext = createContext<Context>(null);

export const useVisualBuilder = () => {
  const { loadingState, setLoadingState } = useContext(VisualBuilderContext);

  const launchVisualBuilderSession = useCallback(
    async ({
      type,
      initialData,
      baseUrl,
    }: {
      type: VisualBuilderSessionType;
      initialData: any;
      baseUrl: string;
    }) => {
      // If there is another active session, do nothing
      if (loadingState) {
        return;
      }

      try {
        setLoadingState(VisualBuilderLoadingModalState.Launching);

        const {
          createVisualBuilderSession: {
            visualBuilderSession: { entityId },
            accessToken,
            appId,
          },
        } = await CreateVisualBuilderSessionMutation.commit({
          type,
          initialData,
        });

        setLoadingState(VisualBuilderLoadingModalState.InProgress);

        await _launchVisualBuilderSession({
          url: `${env('CLIENT_HOST')}${baseUrl}/${entityId}`,
          extensionId: WYSIWYG_CHROME_EXTENSION_ID,
          sessionId: entityId,
          accessToken,
          appId,
        });

        setLoadingState(VisualBuilderLoadingModalState.Closing);

        const { visualBuilderSession } = await VisualBuilderSessionQuery({
          visualBuilderSessionEntityId: entityId,
        });

        if (visualBuilderSession.state === VisualBuilderSessionState.Complete) {
          return visualBuilderSession.progressData;
        }

        return null;
      } finally {
        setLoadingState(undefined);
      }
    },
    [loadingState]
  );

  return { launchVisualBuilderSession };
};

const VisualBuilderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loadingState, setLoadingState] = useState<
    VisualBuilderLoadingModalState | undefined
  >();

  return (
    <VisualBuilderContext.Provider value={{ loadingState, setLoadingState }}>
      {children}
      {loadingState && <VisualBuilderLoadingModal state={loadingState} />}
    </VisualBuilderContext.Provider>
  );
};

export default VisualBuilderProvider;
