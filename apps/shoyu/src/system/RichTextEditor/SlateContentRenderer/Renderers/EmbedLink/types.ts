import {
  EmbedLinkElement,
  EmbedLinkElementSources,
  SlateRendererProps,
} from 'bento-common/types/slate';
import React from 'react';

import { CustomUIProviderValue } from '../../../../../providers/CustomUIProvider';

export type EmbedLinkComponentProps<S extends EmbedLinkElementSources> = {
  node: Extract<EmbedLinkElement, { source: S }>;
} & Pick<SlateRendererProps, 'children'> &
  Pick<
    CustomUIProviderValue,
    'backgroundColor' | 'primaryColorHex' | 'fontColorHex'
  >;

export type EmbedLinkComponent<S extends EmbedLinkElementSources> =
  React.ComponentType<EmbedLinkComponentProps<S>>;
