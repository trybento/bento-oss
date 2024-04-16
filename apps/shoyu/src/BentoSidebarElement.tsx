import React, { useCallback, useEffect } from 'react';
import { EmbedFormFactor } from 'bento-common/types';

import useStealthMode from './hooks/useStealthMode';
import useSessionStore from './stores/sessionStore/hooks/useSessionStore';
import useBlocklistedOnCertainUrls from './hooks/useBlocklistedOnCertainUrls';
import CommonComponentProviders from './components/CommonComponentProviders';
import GuideThemeSelector from './components/GuideThemeSelector';
import BentoBacklinkElement from './BentoBacklinkElement';
import { onSidebarLoaded, onSidebarUnloaded } from './lib/events';
import getFeatureFlags from './lib/featureFlags';

type Props = {
  uipreviewid?: string;
  container?: string;
};

const BentoSidebarElement: React.FC<Props> = ({
  uipreviewid: uiPreviewId,
  container,
}) => {
  const stealthMode = useStealthMode();
  /** Disabled by FF for entire org. */
  const hardDisabled = getFeatureFlags(uiPreviewId).isSidebarDisabled;
  const sidebarBlocklistedUrls = useSessionStore(
    useCallback(
      ({ uiSettings }) => uiSettings?.sidebarBlocklistedUrls || [],
      []
    )
  );
  const hidden = useBlocklistedOnCertainUrls(sidebarBlocklistedUrls);

  const hideElements = stealthMode || hidden || hardDisabled;

  useEffect(() => {
    if (!hideElements) onSidebarLoaded();

    return () => {
      if (!hideElements) onSidebarUnloaded();
    };
  }, [hideElements]);

  if (hideElements) return null;

  return (
    <CommonComponentProviders
      uipreviewid={uiPreviewId}
      formFactor={EmbedFormFactor.sidebar}
    >
      <BentoBacklinkElement />
      <GuideThemeSelector container={container} />
    </CommonComponentProviders>
  );
};

export default BentoSidebarElement;
