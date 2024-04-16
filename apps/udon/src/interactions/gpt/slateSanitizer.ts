import { EditorNode, SlateBodyElement } from 'bento-common/types/slate';
import { getBodySlateString } from 'bento-common/utils/bodySlate';
import { logger } from 'src/utils/logger';

/**
 * Slate node types we support from GPT.
 * Everything else we'll try to extract some text from and wrap in a paragraph.
 */
const baseNodeTypes = new Set([
  'text',
  'bulleted-list',
  'numbered-list',
  'list-item',
  'paragraph',
]);

/**
 * Convert unknown node to text, with its content being
 *   any text content we can find within it
 */
const flattenNodeToText = (node: GptEditorNode) => {
  node.type = 'text';
  // @ts-ignore
  node.text = getBodySlateString([node as SlateBodyElement]);
  if (node.children) delete node.children;

  return node;
};

/**
 * If a node is on the root of the editor,
 *   put it in a paragraph.
 */
const flattenNodeToTextInParagraph = (node: GptEditorNode) => {
  node.type = 'paragraph';
  node.children = [flattenNodeToText({ ...node })];
};

/**
 * Potentially bad EditorNodes, so it's basically
 *   a stripped-down EditorNode but /not quite/
 */
export type GptEditorNode = {
  type: string;
  id?: string;
  children?: GptEditorNode[];
  text?: string;
};

const convert = (node: GptEditorNode) => {
  node.type = 'list-item';
  node.children = [flattenNodeToText({ ...node })];

  /* Redundant text property should be removed */
  if (node.text) delete node.text;
};

enum Fixes {
  convertListItem = 'convert listItem',
  bulletList = 'convert bulletList',
  dropUnknown = 'drop unknown',
  flatten = 'flatten',
  applyText = 'apply text type',
}

/**
 * Actual sanitizing logic, for Slate bodies
 */
export const sanitizeGptStepBodies = (stepBody: GptEditorNode[]) => {
  const fixesApplied: Fixes[] = [];

  const crawl = (nodes: GptEditorNode[], parentNodeType?: string) => {
    nodes.forEach((node, i) => {
      /* Bulleted list children should be list items with text */
      if (parentNodeType === 'bulleted-list') {
        fixesApplied.push(Fixes.convertListItem);
        return convert(node);
      }

      if (node.type === 'bulletList') {
        fixesApplied.push(Fixes.bulletList);
        /* Replace bulletList */
        node.type = 'bulleted-list';
      }

      /* If the node has no children and isn't text/li, it's invalid. Drop it */
      if (
        node.type !== 'list-item' &&
        node.type !== 'text' &&
        !node.text &&
        !node.children
      ) {
        fixesApplied.push(Fixes.dropUnknown);
        return nodes.splice(i, 1);
      }

      /* Try to extract text from misc. unsupported node types w/ children */
      if (!baseNodeTypes.has(node.type)) {
        fixesApplied.push(node.text ? Fixes.applyText : Fixes.flatten);
        return parentNodeType
          ? flattenNodeToText(node)
          : flattenNodeToTextInParagraph(node);
      }

      /* Explore the nested bits for anything remaining */
      if (node.children) crawl(node.children, node.type);
    });
  };

  crawl(stepBody);

  logger.debug(
    `[sanitizeGptStepBodies] Applied ${
      fixesApplied.length
    } fixes to Slate body: ${fixesApplied.join(', ')}`
  );

  return stepBody as EditorNode[];
};
