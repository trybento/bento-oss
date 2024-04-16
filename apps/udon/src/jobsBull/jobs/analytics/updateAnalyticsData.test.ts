import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import { Guide } from 'src/data/models/Guide.model';
import { Template } from 'src/data/models/Template.model';
import { Step } from 'src/data/models/Step.model';

import {
  createDummyAccounts,
  createDummyAccountUsers,
  completeGuide,
} from 'src/testUtils/dummyDataHelpers';
import {
  configureAndLaunchToUser,
  generateTemplates,
} from 'src/interactions/targeting/testHelpers';
import { updateStepDataForStepPrototypes } from './updateStepData';
import { StepData } from 'src/data/models/Analytics/StepData.model';

const getContext = setupAndSeedDatabaseForTests('paydayio');

describe('update step data', () => {
  test('rolls up completion', async () => {
    const { organization, account, accountUser } = getContext();

    const { guideParticipant: gp } = await configureAndLaunchToUser({
      organization,
      account,
      accountUser,
    });

    if (!gp) throw new Error('Could not create gp for test');

    const guide = await Guide.findOne({
      where: {
        id: gp.guideId,
      },
      include: [{ model: Template }],
    });

    if (!guide) throw new Error('No guide to test');

    await completeGuide(guide, accountUser);

    const exampleStep = await Step.findOne({
      where: {
        guideId: guide.id,
      },
    });

    if (!exampleStep) throw new Error('No step found');

    await updateStepDataForStepPrototypes({
      stepPrototypeIds: [exampleStep.createdFromStepPrototypeId],
    });

    const stepData = await StepData.findOne({
      where: {
        stepPrototypeId: exampleStep.createdFromStepPrototypeId,
      },
    });

    expect(stepData?.completedSteps).toBeGreaterThan(0);
  });

  test('step rows do not bleed across guides', async () => {
    const { organization, account, accountUser } = getContext();

    const { guideParticipant: gp } = await configureAndLaunchToUser({
      organization,
      account,
      accountUser,
    });

    if (!gp) throw new Error('Could not create gp for test');

    const guide = await Guide.findOne({
      where: {
        id: gp.guideId,
      },
      include: [{ model: Template }],
    });

    if (!guide) throw new Error('No guide to test');

    const [copyTemplate] = await generateTemplates({
      organization,
      useExistingModules: true,
      source: guide.createdFromTemplate!,
    });

    const [newAccount] = await createDummyAccounts(organization);
    const [newAccountUser] = await createDummyAccountUsers(
      organization,
      newAccount
    );

    const { guideParticipant: newGp } = await configureAndLaunchToUser({
      organization,
      account: newAccount,
      accountUser: newAccountUser,
      sourceTemplate: copyTemplate,
    });

    if (!newGp) throw new Error('Could not launch to second gp');

    await completeGuide(guide, accountUser);

    const exampleStep = await Step.findOne({
      where: {
        guideId: guide.id,
      },
    });

    if (!exampleStep) throw new Error('No step found');

    await updateStepDataForStepPrototypes({
      stepPrototypeIds: [exampleStep.createdFromStepPrototypeId],
    });

    const stepData = await StepData.findAll({
      where: {
        stepPrototypeId: exampleStep.createdFromStepPrototypeId,
      },
    });

    expect(stepData.length).toBeGreaterThanOrEqual(2);

    const dataThatShouldHaveCompletion = stepData.find(
      (sd) => sd.templateId === guide.createdFromTemplateId
    );

    if (!dataThatShouldHaveCompletion)
      throw new Error('No completion data generated');

    expect(dataThatShouldHaveCompletion).toBeTruthy();
    expect(dataThatShouldHaveCompletion.completedSteps).toBeGreaterThan(0);

    const otherData = stepData.filter(
      (sd) => sd.id !== dataThatShouldHaveCompletion.id
    );

    otherData.forEach((sd) => {
      expect(sd.completedSteps).toEqual(0);
    });
  });
});
