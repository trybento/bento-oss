/**
 * Basic properties included in Zendesk article objects.
 * There are more properties.
 *
 * See @link https://developer.zendesk.com/api-reference/help_center/help-center-api/articles/
 */
export type ZendeskArticle = {
  author_id: number;
  /** Will be HTML */
  body: string;
  id: number;
  created_at: string;
  title: string;
  /** URL in the help center */
  html_url: string;
  /** API url */
  url: string;
  promoted: boolean;
  vote_sum: number;
};

/** Extends article object type */
export type ZendeskSearchResultArticle = ZendeskArticle & {
  result_type: 'article';
  snippet: string;
};
