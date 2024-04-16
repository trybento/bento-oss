import React, { useEffect } from 'react';

import {
  Guide,
  TaggedElement,
  TaggedElementEntityId,
} from 'bento-common/types/globalShoyuState';
import { BentoUI } from 'bento-common/types/preview';
import { getEmbedFormFactorForContextualTagGuide } from 'bento-common/data/helpers';
import composeComponent from 'bento-common/hocs/composeComponent';

import ErrorBoundary from './components/ErrorBoundary';
import CustomUIProvider from './providers/CustomUIProvider';
import WithGraphQL from './hocs/withGraphQL';
import { useInitialize } from './initialize';
import getFeatureFlags from './lib/featureFlags';
import ContextualTagProvider from './providers/ContextualTagProvider';
import ContextStep from './components/Contextual/ContextStep';
import {
  guideSelector,
  taggedElementSelector,
} from './stores/mainStore/helpers/selectors';
import guideChangedSubscriber from './stores/mainStore/subscribers/guideChanged';
import SidebarProvider from './providers/SidebarProvider';
import withMainStoreData from './stores/mainStore/withMainStore';
import FormFactorProvider from './providers/FormFactorProvider';

type OuterProps = {
  /**
   * The entity ID of the tagged element to render.
   */
  id: TaggedElementEntityId;
  uipreviewid?: string;
};

type BeforeMainStoreDataProps = OuterProps;

type MainStoreData = {
  taggedElement: TaggedElement | undefined;
  guide: Guide | undefined;
};

type ComposedProps = BeforeMainStoreDataProps & MainStoreData;

const BentoVisualTagElement: React.FC<ComposedProps> = ({
  uipreviewid: uiPreviewId,
  guide,
  taggedElement,
}) => {
  const { organization, uiSettings } = useInitialize(uiPreviewId);
  const featureFlags = getFeatureFlags(uiPreviewId);
  const formFactor = getEmbedFormFactorForContextualTagGuide(
    guide,
    uiPreviewId
  );

  /**
   * Subscribe to guide changes to receive updates within the store
   * and give BentoContextElement the chance to filter out tagged elements
   * that are no longer available, therefore triggering this component
   * to unmount.
   */
  useEffect(() => {
    let unsubscribe: () => void;
    if (!taggedElement?.isPreview) {
      unsubscribe = guideChangedSubscriber(taggedElement?.guide);
    }
    return () => unsubscribe?.();
  }, [taggedElement?.guide]);

  if (!organization || !taggedElement) return null;

  return (
    // @ts-ignore
    <ErrorBoundary>
      <FormFactorProvider formFactor={formFactor}>
        <CustomUIProvider
          ui={uiSettings as BentoUI}
          featureFlags={featureFlags}
        >
          <SidebarProvider>
            <ContextualTagProvider taggedElement={taggedElement}>
              <ContextStep />
            </ContextualTagProvider>
          </SidebarProvider>
        </CustomUIProvider>
      </FormFactorProvider>
    </ErrorBoundary>
  );
};

export default composeComponent<OuterProps>([
  WithGraphQL,
  withMainStoreData<BeforeMainStoreDataProps, MainStoreData>(
    (state, { id }): MainStoreData => {
      const taggedElement = taggedElementSelector(id, state);
      return {
        taggedElement: taggedElementSelector(id, state),
        guide: guideSelector(taggedElement?.guide, state),
      };
    }
  ),
])(BentoVisualTagElement);
