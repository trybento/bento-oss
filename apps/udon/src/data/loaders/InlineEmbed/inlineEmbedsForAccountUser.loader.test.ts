import { merge } from 'lodash';
import { faker } from '@faker-js/faker';
import { CreationAttributes } from 'sequelize';
import {
  InlineEmbedTargeting,
  TargetingType,
  GroupCondition,
  InjectionPosition,
  InlineEmbedState,
  RuleTypeEnum,
  TargetValueType,
  GuideFormFactor,
  Theme,
  GuidePageTargetingType,
} from 'bento-common/types';

import { applyFinalCleanupHook } from 'src/data/datatests';
import { setupGraphQLTestServer } from 'src/graphql/testHelpers';
import { launchTemplateForTest } from 'src/graphql/Template/testHelpers';
import { AccountUser } from 'src/data/models/AccountUser.model';
import OrganizationInlineEmbed from 'src/data/models/OrganizationInlineEmbed.model';
import { Organization } from 'src/data/models/Organization.model';
import genLoaders from 'src/data/loaders';
import { createTemplateForTest } from 'src/graphql/Template/testHelpers';

applyFinalCleanupHook();

const graphqlTestHelpers = setupGraphQLTestServer('bento');
const { executeAdminQuery, getEmbedContext } = graphqlTestHelpers;

const allTargeting: InlineEmbedTargeting = {
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
};

async function createInlineEmbed(
  org: Organization,
  overrides?: Partial<CreationAttributes<OrganizationInlineEmbed>>
) {
  const url = faker.internet.url();
  return OrganizationInlineEmbed.create(
    merge(
      {
        organizationId: org.id,
        url: url,
        wildcardUrl: url,
        elementSelector: '#fake-selector',
        position: InjectionPosition.inside,
        topMargin: 0,
        bottomMargin: 0,
        leftMargin: 0,
        rightMargin: 0,
        padding: 0,
        borderRadius: 0,
        state: InlineEmbedState.active,
      },
      overrides
    )
  );
}

function getInlineEmbeds(accountUser: AccountUser) {
  return genLoaders().inlineEmbedsForAccountUserLoader.load(accountUser);
}

// Some tests can be flaky, the block can be disabled now but dummy test enabled
describe('inlineEmbedsForAccountUser loader', () => {
  beforeEach(() => {
    const { accountUser } = getEmbedContext();
    accountUser.set('email', 'user@email.com');
  });
  test('no embeds', async () => {
    const { accountUser } = getEmbedContext();
    const embeds = await getInlineEmbeds(accountUser);
    expect(embeds.length).toBe(0);
  });

  test('one embed, targeted to all', async () => {
    const { organization, accountUser } = getEmbedContext();
    await createInlineEmbed(organization);
    const embeds = await getInlineEmbeds(accountUser);
    expect(embeds.length).toBe(1);
  });

  test('two embeds, one is targeted to all, another is template-specific', async () => {
    const { organization, accountUser, account } = getEmbedContext();
    await createInlineEmbed(organization);

    const { template: createdTemplate } = await createTemplateForTest(
      executeAdminQuery,
      getEmbedContext(),
      {
        formFactor: GuideFormFactor.inline,
        pageTargetingType: GuidePageTargetingType.inline,
        isSideQuest: true,
        theme: Theme.card,
      },
      false
    );

    const { guideBase } = await launchTemplateForTest(
      createdTemplate.entityId,
      organization,
      account,
      accountUser
    );

    await createInlineEmbed(organization, {
      templateId: guideBase.createdFromTemplateId!,
    });

    const embeds = await getInlineEmbeds(accountUser);
    expect(embeds.length).toBe(2);
  });

  test("one embed targeted to this account user's email", async () => {
    const { organization, accountUser } = getEmbedContext();
    await createInlineEmbed(organization, {
      targeting: {
        account: allTargeting.account,
        accountUser: {
          type: TargetingType.attributeRules,
          grouping: GroupCondition.all,
          rules: [
            {
              attribute: 'email',
              ruleType: RuleTypeEnum.equals,
              valueType: TargetValueType.text,
              value: accountUser.email,
            },
          ],
        },
      },
    });
    const embeds = await getInlineEmbeds(accountUser);
    expect(embeds.length).toBe(1);
  });

  test("one embed targeted to another account user's email", async () => {
    const { organization, accountUser } = getEmbedContext();
    await createInlineEmbed(organization, {
      targeting: {
        account: allTargeting.account,
        accountUser: {
          type: TargetingType.attributeRules,
          grouping: GroupCondition.all,
          rules: [
            {
              attribute: 'email',
              ruleType: RuleTypeEnum.equals,
              valueType: TargetValueType.text,
              value: 'another@user.com',
            },
          ],
        },
      },
    });
    const embeds = await getInlineEmbeds(accountUser);
    expect(embeds.length).toBe(0);
  });

  test('one embed targeted to two users emails', async () => {
    const { organization, accountUser } = getEmbedContext();
    await createInlineEmbed(organization, {
      targeting: {
        account: allTargeting.account,
        accountUser: {
          type: TargetingType.attributeRules,
          grouping: GroupCondition.any,
          rules: [
            {
              attribute: 'email',
              ruleType: RuleTypeEnum.equals,
              valueType: TargetValueType.text,
              value: accountUser.email,
            },
            {
              attribute: 'email',
              ruleType: RuleTypeEnum.equals,
              valueType: TargetValueType.text,
              value: 'another@user.com',
            },
          ],
        },
      },
    });
    const embeds = await getInlineEmbeds(accountUser);
    expect(embeds.length).toBe(1);
  });

  test("one embed targeted to the user's account", async () => {
    const { organization, account, accountUser } = getEmbedContext();
    await createInlineEmbed(organization, {
      targeting: {
        account: {
          type: TargetingType.attributeRules,
          grouping: GroupCondition.all,
          rules: [
            {
              attribute: 'name',
              ruleType: RuleTypeEnum.equals,
              valueType: TargetValueType.text,
              value: account.name,
            },
          ],
        },
        accountUser: allTargeting.accountUser,
      },
    });
    const embeds = await getInlineEmbeds(accountUser);
    expect(embeds.length).toBe(1);
  });

  test('one embed targeted to a different account', async () => {
    const { organization, accountUser } = getEmbedContext();
    await createInlineEmbed(organization, {
      targeting: {
        account: {
          type: TargetingType.attributeRules,
          grouping: GroupCondition.all,
          rules: [
            {
              attribute: 'name',
              ruleType: RuleTypeEnum.equals,
              valueType: TargetValueType.text,
              value: 'different account',
            },
          ],
        },
        accountUser: allTargeting.accountUser,
      },
    });
    const embeds = await getInlineEmbeds(accountUser);
    expect(embeds.length).toBe(0);
  });

  test('one embed targeted to two accounts', async () => {
    const { organization, account, accountUser } = getEmbedContext();
    await createInlineEmbed(organization, {
      targeting: {
        account: {
          type: TargetingType.attributeRules,
          grouping: GroupCondition.any,
          rules: [
            {
              attribute: 'name',
              ruleType: RuleTypeEnum.equals,
              valueType: TargetValueType.text,
              value: account.name,
            },
            {
              attribute: 'name',
              ruleType: RuleTypeEnum.equals,
              valueType: TargetValueType.text,
              value: 'different account',
            },
          ],
        },
        accountUser: allTargeting.accountUser,
      },
    });
    const embeds = await getInlineEmbeds(accountUser);
    expect(embeds.length).toBe(1);
  });

  test('one embed targeted to wrong account but right user', async () => {
    const { organization, accountUser } = getEmbedContext();
    await createInlineEmbed(organization, {
      targeting: {
        account: {
          type: TargetingType.attributeRules,
          grouping: GroupCondition.all,
          rules: [
            {
              attribute: 'name',
              ruleType: RuleTypeEnum.equals,
              valueType: TargetValueType.text,
              value: 'different account',
            },
          ],
        },
        accountUser: {
          type: TargetingType.attributeRules,
          grouping: GroupCondition.all,
          rules: [
            {
              attribute: 'email',
              ruleType: RuleTypeEnum.equals,
              valueType: TargetValueType.text,
              value: accountUser.email,
            },
          ],
        },
      },
    });
    const embeds = await getInlineEmbeds(accountUser);
    expect(embeds.length).toBe(0);
  });

  test('one embed targeted to wrong user but right account', async () => {
    const { organization, account, accountUser } = getEmbedContext();
    await createInlineEmbed(organization, {
      targeting: {
        account: {
          type: TargetingType.attributeRules,
          grouping: GroupCondition.all,
          rules: [
            {
              attribute: 'name',
              ruleType: RuleTypeEnum.equals,
              valueType: TargetValueType.text,
              value: account.name,
            },
          ],
        },
        accountUser: {
          type: TargetingType.attributeRules,
          grouping: GroupCondition.all,
          rules: [
            {
              attribute: 'email',
              ruleType: RuleTypeEnum.equals,
              valueType: TargetValueType.text,
              value: 'another@user.com',
            },
          ],
        },
      },
    });
    const embeds = await getInlineEmbeds(accountUser);
    expect(embeds.length).toBe(0);
  });

  test('one embed targeted to correct user and account', async () => {
    const { organization, account, accountUser } = getEmbedContext();
    await createInlineEmbed(organization, {
      targeting: {
        account: {
          type: TargetingType.attributeRules,
          grouping: GroupCondition.all,
          rules: [
            {
              attribute: 'name',
              ruleType: RuleTypeEnum.equals,
              valueType: TargetValueType.text,
              value: account.name,
            },
          ],
        },
        accountUser: {
          type: TargetingType.attributeRules,
          grouping: GroupCondition.all,
          rules: [
            {
              attribute: 'email',
              ruleType: RuleTypeEnum.equals,
              valueType: TargetValueType.text,
              value: accountUser.email,
            },
          ],
        },
      },
    });
    const embeds = await getInlineEmbeds(accountUser);
    expect(embeds.length).toBe(1);
  });

  test('one embed targeted to correct user and account (any)', async () => {
    const { organization, account, accountUser } = getEmbedContext();
    await createInlineEmbed(organization, {
      targeting: {
        account: {
          type: TargetingType.attributeRules,
          grouping: GroupCondition.any,
          rules: [
            {
              attribute: 'name',
              ruleType: RuleTypeEnum.equals,
              valueType: TargetValueType.text,
              value: account.name,
            },
            {
              attribute: 'name',
              ruleType: RuleTypeEnum.equals,
              valueType: TargetValueType.text,
              value: 'different account',
            },
          ],
        },
        accountUser: {
          type: TargetingType.attributeRules,
          grouping: GroupCondition.any,
          rules: [
            {
              attribute: 'email',
              ruleType: RuleTypeEnum.equals,
              valueType: TargetValueType.text,
              value: accountUser.email,
            },
            {
              attribute: 'email',
              ruleType: RuleTypeEnum.equals,
              valueType: TargetValueType.text,
              value: 'another@user.com',
            },
          ],
        },
      },
    });
    const embeds = await getInlineEmbeds(accountUser);
    expect(embeds.length).toBe(1);
  });
});
