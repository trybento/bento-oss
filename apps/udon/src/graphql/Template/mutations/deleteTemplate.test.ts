import { applyFinalCleanupHook } from 'src/data/datatests';
import {
  generateTemplates,
  getDummySplitTestTemplate,
} from 'src/testUtils/dummyDataHelpers';
import { Template } from 'src/data/models/Template.model';
import { setupGraphQLTestServer } from 'src/graphql/testHelpers';

const { executeAdminQuery, getAdminContext } =
  setupGraphQLTestServer('paydayio');

applyFinalCleanupHook();

const deleteTemplateMutation = `
  mutation ($input: DeleteTemplateInput!) {
    deleteTemplate(input: $input) {
      deletedTemplateId
      errors
    }
  }
`;

type DeleteTemplateResponse = {
  data: {
    deleteTemplate: {
      deletedTemplateId: string[];
      errors: any[];
    };
  };
};

describe('DeleteTemplate mutation', () => {
  test('Returns an error if the template is included in a split test', async () => {
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
      count: 2,
    });

    await getDummySplitTestTemplate(
      organization,
      newTemplates.map((t) => t.entityId)
    );

    const {
      data: {
        deleteTemplate: { errors },
      },
    } = await executeAdminQuery<DeleteTemplateResponse>({
      query: deleteTemplateMutation,
      variables: {
        input: {
          templateEntityId: newTemplates[0].entityId,
        },
      },
    });

    expect(errors).toBeDefined();
    expect(errors[0]).toBe(
      'Template is part of a split test. Please delete the split test first.'
    );

    const existingTemplates = await Template.findAll({
      where: {
        entityId: newTemplates.map((t) => t.entityId),
      },
    });

    expect(existingTemplates).toHaveLength(2);
  });
});
