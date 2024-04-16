import { setupAndSeedDatabaseForTests } from 'src/data/datatests';

import { configureAndLaunchToUser } from './targeting/testHelpers';
import { autoCompleteStepsMappedToEvent } from './autoCompleteStepsMappedToEvent';
import { Step, StepCompletedByType } from 'src/data/models/Step.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { setStepAutoCompleteMapping } from './setStepAutoCompleteMapping';
import { LongRuleTypeEnum } from 'bento-common/types';

const getContext = setupAndSeedDatabaseForTests('bento');

describe('step autocomplete', () => {
  test('ignores irrelevant events', async () => {
    const { organization, account, accountUser } = getContext();

    const { guideParticipant: gp } = await configureAndLaunchToUser({
      organization,
      account,
      accountUser,
    });

    if (!gp) throw 'No guide participant created';

    const completedBefore = await Step.count({
      where: {
        guideId: gp.guideId,
        isComplete: true,
      },
    });

    await autoCompleteStepsMappedToEvent({
      accountUserExternalId: accountUser.externalId,
      eventName: 'NullAndVoidEvent',
      eventProperties: {},
      organization,
    });

    const completedAfter = await Step.count({
      where: {
        guideId: gp.guideId,
        isComplete: true,
      },
    });

    expect(completedBefore).toEqual(completedAfter);
  });

  test('can autocomplete from an event', async () => {
    const { organization, account, accountUser } = getContext();

    const eventName = 'Erin or Polly growled at the window';

    let spId = 0;

    const { guideParticipant: gp } = await configureAndLaunchToUser({
      organization,
      account,
      accountUser,
      modifyTemplate: async (template) => {
        const modules = await template.$get('modules', {
          include: [{ model: StepPrototype }],
        });

        const firstSp = modules?.[0]?.stepPrototypes?.[0];

        if (!firstSp) throw new Error('No step prototype to modify');

        spId = firstSp.id;

        await setStepAutoCompleteMapping({
          stepPrototype: firstSp,
          eventName,
          completeForWholeAccount: false,
          rules: [],
        });
      },
    });

    if (!gp) throw 'No guide participant created';

    await autoCompleteStepsMappedToEvent({
      accountUserExternalId: accountUser.externalId,
      eventName,
      eventProperties: {},
      organization,
    });

    const step = await Step.findOne({
      where: {
        guideId: gp.guideId,
        createdFromStepPrototypeId: spId,
      },
    });

    if (!step) throw 'No step';

    expect(step.isComplete).toBeTruthy();
    expect(step.completedByType).toEqual(StepCompletedByType.Auto);
  });

  test('can autocomplete from an event with properties', async () => {
    const { organization, account, accountUser } = getContext();

    const eventName = 'Erin or Polly growled at the window';

    let spId = 0;

    const { guideParticipant: gp } = await configureAndLaunchToUser({
      organization,
      account,
      accountUser,
      modifyTemplate: async (template) => {
        const modules = await template.$get('modules', {
          include: [{ model: StepPrototype }],
        });

        const firstSp = modules?.[0]?.stepPrototypes?.[0];

        if (!firstSp) throw new Error('No step prototype to modify');

        spId = firstSp.id;

        await setStepAutoCompleteMapping({
          stepPrototype: firstSp,
          eventName,
          completeForWholeAccount: false,
          rules: [
            {
              propertyName: 'times_barked',
              valueType: 'number',
              numberValue: 5,
              ruleType: LongRuleTypeEnum.gt,
            },
          ],
        });
      },
    });

    if (!gp) throw 'No guide participant created';

    await autoCompleteStepsMappedToEvent({
      accountUserExternalId: accountUser.externalId,
      eventName,
      eventProperties: {
        times_barked: 4,
      },
      organization,
    });

    const step = await Step.findOne({
      where: {
        guideId: gp.guideId,
        createdFromStepPrototypeId: spId,
      },
    });

    if (!step) throw 'No step';

    expect(step.isComplete).toBeFalsy();

    await autoCompleteStepsMappedToEvent({
      accountUserExternalId: accountUser.externalId,
      eventName,
      eventProperties: {
        times_barked: 40,
      },
      organization,
    });

    await step.reload();

    expect(step.isComplete).toBeTruthy();
  });
});
