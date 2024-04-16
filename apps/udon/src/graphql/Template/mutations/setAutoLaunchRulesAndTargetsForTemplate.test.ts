import { GuideBaseState, TemplateState } from 'bento-common/types';
import { setupGraphQLTestServer } from 'src/graphql/testHelpers';
import { createTemplateForTest } from 'src/graphql/Template/testHelpers';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Template } from 'src/data/models/Template.model';
import { queryRunner } from 'src/data';
import { applyFinalCleanupHook } from 'src/data/datatests';

applyFinalCleanupHook();

const graphqlTestHelpers = setupGraphQLTestServer('bento');
const { executeAdminQuery, getEmbedContext } = graphqlTestHelpers;

export type SetAutoLaunchRulesAndTargetsForTemplateInput = {
  templateEntityId: string;
  isAutoLaunchEnabled: boolean;
  onlySetAutolaunchState?: boolean | null;
};

const onlySetAutoLaunchStateQuery = `
  mutation ($input: SetAutoLaunchRulesAndTargetsForTemplateInput!) {
    setAutoLaunchRulesAndTargetsForTemplate(input: $input) {
      template {
        isAutoLaunchEnabled
        state
      }
    }
  }
`;

type ResultData = {
  setAutoLaunchRulesAndTargetsForTemplate: {
    template: {
      isAutoLaunchEnabled: boolean;
      state: TemplateState;
    };
  };
};

describe('setAutoLaunchRulesAndTargetsForTemplate', () => {
  afterEach(async () => {
    // cleanup audits after each run
    await queryRunner({
      sql: `DELETE FROM audit.template_audit`,
    });
  });

  test('updates the state of derivative GuideBases when paused', async () => {
    const {
      template: { entityId: templateEntityId },
      guideBase,
    } = await createTemplateForTest(
      executeAdminQuery,
      getEmbedContext(),
      {},
      true
    );

    await guideBase.update({ state: GuideBaseState.active });
    expect(guideBase.isModifiedFromTemplate).toBe(false);

    const template = (await Template.findOne({
      where: { entityId: templateEntityId },
    })) as Template;
    await template.update({ isAutoLaunchEnabled: true });

    const input: SetAutoLaunchRulesAndTargetsForTemplateInput = {
      templateEntityId,
      isAutoLaunchEnabled: false,
      onlySetAutolaunchState: true,
    };

    const { errors, data } = await executeAdminQuery({
      query: onlySetAutoLaunchStateQuery,
      variables: { input },
    });
    expect(errors).toBeUndefined();

    const dataTemplate = (data as ResultData)
      .setAutoLaunchRulesAndTargetsForTemplate.template;
    expect(dataTemplate.isAutoLaunchEnabled).toBe(false);

    const guideBases = await GuideBase.findAll({
      where: {
        createdFromTemplateId: template.id,
      },
    });
    expect(guideBases).toHaveLength(1);
    const [foundGuideBase] = guideBases;
    expect(foundGuideBase.state).toBe('paused');
  });

  test('updates the state of derivative GuideBases when launched', async () => {
    const {
      template: { entityId: templateEntityId },
      guideBase,
    } = await createTemplateForTest(
      executeAdminQuery,
      getEmbedContext(),
      {},
      true
    );

    await guideBase.update({ state: GuideBaseState.paused });
    expect(guideBase.isModifiedFromTemplate).toBe(false);

    const template = (await Template.findOne({
      where: { entityId: templateEntityId },
    })) as Template;
    expect(template.isAutoLaunchEnabled).toBe(false);

    const input: SetAutoLaunchRulesAndTargetsForTemplateInput = {
      templateEntityId,
      isAutoLaunchEnabled: true,
      onlySetAutolaunchState: true,
    };

    const { errors, data } = await executeAdminQuery({
      query: onlySetAutoLaunchStateQuery,
      variables: { input },
    });
    expect(errors).toBeUndefined();

    const dataTemplate = (data as ResultData)
      .setAutoLaunchRulesAndTargetsForTemplate.template;
    expect(dataTemplate.isAutoLaunchEnabled).toBe(true);

    const guideBases = await GuideBase.findAll({
      where: {
        createdFromTemplateId: template.id,
      },
    });
    expect(guideBases).toHaveLength(1);
    const [foundGuideBase] = guideBases;
    expect(foundGuideBase.state).toBe('active');
  });

  test('does not update the state of derivative GuideBases that have been modified when paused', async () => {
    const {
      template: { entityId: templateEntityId },
      guideBase,
    } = await createTemplateForTest(
      executeAdminQuery,
      getEmbedContext(),
      {},
      true
    );

    await guideBase.update({ state: GuideBaseState.active });
    await guideBase.update({ isModifiedFromTemplate: true });

    const template = (await Template.findOne({
      where: { entityId: templateEntityId },
    })) as Template;
    await template.update({ isAutoLaunchEnabled: true });

    const input: SetAutoLaunchRulesAndTargetsForTemplateInput = {
      templateEntityId,
      isAutoLaunchEnabled: false,
      onlySetAutolaunchState: true,
    };

    const { errors, data } = await executeAdminQuery({
      query: onlySetAutoLaunchStateQuery,
      variables: { input },
    });
    expect(errors).toBeUndefined();

    const dataTemplate = (data as ResultData)
      .setAutoLaunchRulesAndTargetsForTemplate.template;
    expect(dataTemplate.isAutoLaunchEnabled).toBe(false);

    const guideBases = await GuideBase.findAll({
      where: {
        createdFromTemplateId: template.id,
      },
    });
    expect(guideBases).toHaveLength(1);
    const [foundGuideBase] = guideBases;
    expect(foundGuideBase.state).toBe('active');

    await GuideBase.destroy({
      where: { id: guideBases.map((gb) => gb.id) },
      force: true,
    });
  });
});
