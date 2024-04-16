export function findNodeById(nodes, nodeId) {
  let foundNode;
  const deepFind = (nodesToTraverse) => {
    if (nodesToTraverse.length === 0) return;

    const matchingNode = nodesToTraverse.find((node) => node.id === nodeId);
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

  deepFind(nodes);

  return foundNode;
}
