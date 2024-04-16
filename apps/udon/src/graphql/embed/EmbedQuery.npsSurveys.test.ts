import { NpsFormFactor } from 'bento-common/types/netPromoterScore';

import { setupGraphQLTestServer } from '../testHelpers';
import { applyFinalCleanupHook } from 'src/data/datatests';
import npsParticipantForAccountUserLoader from 'src/data/loaders/NpsSurvey/npsParticipantForAccountUser.loader';
import npsSurveyOfParticipantLoader from 'src/data/loaders/NpsSurvey/npsSurveyOfParticipant.loader';
import npsParticipantForSurveyLoader from 'src/data/loaders/NpsSurvey/npsParticipantForSurvey.loader';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { randomInt } from 'src/utils/helpers';
import { createDummyNps } from 'src/testUtils/tests.helpers';
import NpsSurveyInstance from 'src/data/models/NetPromoterScore/NpsSurveyInstance.model';
import NpsSurvey from 'src/data/models/NetPromoterScore/NpsSurvey.model';
import upsertNpsSurvey from 'src/interactions/netPromoterScore/upsertNpsSurvey';
import launchNpsSurvey from 'src/interactions/netPromoterScore/launchNpsSurvey';
import { createGuides } from 'src/testUtils/dummyDataHelpers';
import addUsersToNpsSurveysBasedOnTargeting from 'src/interactions/netPromoterScore/addUsersToNpsSurveysBasedOnTargeting';
import answerNpsSurvey from 'src/interactions/netPromoterScore/answerNpsSurvey';

applyFinalCleanupHook();

jest.mock('src/utils/features', () => ({
  ...jest.requireActual('src/utils/features'),
  enableNpsSurveys: {
    enabled: jest.fn(() => true),
  },
}));

const { executeEmbedQuery, executeAdminQuery, getEmbedContext } =
  setupGraphQLTestServer('bento');

const getNpsQuery = `
  query EmbedQueryTest {
    npsSurveys {
      entityId
      name
      formFactor
      orderIndex
      firstSeenAt
    }
  }
`;

type TestEmbedNpsSurvey = {
  entityId: string;
  name: string;
  formFactor: NpsFormFactor;
  orderIndex: number;
  firstSeenAt: Date | null;
};

const getNpsParticipant = async (accountUser: AccountUser) => {
  const npsParticipant = await npsParticipantForAccountUserLoader().load(
    accountUser.id
  );

  return Promise.all(
    npsParticipant.map((np) =>
      np.reload({
        include: [
          {
            model: NpsSurveyInstance,
            required: true,
            include: [
              {
                model: NpsSurvey,
                required: true,
              },
            ],
          },
        ],
      })
    )
  );
};

describe('pending embed nps surveys', () => {
  test('loader: one survey', async () => {
    const { accountUser, organization } = getEmbedContext();

    const [created] = await createDummyNps(organization, accountUser);
    const { npsSurvey } = created;

    expect(!!npsSurvey.name).toBeTruthy();

    const participants = await getNpsParticipant(accountUser);

    expect(participants.length).toBeGreaterThan(0);

    const instance = await participants[0].instance;
    const survey = instance?.survey
      ? instance.survey
      : await instance?.$get('survey');

    if (!survey) throw new Error('No survey was found');

    expect(survey.name).toEqual(npsSurvey.name);
  });

  test('loader: two surveys, prioritized', async () => {
    const { accountUser, organization } = getEmbedContext();

    const TO_CREATE = 3;
    const created = await createDummyNps(organization, accountUser, TO_CREATE);

    expect(created.length).toEqual(TO_CREATE);

    const { npsSurvey } = created[0];

    expect(!!npsSurvey.name).toBeTruthy();

    const participants = await getNpsParticipant(accountUser);

    expect(participants.length).toBeGreaterThan(0);

    const instance = await participants[0].instance;
    const survey = instance?.survey
      ? instance.survey
      : await instance?.$get('survey');

    if (!survey) throw new Error('No survey was found');

    /* Always expect the first one */
    expect(survey.name).toEqual(npsSurvey.name);
    expect(survey.priorityRanking).toEqual(0);
  });

  test('loader: get survey from participant', async () => {
    const { accountUser, organization } = getEmbedContext();
    const [created] = await createDummyNps(organization, accountUser);
    const { npsParticipant, npsSurvey } = created;

    const survey = await npsSurveyOfParticipantLoader().load(npsParticipant.id);

    if (!survey) throw new Error('Loader found no NPS survey');

    expect(survey.name).toEqual(npsSurvey.name);
  });

  test('loader: participant for survey/accountUser', async () => {
    const { accountUser, organization } = getEmbedContext();

    const [created] = await createDummyNps(organization, accountUser);
    const { npsSurvey, npsParticipant } = created;

    const participant = await npsParticipantForSurveyLoader().load({
      accountUserId: accountUser.id,
      npsSurveyId: npsSurvey.id,
    });

    if (!participant) throw new Error('Loader found no NPS participant');

    expect(participant.id).toEqual(npsParticipant.id);
  });

  test('resolver: gets one nps', async () => {
    const { accountUser, organization } = getEmbedContext();
    const [created] = await createDummyNps(organization, accountUser);
    const { npsSurvey, npsParticipant } = created;

    const response = (await executeEmbedQuery({
      query: getNpsQuery,
      variables: {},
    })) as { data: { npsSurveys: TestEmbedNpsSurvey[] } };

    const fetchedSurvey = response.data.npsSurveys[0];

    expect(fetchedSurvey.name).toEqual(npsSurvey.name);
    expect(fetchedSurvey.entityId).toEqual(npsParticipant.entityId);
  });

  test('resolver: will not return actual list', async () => {
    const { accountUser, organization } = getEmbedContext();
    await createDummyNps(organization, accountUser, randomInt(2, 5));

    const response = (await executeEmbedQuery({
      query: getNpsQuery,
      variables: {},
    })) as { data: { npsSurveys: TestEmbedNpsSurvey[] } };

    expect(response.data.npsSurveys.length).toEqual(1);
  });

  test('orderIndex: two incomplete surveys, one guide in between', async () => {
    const embedContext = getEmbedContext();
    const { accountUser, organization } = embedContext;

    const [firstSurvey] = await upsertNpsSurvey({
      organization,
      input: {
        name: 'first survey',
        priorityRanking: 0,
      },
    });

    await launchNpsSurvey({ organization, entityId: firstSurvey.entityId });

    await createGuides({
      executeAdminQuery,
      embedContext,
      mainQuestGuidesCount: 1,
      incompletedMainQuestGuidesCount: 1,
      priorityRanking: [1],
    });

    const [secondSurvey] = await upsertNpsSurvey({
      organization,
      input: {
        name: 'second survey',
        priorityRanking: 2,
      },
    });

    await launchNpsSurvey({ organization, entityId: secondSurvey.entityId });

    await addUsersToNpsSurveysBasedOnTargeting({ accountUser });

    const response = (await executeEmbedQuery({
      query: getNpsQuery,
      variables: {},
    })) as { data: { npsSurveys: TestEmbedNpsSurvey[] } };

    expect(response.data.npsSurveys.length).toEqual(1);
    expect(response.data.npsSurveys).toMatchObject([
      {
        name: firstSurvey.name,
        orderIndex: 0,
      },
    ]);
  });

  test('orderIndex: two surveys, first answered, one guide in between', async () => {
    const embedContext = getEmbedContext();
    const { accountUser, organization } = embedContext;

    const [firstSurvey] = await upsertNpsSurvey({
      organization,
      input: {
        name: 'first survey',
        priorityRanking: 0,
      },
    });

    await launchNpsSurvey({ organization, entityId: firstSurvey.entityId });

    await createGuides({
      executeAdminQuery,
      embedContext,
      mainQuestGuidesCount: 1,
      incompletedMainQuestGuidesCount: 1,
      priorityRanking: [1],
    });

    const [secondSurvey] = await upsertNpsSurvey({
      organization,
      input: {
        name: 'second survey',
        priorityRanking: 2,
      },
    });

    await launchNpsSurvey({ organization, entityId: secondSurvey.entityId });

    const [firstParticipant] = await addUsersToNpsSurveysBasedOnTargeting({
      accountUser,
    });

    await answerNpsSurvey({
      entityId: firstParticipant.entityId,
      accountUser,
      answer: 4,
    });

    const response = (await executeEmbedQuery({
      query: getNpsQuery,
      variables: {},
    })) as { data: { npsSurveys: TestEmbedNpsSurvey[] } };

    expect(response.data.npsSurveys.length).toEqual(1);
    expect(response.data.npsSurveys).toMatchObject([
      {
        name: 'second survey',
        orderIndex: 1,
      },
    ]);
  });
});
