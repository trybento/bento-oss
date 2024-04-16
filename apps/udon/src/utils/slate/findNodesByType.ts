import { NodeTypes } from './unified/markdownToSlatePlugin';

export function findNodesByType(nodes, type: keyof NodeTypes) {
  const foundNodes: any[] = [];

  if (!nodes) return [];

  const deepFind = (nodesToTraverse) => {
    if (!nodesToTraverse?.length) return;

    nodesToTraverse.forEach((node) => {
      if (node.type === type) {
        foundNodes.push(node);
      }

      const children = node.children || [];
      if (children.length > 0) {
        deepFind(children);
      }
    });
  };

  deepFind(nodes);

  return foundNodes;
}
