import {
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

const { executeAdminQuery } = setupGraphQLTestServer('bento');

applyFinalCleanupHook();

const createNpsSurveyMutationQuery = `
  mutation ($input: CreateNpsSurveyInput!) {
    createNpsSurvey(input: $input) {
      npsSurvey {
        entityId
        name
        targets
      }
    }
  }
`;

type CreateNpsSurveyResponse = {
  data: {
    createNpsSurvey: {
      npsSurvey: {
        id: number;
        entityId: string;
        name: string;
        targets: NpsSurveyTargets;
      };
    };
  };
  errors: any[];
};

describe('CreateNpsSurvey mutation', () => {
  test('can create new survey', async () => {
    const input: NpsSurveyInput = {
      name: 'Title of the new NPS survey',
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

    const {
      errors,
      data: { createNpsSurvey: data },
    } = await executeAdminQuery<CreateNpsSurveyResponse>({
      query: createNpsSurveyMutationQuery,
      variables: {
        input,
      },
    });

    expect(errors).toBeUndefined();
    expect(data.npsSurvey).toMatchObject({
      ...input,
      entityId: expect.any(String),
    });
  });
});
