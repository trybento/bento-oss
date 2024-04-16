import { sub } from 'date-fns';
import { applyFinalCleanupHook } from 'src/data/datatests';
import { Template } from 'src/data/models/Template.model';
import { setupGraphQLTestServer } from 'src/graphql/testHelpers';
import { generateTemplates } from 'src/testUtils/dummyDataHelpers';
import { shuffle } from 'lodash';
import { OrderBy } from './templates.connections';
import { GuideStatusFilter } from 'src/../../common/types/filters';
import { TemplateState } from 'src/../../common/types';

const { executeAdminQuery, getAdminContext } =
  setupGraphQLTestServer('paydayio');

applyFinalCleanupHook();

const templatesConnectionQuery = `
  query (
    $first: Int
    $after: String
    $last: Int
    $before: String
    $orderBy: TemplatesOrderBy
    $orderDirection: OrderDirection
    $audienceEntityId: String
    $userEmail: String
    $filters: JSON
    $search: String
  ) {
    templatesConnection(
      first: $first
      after: $after
      last: $last
      before: $before
      orderBy: $orderBy
      orderDirection: $orderDirection
      audienceEntityId: $audienceEntityId
      userEmail: $userEmail
      filters: $filters
      search: $search
    ) {
      edges {
        node {
          entityId
        }
      }
    }
  }
`;

type TemplatesConnectionResponse = {
  data: {
    templatesConnection: {
      edges: {
        node: { entityId: string };
      }[];
    };
  };
};

describe('Templates connection', () => {
  test('Returns templates ordered by editedAt DESC', async () => {
    const { organization } = getAdminContext();
    const source = await Template.findOne({
      where: {
        organizationId: organization.id,
      },
    });

    if (!source) throw new Error('No source template');

    const templates = shuffle([
      source,
      ...(await generateTemplates({
        organization,
        source,
        count: 5,
      })),
    ]);

    for (let i = 0; i < templates.length; i++) {
      await templates[i].update({ editedAt: sub(new Date(), { days: i }) });
    }

    const {
      data: {
        templatesConnection: { edges },
      },
    } = await executeAdminQuery<TemplatesConnectionResponse>({
      query: templatesConnectionQuery,
      variables: {
        orderBy: OrderBy.editedAt,
        orderDirection: 'desc',
      },
    });

    for (let i = 0; i < edges.length; i++) {
      expect(edges[i].node.entityId).toBe(templates[i].entityId);
    }
  });

  test('Treats stopped + manually-launched as live', async () => {
    const { organization } = getAdminContext();
    const source = await Template.findOne({
      where: {
        organizationId: organization.id,
      },
    });

    if (!source) throw new Error('No source template');

    await source.update({
      state: TemplateState.stopped,
      manuallyLaunched: true,
    });

    const {
      data: {
        templatesConnection: { edges },
      },
    } = await executeAdminQuery<TemplatesConnectionResponse>({
      query: templatesConnectionQuery,
      variables: {
        filters: {
          Status: {
            [GuideStatusFilter.live]: true,
          },
        },
      },
    });

    expect(edges).toContainEqual({ node: { entityId: source.entityId } });
  });
});
