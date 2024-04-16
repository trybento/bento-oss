import { GuideFormFactor, GuideTypeEnum, Theme } from 'bento-common/types';
import { DEFAULT_PRIORITY_RANKING } from 'bento-common/utils/constants';
import { applyFinalCleanupHook } from 'src/data/datatests';
import { fakeModule } from 'src/testUtils/dummyDataHelpers';
import { Template } from 'src/data/models/Template.model';
import { TemplateInput } from 'src/graphql/Template/mutations/editTemplate';
import { createTemplateForTest } from 'src/graphql/Template/testHelpers';
import { setupGraphQLTestServer } from 'src/graphql/testHelpers';

const { executeAdminQuery, getEmbedContext } = setupGraphQLTestServer('bento');

applyFinalCleanupHook();

const createTemplate = async (data?: Partial<TemplateInput>) => {
  const {
    template: { entityId },
  } = await createTemplateForTest(
    executeAdminQuery,
    getEmbedContext(),
    {
      formFactor: GuideFormFactor.legacy,
      isSideQuest: false,
      theme: Theme.nested,
      type: GuideTypeEnum.user,
      modules: fakeModule() as unknown as any,
      ...data,
    },
    false,
    DEFAULT_PRIORITY_RANKING
  );

  return Template.findOne({
    where: {
      entityId,
    },
  });
};

const resetTemplateMutation = `
  mutation ($input: ResetTemplateInput!) {
    resetTemplate(input: $input) {
      template {
        entityId
      }
      errors
    }
  }
`;

type ResetTemplateResponse = {
  data: {
    resetTemplate: {
      template: {
        entityId: string;
      };
      errors: string[];
    };
  };
};

describe('ResetTemplate mutation', () => {
  test("updates the template's isResetting flag", async () => {
    const template = await createTemplate();

    const {
      data: { resetTemplate: data },
    } = await executeAdminQuery<ResetTemplateResponse>({
      query: resetTemplateMutation,
      variables: {
        input: {
          templateEntityId: template?.entityId,
        },
      },
    });

    expect(data.errors).toHaveLength(0);
    expect(data.template).toHaveProperty('entityId', template?.entityId);

    await template?.reload();

    expect(template).toHaveProperty('isResetting', true);
  });

  test('prevents resetting the template if a reset is already in progress', async () => {
    const template = await createTemplate();

    await template?.update({ isResetting: true });

    const {
      data: { resetTemplate: data },
    } = await executeAdminQuery<ResetTemplateResponse>({
      query: resetTemplateMutation,
      variables: {
        input: {
          templateEntityId: template?.entityId,
        },
      },
    });

    expect(data.template).toBeNull();
    expect(data.errors).toHaveLength(1);
    expect(data.errors[0]).toBe('Guide resetting already in progress');

    await template?.reload();

    expect(template).toHaveProperty('isResetting', true);
  });
});
