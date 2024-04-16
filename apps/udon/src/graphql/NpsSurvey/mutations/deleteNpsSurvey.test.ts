import { NpsStartingType } from 'bento-common/types/netPromoterScore';
import { applyFinalCleanupHook } from 'src/data/datatests';
import { setupGraphQLTestServer } from 'src/graphql/testHelpers';
import upsertNpsSurvey from 'src/interactions/netPromoterScore/upsertNpsSurvey';
import launchNpsSurvey from 'src/interactions/netPromoterScore/launchNpsSurvey';
import NpsSurvey from 'src/data/models/NetPromoterScore/NpsSurvey.model';

const { executeAdminQuery, getAdminContext } = setupGraphQLTestServer('bento');

applyFinalCleanupHook();

const mutationQuery = `
  mutation ($input: DeleteNpsSurveyInput!) {
    deleteNpsSurvey(input: $input) {
      deletedNpsSurveyId
    }
  }
`;

type MutationResponse = {
  data: {
    deletedNpsSurveyId: string;
  };
  errors: any[];
};

describe('DeleteNpsSurvey mutation', () => {
  test('can delete a survey', async () => {
    const { organization } = getAdminContext();
    const [survey] = await upsertNpsSurvey({
      organization,
      input: {
        startingType: NpsStartingType.manual,
        startAt: null,
      },
    });

    await launchNpsSurvey({
      organization,
      entityId: survey.entityId,
    });

    await executeAdminQuery<MutationResponse>({
      query: mutationQuery,
      variables: {
        input: {
          entityId: survey.entityId,
        },
      },
    });

    const deletedSurvey = await NpsSurvey.findByPk(survey.id);

    expect(deletedSurvey).toBeNull();
  });
});
