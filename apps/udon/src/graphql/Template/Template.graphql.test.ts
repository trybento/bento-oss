import { setupGraphQLTestServer } from 'src/graphql/testHelpers';
import { createTemplateForTest } from 'src/graphql/Template/testHelpers';
import { TemplateState } from 'bento-common/types';
import { Template } from 'src/data/models/Template.model';
import { applyFinalCleanupHook } from 'src/data/datatests';
import { SetAutoLaunchRulesAndTargetsForTemplateInput } from './mutations/setAutoLaunchRulesAndTargetsForTemplate.test';

applyFinalCleanupHook();

const graphqlTestHelpers = setupGraphQLTestServer('bento');
const { executeAdminQuery, getEmbedContext } = graphqlTestHelpers;

const findTemplateQuery = `
  query ($entityId: EntityId!) {
    findTemplate(entityId: $entityId) {
      state
    }
  }
`;

const setAutoLaunchRulesMutation = `
  mutation ($input: SetAutoLaunchRulesAndTargetsForTemplateInput!) {
    setAutoLaunchRulesAndTargetsForTemplate(input: $input) {
      template {
        state
      }
    }
  }
`;

describe('state field', () => {
  test('the state field resolves to stopped for stopped templates', async () => {
    const {
      template: { entityId },
    } = await createTemplateForTest(
      executeAdminQuery,
      getEmbedContext(),
      {},
      true
    );

    await Template.update(
      { isAutoLaunchEnabled: true, state: TemplateState.live },
      { where: { entityId } }
    );

    const input: SetAutoLaunchRulesAndTargetsForTemplateInput = {
      templateEntityId: entityId,
      isAutoLaunchEnabled: false,
    };

    const { errors, data } = await executeAdminQuery({
      query: setAutoLaunchRulesMutation,
      variables: { input },
    });

    expect(errors).toBeUndefined();
    expect(data!.setAutoLaunchRulesAndTargetsForTemplate.template.state).toBe(
      TemplateState.stopped
    );
  });

  test('the state field resolves to live for auto-launched templates', async () => {
    const {
      template: { entityId },
    } = await createTemplateForTest(
      executeAdminQuery,
      getEmbedContext(),
      {},
      false
    );

    const input: SetAutoLaunchRulesAndTargetsForTemplateInput = {
      templateEntityId: entityId,
      isAutoLaunchEnabled: true,
    };

    const { errors, data } = await executeAdminQuery({
      query: setAutoLaunchRulesMutation,
      variables: { input },
    });

    expect(errors).toBeUndefined();
    expect(data!.setAutoLaunchRulesAndTargetsForTemplate.template.state).toBe(
      TemplateState.live
    );
  });

  test('the state field resolves to live for manually-launched templates', async () => {
    const {
      template: { entityId },
    } = await createTemplateForTest(
      executeAdminQuery,
      getEmbedContext(),
      {},
      false
    );

    await Template.update({ manuallyLaunched: true }, { where: { entityId } });

    const { errors, data } = await executeAdminQuery({
      query: findTemplateQuery,
      variables: { entityId },
    });

    expect(errors).toBeUndefined();
    expect(data!.findTemplate.state).toBe(TemplateState.live);
  });
});
