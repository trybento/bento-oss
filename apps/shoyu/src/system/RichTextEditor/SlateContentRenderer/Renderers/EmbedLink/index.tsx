import React from 'react';
import {
  EmbedLinkElement,
  EmbedLinkElementSources,
  SlateRendererProps,
} from 'bento-common/types/slate';
import composeComponent from 'bento-common/hocs/composeComponent';

import withCustomUIContext from '../../../../../hocs/withCustomUIContext';
import { CustomUIProviderValue } from '../../../../../providers/CustomUIProvider';
import { EmbedLinkComponent } from './types';
import CalendlyEmbed from './CalendlyEmbed';

interface OuterProps extends SlateRendererProps {
  node: EmbedLinkElement;
}

type Props = OuterProps &
  Pick<
    CustomUIProviderValue,
    'backgroundColor' | 'primaryColorHex' | 'fontColorHex'
  >;

const embedComponents: {
  [key in EmbedLinkElementSources]: EmbedLinkComponent<key>;
} = {
  calendly: CalendlyEmbed,
};

export function EmbedLink({
  node,
  backgroundColor,
  primaryColorHex,
  fontColorHex,
  children,
}: Props) {
  const Embed = embedComponents[node.source];
  return (
    <Embed
      backgroundColor={backgroundColor}
      primaryColorHex={primaryColorHex}
      fontColorHex={fontColorHex}
      node={node}
    >
      {children}
    </Embed>
  );
}

export default composeComponent<OuterProps>([withCustomUIContext])(EmbedLink);
