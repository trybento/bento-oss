import {
  BulletedListElement,
  SlateBodyElement,
} from 'bento-common/types/slate';
import { createNode } from 'bento-common/components/RichTextEditor/helpers';

const processSnappySuggestion = (
  suggestion: string | undefined | null
): SlateBodyElement[] => {
  if (!suggestion) return [createNode('paragraph')];

  let currentListNode: BulletedListElement;
  const suggestionsArray = suggestion.split('\n');

  return suggestionsArray.reduce((acc, line, idx) => {
    const isLast = suggestionsArray.length === idx + 1;
    const _line = line.trim();
    const isBulletListItem = _line.startsWith('-');

    if (isBulletListItem) {
      if (!currentListNode) {
        currentListNode = createNode('bulleted-list');
      }
      currentListNode.children.push(
        createNode('list-item', {
          children: [
            {
              text: _line.substring(1, _line.length),
            },
          ],
        })
      );
    } else {
      if (currentListNode) {
        acc.push(currentListNode);
        currentListNode = undefined;
      }
      // Skip empty lines.
      if (_line) {
        acc.push(
          createNode('paragraph', {
            children: [
              {
                text: _line,
              },
            ],
          })
        );
      }
    }

    if (isLast && currentListNode) {
      acc.push(currentListNode);
    }

    return acc;
  }, [] as SlateBodyElement[]);
};

export default processSnappySuggestion;
