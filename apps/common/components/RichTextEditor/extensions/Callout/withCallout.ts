import {
  getCurrentNodeAndParent,
  getEmptyParagraph,
  getFocusedBlocks,
  insertVoidBlockNode,
  noSelection,
} from '../../helpers';
import { ReactEditor } from 'slate-react';
import { Transforms } from 'slate';
import { getNodesByTypeAndSanitize } from 'bento-common/utils/bodySlate';
import { EditorNode, SlateBodyElement } from 'bento-common/types/slate';

export const insertCallout = (
  editor: ReactEditor,
  calloutType: string
): void => {
  const [currentNode, currentParentNode] = getCurrentNodeAndParent(editor);
  const isCalloutFocused =
    currentNode?.type === 'callout' || currentParentNode?.type === 'callout';

  if (isCalloutFocused) return;

  /* Check selection and wrap if needed */
  const focus = noSelection(editor) ? null : getFocusedBlocks(editor);

  // Flatten callout children.
  const children = focus?.length
    ? focus.flatMap((n) =>
        (n as EditorNode).type === 'callout'
          ? (n as EditorNode).children || []
          : [n]
      )
    : [getEmptyParagraph()];

  const calloutBlock = { type: 'callout', calloutType, children };

  insertVoidBlockNode(editor, calloutBlock, true);
};

export const withCallout = (editor: ReactEditor) => {
  const { normalizeNode, insertFragment } = editor;

  editor.insertFragment = (data) => {
    const [currentNode, currentParentNode] = getCurrentNodeAndParent(editor);
    const isCalloutFocused =
      currentNode?.type === 'callout' || currentParentNode?.type === 'callout';

    if (!isCalloutFocused) return insertFragment(data);

    const {
      extractedNodes: { callout: callouts = [] },
      sanitizedBodySlate: filteredFragment,
    } = getNodesByTypeAndSanitize<'callout'>(
      (data || []) as SlateBodyElement[],
      ['callout']
    );

    const newFragment = filteredFragment;
    // Handle copying content from callout to callout,
    // otherwise, ignore callouts when mixed content is pasted.
    if (!newFragment.length && callouts) {
      callouts.forEach((callout) => {
        (callout.children || []).forEach((child: any) => {
          if (child && child.type !== 'callout') newFragment.push(child);
        });
      });
    }

    return insertFragment(newFragment);
  };

  editor.normalizeNode = (entry: any) => {
    try {
      const [node, path] = entry;

      // Fix callouts just aligning the first paragraph.
      if (node && node.type === 'callout') {
        const childAligned = node?.children?.find((n) => n.alignment);

        if (childAligned) {
          const { alignment } = childAligned;
          node.children.map((child, childIdx) => {
            if (child.alignment !== alignment) {
              Transforms.setNodes(
                editor,
                { ...child, alignment },
                { at: [...path, childIdx] }
              );
            }
          });
          return;
        }
      }

      normalizeNode(entry);
    } catch (e) {
      console.info('[RTE] withCallout resolving error:', e);
    }
  };

  return editor;
};

export default withCallout;
