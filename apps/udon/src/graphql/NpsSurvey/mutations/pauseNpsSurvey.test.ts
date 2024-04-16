import {
  NpsStartingType,
  NpsSurveyInstanceState,
  NpsSurveyState,
} from 'bento-common/types/netPromoterScore';

import { applyFinalCleanupHook } from 'src/data/datatests';
import { setupGraphQLTestServer } from 'src/graphql/testHelpers';
import upsertNpsSurvey from 'src/interactions/netPromoterScore/upsertNpsSurvey';
import launchNpsSurvey from 'src/interactions/netPromoterScore/launchNpsSurvey';

const { executeAdminQuery, getAdminContext } = setupGraphQLTestServer('bento');

applyFinalCleanupHook();

const mutationQuery = `
  mutation ($input: PauseNpsSurveyInput!) {
    pauseNpsSurvey(input: $input) {
      errors
      npsSurvey {
        entityId
        state
        startAt
        launchedAt
        instances {
          entityId
          state
          startedAt
          endedAt
        }
      }
    }
  }
`;

type MutationResponse = {
  data: {
    launchNpsSurvey: {
      npsSurvey: {
        entityId: string;
        state: NpsSurveyState;
        startAt: string | null;
        launchedAt: string | null;
        instances: {
          entityId: string;
          state: NpsSurveyInstanceState;
          startedAt: string;
          endedAt: string | null;
        }[];
      };
    };
  };
  errors: any[];
};

describe('PauseNpsSurvey mutation', () => {
  test('can pause a survey', async () => {
    const { organization } = getAdminContext();
    const now = Date.now();

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

    const {
      errors,
      data: { pauseNpsSurvey: data },
    } = await executeAdminQuery<MutationResponse>({
      query: mutationQuery,
      variables: {
        input: {
          entityId: survey.entityId,
        },
      },
    });

    const [activeInstance] = await survey.$get('instances', {
      scope: 'notActive',
      limit: 1,
    });

    expect(errors).toBeUndefined();
    expect(data.npsSurvey).toMatchObject({
      entityId: survey.entityId,
      state: NpsSurveyState.stopped,
      launchedAt: null,
      instances: [
        {
          entityId: activeInstance.entityId,
          state: NpsSurveyInstanceState.terminated,
          endedAt: expect.any(String),
        },
      ],
    });
    expect(
      new Date(data.npsSurvey.instances[0].endedAt!)?.getTime()
    ).toBeGreaterThan(now);
  });

  test('cannot pause a survey that is alraedy paused', async () => {
    const { organization } = getAdminContext();
    const now = Date.now();

    const [survey] = await upsertNpsSurvey({
      organization,
      input: {
        startingType: NpsStartingType.manual,
        startAt: null,
      },
    });

    const {
      errors,
      data: { pauseNpsSurvey: data },
    } = await executeAdminQuery<MutationResponse>({
      query: mutationQuery,
      variables: {
        input: {
          entityId: survey.entityId,
        },
      },
    });

    expect(errors).not.toBeUndefined();
    expect(data).toBeNull();
  });
});
