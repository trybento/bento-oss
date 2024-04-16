import { setupGraphQLTestServer } from 'src/graphql/testHelpers';

import NpsSurvey from 'src/data/models/NetPromoterScore/NpsSurvey.model';
import { createDummyNps } from 'src/testUtils/tests.helpers';

const graphQLTestHelpers = setupGraphQLTestServer('bento');
const { executeEmbedQuery, getEmbedContext } = graphQLTestHelpers;

type NpsMutationReturnType = {
  data: Record<string, { npsSurvey: NpsSurvey; errors: string[] }>;
};

describe('nps embed mutations', () => {
  test('tracks view time', async () => {
    const { accountUser, organization } = getEmbedContext();

    const [created] = await createDummyNps(organization, accountUser);
    const { npsParticipant } = created;

    expect(npsParticipant.firstSeenAt).toBeFalsy();

    const query = `
			mutation TrackNpsSurveyViewedMutation($input: TrackNpsSurveyViewedInput!) {
				trackNpsSurveyViewed(input: $input) {
					npsSurvey {
						entityId
            firstSeenAt
					}
					errors
				}
			}
		`;

    const {
      data: { trackNpsSurveyViewed: data },
    } = await executeEmbedQuery<NpsMutationReturnType>({
      query,
      variables: {
        input: {
          entityId: npsParticipant.entityId,
        },
      },
    });

    expect(data.errors).toHaveLength(0);
    expect(data.npsSurvey.entityId).toEqual(npsParticipant.entityId);

    await npsParticipant.reload();
    expect(npsParticipant.firstSeenAt).toBeTruthy();
  });

  test('tracks dismissal', async () => {
    const { accountUser, organization } = getEmbedContext();

    const [created] = await createDummyNps(organization, accountUser);
    const { npsParticipant } = created;

    expect(!!npsParticipant.dismissedAt).toBeFalsy();

    const query = `
			mutation DismissNpsSurveyMutation($input: DismissNpsSurveyInput!) {
				dismissNpsSurvey(input: $input) {
					npsSurvey {
						entityId
					}
					errors
				}
			}
		`;

    const {
      data: { dismissNpsSurvey: data },
    } = await executeEmbedQuery<NpsMutationReturnType>({
      query,
      variables: {
        input: {
          entityId: npsParticipant.entityId,
        },
      },
    });

    expect(data.errors).toHaveLength(0);
    expect(data.npsSurvey.entityId).toEqual(npsParticipant.entityId);

    await npsParticipant.reload();
    expect(npsParticipant.dismissedAt).toBeTruthy();
  });

  test('records nps answers', async () => {
    const { accountUser, organization } = getEmbedContext();

    const [created] = await createDummyNps(organization, accountUser);
    const { npsParticipant, npsSurveyInstance } = created;

    expect(npsParticipant.answer).toBeNull();
    expect(npsParticipant.answeredAt).toBeFalsy();

    const NPS_SCORE = 1;
    const query = `
			mutation AnswerNpsSurveyMutation($input: AnswerNpsSurveyInput!) {
				answerNpsSurvey(input: $input) {
					npsSurvey {
						entityId
            answeredAt
					}
					errors
				}
			}
		`;

    const {
      data: { answerNpsSurvey: data },
    } = await executeEmbedQuery<NpsMutationReturnType>({
      query,
      variables: {
        input: {
          entityId: npsParticipant.entityId,
          answer: NPS_SCORE,
        },
      },
    });

    expect(data.errors).toHaveLength(0);
    expect(data.npsSurvey.entityId).toEqual(npsParticipant.entityId);
    expect(data.npsSurvey.answeredAt).toBeTruthy();

    await npsParticipant.reload();
    await npsSurveyInstance.reload();

    expect(npsSurveyInstance.totalAnswers).toEqual(1);
    expect(npsParticipant.answer).toEqual(NPS_SCORE);
    expect(npsParticipant.answeredAt).toBeTruthy();
  });

  test('validates unexpected fup answer', async () => {
    const { accountUser, organization } = getEmbedContext();

    const [created] = await createDummyNps(organization, accountUser);
    const { npsParticipant } = created;

    const query = `
			mutation AnswerNpsSurveyMutation($input: AnswerNpsSurveyInput!) {
				answerNpsSurvey(input: $input) {
					npsSurvey {
						entityId
					}
					errors
				}
			}
		`;

    const {
      data: {
        answerNpsSurvey: { errors },
      },
    } = await executeEmbedQuery<NpsMutationReturnType>({
      query,
      variables: {
        input: {
          entityId: npsParticipant.entityId,
          answer: 1,
          fupAnswer: 'ok',
        },
      },
    });

    expect(errors?.length).toBeGreaterThan(0);
  });
});
