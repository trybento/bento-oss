import { setupGraphQLTestServer } from './testHelpers';

import { Guide } from 'src/data/models/Guide.model';
import { Account } from 'src/data/models/Account.model';
import { Template } from 'src/data/models/Template.model';
import { Organization } from 'src/data/models/Organization.model';

const {
  executeAdminQuery,
  executeEmbedQuery,
  getAdminContext,
  getEmbedContext,
} = setupGraphQLTestServer('bento');

test('get org from query context', async () => {
  const { organization } = getAdminContext();
  const {
    data: { organization: org },
  } = (await executeAdminQuery({
    query: `
      query Test {
        organization {
          name
        }
      }
    `,
  })) as { data: { organization: Organization } };
  expect(org.name).toBe(organization.name);
});

test('get some actual data from the db', async () => {
  const {
    data: { templates },
  } = (await executeAdminQuery({
    query: `
      query Test {
        templates {
          name
        }
      }`,
  })) as { data: { templates: Template[] } };
  const templateNames = templates.map((template) => template.name);
  expect(templateNames).toHaveLength(3);
  expect(templateNames).toEqual(
    expect.arrayContaining(['Stakeholder', 'Team member', 'Project lead'])
  );
});

test('get account from query context', async () => {
  const { account } = getEmbedContext();
  const {
    data: { account: acc },
  } = (await executeEmbedQuery({
    query: `
      query EmbedTest {
        account {
          name
        }
      }
    `,
  })) as { data: { account: Account } };
  expect(acc.name).toBe(account.name);
});

test('get some embed data from the db', async () => {
  const {
    data: { availableGuides },
  } = (await executeEmbedQuery({
    query: `
      query EmbedTest {
        availableGuides {
          name
        }
      }`,
  })) as { data: { availableGuides: Partial<Guide>[] } };
  expect(availableGuides).toHaveLength(0);
});
