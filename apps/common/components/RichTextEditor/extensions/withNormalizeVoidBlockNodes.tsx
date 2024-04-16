import { Transforms, Editor, NodeEntry } from 'slate';
import { isVoidBlockNode } from '../helpers';
import { EditorNode } from 'bento-common/types/slate';

const withNormalizeVoidBlockNodes = (editor: Editor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry: NodeEntry<EditorNode>) => {
    const [node, path] = entry;

    // If the element is a void block node, ensure it is at the top level.
    if (isVoidBlockNode(editor, node)) {
      if (editor?.selection?.focus?.path?.length > 2) {
        Transforms.liftNodes(editor, {
          match: (n: EditorNode) => n.type === node.type,
        });
        return;
      }
    }

    // Fall back to the original `normalizeNode` to enforce other constraints.
    normalizeNode(entry);
  };

  return editor;
};

export default withNormalizeVoidBlockNodes;
