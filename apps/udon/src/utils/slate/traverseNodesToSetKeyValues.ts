import { EditorNode } from 'shared/types';

export function traverseNodesToSetKeyValues(
  nodes: EditorNode[],
  nodeId: string,
  keyValues: { [key: string]: any }
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
        children: traverseNodesToSetKeyValues(node.children, nodeId, keyValues),
      };
    } else {
      updatedNode = {
        ...node,
      };
    }

    return updatedNode;
  });
}
