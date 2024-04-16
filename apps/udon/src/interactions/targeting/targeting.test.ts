import { setupAndSeedDatabaseForTests } from 'src/data/datatests';

import {
  GuideTypeEnum,
  RuleTypeEnum,
  TargetValueType,
  TargetingType,
} from 'bento-common/types';
import { GroupTargetingSegment } from 'bento-common/types/targeting';

import { Template } from 'src/data/models/Template.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { autoLaunchGuidesForAccountIfAny } from 'src/interactions/autoLaunchGuidesForAccountIfAny';
import { Account } from 'src/data/models/Account.model';
import { Organization } from 'src/data/models/Organization.model';
import createIndividualGuidesForCreatedAccountUser from '../launching/createIndividualGuidesForCreatedAccountUser';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';
import { addUserToGuidesBasedOnTargetedAttributes } from './addUserToGuidesBasedOnTargetedAttributes';
import addCreatedAccountUserAsParticipantToExistingAccountGuides from '../launching/addCreatedAccountUserAsParticipantToExistingAccountGuides';
import {
  excludeExtraAttributeTargeting,
  getTargetingExtraAttributes,
} from './targeting.helpers';
import { TemplateTarget } from 'src/data/models/TemplateTarget.model';
import * as data from 'src/data';
import testUtils from 'src/testUtils/test.util';

const getContext = setupAndSeedDatabaseForTests('paydayio');

/**
 * This test suite is specifically for the methods that add guide/bases
 * For detailed targeting-helper unit tests see checkIsRuleSatisfied.test.ts
 */

describe('account targeting', () => {
  test('launches to all', async () => {
    const { account, organization } = getContext();

    const template = await Template.findOne({
      where: { organizationId: organization.id },
    });

    if (!template) throw 'No template!';

    await testUtils.guides.launchTemplate({ template });

    await autoLaunchGuidesForAccountIfAny({ account });

    const guideBase = await GuideBase.findOne({
      where: {
        organizationId: organization.id,
        accountId: account.id,
        createdFromTemplateId: template.id,
      },
    });

    expect(guideBase).toBeTruthy();
  });

  test('will not launch if specifically not targeted', async () => {
    const { account, organization } = getContext();

    const template = await Template.findOne({
      where: { organizationId: organization.id },
    });

    if (!template) throw 'No template!';

    await testUtils.guides.launchTemplate({
      template,
      accountTargeting: testUtils.fake.singleNameTargeting(
        'Belching Maya and Gassing Bonnie Vineyards',
        RuleTypeEnum.equals,
        'name'
      ),
    });

    await autoLaunchGuidesForAccountIfAny({ account });

    const guideBase = await GuideBase.findOne({
      where: {
        organizationId: organization.id,
        accountId: account.id,
        createdFromTemplateId: template.id,
      },
    });

    expect(guideBase).toBeFalsy();
  });

  test('will launch when targeted by attributes', async () => {
    const { account, organization } = getContext();

    const [anotherAccount] = await testUtils.users.accounts(organization, 1);

    const template = await Template.findOne({
      where: { organizationId: organization.id },
    });

    if (!template) throw 'No template!';

    await testUtils.guides.launchTemplate({
      template,
      accountTargeting: testUtils.fake.singleNameTargeting(
        account.name!,
        RuleTypeEnum.equals,
        'name'
      ),
    });

    await autoLaunchGuidesForAccountIfAny({ account });
    await autoLaunchGuidesForAccountIfAny({ account: anotherAccount });

    const guideBase = await GuideBase.findOne({
      where: {
        organizationId: organization.id,
        accountId: account.id,
        createdFromTemplateId: template.id,
      },
    });

    expect(guideBase).toBeTruthy();

    const otherGuideBase = await GuideBase.findOne({
      where: {
        organizationId: organization.id,
        accountId: anotherAccount.id,
        createdFromTemplateId: template.id,
      },
    });

    expect(otherGuideBase).toBeFalsy();
  });

  test('will not add paused templates', async () => {
    const { account, organization } = getContext();

    const template = await Template.findOne({
      where: { organizationId: organization.id },
    });

    if (!template) throw 'No template!';

    await testUtils.guides.launchTemplate({ template });

    await template.update({ isAutoLaunchEnabled: false });

    await autoLaunchGuidesForAccountIfAny({ account });

    const guideBase = await GuideBase.findOne({
      where: {
        organizationId: organization.id,
        accountId: account.id,
        createdFromTemplateId: template.id,
      },
    });

    expect(guideBase).toBeFalsy();
  });
});

/**
 * @todo see dummyDataHelpers. Dup of configureAutolaunch/configureAndLaunch
 *   should combine eventually.
 */
const launchWithTargeting = async ({
  account,
  organization,
  accountTargeting,
  accountUserTargeting,
}: {
  account: Account;
  organization: Organization;
  accountTargeting?: GroupTargetingSegment;
  accountUserTargeting?: GroupTargetingSegment;
}) => {
  const template = await Template.findOne({
    where: { organizationId: organization.id },
  });

  if (!template) throw 'No template';

  await template.update({ type: GuideTypeEnum.user });

  await testUtils.guides.launchTemplate({
    template,
    accountTargeting,
    accountUserTargeting,
  });

  await autoLaunchGuidesForAccountIfAny({ account });

  return template;
};

describe('account user targeting', () => {
  test('adds guide participants to account guides', async () => {
    const { account, organization, accountUser } = getContext();
    const template = await Template.findOne({
      where: { organizationId: organization.id },
    });

    if (!template) throw 'No template';

    expect(template.type).toEqual(GuideTypeEnum.account);

    await testUtils.guides.launchTemplate({ template });
    await autoLaunchGuidesForAccountIfAny({ account });

    await addCreatedAccountUserAsParticipantToExistingAccountGuides(
      accountUser
    );

    const gp = await GuideParticipant.findOne({
      where: { accountUserId: accountUser.id },
    });

    expect(gp).toBeTruthy();
  });

  test('launches all target', async () => {
    const { account, organization, accountUser } = getContext();

    const template = await launchWithTargeting({
      account,
      organization,
      accountUserTargeting: { type: TargetingType.all },
    });

    const gb = await GuideBase.findOne({
      where: { createdFromTemplateId: template.id },
    });

    expect(gb).toBeTruthy();

    await createIndividualGuidesForCreatedAccountUser(accountUser);

    const gp = await GuideParticipant.findOne({
      where: { accountUserId: accountUser.id },
    });

    expect(gp).toBeTruthy();
  });

  test('launches if targeted by name', async () => {
    const { account, organization, accountUser } = getContext();

    const template = await launchWithTargeting({
      account,
      organization,
      accountUserTargeting: {
        type: TargetingType.attributeRules,
        groups: [
          {
            rules: [
              {
                value: accountUser.fullName!,
                attribute: 'fullName',
                valueType: TargetValueType.text,
                ruleType: RuleTypeEnum.equals,
              },
            ],
          },
        ],
      },
    });

    const gb = await GuideBase.findOne({
      where: { createdFromTemplateId: template.id },
    });

    expect(gb).toBeTruthy();

    await createIndividualGuidesForCreatedAccountUser(accountUser);
    await addUserToGuidesBasedOnTargetedAttributes(accountUser);

    const gp = await GuideParticipant.findOne({
      where: { accountUserId: accountUser.id },
    });

    expect(gp).toBeTruthy();
  });

  test('does not launch if not targeted', async () => {
    const { account, organization, accountUser } = getContext();

    const template = await launchWithTargeting({
      account,
      organization,
      accountUserTargeting: {
        type: TargetingType.attributeRules,
        groups: [
          {
            rules: [
              {
                value: testUtils.fake.phrase(),
                attribute: 'fullName',
                valueType: TargetValueType.text,
                ruleType: RuleTypeEnum.equals,
              },
            ],
          },
        ],
      },
    });

    const gb = await GuideBase.findOne({
      where: { createdFromTemplateId: template.id },
    });

    expect(gb).toBeTruthy();

    await createIndividualGuidesForCreatedAccountUser(accountUser);
    await addUserToGuidesBasedOnTargetedAttributes(accountUser);

    const gp = await GuideParticipant.findOne({
      where: { accountUserId: accountUser.id },
    });

    expect(gp).toBeFalsy();
  });

  test('launches on multiple guide targets', async () => {
    const { account, organization, accountUser } = getContext();

    const [accountUserTwo] = await testUtils.users.accountUsers(
      organization,
      account,
      1
    );

    const template = await launchWithTargeting({
      account,
      organization,
      accountUserTargeting: {
        type: TargetingType.attributeRules,
        groups: [
          {
            rules: [
              {
                value: accountUserTwo.fullName!,
                attribute: 'fullName',
                valueType: TargetValueType.text,
                ruleType: RuleTypeEnum.equals,
              },
            ],
          },
          {
            rules: [
              {
                value: accountUser.fullName!,
                attribute: 'fullName',
                valueType: TargetValueType.text,
                ruleType: RuleTypeEnum.equals,
              },
            ],
          },
        ],
      },
    });

    const gb = await GuideBase.findOne({
      where: { createdFromTemplateId: template.id },
    });

    if (!gb) throw new Error('No guideBase');

    expect(gb).toBeTruthy();

    const au = [accountUser, accountUserTwo];

    for (let i = 0; i < au.length; i++) {
      const selectedUser = au[i];
      await createIndividualGuidesForCreatedAccountUser(selectedUser);
      await addUserToGuidesBasedOnTargetedAttributes(selectedUser);

      const gp = await GuideParticipant.findOne({
        where: { accountUserId: selectedUser.id },
      });

      expect(gp).toBeTruthy();
    }
  });
});

describe('extra attributes', () => {
  test.each([TargetValueType.template, TargetValueType.branchingPath])(
    'marks exclude if no %s rules',
    (valueType) => {
      const exclude = excludeExtraAttributeTargeting([]);

      const property: keyof ReturnType<typeof excludeExtraAttributeTargeting> =
        valueType === TargetValueType.branchingPath ? 'branching' : 'templates';

      expect(exclude[property]).toBeTruthy();
    }
  );

  test.each([TargetValueType.template, TargetValueType.branchingPath])(
    'will not exclude if %s rule exists',
    (valueType) => {
      const target: Partial<TemplateTarget> = {
        id: 1,
        rules: [
          {
            ruleType: RuleTypeEnum.equals,
            attribute: 'etc',
            valueType,
            value: 'wan',
          },
        ],
      };

      const exclude = excludeExtraAttributeTargeting([
        target as TemplateTarget,
      ]);

      const property: keyof ReturnType<typeof excludeExtraAttributeTargeting> =
        valueType === TargetValueType.branchingPath ? 'branching' : 'templates';

      expect(exclude[property]).toBeFalsy();
    }
  );

  test.each([true, false])(
    'can call excludes on template data %s',
    async (exclude) => {
      const { accountUser } = getContext();

      const spied = jest.spyOn(data, 'queryRunner');

      spied.mockClear();

      await getTargetingExtraAttributes({
        accountUserIds: [accountUser.id],
        excludes: {
          templates: exclude,
        },
      });

      if (exclude) {
        expect(spied).not.toBeCalled();
      } else {
        expect(spied).toBeCalled();
      }
    }
  );
});
