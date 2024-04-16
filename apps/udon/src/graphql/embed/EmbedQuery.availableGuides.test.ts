import { GuideFormFactor } from 'bento-common/types';
import { Guide as EmbedGuide } from 'bento-common/types/globalShoyuState';

import { setupGraphQLTestServer } from '../testHelpers';
import { createTemplateForTest } from 'src/graphql/Template/testHelpers';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';
import { applyFinalCleanupHook } from 'src/data/datatests';

applyFinalCleanupHook();

const graphqlTestHelpers = setupGraphQLTestServer('bento');
const { executeAdminQuery, executeEmbedQuery, getEmbedContext } =
  graphqlTestHelpers;

const query = `
  query EmbedQueryTest {
    availableGuides {
        entityId
        name
        isSideQuest
        savedAt
        completedAt
    }
  }
`;

type QueryReturnType = {
  data: { availableGuides: EmbedGuide[] };
};

function splitGuidesByQuest(
  guides: EmbedGuide[]
): [EmbedGuide[], EmbedGuide[]] {
  return guides.reduce(
    (splitGuides, guide) => {
      if (guide.isSideQuest) {
        return [splitGuides[0], [...splitGuides[1], guide]];
      }
      return [[...splitGuides[0], guide], splitGuides[1]];
    },
    [[], []] as [EmbedGuide[], EmbedGuide[]]
  );
}

test('includes only main quests guides when no side quests are launched', async () => {
  // main quest
  await createTemplateForTest(executeAdminQuery, getEmbedContext(), {}, true);

  const {
    data: { availableGuides },
  } = await executeEmbedQuery<QueryReturnType>({ query });

  const [mainQuestGuides, sideQuestGuides] =
    splitGuidesByQuest(availableGuides);
  expect(mainQuestGuides).toHaveLength(1);
  expect(sideQuestGuides).toHaveLength(0);
});

test('also includes side quests guides when they exist', async () => {
  const embedContext = getEmbedContext();
  // main quest
  await createTemplateForTest(executeAdminQuery, embedContext, {}, true);

  await createTemplateForTest(
    executeAdminQuery,
    embedContext,
    { isSideQuest: true, formFactor: GuideFormFactor.modal },
    true
  );

  const {
    data: { availableGuides },
  } = await executeEmbedQuery<QueryReturnType>({ query });

  const [mainQuestGuides, sideQuestGuides] =
    splitGuidesByQuest(availableGuides);
  expect(mainQuestGuides).toHaveLength(1);
  expect(sideQuestGuides).toHaveLength(1);
});

test('only includes side quests guides when no main quest exists', async () => {
  await createTemplateForTest(
    executeAdminQuery,
    getEmbedContext(),
    { isSideQuest: true, formFactor: GuideFormFactor.modal },
    true
  );

  const {
    data: { availableGuides },
  } = await executeEmbedQuery<QueryReturnType>({ query });

  const [mainQuestGuides, sideQuestGuides] =
    splitGuidesByQuest(availableGuides);
  expect(mainQuestGuides).toHaveLength(0);
  expect(sideQuestGuides).toHaveLength(1);
});

test('includes saved side quests if they exist', async () => {
  // main quest
  await createTemplateForTest(
    executeAdminQuery,
    getEmbedContext(),
    {},
    true,
    0
  );

  const { guide: guide1 } = await createTemplateForTest(
    executeAdminQuery,
    getEmbedContext(),
    { isSideQuest: true, formFactor: GuideFormFactor.modal },
    true,
    1
  );

  const { guide: guide2 } = await createTemplateForTest(
    executeAdminQuery,
    getEmbedContext(),
    { isSideQuest: true, formFactor: GuideFormFactor.modal },
    true,
    2
  );

  await GuideParticipant.update(
    { savedAt: new Date() },
    { where: { guideId: guide1!.id } }
  );

  const {
    data: { availableGuides },
  } = await executeEmbedQuery<QueryReturnType>({ query });

  const [mainQuestGuides, sideQuestGuides] =
    splitGuidesByQuest(availableGuides);

  expect(mainQuestGuides).toHaveLength(1);
  expect(sideQuestGuides).toHaveLength(2);
  expect(sideQuestGuides[0].entityId).toBe(guide1!.entityId);
  expect(sideQuestGuides[1].entityId).toBe(guide2!.entityId);
});
