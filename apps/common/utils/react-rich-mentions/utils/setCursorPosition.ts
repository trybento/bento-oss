import { getSelection } from './getSelection';

export function setCursorPosition(
  element: HTMLElement | Node | Text,
  position: number
): void {
  const selection = getSelection();
  const range = document.createRange();

  range.setStart(element, position);
  range.collapse(true);

  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
