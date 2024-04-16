import {
  GroupCondition,
  RuleTypeEnum,
  TargetingType,
} from 'bento-common/types';
import {
  NpsStartingType,
  NpsSurveyAttributeValueType,
  NpsSurveyTarget,
  NpsSurveyTargets,
} from 'bento-common/types/netPromoterScore';

import {
  applyFinalCleanupHook,
  setupAndSeedDatabaseForTests,
} from 'src/data/datatests';
import {
  createDummyAccounts,
  createDummyAccountUsers,
} from 'src/testUtils/dummyDataHelpers';
import { Account } from 'src/data/models/Account.model';
import { Organization } from 'src/data/models/Organization.model';
import addUsersToNpsSurveysBasedOnTargeting, {
  checkTargetsMatch,
} from './addUsersToNpsSurveysBasedOnTargeting';
import launchNpsSurvey from './launchNpsSurvey';
import upsertNpsSurvey from './upsertNpsSurvey';

const getContext = setupAndSeedDatabaseForTests('bento');

jest.mock('src/utils/features', () => ({
  ...jest.requireActual('src/utils/features'),
  enableNpsSurveys: {
    enabled: jest.fn(() => true),
  },
}));

afterEach(() => {
  jest.restoreAllMocks();
});

applyFinalCleanupHook();

const createAndLaunchSurvey = async (
  organization: Organization,
  targets: NpsSurveyTargets
) => {
  const [survey] = await upsertNpsSurvey({
    organization,
    input: {
      startingType: NpsStartingType.manual,
      startAt: null,
      targets,
    },
  });

  return launchNpsSurvey({ organization, entityId: survey.entityId });
};

describe('addUsersToNpsSurveysBasedOnTargeting', () => {
  test('can create participant if targeting matches', async () => {
    const { organization } = getContext();
    const [account] = await createDummyAccounts(organization);
    const [accountUser] = await createDummyAccountUsers(organization, account);

    await createAndLaunchSurvey(organization, {
      account: {
        type: TargetingType.all,
        rules: [],
        grouping: GroupCondition.all,
      },
      accountUser: {
        type: TargetingType.all,
        rules: [],
        grouping: GroupCondition.all,
      },
    });

    const created = await addUsersToNpsSurveysBasedOnTargeting({
      accountUser,
    });

    expect(created).toHaveLength(1);
    expect(created).toMatchObject([
      {
        organizationId: organization.id,
        accountUserId: accountUser.id,
        answer: null,
        fupAnswer: null,
        firstSeenAt: null,
        dismissedAt: null,
        answeredAt: null,
      },
    ]);
  });

  test('wont create participants if no survey instances are found', async () => {
    const { organization } = getContext();
    const [account] = await createDummyAccounts(organization);
    const [accountUser] = await createDummyAccountUsers(organization, account);
    const created = await addUsersToNpsSurveysBasedOnTargeting({
      accountUser,
    });
    expect(created).toHaveLength(0);
  });

  test('will only create participant for the new survey', async () => {
    const { organization } = getContext();
    const [account] = await createDummyAccounts(organization);
    const [accountUser] = await createDummyAccountUsers(organization, account);

    await createAndLaunchSurvey(organization, {
      account: {
        type: TargetingType.all,
        rules: [],
        grouping: GroupCondition.all,
      },
      accountUser: {
        type: TargetingType.all,
        rules: [],
        grouping: GroupCondition.all,
      },
    });

    await addUsersToNpsSurveysBasedOnTargeting({
      accountUser,
    });

    const survey = await createAndLaunchSurvey(organization, {
      account: {
        type: TargetingType.all,
        rules: [],
        grouping: GroupCondition.all,
      },
      accountUser: {
        type: TargetingType.all,
        rules: [],
        grouping: GroupCondition.all,
      },
    });

    const [instance] = await survey.$get('instances', { scope: 'active' });

    const created = await addUsersToNpsSurveysBasedOnTargeting({
      accountUser,
    });

    expect(created).toHaveLength(1);
    expect(created).toMatchObject([
      {
        organizationId: organization.id,
        accountUserId: accountUser.id,
        npsSurveyInstanceId: instance.id,
        answer: null,
        fupAnswer: null,
        firstSeenAt: null,
        dismissedAt: null,
        answeredAt: null,
      },
    ]);
  });
});

describe('checkTargetsMatch', () => {
  test('will always match targeting all', async () => {
    const { organization } = getContext();
    const [input] = await createDummyAccounts(organization, 1);
    const target: NpsSurveyTarget = {
      type: TargetingType.all,
      grouping: GroupCondition.all,
      rules: [],
    };

    expect(checkTargetsMatch(input, target)).toEqual(true);
    expect(
      checkTargetsMatch(input, {
        ...target,
        grouping: GroupCondition.any,
      })
    ).toEqual(true);
  });

  test('will match account base and custom attributes', async () => {
    const { organization } = getContext();
    const [input] = await createDummyAccounts(organization, 1);
    await input.update({
      createdInOrganizationAt: new Date(),
      attributes: {
        foo: false,
      },
    });

    const target: NpsSurveyTarget = {
      type: TargetingType.attributeRules,
      grouping: GroupCondition.all,
      rules: [
        {
          attribute: 'name',
          ruleType: RuleTypeEnum.equals,
          valueType: NpsSurveyAttributeValueType.text,
          value: input.name,
        },
        {
          attribute: 'createdAt',
          ruleType: RuleTypeEnum.lt,
          valueType: NpsSurveyAttributeValueType.date,
          value: new Date(),
        },
        {
          attribute: 'foo',
          ruleType: RuleTypeEnum.equals,
          valueType: NpsSurveyAttributeValueType.boolean,
          value: false,
        },
      ],
    };

    expect(checkTargetsMatch(input, target)).toEqual(true);
  });

  test('will match user base and custom attributes', async () => {
    const { organization } = getContext();
    const [account] = await createDummyAccounts(organization, 1);
    const [input] = await createDummyAccountUsers(organization, account, 1);
    await input.update({
      createdInOrganizationAt: new Date(),
      attributes: {
        foo: true,
      },
    });

    const target: NpsSurveyTarget = {
      type: TargetingType.attributeRules,
      grouping: GroupCondition.all,
      rules: [
        {
          attribute: 'fullName',
          ruleType: RuleTypeEnum.equals,
          valueType: NpsSurveyAttributeValueType.text,
          value: input.fullName,
        },
        {
          attribute: 'createdAt',
          ruleType: RuleTypeEnum.lt,
          valueType: NpsSurveyAttributeValueType.date,
          value: new Date(),
        },
        {
          attribute: 'foo',
          ruleType: RuleTypeEnum.equals,
          valueType: NpsSurveyAttributeValueType.boolean,
          value: true,
        },
      ],
    };

    expect(checkTargetsMatch(input, target)).toEqual(true);
  });

  test('wont match if grouping is ALL and some rule fails', async () => {
    const { organization } = getContext();
    const [account] = await createDummyAccounts(organization, 1);
    const [input] = await createDummyAccountUsers(organization, account, 1);
    await input.update({
      attributes: {
        foo: false,
        another: true,
      },
    });

    const target: NpsSurveyTarget = {
      type: TargetingType.attributeRules,
      grouping: GroupCondition.all,
      rules: [
        {
          attribute: 'fullName',
          ruleType: RuleTypeEnum.equals,
          valueType: NpsSurveyAttributeValueType.text,
          value: input.fullName,
        },
        {
          attribute: 'foo',
          ruleType: RuleTypeEnum.equals,
          valueType: NpsSurveyAttributeValueType.boolean,
          value: true,
        },
      ],
    };

    expect(checkTargetsMatch(input, target)).toEqual(false);
  });
});
