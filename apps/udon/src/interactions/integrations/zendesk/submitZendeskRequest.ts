import fetch from 'node-fetch';

import { AccountUser } from 'src/data/models/AccountUser.model';
import { Organization } from 'src/data/models/Organization.model';
import { logger } from 'src/utils/logger';
import { getZendeskParams } from './zendesk.helpers';

type Args = {
  organization: Organization;
  accountUser: AccountUser;
  subject: string;
  body: string;
  name?: string;
  email?: string;
};

export default async function submitZendeskRequest({
  accountUser,
  organization,
  subject,
  body,
  name,
  email,
}: Args) {
  const { subdomain, auth } = await getZendeskParams(organization.id);

  try {
    const res = await fetch(
      `https://${subdomain}.zendesk.com/api/v2/requests`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth,
        },
        body: JSON.stringify({
          request: {
            subject,
            comment: {
              body,
            },
            requester: {
              name: name || accountUser.fullName,
              email: email || accountUser.email,
            },
          },
        }),
      }
    );

    const parsed = (await res.json()) as {
      request: { id: number; subject: string; url: string };
    };

    return parsed.request.id;
  } catch (e: any) {
    logger.error(
      `[submitZendeskIssue] error submitting request, ${e.message}`,
      e
    );
  }
}
