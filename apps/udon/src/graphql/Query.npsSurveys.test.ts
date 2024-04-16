import { addDays } from 'date-fns';
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

const npsSurveysQuery = `
  query NpsSurveysQuery {
    npsSurveys {
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

type NpsSurveysQueryResponse = {
  data: {
    npsSurveys: Array<{
      id: number;
      entityId: string;
      name: string;
      startingType: NpsStartingType;
      startAt: Date;
      targets: NpsSurveyTargets;
    }>;
  };
};

describe('NpsSurveys query', () => {
  test('can fetch all surveys', async () => {
    const { organization } = getAdminContext();

    const inputs: NpsSurveyInput[] = [
      {
        name: 'First survey',
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
      },
      {
        name: 'Second survey',
        question:
          'How likely you would you recommend us to friends and family?',
        startingType: NpsStartingType.manual,
        startAt: addDays(new Date(), -10),
        targets: {
          account: {
            type: TargetingType.attributeRules,
            rules: [
              {
                attribute: 'foo',
                ruleType: RuleTypeEnum.equals,
                valueType: NpsSurveyAttributeValueType.text,
                value: 'bar',
              },
            ],
            grouping: GroupCondition.all,
          },
          accountUser: {
            type: TargetingType.attributeRules,
            rules: [
              {
                attribute: 'total',
                ruleType: RuleTypeEnum.equals,
                valueType: NpsSurveyAttributeValueType.number,
                value: 1,
              },
            ],
            grouping: GroupCondition.all,
          },
        },
      },
    ];

    const surveys = await Promise.all([
      (
        await upsertNpsSurvey({
          organization,
          input: inputs[0],
        })
      )?.[0],
      (
        await upsertNpsSurvey({
          organization,
          input: inputs[1],
        })
      )?.[0],
    ]);

    const {
      data: { npsSurveys: data },
    } = await executeAdminQuery<NpsSurveysQueryResponse>({
      query: npsSurveysQuery,
    });

    expect(data).toHaveLength(2);
    expect(data).toMatchObject([
      {
        ...inputs[0],
        id: expect.any(String),
        entityId: surveys[0]?.entityId,
        startAt: inputs[0].startAt?.toISOString(),
      },
      {
        ...inputs[1],
        id: expect.any(String),
        entityId: surveys[1].entityId,
        startAt: inputs[1].startAt?.toISOString(),
      },
    ]);
  });
});
