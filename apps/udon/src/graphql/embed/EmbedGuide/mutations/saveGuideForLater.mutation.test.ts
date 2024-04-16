import { GuideFormFactor } from 'bento-common/types';
import { applyFinalCleanupHook } from 'src/data/datatests';

import { GuideParticipant } from 'src/data/models/GuideParticipant.model';
import { createTemplateForTest } from 'src/graphql/Template/testHelpers';
import { setupGraphQLTestServer } from 'src/graphql/testHelpers';

applyFinalCleanupHook();

const graphQLTestHelpers = setupGraphQLTestServer('bento');
const { executeAdminQuery, executeEmbedQuery, getEmbedContext } =
  graphQLTestHelpers;

test('guide is saved for later', async () => {
  const { guide, guideParticipant } = await createTemplateForTest(
    executeAdminQuery,
    getEmbedContext(),
    { isSideQuest: true, formFactor: GuideFormFactor.modal },
    true
  );

  expect(guideParticipant?.savedAt).toBeNull();

  const query = `
    mutation SaveForLater($data: SaveGuideForLaterInput!) {
      saveGuideForLater(input: $data) {
        guide {
          savedAt
        }
      }
    }
  `;
  const {
    data: {
      saveGuideForLater: { guide: savedGuide },
    },
  } = (await executeEmbedQuery({
    query,
    variables: { data: { guideEntityId: guide!.entityId } },
  })) as { data: { saveGuideForLater: { guide: { savedAt: string } } } };

  expect(savedGuide.savedAt).not.toBeNull();

  const updatedGP = await GuideParticipant.findOne({
    where: { entityId: guideParticipant!.entityId },
  });

  expect(updatedGP?.savedAt).not.toBeNull();
});
