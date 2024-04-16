function shadowRootGetSelectionPolyfill() {
  // @ts-ignore - getSelection doesn't exist on ShadowRoot
  if (typeof ShadowRoot !== 'undefined' && !ShadowRoot.prototype.getSelection) {
    // @ts-ignore - same
    ShadowRoot.prototype.getSelection = () => document.getSelection();
  }
}

shadowRootGetSelectionPolyfill();
