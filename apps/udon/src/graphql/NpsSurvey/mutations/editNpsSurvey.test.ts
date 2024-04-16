import {
  NpsSurveyAttributeValueType,
  NpsSurveyTargets,
} from 'bento-common/types/netPromoterScore';
import {
  GroupCondition,
  RuleTypeEnum,
  TargetingType,
} from 'bento-common/types';
import { DEFAULT_PRIORITY_RANKING } from 'bento-common/utils/constants';

import { applyFinalCleanupHook } from 'src/data/datatests';
import { setupGraphQLTestServer } from 'src/graphql/testHelpers';
import NpsSurvey from 'src/data/models/NetPromoterScore/NpsSurvey.model';
import { EditNpsSurveyMutationArgs } from './editNpsSurvey';

const { executeAdminQuery, getAdminContext } = setupGraphQLTestServer('bento');

applyFinalCleanupHook();

const editNpsSurveyMutationQuery = `
  mutation ($input: EditNpsSurveyInput!) {
    editNpsSurvey(input: $input) {
      errors
      npsSurvey {
        entityId
        name
        targets
        priorityRanking
      }
    }
  }
`;

type EditNpsSurveyResponse = {
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

describe('EditNpsSurvey mutation', () => {
  test('can edit a survey', async () => {
    const { organization } = getAdminContext();

    const survey = await NpsSurvey.create({
      name: 'Previous title of nps survey',
      organizationId: organization.id,
    });

    const input: EditNpsSurveyMutationArgs = {
      npsSurveyData: {
        entityId: survey.entityId,
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
      },
      priorityRankings: [],
    };

    const {
      errors,
      data: { editNpsSurvey: data },
    } = await executeAdminQuery<EditNpsSurveyResponse>({
      query: editNpsSurveyMutationQuery,
      variables: {
        input,
      },
    });

    expect(errors).toBeUndefined();
    expect(data.npsSurvey).toMatchObject({
      ...input.npsSurveyData,
      priorityRanking: DEFAULT_PRIORITY_RANKING,
    });
  });
});
