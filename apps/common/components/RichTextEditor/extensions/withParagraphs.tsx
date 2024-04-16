import { Transforms, Editor, Element, Node } from 'slate';
import { isVoidBlockNode } from '../helpers';

const withParagraphs = (editor: Editor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    // If the element is a paragraph, ensure its children are valid.
    if (
      Element.isElement(node) &&
      ((node as any).type === 'paragraph' ||
        (node as any).type === 'block-quote')
    ) {
      for (const [child, childPath] of Node.children(editor, path)) {
        if (Element.isElement(child) && !editor.isInline(child)) {
          // Attempt of lifting nested void blocks from paragraphs.
          // Not sure why we end up in such state.
          if ((child as any).break || isVoidBlockNode(editor, child)) {
            Transforms.liftNodes(editor, { at: childPath });
            return;
          } else {
            Transforms.unwrapNodes(editor, { at: childPath });
            return;
          }
        }
      }
    }

    // Fall back to the original `normalizeNode` to enforce other constraints.
    normalizeNode(entry);
  };

  return editor;
};

export default withParagraphs;
