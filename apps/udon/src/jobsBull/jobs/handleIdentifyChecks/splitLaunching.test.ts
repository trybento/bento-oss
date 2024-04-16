import { Op } from 'sequelize';

import { setupAndSeedDatabaseForTests } from 'src/data/datatests';

import { GuideTypeEnum } from 'bento-common/types';
import { logger } from 'src/utils/logger';
import { allElementsEqual } from 'src/utils/helpers';

import {
  configureAutolaunchForTemplateTest,
  generateTemplates,
  getDummySplitTestTemplate,
} from 'src/interactions/targeting/testHelpers';
import { createDummyAccounts } from 'src/testUtils/dummyDataHelpers';
import { doAccountChecks } from 'src/jobsBull/jobs/handleIdentifyChecks/handleIdentifyChecks';
import { isCacheHit } from 'src/interactions/caching/identifyChecksCache';
import { Template } from 'src/data/models/Template.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { TemplateSplitTarget } from 'src/data/models/TemplateSplitTarget.model';
import { Organization } from 'src/data/models/Organization.model';

jest.mock('src/interactions/caching/identifyChecksCache', () => ({
  ...jest.requireActual('src/interactions/caching/identifyChecksCache'),
  isCacheHit: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

const getContext = setupAndSeedDatabaseForTests('bento');

const prepareSplitTestSetup = async (organization: Organization) => {
  const source = await Template.findOne({
    where: {
      organizationId: organization.id,
      type: {
        [Op.ne]: GuideTypeEnum.splitTest,
      },
    },
  });

  if (!source) throw new Error('No source template');

  const newTemplates = await generateTemplates({
    organization,
    source,
    count: 2,
  });

  const template = await getDummySplitTestTemplate(
    organization,
    newTemplates.map((t) => t.entityId)
  );

  await configureAutolaunchForTemplateTest({ template });

  return {
    template,
    newTemplates,
  };
};

describe('split tests', () => {
  test('launches split tests', async () => {
    const { organization } = getContext();

    await prepareSplitTestSetup(organization);

    const accounts = await createDummyAccounts(organization, 20);
    const selected: number[] = [];

    for (const account of accounts) {
      (isCacheHit as jest.Mock).mockReturnValue(false);
      await doAccountChecks({
        organization,
        account,
        attributes: {},
        accountChanged: true,
        logger,
        withAttributeRecording: false,
      });

      const guideBase = await GuideBase.findOne({
        where: {
          accountId: account.id,
        },
      });

      if (!guideBase) throw new Error('No guide base made');

      if (guideBase.createdFromTemplateId)
        selected.push(guideBase.createdFromTemplateId);
    }

    expect(allElementsEqual(selected)).toBeFalsy();
  });

  test('should launch evenly with triggered times method', async () => {
    const { organization } = getContext();

    await prepareSplitTestSetup(organization);

    const accounts = await createDummyAccounts(organization, 20);
    const counts: Record<number, number> = {};

    for (const account of accounts) {
      (isCacheHit as jest.Mock).mockReturnValue(false);
      await doAccountChecks({
        organization,
        account,
        attributes: {},
        accountChanged: true,
        logger,
        withAttributeRecording: false,
      });

      const guideBase = await GuideBase.findOne({
        where: {
          accountId: account.id,
        },
      });

      if (!guideBase) throw new Error('No guide base made');

      if (guideBase.createdFromTemplateId)
        counts[guideBase.createdFromTemplateId] =
          (counts[guideBase.createdFromTemplateId] ?? 0) + 1;
    }

    expect(allElementsEqual(Object.values(counts))).toBeTruthy();
  });

  test('launched split test will not launch again', async () => {
    const { organization } = getContext();

    const [account] = await createDummyAccounts(organization, 1);

    const { template } = await prepareSplitTestSetup(organization);

    (isCacheHit as jest.Mock).mockReturnValueOnce(false);

    await doAccountChecks({
      organization,
      account,
      attributes: {},
      logger,
    });

    for (let i = 0; i < 10; i++) {
      (isCacheHit as jest.Mock).mockReturnValueOnce(false);
      await doAccountChecks({
        organization,
        account,
        attributes: {},
        logger,
      });
    }

    const gbFromSplitTestCount = await GuideBase.count({
      where: {
        createdFromSplitTestId: template.id,
        accountId: account.id,
      },
    });

    expect(gbFromSplitTestCount).toEqual(1);
  });

  test('should not create duplicates', async () => {
    const { organization } = getContext();

    const [account] = await createDummyAccounts(organization, 1);

    const { newTemplates } = await prepareSplitTestSetup(organization);

    for (const newTemplate of newTemplates) {
      await configureAutolaunchForTemplateTest({ template: newTemplate });
    }

    (isCacheHit as jest.Mock).mockReturnValueOnce(false);

    await doAccountChecks({
      organization,
      account,
      attributes: {},
      logger,
    });

    for (const newTemplate of newTemplates) {
      const gbCount = await GuideBase.count({
        where: {
          createdFromTemplateId: newTemplate.id,
          accountId: account.id,
        },
      });

      expect(gbCount).toBeLessThanOrEqual(1);
    }
  });

  test('selected null blocks other paths', async () => {
    const { organization } = getContext();

    const [account] = await createDummyAccounts(organization, 1);

    const source = await Template.findOne({
      where: {
        organizationId: organization.id,
      },
    });

    if (!source) throw new Error('No source template');

    const [newTemplate] = await generateTemplates({
      organization,
      source,
      count: 1,
    });

    const template = await getDummySplitTestTemplate(organization, [
      null,
      null,
    ]);
    await configureAutolaunchForTemplateTest({ template });

    await doAccountChecks({
      organization,
      account,
      attributes: {},
      logger,
    });

    /* We now expect a split test path to be chosen and have launched nothing */

    await TemplateSplitTarget.update(
      {
        destinationTemplateId: newTemplate.id,
      },
      {
        where: {
          sourceTemplateId: template.id,
        },
      }
    );

    await doAccountChecks({
      organization,
      account,
      attributes: {},
      logger,
    });

    const gbsOfNewSetting = await GuideBase.count({
      where: {
        accountId: account.id,
        createdFromTemplateId: newTemplate.id,
      },
    });

    expect(gbsOfNewSetting).toEqual(0);
  });
});
