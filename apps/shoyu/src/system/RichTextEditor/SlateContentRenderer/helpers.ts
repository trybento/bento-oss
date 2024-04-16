import React from 'react';
import {
  SlateBodyElement,
  EditorNode,
  TextNode,
  SlateRendererOptions,
} from 'bento-common/types/slate';
import { AlignmentEnum } from 'bento-common/types';
import {
  isMediaNode,
  isVideoNode,
  nodeTypesWithChildren,
} from 'bento-common/utils/bodySlate';

export const isEmptySlate = (bodySlate) => {
  const emptySlate = !bodySlate || (!!bodySlate && isEmptyNode(bodySlate));
  return emptySlate;
};

export const isEmptyNode = (nodes: EditorNode[]) => {
  const shouldHaveChildren =
    nodes?.[0]?.type && nodeTypesWithChildren.includes(nodes?.[0]?.type);

  if (
    !nodes ||
    nodes.length === 0 ||
    (!nodes[0].children && shouldHaveChildren) ||
    ((nodes[0].children?.length || 0) === 0 && shouldHaveChildren)
  )
    return true;

  const childNodesOfFirstParagraph = nodes[0].children;

  if (
    nodes.length === 1 &&
    childNodesOfFirstParagraph.length === 1 &&
    typeof childNodesOfFirstParagraph[0].text === 'string' &&
    childNodesOfFirstParagraph[0].text.trim() === '' &&
    !nodes[0].placeholder &&
    shouldHaveChildren
  )
    return true;

  return false;
};

/**
 *
 * @param url
 * @returns [iFrameSrc, iFrameSrcLightbox]
 */
export function videoIframeStrings(url: string) {
  if (!url) return ['', ''];

  const urlHasQuery = url.includes('?');

  // Styling used here seems to be used to remove black bacground from the iFrame.
  return [
    `<iframe src="${url}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" webkitallowfullscreen mozallowfullscreen allowFullScreen style="width: 100%; height: 100%; max-width: 100%; max-height: 100%;" />`,
    `<iframe src="${url}${
      urlHasQuery ? '&' : '?'
    }autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" webkitallowfullscreen mozallowfullscreen allowFullScreen style="width: 100%; height: 100%;">
		</iframe>`,
  ];
}

export function thumbnailImgString(url: string) {
  return `<img class="video-thumbnail" src="${url}" style="width: 100%; aspect-ratio: 16 / 9;"/>`;
}

export function getNodeStyle(
  node: SlateBodyElement,
  options?: SlateRendererOptions
) {
  if (!node) return {};

  const { type } = node;

  const alignment =
    isMediaNode(node) || type === 'dynamic-attribute-block'
      ? options?.alignment?.media || node.alignment
      : node.alignment;
  let style: React.CSSProperties = {};

  if (!alignment) {
    if ((node as TextNode).color) return { color: (node as TextNode).color };
    return {};
  }

  if (
    type === 'input' ||
    type === 'select' ||
    isVideoNode(node) ||
    type === 'dynamic-attribute-block'
  ) {
    switch (alignment) {
      case AlignmentEnum.left:
        style = {
          ...(type !== 'select' && {
            margin: 'unset',
          }),
          marginLeft: 0,
          marginRight: 'auto',
        };
        break;

      case AlignmentEnum.right:
        style = {
          ...(type !== 'select' && {
            margin: 'unset',
          }),
          marginRight: 0,
          marginLeft: 'auto',
        };
        break;

      default:
        break;
    }
  }

  if (
    !type ||
    type === 'button' ||
    type === 'file-upload' ||
    type === 'image' ||
    type === 'paragraph' ||
    type === 'text' ||
    type === 'block-quote'
  ) {
    style = { ...style, ...(alignment ? { textAlign: alignment } : {}) };
  }

  if ((node as TextNode).color)
    style = { ...style, color: (node as TextNode).color };

  return style;
}

export function findNodeById(bodySlate: EditorNode[], slateNodeId: string) {
  let foundNode;
  const deepFind = (nodesToTraverse) => {
    if (nodesToTraverse.length === 0) return;

    const matchingNode = nodesToTraverse.find(
      (node) => node.id === slateNodeId
    );
    if (matchingNode) {
      foundNode = matchingNode;
      return;
    }

    nodesToTraverse.forEach((node) => {
      const children = node.children || [];
      if (children.length > 0) {
        deepFind(children);
      }
    });
  };

  deepFind(bodySlate);

  return foundNode;
}

export function traverseNodesToSetKeyValues(
  nodes: EditorNode[],
  nodeId: string,
  keyValues: { [key: string]: string | number | boolean }
): EditorNode[] {
  return nodes.map((node) => {
    let updatedNode;
    if (node.id && node.id === nodeId) {
      updatedNode = {
        ...node,
      };

      Object.entries(keyValues).forEach((tuple) => {
        const [key, value] = tuple;
        if (value !== undefined) {
          updatedNode[key] = value;
        } else {
          delete updatedNode[key];
        }
      });
    } else if (node.children && node.children.length > 0) {
      updatedNode = {
        ...node,
        children: traverseNodesToSetKeyValues(
          node.children as EditorNode[],
          nodeId,
          keyValues
        ),
      };
    } else {
      updatedNode = {
        ...node,
      };
    }

    return updatedNode;
  });
}
