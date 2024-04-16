import { addDays } from 'date-fns';
import {
  NpsStartingType,
  NpsSurveyInstanceState,
  NpsSurveyState,
} from 'bento-common/types/netPromoterScore';

import { applyFinalCleanupHook } from 'src/data/datatests';
import { setupGraphQLTestServer } from 'src/graphql/testHelpers';
import upsertNpsSurvey from 'src/interactions/netPromoterScore/upsertNpsSurvey';

const { executeAdminQuery, getAdminContext } = setupGraphQLTestServer('bento');

applyFinalCleanupHook();

const mutationQuery = `
  mutation ($input: LaunchNpsSurveyInput!) {
    launchNpsSurvey(input: $input) {
      errors
      npsSurvey {
        id
        entityId
        state
        startAt
        launchedAt
      }
    }
  }
`;

type MutationResponse = {
  data: {
    launchNpsSurvey: {
      npsSurvey: {
        id: number;
        entityId: string;
        state: NpsSurveyState;
        startAt: string | null;
        launchedAt: string | null;
      };
    };
  };
  errors: any[];
};

describe('LaunchNpsSurvey mutation', () => {
  test('can manually launch a survey', async () => {
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
      data: { launchNpsSurvey: data },
    } = await executeAdminQuery<MutationResponse>({
      query: mutationQuery,
      variables: {
        input: {
          entityId: survey.entityId,
        },
      },
    });

    expect(errors).toBeUndefined();
    expect(data.npsSurvey).toMatchObject({
      entityId: survey.entityId,
      state: NpsSurveyState.live,
      launchedAt: expect.any(String),
    });
    expect(new Date(data.npsSurvey.launchedAt!).getTime()).toBeGreaterThan(now);

    const [activeInstance] = await survey.$get('instances', {
      scope: 'active',
      limit: 1,
    });

    expect(activeInstance).toMatchObject({
      state: NpsSurveyInstanceState.active,
    });
    expect(activeInstance.startedAt.getTime()).toBeGreaterThan(now);
    expect(activeInstance.startedAt.getTime()).toBeLessThan(Date.now());
  });

  test('can schedule a survey for a later time', async () => {
    const { organization } = getAdminContext();
    const now = Date.now();

    const [survey] = await upsertNpsSurvey({
      organization,
      input: {
        startingType: NpsStartingType.dateBased,
        startAt: addDays(Date.now(), 20),
      },
    });

    const {
      errors,
      data: { launchNpsSurvey: data },
    } = await executeAdminQuery<MutationResponse>({
      query: mutationQuery,
      variables: {
        input: {
          entityId: survey.entityId,
        },
      },
    });

    expect(errors).toBeUndefined();
    expect(data.npsSurvey).toMatchObject({
      entityId: survey.entityId,
      state: NpsSurveyState.live,
      launchedAt: expect.any(String),
    });
    expect(new Date(data.npsSurvey.launchedAt!).getTime()).toBeGreaterThan(now);

    const [activeInstance] = await survey.$get('instances', {
      scope: 'active',
      limit: 1,
    });

    expect(activeInstance).toBeUndefined();
  });

  test('cannot launch a soft-deleted survey', async () => {
    const { organization } = getAdminContext();

    const [survey] = await upsertNpsSurvey({
      organization,
      input: {
        startingType: NpsStartingType.dateBased,
        startAt: addDays(Date.now(), 20),
      },
    });

    await survey.destroy(); // soft-deleted

    const {
      errors,
      data: { launchNpsSurvey: data },
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

  test('cannot launch a survey that is already launched', async () => {
    const { organization } = getAdminContext();

    const [survey] = await upsertNpsSurvey({
      organization,
      input: {
        startingType: NpsStartingType.manual,
      },
    });

    await executeAdminQuery<MutationResponse>({
      query: mutationQuery,
      variables: {
        input: {
          entityId: survey.entityId,
        },
      },
    });

    await survey.reload();
    expect(survey.state).toEqual(NpsSurveyState.live);

    const {
      errors,
      data: { launchNpsSurvey: data },
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
