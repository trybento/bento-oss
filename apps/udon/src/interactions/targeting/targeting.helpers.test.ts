import { setupAndSeedDatabaseForTests } from 'src/data/datatests';

import { RuleTypeEnum, TargetingType } from 'bento-common/types';
import {
  GroupTargetingSegment,
  RawRule,
  TargetValueType,
} from 'bento-common/types/targeting';
import {
  getTargetingForTemplate,
  targetingSegmentToLegacy,
} from './targeting.helpers';
import testUtils from 'src/testUtils/test.util';

import { TemplateAutoLaunchRule } from 'src/data/models/TemplateAutoLaunchRule.model';
import { TemplateAudience } from 'src/data/models/TemplateAudience.model';
import { TemplateTarget } from 'src/data/models/TemplateTarget.model';
import { formatTargeting } from './targeting.helpers';
import { addUserToGuidesBasedOnTargetedAttributes } from './addUserToGuidesBasedOnTargetedAttributes';

const getContext = setupAndSeedDatabaseForTests('paydayio');

describe('targeting helpers', () => {
  test('defaults to all', () => {
    const result = formatTargeting({
      autoLaunchRules: [],
      templateTargets: [],
    });

    expect(result.account.type).toEqual(TargetingType.all);
    expect(result.accountUser.type).toEqual(TargetingType.all);
  });

  test('adapts DB data model for autoLaunchRules', async () => {
    const { organization } = getContext();

    const template = (await testUtils.getters.getTemplate(organization))!;

    const accountGroupSegment: GroupTargetingSegment = {
      type: TargetingType.attributeRules,
      groups: [
        {
          rules: [
            {
              attribute: 'name',
              ruleType: RuleTypeEnum.equals,
              value: "AllStar's AND/OR Factory",
              valueType: TargetValueType.text,
            },
          ],
        },
      ],
    };

    await testUtils.guides.launchTemplate({
      template,
      accountTargeting: accountGroupSegment,
    });

    const autoLaunchRule = await TemplateAutoLaunchRule.findOne({
      where: {
        templateId: template.id,
      },
    });

    if (!autoLaunchRule) throw new Error('Failed to create rules to test');

    const output = formatTargeting({
      autoLaunchRules: [autoLaunchRule],
      templateTargets: [],
    });

    expect(output.account.groups?.[0].rules).toEqual(
      accountGroupSegment.groups?.[0].rules
    );
  });

  test('adapts DB data model for templateTargets', async () => {
    const { organization } = getContext();

    const template = (await testUtils.getters.getTemplate(organization))!;

    const accountUserGroupSegment: GroupTargetingSegment = {
      type: TargetingType.attributeRules,
      groups: [
        {
          rules: [
            {
              attribute: 'name',
              ruleType: RuleTypeEnum.equals,
              value: "AllStar's AND/OR Factory",
              valueType: TargetValueType.text,
            },
          ],
        },
      ],
    };

    await testUtils.guides.launchTemplate({
      template,
      accountUserTargeting: accountUserGroupSegment,
    });

    const templateTarget = await TemplateTarget.findOne({
      where: {
        templateId: template.id,
      },
    });

    if (!templateTarget) throw new Error('Failed to create rules to test');

    const output = formatTargeting({
      autoLaunchRules: [],
      templateTargets: [templateTarget],
    });

    expect(output.accountUser.groups?.[0].rules).toEqual(
      accountUserGroupSegment.groups?.[0].rules
    );
  });

  test('adapts DB model for audiences', async () => {
    const { organization } = getContext();
    const template = (await testUtils.getters.getTemplate(organization))!;

    const audience = await testUtils.guides.createNewAudience(
      {
        accountUser: {
          type: TargetingType.attributeRules,
          groups: [
            {
              rules: [
                {
                  value: 'Johnathon Barros',
                  attribute: 'fullName',
                  valueType: TargetValueType.text,
                  ruleType: RuleTypeEnum.equals,
                },
              ],
            },
          ],
        },
      },
      organization.id
    );

    await TemplateAudience.create({
      organizationId: organization.id,
      templateId: template.id,
      audienceEntityId: audience.entityId,
      groupIndex: 0,
      ruleType: RuleTypeEnum.equals,
    });

    const groupTargeting = await getTargetingForTemplate(template.id);

    expect(!!groupTargeting.audiences).toBeTruthy();
    expect(groupTargeting.audiences?.type).toEqual(
      TargetingType.attributeRules
    );
  });

  test('converts to legacy', async () => {
    const { organization } = getContext();

    const template = await testUtils.getters.getTemplate(organization);

    if (!template) throw new Error('No template to test');

    await testUtils.guides.launchTemplate({
      template,
      accountUserTargeting: testUtils.fake.singleNameTargeting(
        'someName',
        RuleTypeEnum.equals
      ),
    });

    const groupTargeting1 = await getTargetingForTemplate(template.id);
    const templateTarget = await TemplateTarget.findOne({
      where: {
        templateId: template.id,
      },
    });

    if (!templateTarget) throw new Error('No template target to check');

    const legacyFormat = targetingSegmentToLegacy(
      groupTargeting1.accountUser as GroupTargetingSegment<RawRule>,
      'targetType'
    );

    expect(legacyFormat[0].rules).toEqual(templateTarget.rules);
  });
});

describe('audiences', () => {
  test('launches when audience is present', async () => {
    const { organization, account, accountUser } = getContext();

    const { template } = await testUtils.guides.createModifiedGuideForTarget({
      account,
      organization,
    });

    const audience = await testUtils.guides.createNewAudience(
      {
        accountUser: testUtils.fake.singleNameTargeting(
          accountUser.fullName!,
          RuleTypeEnum.equals
        ),
      },
      organization.id,
      `only to ${accountUser.fullName!}`
    );

    await TemplateAudience.create({
      organizationId: organization.id,
      templateId: template.id,
      audienceEntityId: audience.entityId,
      groupIndex: 0,
      ruleType: RuleTypeEnum.equals,
    });

    await addUserToGuidesBasedOnTargetedAttributes(accountUser);

    const gp = await testUtils.getters.getParticipantForUserAndTemplate(
      accountUser.id,
      template.id
    );

    expect(!!gp).toBeTruthy();
  });

  test('ignore target templates when audience is present', async () => {
    const { organization, account, accountUser } = getContext();

    const { template } = await testUtils.guides.createModifiedGuideForTarget({
      account,
      organization,
    });

    const audience = await testUtils.guides.createNewAudience(
      {
        accountUser: testUtils.fake.singleNameTargeting(
          accountUser.fullName!,
          RuleTypeEnum.notEquals
        ),
      },
      organization.id,
      `only to ${accountUser.fullName!}`
    );

    await TemplateAudience.create({
      organizationId: organization.id,
      templateId: template.id,
      audienceEntityId: audience.entityId,
      groupIndex: 0,
      ruleType: RuleTypeEnum.equals,
    });

    await addUserToGuidesBasedOnTargetedAttributes(accountUser);

    const gp = await testUtils.getters.getParticipantForUserAndTemplate(
      accountUser.id,
      template.id
    );

    expect(!!gp).toBeFalsy();
  });

  /** For some reason after deleted the ta, addUserToGuidesBasedOnTargetedAttributes still pulled it. */
  test('revert to targeting when audience removed', async () => {
    const { organization, account, accountUser } = getContext();

    const { template } = await testUtils.guides.createModifiedGuideForTarget({
      account,
      organization,
      targeting: {
        accountUser: testUtils.fake.singleNameTargeting(
          'Nope-a-doo',
          RuleTypeEnum.notEquals
        ),
      },
    });

    const audience = await testUtils.guides.createNewAudience(
      {
        accountUser: testUtils.fake.singleNameTargeting(
          accountUser.fullName!,
          RuleTypeEnum.notEquals
        ),
      },
      organization.id,
      `only to ${accountUser.fullName!}`
    );

    await TemplateAudience.create({
      organizationId: organization.id,
      templateId: template.id,
      audienceEntityId: audience.entityId,
      groupIndex: 0,
      ruleType: RuleTypeEnum.equals,
    });

    await addUserToGuidesBasedOnTargetedAttributes(accountUser);

    const gp = await testUtils.getters.getParticipantForUserAndTemplate(
      accountUser.id,
      template.id
    );

    expect(!!gp).toBeFalsy();

    await TemplateAudience.destroy({
      where: {
        templateId: template.id,
      },
      force: true,
    });

    await addUserToGuidesBasedOnTargetedAttributes(accountUser);

    const gpAgain = await testUtils.getters.getParticipantForUserAndTemplate(
      accountUser.id,
      template.id
    );

    expect(!!gpAgain).toBeTruthy();
  });
});
