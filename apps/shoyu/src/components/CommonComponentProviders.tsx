import React, { useEffect } from 'react';
import { EmbedFormFactor } from 'bento-common/types';
import { capitalizeFirstLetter } from 'bento-common/utils/strings';
import {
  InlineEmbed,
  InlineEmbedEntityId,
} from 'bento-common/types/globalShoyuState';
import composeComponent from 'bento-common/hocs/composeComponent';

import ErrorBoundary from './ErrorBoundary';
import CustomUIProvider from '../providers/CustomUIProvider';
import WithGraphQL from '../hocs/withGraphQL';
import { useInitialize } from '../initialize';
import getFeatureFlags from '../lib/featureFlags';
import { BentoUI } from 'bento-common/types/preview';
import FormFactorProvider from '../providers/FormFactorProvider';
import UIStateContextProvider from '../providers/UIStateProvider';
import SidebarProvider from '../providers/SidebarProvider';
import GuideAndStepTransitions from './GuideAndStepTransitions';
import withMainStoreData from '../stores/mainStore/withMainStore';
import { inlineEmbedSelector } from '../stores/mainStore/helpers/selectors';

export type WebComponentProps = {
  uipreviewid?: string;
  embedId?: InlineEmbedEntityId;
};

type Props = WebComponentProps & {
  formFactor: EmbedFormFactor;
  isSideQuest?: boolean;
};

type MainStoreData = {
  inlineEmbed: InlineEmbed | undefined;
};

export const CommonComponentProvidersComponent: React.FC<
  React.PropsWithChildren<Props & MainStoreData>
> = ({
  uipreviewid: uiPreviewId,
  formFactor: ff,
  embedId,
  inlineEmbed,
  children,
}) => {
  useEffect(() => {
    const guideLoadEvent = new Event(
      `bento-on${capitalizeFirstLetter(formFactor)}EmbedLoad`
    );
    document.dispatchEvent(guideLoadEvent);
  }, []);

  const {
    organization,
    uiSettings,
    sidebarAlwaysExpanded,
    sidebarInitiallyExpanded,
    view,
  } = useInitialize(uiPreviewId);

  const formFactor =
    uiPreviewId || (inlineEmbed?.guide ? `${ff}-${embedId}` : ff);

  return organization ? (
    // @ts-ignore
    <ErrorBoundary>
      <FormFactorProvider formFactor={formFactor} forcedView={view}>
        <CustomUIProvider
          ui={uiSettings as BentoUI}
          featureFlags={getFeatureFlags(uiPreviewId)}
        >
          <SidebarProvider
            alwaysExpanded={sidebarAlwaysExpanded}
            initiallyExpanded={sidebarInitiallyExpanded}
          >
            {[EmbedFormFactor.banner, EmbedFormFactor.modal].includes(ff) ? (
              children
            ) : (
              <UIStateContextProvider>
                <GuideAndStepTransitions
                  embedId={embedId as InlineEmbedEntityId}
                >
                  {children}
                </GuideAndStepTransitions>
              </UIStateContextProvider>
            )}
          </SidebarProvider>
        </CustomUIProvider>
      </FormFactorProvider>
    </ErrorBoundary>
  ) : null;
};

export default composeComponent<React.PropsWithChildren<Props>>([
  WithGraphQL,
  withMainStoreData<Props, MainStoreData>((state, { embedId }) => ({
    inlineEmbed: inlineEmbedSelector(state, embedId),
  })),
])(CommonComponentProvidersComponent);
