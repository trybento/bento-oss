import { SlateBodyElement, VideoSourceType } from '../types/slate';
import { isEdgeToEdge } from './image';

export function videoSourceToNodeType(source: VideoSourceType) {
  return source ? `${source}-video` : source;
}

export const isEdgeToEdgeImageFirst = (body: SlateBodyElement[] | undefined) =>
  body?.[0]?.type === 'image' && isEdgeToEdge(body[0].fill);

export function isVideoNode(element: SlateBodyElement | undefined) {
  return (
    element &&
    (element.type === 'youtube-video' ||
      element.type === 'loom-video' ||
      element.type === 'wistia-video' ||
      element.type === 'vidyard-video' ||
      element.type === 'vimeo-video')
  );
}

export function isMediaNode(element: SlateBodyElement | undefined) {
  return element && (isVideoNode(element) || element.type === 'image');
}

export const allowedTypesWithFillMap: { [type: string]: boolean } = {
  image: true,
};

// Determines value for 'editor.isInline' normalization.
export const inlineElementNodesMap: { [type: string]: boolean } = {
  text: true,
  link: true,
  'dynamic-attribute': true,
};

export const nodeTypesWithChildren: string[] = [
  'paragraph',
  'block-quote',
  'code-block',
  'bulleted-list',
  'numbered-list',
];

type ExtractTypeNames = SlateBodyElement['type'] | 'media' | 'video';

type SanitizedBodySlateReturn<T extends ExtractTypeNames> = {
  // @ts-ignore
  extractedNodes: Record<T, SlateBodyElement[]>;
  sanitizedBodySlate: SlateBodyElement[];
};
export const getNodesByTypeAndSanitize = <T extends ExtractTypeNames>(
  bodySlate: SlateBodyElement[],
  types: ExtractTypeNames[]
): SanitizedBodySlateReturn<T> => {
  const unifyMedia = types.includes('media');

  const extractedNodes = Object.fromEntries(
    types.map((t) => [t, []])
    // @ts-ignore
  ) as Record<T, SlateBodyElement[]>;

  const deepFind = (nodes: SlateBodyElement[]) => {
    if (!nodes?.length) return [];

    return nodes.filter((n) => {
      const type = unifyMedia
        ? isMediaNode(n)
          ? 'media'
          : n.type
        : isVideoNode(n)
        ? 'video'
        : n.type;

      const match = types.includes(type);
      if (match) {
        // @ts-ignore
        extractedNodes[type].push(n);
      }

      // @ts-ignore
      if (!match && n.children) {
        // @ts-ignore
        n = { ...n, children: deepFind(n.children) };
      }
      return !match;
    });
  };

  const sanitizedBodySlate = deepFind(bodySlate || []);
  return { extractedNodes, sanitizedBodySlate };
};

export const getBodySlateString = (bodySlate: SlateBodyElement[]): string => {
  const deepFind = (nodes: SlateBodyElement[], result: string): string => {
    if (!nodes?.length) return result;
    return nodes.reduce((subResult, n) => {
      return (
        // @ts-ignore
        subResult + (n.text ? n.text + ' ' : '') + deepFind(n.children, result)
      );
    }, '');
  };
  return deepFind(bodySlate || [], '').trim();
};

export const isEmptyBody = (body: any[] | undefined | null): boolean => {
  if (body?.length === 1) {
    return isEmptyNode(body[0]);
  }
  return false;
};

export const isEmptyNode = (node: SlateBodyElement): boolean => {
  const isEmptyText = node?.type === 'text' && !node.text;
  const isEmptyParagraph =
    node?.type === 'paragraph' &&
    node.children?.length === 1 &&
    (node.children[0]?.type === 'text' || !node.children[0]?.type) &&
    // @ts-ignore
    node.children[0]?.text === '';
  return isEmptyText || isEmptyParagraph;
};

export const getIdRecursively = (node: any): string | undefined => {
  return node?.id
    ? node.id
    : node?.children?.[0]
    ? getIdRecursively(node.children[0])
    : undefined;
};
