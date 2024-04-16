import React from 'react';
import {
  TaggedElement,
  TaggedElementEntityId,
} from 'bento-common/types/globalShoyuState';
import composeComponent from 'bento-common/hocs/composeComponent';
import withLocation, {
  WithLocationPassedProps,
} from 'bento-common/hocs/withLocation';
import { isPreviewContent } from 'bento-common/utils/previews';

import { WebComponentProps } from './components/CommonComponentProviders';
import { taggedElementSelector } from './stores/mainStore/helpers/selectors';
import withMainStoreData from './stores/mainStore/withMainStore';
import { tagsAllowedToShowSelector } from './stores/airTrafficStore/helpers/selectors';
import withAirTrafficState from './stores/airTrafficStore/withAirTrafficState';
import BentoVisualTagElement from './BentoVisualTagElement';

type OuterProps = WebComponentProps;

type BeforeAirTrafficStoreDataProps = OuterProps & WithLocationPassedProps;

type AirTrafficStoreDataProps = {
  tagsAllowedToShow: TaggedElementEntityId[];
};

type BeforeMainDataStoreProps = BeforeAirTrafficStoreDataProps &
  AirTrafficStoreDataProps;

type MainStoreData = { tags: TaggedElement[] };

type ComposedProps = BeforeMainDataStoreProps & MainStoreData;

const BentoContextElement: React.FC<ComposedProps> = ({
  uipreviewid,
  tags,
}) => {
  /** @todo check whether logic removed can be a breaking change (i.e. sanitizeAttributesForPreview) */
  return (
    <>
      {tags.map((tag) => (
        <BentoVisualTagElement
          key={tag.entityId}
          id={tag.entityId}
          uipreviewid={uipreviewid}
        />
      ))}
    </>
  );
};

export default composeComponent<OuterProps>([
  withLocation,
  withAirTrafficState<BeforeAirTrafficStoreDataProps, AirTrafficStoreDataProps>(
    (state) => ({
      tagsAllowedToShow: tagsAllowedToShowSelector(state),
    })
  ),
  withMainStoreData<BeforeMainDataStoreProps, MainStoreData>(
    (state, { tagsAllowedToShow, uipreviewid }): MainStoreData => {
      /**
       * If `uipreviewid` is set, we can safely assume we're in a preview session and therefore
       * should only show preview tags, and vice-versa.
       */
      const isPreview = !!uipreviewid;

      const tags = tagsAllowedToShow.reduce<TaggedElement[]>((acc, teId) => {
        const tag = taggedElementSelector(teId, state);
        /**
         * Filter out tags that either do not exist or its `isPreview` flag
         * does not match the inferred preview state.
         */
        if (tag && isPreviewContent<TaggedElement>(tag) === isPreview)
          acc.push(tag);
        return acc;
      }, []);

      return { tags };
    }
  ),
])(BentoContextElement);
