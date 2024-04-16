import { Transforms, Editor, Element, Node } from 'slate';
import { isListType } from '../helpers';

const withLists = (editor: Editor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    // If the element is a list, ensure its children are valid.
    if (Element.isElement(node) && isListType((node as any).type)) {
      for (const [child, childPath] of Node.children(editor, path)) {
        // Unwrap nested lists
        if (Element.isElement(child) && isListType((child as any).type)) {
          Transforms.unwrapNodes(editor, { at: childPath });
          return;
        }
      }
    }

    // Fall back to the original `normalizeNode` to enforce other constraints.
    normalizeNode(entry);
  };

  return editor;
};

export default withLists;
