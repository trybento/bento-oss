import { getZendeskParams } from './zendesk.helpers';

type Args = {
  organizationId: number;
  articleId: string;
};

export default async function getZendeskArticle({
  organizationId,
  articleId,
}: Args) {
  const { subdomain, auth } = await getZendeskParams(organizationId);

  const res = await fetch(
    `https://${subdomain}.zendesk.com/api/v2/help_center/articles/${articleId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth,
      },
    }
  );

  const results = await res.json();

  return {};
}
