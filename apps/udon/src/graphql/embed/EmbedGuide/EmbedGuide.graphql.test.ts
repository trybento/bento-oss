import promises from 'src/utils/promises';
import { sub } from 'date-fns';
import { GuideTypeEnum } from 'bento-common/types';

import { applyFinalCleanupHook, MAX_RETRY_TIMES } from 'src/data/datatests';
import { setupGraphQLTestServer } from 'src/graphql/testHelpers';
import { Guide } from 'src/data/models/Guide.model';
import {
  createDummyAccountUsers,
  createGuides,
} from 'src/testUtils/dummyDataHelpers';
import { TriggeredBranchingPath } from 'src/data/models/TriggeredBranchingPath.model';

applyFinalCleanupHook();

jest.retryTimes(MAX_RETRY_TIMES);

const graphqlTestHelpers = setupGraphQLTestServer('bento');
const { executeAdminQuery, executeEmbedQuery, getEmbedContext } =
  graphqlTestHelpers;

const testQuery = `
  query EmbedQueryTest($guideEntityId: EntityId!) {
    guide(guideEntityId: $guideEntityId) {
      entityId
      isSideQuest
      isViewed
      nextGuide
      previousGuide
      orderIndex
      modules {
        entityId
        steps {
          entityId
        }
      }
      steps {
        entityId
      }
      completedStepsCount
      totalSteps
      firstIncompleteStep
    }
  }
`;

type EmbedQueryReturnType = {
  data: { guide: Guide };
};

test('one guide: main quest', async () => {
  const {
    mainQuestGuides: [expectedGuide],
  } = await createGuides({
    executeAdminQuery,
    embedContext: getEmbedContext(),
  });

  const {
    data: { guide },
  } = await executeEmbedQuery<EmbedQueryReturnType>({
    query: testQuery,
    variables: { guideEntityId: expectedGuide.entityId },
  });

  expect(guide).toMatchObject({
    entityId: expectedGuide.entityId,
    isViewed: true,
    nextGuide: null,
    previousGuide: null,
    orderIndex: 0,
    completedStepsCount: 1,
    totalSteps: 3,
    firstIncompleteStep: expectedGuide.guideModules[0].steps[1].entityId,
  });
});

test('two guides: main quests', async () => {
  const { mainQuestGuides: expectedGuides } = await createGuides({
    executeAdminQuery,
    embedContext: getEmbedContext(),
    mainQuestGuidesCount: 2,
  });

  let {
    data: { guide },
  } = await executeEmbedQuery<EmbedQueryReturnType>({
    query: testQuery,
    variables: { guideEntityId: expectedGuides[0].entityId },
  });

  expect(guide).toMatchObject({
    entityId: expectedGuides[0].entityId,
    isViewed: true,
    nextGuide: expectedGuides[1].entityId,
    previousGuide: null,
    orderIndex: 0,
    completedStepsCount: 3,
    totalSteps: 3,
    firstIncompleteStep: null,
  });

  ({
    data: { guide },
  } = await executeEmbedQuery<EmbedQueryReturnType>({
    query: testQuery,
    variables: { guideEntityId: expectedGuides[1].entityId },
  }));

  expect(guide).toMatchObject({
    entityId: expectedGuides[1].entityId,
    isViewed: true,
    nextGuide: null,
    previousGuide: expectedGuides[0].entityId,
    orderIndex: 1,
    completedStepsCount: 1,
    totalSteps: 3,
    firstIncompleteStep: expectedGuides[1].guideModules[0].steps[1].entityId,
  });
});

test('three guides: main quests, two incomplete', async () => {
  const { mainQuestGuides: expectedGuides } = await createGuides({
    executeAdminQuery,
    embedContext: getEmbedContext(),
    mainQuestGuidesCount: 3,
    incompletedMainQuestGuidesCount: 2,
    completeFirstStepOfFirstIncompleteMainQuest: false,
  });

  let {
    data: { guide },
  } = await executeEmbedQuery<EmbedQueryReturnType>({
    query: testQuery,
    variables: { guideEntityId: expectedGuides[0].entityId },
  });

  expect(guide).toMatchObject({
    entityId: expectedGuides[0].entityId,
    nextGuide: expectedGuides[1].entityId,
    previousGuide: null,
    orderIndex: 0,
  });

  ({
    data: { guide },
  } = await executeEmbedQuery<EmbedQueryReturnType>({
    query: testQuery,
    variables: { guideEntityId: expectedGuides[1].entityId },
  }));

  expect(guide).toMatchObject({
    entityId: expectedGuides[1].entityId,
    nextGuide: expectedGuides[2].entityId,
    previousGuide: expectedGuides[0].entityId,
    orderIndex: 1,
  });

  ({
    data: { guide },
  } = await executeEmbedQuery<EmbedQueryReturnType>({
    query: testQuery,
    variables: { guideEntityId: expectedGuides[2].entityId },
  }));

  expect(guide).toMatchObject({
    entityId: expectedGuides[2].entityId,
    nextGuide: null,
    previousGuide: expectedGuides[1].entityId,
    orderIndex: 2,
  });
});

test('only guide: side quest', async () => {
  const {
    sideQuestGuides: [expectedGuide],
  } = await createGuides({
    executeAdminQuery,
    embedContext: getEmbedContext(),
    mainQuestGuidesCount: 0,
    sideQuestGuidesCount: 1,
    incompletedMainQuestGuidesCount: 0,
  });

  const {
    data: { guide },
  } = await executeEmbedQuery<EmbedQueryReturnType>({
    query: testQuery,
    variables: { guideEntityId: expectedGuide.entityId },
  });

  expect(guide).toMatchObject({
    entityId: expectedGuide.entityId,
    isViewed: false,
    nextGuide: null,
    previousGuide: null,
    orderIndex: 0,
    completedStepsCount: 0,
    totalSteps: 1,
    firstIncompleteStep: expectedGuide.guideModules[0].steps[0].entityId,
  });
});

test('two guides: side quests', async () => {
  const { sideQuestGuides: expectedGuides } = await createGuides({
    executeAdminQuery,
    embedContext: getEmbedContext(),
    mainQuestGuidesCount: 0,
    sideQuestGuidesCount: 2,
    incompletedMainQuestGuidesCount: 0,
  });

  let {
    data: { guide },
  } = await executeEmbedQuery<EmbedQueryReturnType>({
    query: testQuery,
    variables: { guideEntityId: expectedGuides[0].entityId },
  });

  expect(guide).toMatchObject({
    entityId: expectedGuides[0].entityId,
    isViewed: false,
    nextGuide: null,
    previousGuide: null,
    orderIndex: 0,
    completedStepsCount: 0,
    totalSteps: 1,
    firstIncompleteStep: expectedGuides[0].guideModules[0].steps[0].entityId,
  });

  ({
    data: { guide },
  } = await executeEmbedQuery<EmbedQueryReturnType>({
    query: testQuery,
    variables: { guideEntityId: expectedGuides[1].entityId },
  }));

  expect(guide).toMatchObject({
    entityId: expectedGuides[1].entityId,
    isViewed: false,
    nextGuide: null,
    previousGuide: null,
    orderIndex: 1,
    completedStepsCount: 0,
    totalSteps: 1,
    firstIncompleteStep: expectedGuides[1].guideModules[0].steps[0].entityId,
  });
});

test('three guides: mixed', async () => {
  const {
    mainQuestGuides,
    sideQuestGuides: [sideQuestGuide],
  } = await createGuides({
    executeAdminQuery,
    embedContext: getEmbedContext(),
    mainQuestGuidesCount: 2,
    sideQuestGuidesCount: 1,
    priorityRanking: [0, 1, 2],
  });

  let {
    data: { guide },
  } = await executeEmbedQuery<EmbedQueryReturnType>({
    query: testQuery,
    variables: { guideEntityId: mainQuestGuides[0].entityId },
  });

  expect(guide).toMatchObject({
    entityId: mainQuestGuides[0].entityId,
    isViewed: true,
    nextGuide: mainQuestGuides[1].entityId,
    previousGuide: null,
    orderIndex: 0,
    completedStepsCount: 3,
    totalSteps: 3,
    firstIncompleteStep: null,
  });

  ({
    data: { guide },
  } = await executeEmbedQuery<EmbedQueryReturnType>({
    query: testQuery,
    variables: { guideEntityId: mainQuestGuides[1].entityId },
  }));

  expect(guide).toMatchObject({
    entityId: mainQuestGuides[1].entityId,
    isViewed: true,
    nextGuide: null,
    previousGuide: mainQuestGuides[0].entityId,
    orderIndex: 1,
    completedStepsCount: 1,
    totalSteps: 3,
    firstIncompleteStep: mainQuestGuides[1].guideModules[0].steps[1].entityId,
  });

  ({
    data: { guide },
  } = await executeEmbedQuery<EmbedQueryReturnType>({
    query: testQuery,
    variables: { guideEntityId: sideQuestGuide.entityId },
  }));

  expect(guide).toMatchObject({
    entityId: sideQuestGuide.entityId,
    isViewed: false,
    nextGuide: null,
    previousGuide: null,
    orderIndex: 2,
    completedStepsCount: 0,
    totalSteps: 1,
    firstIncompleteStep: sideQuestGuide.guideModules[0].steps[0].entityId,
  });
});

test('user branching guide and account destination guide are correctly linked', async () => {
  const embedContext = getEmbedContext();

  const { mainQuestGuides } = await createGuides({
    executeAdminQuery,
    embedContext,
    mainQuestGuidesCount: 2,
    incompletedMainQuestGuidesCount: 1,
    priorityRanking: [0, 999],
    additionalData: [
      {},
      {
        type: GuideTypeEnum.account,
      },
    ],
  });

  const [branchingGuide, destinationGuide] = mainQuestGuides;

  // updates the destination guide to simulate it had been previously
  // launched by another end-user within the same account
  const yesterday = sub(new Date(), { days: 1 });
  await destinationGuide.update(
    {
      launchedAt: yesterday,
    },
    { validate: false }
  );

  const createdAccountUsers = await createDummyAccountUsers(
    embedContext.organization,
    embedContext.account,
    5
  );

  await promises.mapSeries(
    [
      ...createdAccountUsers.slice(3),
      embedContext.accountUser,
      ...createdAccountUsers.slice(0, 3),
    ],
    async (au) => {
      await TriggeredBranchingPath.create({
        organizationId: embedContext.organization.id,
        accountUserId: au.id,
        triggeredFromGuideId: branchingGuide.id,
        createdGuideId: destinationGuide.id,
      });
    }
  );

  let {
    data: { guide },
  } = await executeEmbedQuery<EmbedQueryReturnType>({
    query: testQuery,
    variables: { guideEntityId: branchingGuide.entityId },
  });

  expect(guide).toMatchObject({
    entityId: branchingGuide.entityId,
    previousGuide: null,
    nextGuide: destinationGuide.entityId,
  });

  ({
    data: { guide },
  } = await executeEmbedQuery<EmbedQueryReturnType>({
    query: testQuery,
    variables: { guideEntityId: destinationGuide.entityId },
  }));

  expect(guide).toMatchObject({
    entityId: destinationGuide.entityId,
    previousGuide: branchingGuide.entityId,
    nextGuide: null,
  });
});
