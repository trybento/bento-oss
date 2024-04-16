import React from 'react';
import { List } from '@chakra-ui/react';
import { RenderElementProps } from 'slate-react';
import {
  AlignmentEnum,
  Attribute,
  FormFactorStyle,
  GuideFormFactor,
} from 'bento-common/types';
import { SlateBodyElement } from 'bento-common/types/slate';

import { FormEntityType } from '../../types/forms';
import Text from '../Text';
import DynamicAttributeElement from './extensions/DynamicAttribute/DynamicAttributeElement';
import ButtonElement from './extensions/Button/ButtonElement';
import ImageElement from './extensions/Image/ImageElement';
import LinkElement from './extensions/Link/LinkElement';
import InputElement from './extensions/Input/InputElement';
import SelectElement from './extensions/Select/SelectElement';
import HtmlElement from './extensions/Html/HtmlElement';
import CalloutElement from './extensions/Callout/CalloutElement';
import DividerElement from './extensions/Divider/DividerElement';
import VideoElement from './extensions/Video/VideoElement';
import EmbedLinkElement from './extensions/EmbedLink/EmbedLinkElement';
import { CodeBlock } from './components/FormattingBlocks';
import { RichTextEditorUISettings } from './helpers';

export interface ElementProps {
  dynamicAttributes: Attribute[];
  uiSettings: RichTextEditorUISettings;
  accessToken: string;
  fileUploadConfig: {
    apiHost: string;
    uploadsHost: string;
  };
  attributes: RenderElementProps['attributes'];
  element: SlateBodyElement;
  children: SlateBodyElement[];
  /** We want to lock some eles on guides/guidebases */
  formEntityType: FormEntityType | undefined;
  formFactor: GuideFormFactor;
  formFactorStyle?: FormFactorStyle;
}

export function getMargin(alignment?: AlignmentEnum): React.CSSProperties {
  switch (alignment) {
    case AlignmentEnum.left:
      return {
        margin: 'unset',
        marginLeft: 0,
        marginRight: 'auto',
      };

    case AlignmentEnum.right:
      return {
        margin: 'unset',
        marginRight: 0,
        marginLeft: 'auto',
      };

    default:
      return {};
  }
}

export function getTextAlign(alignment?: AlignmentEnum): React.CSSProperties {
  return alignment ? { textAlign: alignment } : {};
}

export default function Element(props: ElementProps): JSX.Element {
  const { attributes, children, element } = props;
  const { alignment } = element || {};

  switch (element.type) {
    case 'code-block':
      return <CodeBlock {...attributes}>{children}</CodeBlock>;
    case 'block-quote': {
      const style = getTextAlign(alignment);
      return (
        <Text
          borderLeft="2px solid #ddd"
          ml="0"
          mr="0"
          pl="10px"
          color="#aaa"
          {...attributes}
          style={style}
        >
          {children as React.ReactNode}
        </Text>
      );
    }
    case 'bulleted-list':
      return (
        <List
          styleType="disc"
          stylePosition="outside"
          mb="2"
          {...attributes}
          pl="8"
        >
          {children as React.ReactNode}
        </List>
      );
    case 'numbered-list':
      return (
        <List
          as="ol"
          styleType="decimal"
          stylePosition="outside"
          mb="2"
          {...attributes}
          pl="8"
        >
          {children as React.ReactNode}
        </List>
      );
    case 'list-item':
      // Slate sometimes renders list-item elements without a parent
      // 'bulleted-list' or 'numbered-list' node.
      //
      // Chakra requires all <ListItem /> components exist
      // under a <List> component because it provides styles
      // to them
      //
      // As safety, we use a normal list item element instead of
      // Chakra's <ListItem /> component
      return <li {...attributes}>{children as React.ReactNode}</li>;
    case 'link':
      return <LinkElement {...props} />;
    case 'image': {
      const style = getTextAlign(alignment);
      return <ImageElement {...props} style={style} />;
    }
    case 'select': {
      const style = getMargin(alignment);
      return <SelectElement {...props} style={style} />;
    }
    case 'loom-video':
    case 'youtube-video':
    case 'vidyard-video':
    case 'vimeo-video':
    case 'wistia-video': {
      const style = getMargin(alignment);

      // @ts-expect-error
      return <VideoElement {...props} style={style} />;
    }
    case 'html':
      return <HtmlElement {...props} />;
    case 'input': {
      const style = getMargin(alignment);
      return <InputElement {...props} style={style} />;
    }
    case 'button': {
      const style = { ...getTextAlign(alignment), ...getMargin(alignment) };
      return (
        // @ts-ignore
        <ButtonElement {...props} style={style} />
      );
    }
    case 'dynamic-attribute':
      return <DynamicAttributeElement {...props} />;
    case 'callout':
      return <CalloutElement {...props} />;
    case 'divider':
      return <DividerElement {...props} />;
    case 'embed-link': {
      const style = { ...getTextAlign(alignment), ...getMargin(alignment) };
      // @ts-ignore
      return <EmbedLinkElement {...props} style={style} />;
    }
    default: {
      const style = getTextAlign(alignment);
      return (
        <Text as="p" mb={2} {...attributes} style={style}>
          {children as React.ReactNode}
        </Text>
      );
    }
  }
}
