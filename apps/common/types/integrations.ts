import { GptMethod, IntegrationType } from './index';
import { EditorNode } from './slate';

// TODO: Combine w/ Webhook State
export enum IntegrationState {
  Active = 'active',
  Inactive = 'inactive',
}

/** Generic kb article shape */
export type KbArticle = {
  title: string;
  articleId: string;
  articleUrl: string;
  /** May omit this for search result lists */
  body?: string;
};

export interface IntegrationOptionMap {
  [IntegrationType.zendesk]: ZendeskOptions;
}

export type ZendeskOptions = {
  username?: string;
  subdomain?: string;
  /** @deprecated Use orgSettings.helpcenter instead */
  liveChat?: boolean;
  /** @deprecated Use orgSettings.helpcenter instead */
  issueSubmission?: boolean;
  /** @deprecated Use orgSettings.helpcenter instead */
  kbSearch?: boolean;
};

export enum BentoApiKeyType {
  api = 'api',
}

export type GptGuideRequest = {
  testPrompt?: string;
  templateEntityId: string;
  /** Generate from a transcript of a video explanation */
  transcript?: string;
  /** Directly provided text as a fallback */
  articleText?: string;
  /** Rely on scraping to extract article text */
  links?: string[];
  /** Auto flow builder */
  pageText?: string;
  /** Which method to use */
  method?: GptMethod;
  /** Generic content param for article text, link, etc. */
  text?: string;
};

export type GPTGeneratedGuide = {
  guideTitle: string;
  steps: {
    title: string;
    body: EditorNode[];
    ctaText: string;
    ctaUrl?: string;
    image?: string;
    imageUrl: string;
  }[];
};
