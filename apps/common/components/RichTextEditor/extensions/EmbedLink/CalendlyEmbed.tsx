import React from 'react';
import { InlineWidget } from 'react-calendly';
import {
  EmbedLinkStyle,
  EmbedLinkElement,
  TextNode,
} from 'bento-common/types/slate';

import { EmbedLinkComponentProps } from './types';
import ButtonElement from '../Button/ButtonElement';
import { embedNodeToButtonNode } from 'bento-common/utils/embedSlate';
import { Text } from '../../../SlateContentRenderer/Renderers';

type Props = EmbedLinkComponentProps<'calendly'> & {
  element: EmbedLinkElement;
  style: React.CSSProperties;
};

export default function CalendlyEmbed({
  backgroundColor,
  primaryColorHex,
  fontColorHex,
  ...props
}: React.PropsWithChildren<Props>) {
  const {
    element: { url, style: embedStyle },
  } = props;

  switch (embedStyle) {
    case EmbedLinkStyle.inline:
      return (
        <div className="overflow-hidden h-[652px]">
          <div className="-top-12 relative">
            <InlineWidget
              url={url}
              utm={{ utmSource: 'bento' }}
              pageSettings={{
                hideLandingPageDetails: true,
                hideEventTypeDetails: true,
                hideGdprBanner: true,
                backgroundColor,
                primaryColor: primaryColorHex,
                textColor: fontColorHex,
              }}
              styles={{ overflow: 'hidden', height: '700px' }}
            />
          </div>
        </div>
      );
    case EmbedLinkStyle.button:
      return (
        <ButtonElement
          {...props}
          element={embedNodeToButtonNode(
            props.element as EmbedLinkElement,
            props.formFactor
          )}
          children={[]}
        />
      );
    default:
      return <Text node={props.element.children[0] as TextNode} />;
  }
}
