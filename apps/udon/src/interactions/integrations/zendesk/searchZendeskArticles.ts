import fetch from 'node-fetch';
import promises from 'src/utils/promises';
import { KbArticle } from 'bento-common/types/integrations';
const { convert } = require('html-to-text');

import { getZendeskParams } from './zendesk.helpers';
import { ZendeskSearchResultArticle } from './zendesk.types';
import { htmlToSlate } from 'src/utils/slate/htmlToSlate';

type Args = {
  organizationId: number;
  query: string;
};

type ZendeskSearchResponse = {
  count: number;
  page: number;
  page_count: number;
  per_page: number;
  results: ZendeskSearchResultArticle[];
};

export default async function searchZendeskArticles({
  organizationId,
  query,
}: Args): Promise<KbArticle[]> {
  const { auth, subdomain } = await getZendeskParams(organizationId);

  /* This query doesn't appear to have pagination, so we'll split it manually as needed */
  const res = await fetch(
    `https://${subdomain}.zendesk.com/api/v2/help_center/articles/search?query=${query}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth,
      },
    }
  );

  const results = (await res.json()) as ZendeskSearchResponse;

  /**
   * We may eventually want to split this out to not include the body
   * This will lessen query size and immediate processing
   * but it may be a slower user experience because when an article is selected
   *   that's when we ask for content.
   */
  return promises.map(results?.results || [], async (r) => ({
    title: r.title,
    articleId: String(r.id),
    articleUrl: r.html_url,
    body: await htmlToSlate(r.body),
  }));
}
