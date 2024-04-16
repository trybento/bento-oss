import {
  MAX_RETRY_TIMES,
  setupAndSeedDatabaseForTests,
} from 'src/data/datatests';
import { launchDefaultTemplate } from 'src/testUtils/dummyDataHelpers';
import { Guide } from 'src/data/models/Guide.model';
import { GuideModule } from 'src/data/models/GuideModule.model';
import { Step } from 'src/data/models/Step.model';

import { calculateStepOrderIndex } from './calculateStepOrderIndex';

const getContext = setupAndSeedDatabaseForTests('bento');

jest.retryTimes(MAX_RETRY_TIMES);

const createAndGetGuide = async () => {
  const { organization, account } = getContext();
  await launchDefaultTemplate({ account, organization });

  return Guide.findOne({
    include: [
      {
        model: GuideModule,
        include: [Step],
      },
    ],
    where: { organizationId: organization.id },
  });
};

describe('calculateStepOrderIndex', () => {
  test("should correctly return the each step's orderIndex relative to the guide", async () => {
    const guide = await createAndGetGuide();
    const guideSteps = guide?.guideModules.map((gm) => gm.steps).flat() || [];

    let accOrderIndex = 0;
    for (const module of guide!.guideModules) {
      for (const step of module.steps) {
        const orderIndex = await calculateStepOrderIndex(step, guideSteps);
        expect(orderIndex).toEqual(accOrderIndex);
        accOrderIndex++;
      }
    }
  });
});
