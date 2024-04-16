import {
  EmbedLinkElement,
  EmbedLinkElementSources,
} from 'bento-common/types/slate';
import React from 'react';
import { ElementProps } from '../../Element';

export type EmbedLinkComponentProps<S extends EmbedLinkElementSources> = {
  backgroundColor: string;
  primaryColorHex: string;
  fontColorHex: string;
} & ElementProps & { element: Extract<EmbedLinkElement, { source: S }> };

export type EmbedLinkComponent<S extends EmbedLinkElementSources> =
  React.ComponentType<EmbedLinkComponentProps<S>>;
