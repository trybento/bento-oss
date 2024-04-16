import { setupGraphQLTestServer } from 'src/graphql/testHelpers';
import { Template } from 'src/data/models/Template.model';
import { Module } from 'src/data/models/Module.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { GuideTypeEnum, StepType } from 'bento-common/types';
import { pick } from 'lodash';

import * as queues from 'src/jobsBull/queues';
import { TemplateModule } from 'src/data/models/TemplateModule.model';
import { applyFinalCleanupHook } from 'src/data/datatests';
import { JobType } from 'src/jobsBull/job';

applyFinalCleanupHook();

const graphqlTestHelpers = setupGraphQLTestServer('bento');
const { executeAdminQuery, getAdminContext } = graphqlTestHelpers;

const editTemplateQuery = `
  mutation ($data: EditTemplateInput!) {
    editTemplate(input: $data) {
      template {
        isAutoLaunchEnabled
        state
      }
    }
  }
`;

/* Pulled from relay-types of this mutation */
type EditTemplateInput = {
  templateData: EditTemplateTemplateInput;
};
type EditTemplateTemplateInput = {
  entityId: string;
  privateName?: string | null;
  name?: string | null;
  description?: string | null;
  modules: Array<EditTemplateModuleInput>;
  type: GuideTypeEnum | null;
};
type EditTemplateModuleInput = {
  entityId?: string | null;
  name?: string | null;
  stepPrototypes: Array<EditTemplateStepPrototypeInput>;
  displayTitle?: string | null;
  description?: string | null;
};
type EditTemplateStepPrototypeInput = {
  entityId?: string | null;
  name?: string | null;
  body?: string | null;
  bodySlate?: unknown | null;
  eventName?: string | null;
  stepType?: StepType | null;
  completeForWholeAccount?: boolean | null;
};

const stepProtoKeysToPick: Array<keyof StepPrototype> = [
  'name',
  'entityId',
  'body',
  'bodySlate',
  'stepType',
];

describe('editTemplate', () => {
  let firstTemplate: Template;

  beforeEach(async () => {
    const { organization } = getAdminContext();
    const templates = await Template.findAll({
      where: {
        name: ['Manager activation', 'Employee activation'],
        organizationId: organization.id,
      },
      include: [
        {
          model: Module,
          include: [StepPrototype],
        },
      ],
    });

    expect(templates.length).toBeGreaterThan(1);

    firstTemplate = templates[0];
  });

  test('edits template', async () => {
    const spied = jest.spyOn(queues, 'queueJob');

    const { entityId, name, privateName, description, type, modules } =
      firstTemplate;

    const newName = `${name}-updated`;
    const stepProto = pick(modules[0].stepPrototypes[0], stepProtoKeysToPick);

    const data: EditTemplateInput = {
      templateData: {
        entityId,
        name: newName,
        privateName,
        description,
        type,
        modules: [
          {
            name: 'Module',
            entityId: modules[0].entityId,
            stepPrototypes: [
              stepProto as unknown as EditTemplateStepPrototypeInput,
            ],
          },
        ],
      },
    };

    await executeAdminQuery({
      query: editTemplateQuery,
      variables: { data },
    });

    const repulled = await Template.findOne({ where: { entityId } });

    expect(repulled).toBeTruthy();

    expect(spied).toBeCalledWith(
      expect.objectContaining({
        jobType: JobType.SyncTemplateChanges,
      })
    );

    expect(repulled?.name).toBe(newName);
  });

  test('edits contained modules', async () => {
    const { entityId, name, description, type, modules, organizationId } =
      firstTemplate;

    const data: EditTemplateInput = {
      templateData: {
        entityId,
        name,
        description,
        type,
        modules: modules.map(
          ({ description, entityId, stepPrototypes }, i) => ({
            name: `Module-${i}`,
            description,
            entityId,
            stepPrototypes: stepPrototypes.map(
              (sp) =>
                pick(
                  sp,
                  stepProtoKeysToPick
                ) as unknown as EditTemplateStepPrototypeInput
            ),
          })
        ),
      },
    };

    await executeAdminQuery({
      query: editTemplateQuery,
      variables: { data },
    });

    const editedModule = await Module.findOne({
      where: { name: 'Module-0', organizationId },
    });

    expect(editedModule).toBeTruthy();
  });

  test('removes modules', async () => {
    const { organization } = getAdminContext();
    const template = await Template.findOne({
      where: {
        organizationId: organization.id,
        name: 'Admin setup',
      },
      include: [{ model: Module, include: [StepPrototype] }],
    });

    if (!template) throw 'No default template';

    const { entityId, name, description, type, modules } = template;

    expect(modules.length).toBeGreaterThan(1);

    const data: EditTemplateInput = {
      templateData: {
        entityId,
        name,
        description,
        type,
        modules: modules
          .map(({ description, entityId, stepPrototypes }, i) => ({
            name: `Module-${i}`,
            description,
            entityId,
            stepPrototypes: stepPrototypes.map(
              (sp) =>
                pick(
                  sp,
                  stepProtoKeysToPick
                ) as unknown as EditTemplateStepPrototypeInput
            ),
          }))
          .filter((m) => m.name === 'Module-0'),
      },
    };

    await executeAdminQuery({
      query: editTemplateQuery,
      variables: { data },
    });

    const templateModules = await TemplateModule.count({
      where: { templateId: template.id },
    });

    expect(templateModules).toBe(1);
  });

  test('adds modules', async () => {
    const { organization } = getAdminContext();
    const template = await Template.findOne({
      where: {
        organizationId: organization.id,
        name: 'Organization setup',
      },
      include: [{ model: Module, include: [StepPrototype] }],
    });

    if (!template) throw 'No default template';

    const { entityId, name, description, type, modules } = template;

    const originalLength = modules.length;
    expect(originalLength).toBe(1);

    const newModule = await Module.findOne({
      where: {
        organizationId: organization.id,
        name: 'Set up your employee profile',
      },
      include: [StepPrototype],
    });

    if (!newModule) throw 'No module to add';

    const data: EditTemplateInput = {
      templateData: {
        entityId,
        name,
        description,
        type,
        modules: [...modules, newModule].map(
          ({ name, description, entityId, stepPrototypes }, i) => ({
            name,
            displayTitle: `Module-${i}`,
            description,
            entityId,
            stepPrototypes: stepPrototypes.map(
              (sp) =>
                pick(
                  sp,
                  stepProtoKeysToPick
                ) as unknown as EditTemplateStepPrototypeInput
            ),
          })
        ),
      },
    };

    await executeAdminQuery({
      query: editTemplateQuery,
      variables: { data },
    });

    const templateModules = await TemplateModule.count({
      where: { templateId: template.id },
    });

    expect(templateModules).toBeGreaterThan(originalLength);
  });

  test('calls sync chanegs to templates and modules', async () => {
    const spied = jest.spyOn(queues, 'queueJob');
    const { entityId, name, description, type, modules } = firstTemplate;

    const data: EditTemplateInput = {
      templateData: {
        entityId,
        name,
        description,
        type,
        modules: modules.map(
          ({ name, description, entityId, stepPrototypes }) => ({
            name: `${name}-updated`,
            description,
            entityId,
            stepPrototypes: stepPrototypes.map(
              (sp) =>
                pick(
                  sp,
                  stepProtoKeysToPick
                ) as unknown as EditTemplateStepPrototypeInput
            ),
          })
        ),
      },
    };

    await executeAdminQuery({
      query: editTemplateQuery,
      variables: { data },
    });

    const repulled = await Template.findOne({ where: { entityId } });

    expect(repulled).toBeTruthy();

    expect(spied).toBeCalledWith(
      expect.objectContaining({
        jobType: JobType.SyncTemplateChanges,
      })
    );

    const calls = spied.mock.calls;

    expect(
      calls.some((call) => call[0] && (call[0] as any).type === 'module')
    ).toBeTruthy();
  });
});
