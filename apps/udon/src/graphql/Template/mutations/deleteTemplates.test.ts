import { applyFinalCleanupHook } from 'src/data/datatests';
import {
  generateTemplates,
  getDummySplitTestTemplate,
} from 'src/testUtils/dummyDataHelpers';
import { Template } from 'src/data/models/Template.model';
import { setupGraphQLTestServer } from 'src/graphql/testHelpers';
import { toGlobalId } from 'graphql-relay';

const { executeAdminQuery, getAdminContext } =
  setupGraphQLTestServer('paydayio');

applyFinalCleanupHook();

const deleteTemplatesMutation = `
  mutation ($input: DeleteTemplatesInput!) {
    deleteTemplates(input: $input) {
      deletedTemplateIds
      errors
    }
  }
`;

type DeleteTemplatesResponse = {
  data: {
    deleteTemplates: {
      deletedTemplateIds: string[];
      errors: any[];
    };
  };
};

describe('DeleteTemplates mutation', () => {
  test('Templates included in split tests are ignored', async () => {
    const { organization } = getAdminContext();
    const source = await Template.findOne({
      where: {
        organizationId: organization.id,
      },
    });

    if (!source) throw new Error('No source template');

    const newTemplates = await generateTemplates({
      organization,
      source,
      count: 3,
    });

    const testTemplates = newTemplates.slice(1);

    await getDummySplitTestTemplate(
      organization,
      testTemplates.map((t) => t.entityId)
    );

    const {
      data: {
        deleteTemplates: { deletedTemplateIds, errors },
      },
    } = await executeAdminQuery<DeleteTemplatesResponse>({
      query: deleteTemplatesMutation,
      variables: {
        input: {
          templateEntityIds: newTemplates.map((t) => t.entityId),
        },
      },
    });

    expect(errors).toHaveLength(0);
    expect(deletedTemplateIds).toHaveLength(1);
    expect(deletedTemplateIds[0]).toBe(
      toGlobalId('Template', newTemplates[0].entityId)
    );

    const existingTemplates = await Template.findAll({
      where: {
        entityId: testTemplates.map((t) => t.entityId),
      },
    });

    expect(existingTemplates).toHaveLength(2);
  });
});
