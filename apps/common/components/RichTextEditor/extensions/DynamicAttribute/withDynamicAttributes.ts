import { ReactEditor } from 'slate-react';
import { SlateBodyElement } from 'bento-common/types/slate';
import { Transforms } from 'slate';
import { inlineElementNodesMap } from 'bento-common/utils/bodySlate';
import { DynamicAttributeSuggestion } from './Suggestions';
import { AttributeType } from 'bento-common/types';

const withDynamicAttributes = (editor: ReactEditor) => {
  const { isInline, normalizeNode } = editor;

  editor.isInline = (element: SlateBodyElement) => {
    return element.type === 'dynamic-attribute'
      ? !!inlineElementNodesMap[element.type]
      : isInline(element);
  };

  editor.normalizeNode = (entry: any) => {
    try {
      const [node, path] = entry;

      if (node && node.children && node.type === 'dynamic-attribute' && path) {
        const innerText = node.children.reduce(
          (acc, child) => acc + child.text,
          ''
        );
        if (innerText !== node.originalText) {
          Transforms.delete(editor, { at: path });
          return;
        }
      }

      // Fall back to the original `normalizeNode` to enforce other constraints.
      normalizeNode(entry);
    } catch (e) {
      // This error may happen with invalid nested void blocks.
      console.info('[RTE] withDynamicAttributes resolving error:', e);
    }
  };

  return editor;
};

export function insertDynamicAttribute(
  editor,
  attributeName: string,
  attributeType: DynamicAttributeSuggestion['type']
) {
  const type =
    attributeType === AttributeType.accountUser ? 'user' : attributeType;
  const text = `{{${type}:${attributeName}}}`;

  const dynamicAttribute = {
    type: 'dynamic-attribute',
    originalText: text,
    children: [{ text }],
  };

  Transforms.insertNodes(editor, dynamicAttribute);
  Transforms.move(editor, { unit: 'offset' });
}

export default withDynamicAttributes;
