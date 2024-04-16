import { GuideFormFactor } from '../types';

// TODO: Move the slate type fully
type EditorNode = {
  type?: string;
  children?: EditorNode[];
  text?: string;
};

/** Check if it's a node type that containers other text node types */
const isTextContainerType = (node: EditorNode) => {
  return (
    node.type === 'callout' ||
    node.type === 'block-quote' ||
    node.type === 'code-block' ||
    node.type === 'numbered-list' ||
    node.type === 'bulleted-list' ||
    node.type === 'paragraph'
  );
};

/** Thanks to uyxela/word-counter/blob/1066ae14a298051c5dea4f028358d01de95dfc97/src/components/Editor/Counter.js#L53 */
export function countWords(bodySlate: EditorNode[] | null = []) {
  let count = 0;

  bodySlate?.forEach((value) => {
    if (isTextContainerType(value))
      count += countWords(value.children as EditorNode[]);

    let s =
      value.children && Array.isArray(value.children)
        ? (value.children as EditorNode[]).reduce(
            (a, v) => (v.text ? (a += v.text) : a),
            ''
          )
        : value.children?.['text'] || '';

    if (s.length != 0 && s.match(/\b[-?(\w+)?]+\b/gi)) {
      s = s.replace(/(^\s*)|(\s*$)/gi, '');
      s = s.replace(/[ ]{2,}/gi, ' ');
      s = s.replace(/\n /, '\n');
      count += s.split(' ').length;
    }
  });

  return count;
}

/**
 * Warning and alert thresholds for word count by form factor
 */
export const getWordCountMax = (
  formFactor?: GuideFormFactor
): [number, number] => {
  switch (formFactor) {
    case GuideFormFactor.banner:
      return [15, 20];
    case GuideFormFactor.modal:
      return [40, 60];
    case GuideFormFactor.tooltip:
    case GuideFormFactor.flow:
      return [30, 40];
    default:
      return [80, 100];
  }
};
