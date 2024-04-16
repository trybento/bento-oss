import { addDays, subDays } from 'date-fns';
import { merge } from 'lodash';
import {
  NpsEndingType,
  NpsPageTargetingType,
  NpsStartingType,
  NpsSurveyInput,
} from 'bento-common/types/netPromoterScore';

import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import { getDummyString } from 'src/testUtils/dummyDataHelpers';
import { Organization } from 'src/data/models/Organization.model';
import {
  handleScheduledNpsEnd,
  handleScheduledNpsLaunch,
} from './manageNpsSurveys';
import NpsSurveyInstance from 'src/data/models/NetPromoterScore/NpsSurveyInstance.model';
import upsertNpsSurvey from 'src/interactions/netPromoterScore/upsertNpsSurvey';
import launchNpsSurvey from 'src/interactions/netPromoterScore/launchNpsSurvey';

jest.mock('date-fns', () => {
  const original = jest.requireActual('date-fns');
  return {
    ...original,
    // mocks this to not fail the date validation when launching the survey
    startOfTomorrow: jest.fn(() => subDays(new Date(), 5)), // 5 days ago
  };
});

afterEach(() => {
  jest.restoreAllMocks();
});

const getContext = setupAndSeedDatabaseForTests('bento');

/** By defaults creates one that should have launched and not yet ended */
const createScheduledNps = async (
  organization: Organization,
  overrides: Partial<NpsSurveyInput> = {}
) => {
  const [survey] = await upsertNpsSurvey({
    organization,
    input: merge(
      {
        name: getDummyString(),
        question: getDummyString(),
        startingType: NpsStartingType.dateBased,
        endingType: NpsEndingType.dateBased,
        startAt: subDays(new Date(), 1),
        endAt: addDays(new Date(), 1),
        priorityRanking: 0,
        pageTargeting: {
          type: NpsPageTargetingType.anyPage,
        },
      },
      overrides
    ),
  });

  return launchNpsSurvey({ organization, entityId: survey.entityId });
};

describe('scheduled nps management', () => {
  test('correctly picks up and launch the expected surveys', async () => {
    const { organization } = getContext();

    const survey = await createScheduledNps(organization);

    // launches a single survey
    expect(await handleScheduledNpsLaunch()).toMatchObject([1, 0]);

    const surveyInstanceCount = await NpsSurveyInstance.scope([
      { method: ['fromSurvey', [survey.id]] },
    ]).count();

    // confirm the instance has been created
    expect(surveyInstanceCount).toEqual(1);

    // this time there is nothing else to launch
    expect(await handleScheduledNpsLaunch()).toMatchObject([0, 0]);
  });

  test('ignores future launch dates', async () => {
    const { organization } = getContext();

    await createScheduledNps(organization, {
      startAt: subDays(new Date(), -5),
      endAt: subDays(new Date(), -8),
    });

    expect(await handleScheduledNpsLaunch()).toMatchObject([0, 0]);
  });

  test('ignores manually launched', async () => {
    const { organization } = getContext();

    await createScheduledNps(organization, {
      startingType: NpsStartingType.manual,
      startAt: null,
    });

    expect(await handleScheduledNpsLaunch()).toMatchObject([0, 0]);
  });

  test('correctly picks up and end the expected surveys', async () => {
    const { organization } = getContext();

    const survey = await createScheduledNps(organization, {
      startAt: subDays(new Date(), 1),
      endAt: subDays(new Date(), 1),
    });

    const [launched] = await handleScheduledNpsLaunch();

    if (!launched) throw new Error('Failed to launch Survey');

    expect(await handleScheduledNpsEnd()).toMatchObject([
      1,
      [expect.any(NpsSurveyInstance)],
    ]);

    const endedInstance = await NpsSurveyInstance.scope([
      { method: ['fromSurvey', [survey.id]] },
    ]).findOne();

    expect(endedInstance!.endedAt).toEqual(expect.any(Date));
  });

  test('will not end pre-emptively', async () => {
    const { organization } = getContext();

    await createScheduledNps(organization, {
      endAt: addDays(new Date(), 3),
    });

    await handleScheduledNpsLaunch();

    expect(await handleScheduledNpsEnd()).toMatchObject([0, []]);
  });
});
