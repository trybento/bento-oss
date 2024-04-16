import {
  NpsStartingType,
  NpsSurveyAttributeValueType,
  NpsSurveyInput,
  NpsSurveyTargets,
} from 'bento-common/types/netPromoterScore';
import {
  GroupCondition,
  RuleTypeEnum,
  TargetingType,
} from 'bento-common/types';

import { applyFinalCleanupHook } from 'src/data/datatests';
import { setupGraphQLTestServer } from 'src/graphql/testHelpers';
import upsertNpsSurvey from 'src/interactions/netPromoterScore/upsertNpsSurvey';

const { executeAdminQuery, getAdminContext } = setupGraphQLTestServer('bento');

applyFinalCleanupHook();

const npsSurveyQuery = `
  query NpsSurveyQuery($entityId: EntityId!) {
    npsSurvey(entityId: $entityId) {
      id
      entityId
      name
      question
      startingType
      startAt
      targets
    }
  }
`;

type NpsSurveyQueryResponse = {
  data: {
    npsSurvey: {
      id: number;
      entityId: string;
      name: string;
      startingType: NpsStartingType;
      startAt: Date;
      targets: NpsSurveyTargets;
    };
  };
  errors: any[];
};

describe('NpsSurvey query', () => {
  test('can fetch one survey', async () => {
    const { organization } = getAdminContext();

    const input: NpsSurveyInput = {
      name: 'Title of the new NPS survey',
      question: 'How do you like me?',
      startingType: NpsStartingType.dateBased,
      startAt: new Date(),
      targets: {
        account: {
          type: TargetingType.all,
          rules: [],
          grouping: GroupCondition.all,
        },
        accountUser: {
          type: TargetingType.attributeRules,
          rules: [
            {
              attribute: 'foo',
              ruleType: RuleTypeEnum.equals,
              valueType: NpsSurveyAttributeValueType.text,
              value: 'bar',
            },
            {
              attribute: 'total',
              ruleType: RuleTypeEnum.equals,
              valueType: NpsSurveyAttributeValueType.number,
              value: 1,
            },
          ],
          grouping: GroupCondition.any,
        },
      },
    };

    const [survey] = await upsertNpsSurvey({
      organization,
      input,
    });

    const {
      errors,
      data: { npsSurvey: data },
    } = await executeAdminQuery<NpsSurveyQueryResponse>({
      query: npsSurveyQuery,
      variables: {
        entityId: survey.entityId,
      },
    });

    expect(errors).toBeUndefined();
    expect(data).toMatchObject({
      ...input,
      id: expect.any(String),
      entityId: survey.entityId,
      startAt: input.startAt?.toISOString(),
    });
  });
});
