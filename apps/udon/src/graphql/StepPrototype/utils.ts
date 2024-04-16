import { EditorNode } from 'shared/types';
import { StepPrototype } from 'src/data/models/StepPrototype.model';

const isEmptyNode = (nodes: EditorNode[]) => {
  if (
    !nodes ||
    nodes.length === 0 ||
    !nodes[0].children ||
    (nodes[0].children?.length || 0) === 0
  )
    return true;

  const childNodesOfFirstParagraph = nodes[0].children;

  if (
    nodes.length === 1 &&
    childNodesOfFirstParagraph.length === 1 &&
    typeof childNodesOfFirstParagraph[0].text === 'string' &&
    childNodesOfFirstParagraph[0].text.trim() === '' &&
    !nodes[0].placeholder
  )
    return true;

  return false;
};

const isEmptySlate = (body: EditorNode[]) => {
  if (!body || !Array.isArray(body)) {
    return true;
  }

  return body.every(
    (node) =>
      (node.type === 'paragraph' || node.type == null) && isEmptyNode([node])
  );
};

export const areStepPrototypesEmpty = (stepPrototypes: StepPrototype[]) => {
  if (stepPrototypes?.length === 0) {
    return true;
  }

  if (
    stepPrototypes?.length === 1 &&
    isEmptySlate(stepPrototypes[0].bodySlate as EditorNode[])
  ) {
    return true;
  }

  return false;
};
