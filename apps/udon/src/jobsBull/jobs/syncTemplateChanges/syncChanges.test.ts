import { Op } from 'sequelize';

import {
  MAX_RETRY_TIMES,
  setupAndSeedDatabaseForTests,
} from 'src/data/datatests';
import {
  createDummyAccounts,
  launchDefaultTemplate,
} from 'src/testUtils/dummyDataHelpers';
import { Step } from 'src/data/models/Step.model';
import { Template } from 'src/data/models/Template.model';
import { propagateTemplateChangesInPlace } from 'src/testUtils/tests.helpers';
import { Guide } from 'src/data/models/Guide.model';
import { Module } from 'src/data/models/Module.model';
import { GuideModule } from 'src/data/models/GuideModule.model';
import { addModuleToGuideBase } from 'src/interactions/branching/addModuleToGuideBase';

const getContext = setupAndSeedDatabaseForTests('bento');

jest.retryTimes(MAX_RETRY_TIMES);

describe('sync changes', () => {
  test('preserves module order', async () => {
    const { organization } = getContext();

    const templates = await Template.findAll({
      where: { organizationId: organization.id },
    });

    const template = templates[templates.length - 1];
    if (!template) throw new Error('No template');
    const [account] = await createDummyAccounts(organization, 1);

    const guideBase = await launchDefaultTemplate({ organization, account });
    await guideBase.update({ isModifiedFromTemplate: true });
    const launchedGuide = await Guide.findOne({
      where: { accountId: account.id },
    });

    expect(launchedGuide).toBeTruthy();

    if (!launchedGuide) throw new Error('No guide launched');

    const currGuideModule = await launchedGuide!.$get('guideModules', {
      include: [Step],
    })!;

    const moduleToAdd = (await Module.findOne({
      where: {
        id: { [Op.not]: currGuideModule?.[0].createdFromModuleId },
        organizationId: organization.id,
      },
    })) as Module;

    if (!moduleToAdd)
      throw new Error('No new module found, may be not seeded correctly');

    await addModuleToGuideBase({
      guideBase,
      module: moduleToAdd!,
      shouldOnlyAddToNewGuidesDynamically: false,
      guide: launchedGuide,
      step: currGuideModule[0].steps[0]!,
    });

    const gmsAfterAdding = await GuideModule.findAll({
      where: { guideId: launchedGuide.id },
    });

    expect(gmsAfterAdding.length).toBeGreaterThan(currGuideModule.length);

    await propagateTemplateChangesInPlace(template);

    const gmsAfterPropagation = await GuideModule.findAll({
      where: { guideId: launchedGuide.id },
    });

    gmsAfterPropagation.forEach((gm, i) => {
      expect(gm.entityId).toBe(gmsAfterAdding[i].entityId);
    });
  });
});
