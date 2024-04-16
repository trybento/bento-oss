export function getSelection() {
  const shadowRoot =
    document.activeElement && document.activeElement.shadowRoot;
  // @ts-ignore
  if (shadowRoot) return shadowRoot.getSelection();

  return document.getSelection();
}
