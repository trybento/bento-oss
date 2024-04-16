import React, { Ref } from 'react';
import { AlignmentEnum, FillEnum } from 'bento-common/types';
import {
  allowedTypesWithFillMap,
  inlineElementNodesMap,
} from 'bento-common/utils/bodySlate';
import composeComponent from 'bento-common/hocs/composeComponent';
import {
  ImageElement,
  SlateBodyElement,
  SlateElementRenderer,
  SlateRendererOptions,
  SlateRendererSpacingOptions,
} from 'bento-common/types/slate';
import { isEdgeToEdge } from 'bento-common/utils/image';

import {
  BulletedList,
  Button,
  HTML,
  Image,
  Input,
  Link,
  EmbedLink,
  ListItem,
  VideoRenderer,
  NumberedList,
  Paragraph,
  Text,
  CodeBlock,
  Callout,
  DynamicAttribute,
  Divider,
  DynamicAttributeBlock,
} from './Renderers';
import { isEmptySlate } from './helpers';
import withFormFactor from '../../../hocs/withFormFactor';
import { FormFactorContextValue } from '../../../providers/FormFactorProvider';
import Carousel from '../../../components/Carousel/Carousel';
import withCustomUIContext from '../../../hocs/withCustomUIContext';
import { CustomUIProviderValue } from '../../../providers/CustomUIProvider';
import BlockQuote from './Renderers/BlockQuote';

interface OuterProps {
  body: SlateBodyElement[];
  options?: SlateRendererOptions;
  spacing?: SlateRendererSpacingOptions;
  className?: string;
  style?: React.CSSProperties;
}

type SlateBodyProps = OuterProps &
  FormFactorContextValue &
  Pick<CustomUIProviderValue, 'primaryColorHex' | 'inlineContextualStyle'>;

const defaultRendererOptions: SlateRendererOptions = {
  allowExpand: { image: true },
};

const DEFAULT_RENDERERS = {
  'block-quote': BlockQuote,
  'code-block': CodeBlock,
  'bulleted-list': BulletedList,
  ul_list: BulletedList,
  'numbered-list': NumberedList,
  ol_list: NumberedList,
  'list-item': ListItem,
  list_item: ListItem,
  button: Button,
  'dynamic-attribute': DynamicAttribute,
  'dynamic-attribute-block': DynamicAttributeBlock,
  callout: Callout,
  html: HTML,
  image: Image,
  input: Input,
  link: Link,
  paragraph: Paragraph,
  text: Text,
  divider: Divider,
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

const generateRenderNodeFn = (
  renderers: Record<string, SlateElementRenderer>,
  options: SlateRendererOptions,
  spacing: SlateRendererSpacingOptions | undefined
) => {
  /**
   * RenderNode is recursive; be careful that custom properties only apply
   *   to the level of elements desired. e.g. paddings at the top level.
   */
  return function renderNode(
    node: SlateBodyElement,
    index: string | number,
    totalNodes: number,
    formFactor: string | undefined,
    parentAlignment?: AlignmentEnum,
    /** If we are rendering a top level Slate element */
    top = false
  ) {
    if (node.type === 'text' || node.type == null) {
      if (parentAlignment) {
        node = { ...node, alignment: parentAlignment };
      }

      return <Text node={node} key={index} options={options} />;
    }

    // @ts-ignore
    const nodeChildren = node.children || [];
    const children = nodeChildren.map((n, i: number) =>
      // Passing alignment to children.
      renderNode(n, `${index}-${i}`, totalNodes, formFactor, node.alignment)
    );

    const isLast = index === totalNodes - 1;
    const isFirst = index === 0;

    const Component = renderers[node.type];

    if (!Component) return null;

    const isMarginless =
      options.allowMarginlessImages &&
      isEdgeToEdge((node as ImageElement).fill) &&
      allowedTypesWithFillMap[node.type];
    const isFullWidth =
      // @ts-ignore
      node.fill === FillEnum.full && allowedTypesWithFillMap[node.type];

    const element = (
      <Component
        node={node}
        children={children}
        key={index}
        options={options}
        isLast={isLast}
        isFirst={isFirst}
      />
    );

    if (inlineElementNodesMap[node.type]) {
      // @ts-ignore
      return <React.Fragment key={index}>{element}</React.Fragment>;
    }

    return (
      <div
        className={`bento-content-item`.concat(
          isMarginless ? '-edge-to-edge' : ''
        )}
        key={index}
        style={{
          fontSize: 'inherit',
          ...(isMarginless || isFullWidth
            ? { height: 'inherit' }
            : {
                height:
                  options.allowMarginlessImages || !options.carousel
                    ? undefined
                    : '100%',
              }),
          /* Special margin for the "first" element */
          ...(isFirst &&
            (!isMarginless || spacing?.forceFirstNodeMarginTop) && {
              marginTop: spacing?.firstNodeMarginTop,
            }),
          ...(options?.carousel
            ? {
                flex: '0 0 100%',
              }
            : {}),
          ...(isMarginless || top === false
            ? /* Don't apply custom paddings to nested elements or marginless */
              {}
            : {
                paddingTop: spacing?.yPadding,
                paddingBottom: spacing?.yPadding,
                paddingLeft: spacing?.lPadding || spacing?.xPadding,
                paddingRight: spacing?.rPadding || spacing?.xPadding,
              }),
        }}
      >
        {element}
      </div>
    );
  };
};

function SlateContentRenderer({
  className,
  body = [],
  options,
  spacing,
  primaryColorHex,
  style,
}: SlateBodyProps) {
  if (isEmptySlate(body)) return null;

  const renderNode = generateRenderNodeFn(
    // @ts-ignore
    DEFAULT_RENDERERS,
    {
      ...defaultRendererOptions,
      ...(options || {}),
    },
    spacing
  );

  return (
    <div className={className} style={style}>
      <Carousel options={options} dotColor={primaryColorHex}>
        {body.map((n, i) =>
          renderNode(n, i, body.length, options?.formFactor, undefined, true)
        )}
      </Carousel>
    </div>
  );
}

interface SingleNodeRenderer {
  node: SlateBodyElement;
  className?: string;
  style?: React.CSSProperties;
}

export const SingleNodeRenderer = React.forwardRef(
  (
    { node, className, style }: SingleNodeRenderer,
    ref: Ref<HTMLDivElement>
  ) => {
    const Component = node.type && DEFAULT_RENDERERS[node.type];
    if (!Component) return <></>;
    return (
      <div className={className} style={style} ref={ref}>
        <Component node={node} />
      </div>
    );
  }
);

export default composeComponent<OuterProps>([
  withFormFactor,
  withCustomUIContext,
])(SlateContentRenderer);
