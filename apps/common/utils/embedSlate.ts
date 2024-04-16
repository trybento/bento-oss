import { GuideFormFactor } from './../types/index';
import { pick } from './lodash';

import { getDefaultCtaSetting } from './../data/helpers';
import { StepCtaStyle } from '../types';
import {
  ButtonElement,
  EmbedLinkStyle,
  EmbedLinkElement,
  EmbedLinkElementOptions,
  EmbedLinkElementSources,
} from '../types/slate';

const embedLinkRegexes: { [key in EmbedLinkElementSources]: RegExp } = {
  calendly: /^https:\/\/calendly.com\/[^/]+\/[^/]+$/i,
};

export function getEmbedLinkSource(
  url?: string | null
): EmbedLinkElementSources {
  if (url) {
    for (const [source, re] of Object.entries(embedLinkRegexes)) {
      if (re.test(url)) {
        return source as EmbedLinkElementSources;
      }
    }
  }
  return null;
}

export const isEmbedLink = (url?: string | null) => !!getEmbedLinkSource(url);

export const embedLinkDefaltOptions: {
  [key in EmbedLinkElementSources]: (
    ff?: GuideFormFactor
  ) => EmbedLinkElementOptions<key>;
} = {
  calendly: (formFactor?: GuideFormFactor) => ({
    style: EmbedLinkStyle.inline,
    buttonOptions: {
      text: 'Schedule meeting',
      style: StepCtaStyle.solid,
      settings: getDefaultCtaSetting(formFactor),
    },
  }),
};

export function getEmbedOptions<
  S extends EmbedLinkElementSources,
  E extends Extract<EmbedLinkElement, { source: S }>
>(element: E): EmbedLinkElementOptions<S> {
  return pick(
    element,
    Object.keys(embedLinkDefaltOptions[element.source]()) as (keyof E)[]
  ) as EmbedLinkElementOptions<S>;
}

export function embedNodeToButtonNode(
  node: EmbedLinkElement,
  formFactor?: GuideFormFactor
): ButtonElement {
  return {
    type: 'button',
    url: node.url,
    buttonText: node.buttonOptions?.text || 'Click here',
    style: node.buttonOptions?.style || StepCtaStyle.solid,
    settings: node.buttonOptions?.settings || getDefaultCtaSetting(formFactor),
    children: [],
    alignment: node.alignment,
  };
}
