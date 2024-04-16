import React from 'react';
import { Text as SlateText } from 'slate';
import SlateContentRendererContext from './SlateContentRendererContext';
import {
  BulletedList,
  Button,
  HTML,
  Image,
  Input,
  Link,
  ListItem,
  VideoRenderer,
  NumberedList,
  Paragraph,
  CodeBlock,
  Select,
  Text,
  EmbedLink,
} from './Renderers';
import { TextNode } from 'bento-common/types/slate';
import { Box } from '@chakra-ui/react';

interface SlateBodyProps {
  body: any; //TODO: Add typing
  renderers?: any;
  primaryColorHex: string;
  secondaryColorHex: string;
}

const DEFAULT_RENDERERS = {
  'block-quote': null, // TODO
  'code-block': CodeBlock,
  'bulleted-list': BulletedList,
  ul_list: BulletedList,
  'numbered-list': NumberedList,
  ol_list: NumberedList,
  'list-item': ListItem,
  list_item: ListItem,
  button: Button,
  html: HTML,
  image: Image,
  input: Input,
  link: Link,
  paragraph: Paragraph,
  select: Select,
  text: Text,
  'embed-link': EmbedLink,
  ...[
    'loom-video',
    'youtube-video',
    'wistia-video',
    'vidyard-video',
    'vimeo-video',
  ].reduce((acc, videoType) => {
    acc[videoType] = VideoRenderer;
    return acc;
  }, {}),
};

const generateRenderNodeFn = (renderers) => {
  const renderNode = (node) => {
    if (SlateText.isText(node)) {
      return <Text node={node as TextNode} />;
    }

    const nodeChildren = node.children || [];
    const children = nodeChildren.map((n) => renderNode(n));

    const Component = renderers[node.type];

    if (!Component) return null;

    return <Component node={node} children={children} />;
  };

  return renderNode;
};

export default function SlateContentRenderer(props: SlateBodyProps) {
  const {
    body = [],
    renderers = {},
    primaryColorHex,
    secondaryColorHex,
  } = props;

  const contextValue = {
    colors: {
      primary: primaryColorHex,
      secondary: secondaryColorHex,
    },
  };

  const renderNode = generateRenderNodeFn({
    ...DEFAULT_RENDERERS,
    ...renderers,
  });

  return (
    <SlateContentRendererContext.Provider value={contextValue}>
      <Box {...props}>{body.map((node) => renderNode(node))}</Box>
    </SlateContentRendererContext.Provider>
  );
}
