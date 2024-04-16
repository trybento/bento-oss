import React, { useCallback, useMemo } from 'react';
import {
  GuideEntityId,
  InlineEmbed,
  InlineEmbedEntityId,
} from 'bento-common/types/globalShoyuState';
import useElementsInjector, {
  ElementInjectorCallback,
  ElementInjectorData,
  ElementRemovalCallback,
} from 'bento-common/hooks/useElementInjector';

import { WebComponentProps } from './components/CommonComponentProviders';
import { inlineEmbedsSelector } from './stores/mainStore/helpers/selectors';
import withMainStoreData from './stores/mainStore/withMainStore';
import { InjectionPosition } from 'bento-common/types';
import { isEqual } from 'bento-common/utils/lodash';
import getFeatureFlags from './lib/featureFlags';

type ComponentProps = WebComponentProps;

type MainStoreData = { inlineEmbeds: InlineEmbed[] };

type Data = {
  entityId: InlineEmbedEntityId;
  position: InjectionPosition;
  guideEntityId?: GuideEntityId;
};

function injectInlineEmbed(
  targetElement: HTMLElement,
  data: Data,
  previewId?: string
) {
  const inlineEmbed = document.createElement('bento-embed');
  inlineEmbed.setAttribute('embedid', data.entityId);
  if (previewId) {
    inlineEmbed.setAttribute('uipreviewid', previewId);
  }

  switch (data.position) {
    case InjectionPosition.before:
      targetElement.before(inlineEmbed);
      break;
    case InjectionPosition.after:
      targetElement.after(inlineEmbed);
      break;
    case InjectionPosition.inside:
      targetElement.appendChild(inlineEmbed);
      break;
  }

  return inlineEmbed;
}

const BentoInlineInjectorElement: React.FC<ComponentProps & MainStoreData> = ({
  uipreviewid,
  inlineEmbeds,
}) => {
  const { observeStylingAttributes } = getFeatureFlags(undefined);

  const inlineEmbedsData = useMemo<ElementInjectorData<Data>[]>(
    () =>
      inlineEmbeds
        .sort((a, b) => (!!a.guide && !!b.guide ? 0 : a.guide ? -1 : 1))
        .map((embed) => ({
          url: embed.wildcardUrl,
          selector: embed.elementSelector,
          isPreview: !!(uipreviewid && embed.previewId),
          data: {
            entityId: embed.entityId,
            position: embed.position,
            guideEntityId: embed.guide,
          },
        })),
    [inlineEmbeds, uipreviewid]
  );

  const inject = useCallback<ElementInjectorCallback<Data>>(
    (el, data) => injectInlineEmbed(el, data, uipreviewid),
    [uipreviewid]
  );

  const remove = useCallback<ElementRemovalCallback<Data>>((el) => {
    el.remove();
  }, []);

  useElementsInjector<Data>(
    inlineEmbedsData,
    inject,
    remove,
    undefined,
    observeStylingAttributes
  );

  return null;
};

export default withMainStoreData<ComponentProps, MainStoreData>(
  (state, { uipreviewid }): MainStoreData => ({
    inlineEmbeds: inlineEmbedsSelector(state, uipreviewid),
  }),
  isEqual
)(BentoInlineInjectorElement);
