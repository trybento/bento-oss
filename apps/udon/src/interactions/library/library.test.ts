import {
  StepType,
  BranchingEntityType,
  GuideFormFactor,
  GuideTypeEnum,
  Theme,
  TemplateState,
} from 'bento-common/types';

import {
  getDummyAccount,
  getDummyString,
  getDummyUuid,
} from 'src/testUtils/dummyDataHelpers';
import { removeBranchingChoices } from '../branching/removeBranchingChoices';

import { setupAndSeedDatabaseForTests } from 'src/data/datatests';

import { Module } from 'src/data/models/Module.model';
import { Template } from 'src/data/models/Template.model';
import { TemplateModule } from 'src/data/models/TemplateModule.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { BranchingPath } from 'src/data/models/BranchingPath.model';

import deleteTemplate from './deleteTemplate';
import duplicateModule from './duplicateModule';
import duplicateTemplate from './duplicateTemplate';
import { duplicateName } from 'bento-common/data/helpers';
import updateTemplatesForDeletedModule from './updateTemplatesForDeletedModule';
import findOrCreateAccount from '../findOrCreateAccount';
import { launchGuideBase } from '../launching/launchGuideBase';
import { createGuideBase } from '../createGuideBase';
import { updateManualLaunchFlagForTemplates } from './library.helpers';

const getContext = setupAndSeedDatabaseForTests('bento');

jest.mock('src/jobsBull/queues', () => ({
  ...jest.requireActual('src/jobsBull/queues'),
  queueJob: jest.fn(),
}));

describe('module duplication', () => {
  test('can duplicate module', async () => {
    const { organization, user } = getContext();

    const module = await Module.findOne({
      where: { organizationId: organization.id },
    });

    if (!module) throw 'No seeded modules';

    const numModules1 = await Module.count({
      where: { organizationId: organization.id },
    });

    const moduleName = module.name;
    const newModule = await duplicateModule({
      organization,
      module,
      user,
      theme: undefined,
    });
    const numModules2 = await Module.count({
      where: { organizationId: organization.id },
    });

    expect(numModules2).toBeGreaterThan(numModules1);
    expect(newModule).toBeTruthy();
    expect(newModule.name).toBe(duplicateName(moduleName));
  });

  test('can duplicate module, preserving name', async () => {
    const { organization, user } = getContext();

    const module = await Module.findOne({
      where: { organizationId: organization.id },
    });

    if (!module) throw 'No seeded modules';

    const moduleName = module.name;
    const newModule = await duplicateModule({
      organization,
      module,
      user,
      preserveName: true,
      theme: undefined,
    });

    expect(newModule.name).toBe(moduleName);
  });
});

describe('template duplication', () => {
  test('can duplicate template and re-use modules', async () => {
    const { organization, user } = getContext();

    const template = await Template.findOne({
      where: { organizationId: organization.id },
    });

    if (!template) throw 'No seeded templates';

    const numTemplates1 = await Template.count({
      where: { organizationId: organization.id },
    });
    const numModules1 = await Module.count({
      where: { organizationId: organization.id },
    });

    await duplicateTemplate({
      template,
      organization,
      user,
      useExistingModules: true,
    });

    const numTemplates2 = await Template.count({
      where: { organizationId: organization.id },
    });
    const numModules2 = await Module.count({
      where: { organizationId: organization.id },
    });

    expect(numTemplates2).toBeGreaterThan(numTemplates1);
    expect(numModules2).toBe(numModules1);
  });

  test('can duplicate template and also duplicate its modules', async () => {
    const { organization, user } = getContext();

    const template = await Template.findOne({
      where: { organizationId: organization.id },
    });

    if (!template) throw 'No seeded templates';

    const numTemplates1 = await Template.count({
      where: { organizationId: organization.id },
    });
    const numModules1 = await Module.count({
      where: { organizationId: organization.id },
    });

    await duplicateTemplate({
      template,
      organization,
      user,
    });

    const numTemplates2 = await Template.count({
      where: { organizationId: organization.id },
    });
    const numModules2 = await Module.count({
      where: { organizationId: organization.id },
    });

    expect(numTemplates2).toBeGreaterThan(numTemplates1);
    expect(numModules2).toBeGreaterThan(numModules1);
  });

  test('can create guide templates', async () => {
    const { organization } = getContext();

    const template = await Template.findOne({
      where: { organizationId: organization.id },
    });

    if (!template) throw 'No seeded templates';

    await duplicateTemplate({
      template,
      organization,
      markAsTemplate: true,
      preserveName: true,
    });

    const guideTemplate = await Template.findOne({
      where: { organizationId: organization.id, isTemplate: true },
    });

    expect(guideTemplate?.name).toBe(template.name);
  });
});

describe('content deletion', () => {
  test('template deletes can remove modules', async () => {
    const { organization } = getContext();

    const template = await Template.findOne({
      where: { organizationId: organization.id },
    });

    if (!template) throw 'No templates';

    const templateModules = await TemplateModule.scope('withModule').findAll({
      where: { templateId: template.id },
    });

    expect(templateModules.length).toBeGreaterThan(0);

    const newModule = await duplicateModule({
      module: templateModules[0].module,
      organization,
      theme: undefined,
    });

    await TemplateModule.update(
      { moduleId: newModule.id },
      { where: { templateId: template.id } }
    );

    await deleteTemplate({ organization, template, deleteModules: true });

    const deletedModule = await Module.findOne({ where: { id: newModule.id } });

    expect(deletedModule).toBeFalsy();
  });

  test('template deletes preserve re-used modules', async () => {
    const { organization } = getContext();

    const template = await Template.findOne({
      where: { organizationId: organization.id },
      include: [Module],
    });

    if (!template) throw 'No templates';

    await duplicateTemplate({
      template,
      organization,
      useExistingModules: true,
    });

    const moduleId = template.modules[0].id;

    await deleteTemplate({ organization, template, deleteModules: true });

    const survivingModule = await Module.findAll({ where: { id: moduleId } });

    expect(survivingModule).toBeTruthy();
  });

  test('template deletes preserve when multiple template_modules exist', async () => {
    const { organization } = getContext();

    const template = await Template.findOne({
      where: { organizationId: organization.id },
      include: [Module],
    });

    if (!template) throw 'No templates';

    const tName = getDummyString();
    const newTemplate = await Template.create({
      organizationId: organization.id,
      state: TemplateState.draft,
      name: tName,
      description: tName,
      type: GuideTypeEnum.account,
      isSideQuest: false,
      formFactor: GuideFormFactor.inline,
      theme: Theme.flat,
    });

    const moduleId = template.modules[0].id;

    await TemplateModule.create({
      templateId: newTemplate.id,
      orderIndex: 0,
      organizationId: organization.id,
      moduleId,
    });

    await deleteTemplate({ organization, template, deleteModules: true });

    const survivingModule = await Module.findAll({ where: { id: moduleId } });

    expect(survivingModule).toBeTruthy();
  });

  test('module deletes remove themselves from associated templates', async () => {
    const { organization } = getContext();

    const template = await Template.findOne({
      where: { organizationId: organization.id },
    });

    if (!template) throw 'No templates';

    const templateModules = await TemplateModule.scope('withModule').findAll({
      where: { templateId: template.id },
    });

    if (!templateModules.length) throw 'No modules';

    const module = templateModules[0].module;

    await updateTemplatesForDeletedModule({ organization, module });
    await module.destroy();

    const afterDelete = await TemplateModule.count({
      where: { templateId: template.id },
    });

    expect(afterDelete).toBeLessThan(templateModules.length);
  });

  test('removes branching paths pointed to removed content', async () => {
    const { organization } = getContext();

    const choiceKey = getDummyUuid();

    const stepProto = await StepPrototype.findOne({
      where: { organizationId: organization.id },
    });
    const targetModule = await Module.findOne({
      where: { organizationId: organization.id },
    });

    if (!stepProto || !targetModule) throw 'No step prototypes';

    await stepProto.update({
      branchingChoices: [{ label: choiceKey, choiceKey }],
      stepType: StepType.branching,
    });

    const moduleId = targetModule.id;

    await BranchingPath.create({
      branchingKey: stepProto.entityId,
      choiceKey,
      organizationId: organization.id,
      entityType: BranchingEntityType.Module,
      actionType: 'create',
      moduleId,
    });

    expect(stepProto.branchingChoices?.length).toBeGreaterThan(0);

    await removeBranchingChoices({ moduleId: targetModule.id, organization });
    await targetModule.destroy();

    const bpsNow = await BranchingPath.findAll({ where: { moduleId } });
    expect(bpsNow.length).toEqual(0);
  });

  test('removes only relevant branching path', async () => {
    const { organization } = getContext();

    const choiceKey = getDummyUuid();
    const otherChoice = getDummyUuid();

    const stepProto = await StepPrototype.findOne({
      where: { organizationId: organization.id },
    });
    const targetModule = await Module.findOne({
      where: { organizationId: organization.id },
    });

    if (!stepProto || !targetModule) throw 'No step prototypes';

    await stepProto.update({
      branchingChoices: [
        { label: choiceKey, choiceKey },
        { label: otherChoice, choiceKey: otherChoice },
      ],
      stepType: StepType.branching,
    });

    const moduleId = targetModule.id;

    await BranchingPath.create({
      branchingKey: stepProto.entityId,
      choiceKey,
      organizationId: organization.id,
      entityType: BranchingEntityType.Module,
      actionType: 'create',
      moduleId,
    });

    expect(stepProto.branchingChoices?.length).toBeGreaterThan(0);

    await removeBranchingChoices({ moduleId: targetModule.id, organization });
    await targetModule.destroy();

    await stepProto.reload();

    expect(stepProto.branchingChoices?.length).toEqual(1);
  });
});

describe('updateManualLaunchFlagForTemplates', () => {
  test('should set manually_launched to TRUE if active manually-launched guide base exists', async () => {
    const { organization } = getContext();

    const template = await Template.findOne({
      where: { organizationId: organization.id },
    });

    if (!template) {
      throw new Error('Expected template');
    }

    const { account } = await findOrCreateAccount({
      organization,
      accountInput: getDummyAccount(organization),
    });

    const guideBase = await createGuideBase({
      account,
      templateEntityId: template!.entityId,
      wasAutoLaunched: false,
    });

    await launchGuideBase({ guideBase });
    await updateManualLaunchFlagForTemplates({
      templateIds: [template.id],
    });

    await template.reload();

    expect(template.manuallyLaunched).toBe(true);
  });

  test('should set manually_launched to FALSE if non-active manually-launched guide base exists', async () => {
    const { organization } = getContext();

    const template = await Template.findOne({
      where: { organizationId: organization.id },
    });

    if (!template) {
      throw new Error('Expected template');
    }

    const { account } = await findOrCreateAccount({
      organization,
      accountInput: getDummyAccount(organization),
    });

    await createGuideBase({
      account,
      templateEntityId: template!.entityId,
      wasAutoLaunched: false,
    });

    await updateManualLaunchFlagForTemplates({
      templateIds: [template.id],
    });

    await template.reload();

    expect(template.manuallyLaunched).toBe(false);
  });

  test('should set manually_launched to FALSE if no manually-launched guide base exists', async () => {
    const { organization } = getContext();

    const template = await Template.findOne({
      where: { organizationId: organization.id },
    });

    if (!template) {
      throw new Error('Expected template');
    }

    await updateManualLaunchFlagForTemplates({
      templateIds: [template.id],
    });

    await template.reload();

    expect(template.manuallyLaunched).toBe(false);
  });
});
