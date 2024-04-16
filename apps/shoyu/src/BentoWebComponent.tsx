import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { debounce } from 'bento-common/utils/lodash';

import webComponentCss from './index.css';

export default class BentoWebComponent extends HTMLElement {
  root: React.FC<any> = () => <></>;
  mountPoint: HTMLDivElement;

  static get observedAttributes(): string[] {
    /**
     * uipreviewid: ID of the preview.
     */
    return ['uipreviewid', 'id'];
  }

  constructor() {
    super();
    this.mountPoint = document.createElement('div');
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(this.mountPoint);
  }

  renderApp() {
    if (!this.root) {
      // Development error that is likely to be fixed before this goes to Prod
      // eslint-disable-next-line no-console
      console.error(`[BENTO] ALERT! No react component defined for tag ${this.tagName}
Fix this by this.root:
class MyBentoComponent extends BentoWebComponent {
  root = MyComponent;
}`);
      return;
    }
    const props = Object.fromEntries(
      this.getAttributeNames().map((attributeKey) => [
        attributeKey,
        this.getAttribute(attributeKey),
      ])
    );
    const Component = this.root;

    /** @todo use react.createRoot if upgrading to R18+ */
    render(
      <>
        <style>{webComponentCss}</style>
        <Component {...props}>
          <slot />
        </Component>
      </>,
      this.mountPoint
    );
  }

  update = debounce(this.renderApp, 100);

  connectedCallback() {
    this.renderApp();
  }

  disconnectedCallback() {
    unmountComponentAtNode(this.mountPoint);
  }

  attributeChangedCallback(name: string) {
    const { observedAttributes } = this.constructor as typeof BentoWebComponent;
    if (observedAttributes.includes(name)) {
      this.update();
    }
  }
}
