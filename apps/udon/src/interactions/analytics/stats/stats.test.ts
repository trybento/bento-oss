import { isEmpty, xor } from 'lodash';

import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import { logger } from 'src/utils/logger';
import { GuideTypeEnum } from 'bento-common/types';

import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Organization } from 'src/data/models/Organization.model';
import { Template } from 'src/data/models/Template.model';
import { Step, StepCompletedByType } from 'src/data/models/Step.model';
import { Guide } from 'src/data/models/Guide.model';

import { autoLaunchGuidesForAccountIfAny } from 'src/interactions/autoLaunchGuidesForAccountIfAny';
import createIndividualGuidesForCreatedAccountUser from 'src/interactions/launching/createIndividualGuidesForCreatedAccountUser';
import { configureAutolaunchForTemplateTest } from 'src/interactions/targeting/testHelpers';

import getNumberUsersWhoViewedGuideBases from './getNumberUsersWhoViewedGuideBase';
import getPercentageProgressOfGuideBase from './getPercentageProgressOfGuideBase';
import { trackStepViewingStarted } from '../trackStepViewingStarted';
import {
  runGuideRollup,
  runStepRollup,
} from 'src/jobsBull/jobs/rollupTasks/runGuideRollups';
import getUsersWhoViewedAStepInGuideBases from './getUsersWhoViewedAStepInGuideBase';
import getNumberUsersWhoViewedGuideStepBases from './getNumberUsersViewedGuideStepBase';
import {
  createDummyAccounts,
  createDummyAccountUsersForAccounts,
} from 'src/testUtils/dummyDataHelpers';
import getUsersWhoViewedTemplates, {
  getUsersWhoViewedTemplate,
} from './getUsersWhoViewedTemplate';
import { setStepCompletion } from 'src/interactions/setStepCompletion';
import { trackGuideViewingStarted } from '../trackGuideViewingStarted';
import { getUsersWhoViewedGuideBasesUsingRollup } from './getUsersWhoViewedGuideBase';

import * as dataFns from 'src/data';
import getNumberUsersWhoViewedGuidesOfAccount from './getNumberUsersWhoViewedGuidesOfAccount';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';

const getContext = setupAndSeedDatabaseForTests('paydayio');

const findAndLaunch = async (organization: Organization, account: Account) => {
  const template = await Template.findOne({
    where: { organizationId: organization.id },
  });

  if (!template) throw 'No template!';

  await template.update({ type: GuideTypeEnum.user });
  await configureAutolaunchForTemplateTest({ template });

  await autoLaunchGuidesForAccountIfAny({ account });

  const guideBase = await GuideBase.findOne({
    where: {
      organizationId: organization.id,
      accountId: account.id,
      createdFromTemplateId: template.id,
    },
  });

  if (!guideBase) throw 'Problem launching template for test';

  return guideBase;
};

const total = <T extends { [key: string]: number }>(
  data: T[],
  keyToAggregate: keyof T
) => data.reduce((a, v) => a + v[keyToAggregate], 0);

/** Required to roll-up to update the table */
const rollupPayload = {
  date: 'today',
};

const createStepInteraction = async ({
  organization,
  account,
  accountUser,
  completeStep,
  viewStep = true,
}: {
  account: Account;
  organization: Organization;
  accountUser: AccountUser;
  completeStep?: boolean;
  viewStep?: boolean;
}) => {
  const gb = await findAndLaunch(organization, account);

  await createIndividualGuidesForCreatedAccountUser(accountUser);

  const guide = await Guide.findOne({
    include: [
      {
        model: GuideParticipant,
        required: true,
        where: { accountUserId: accountUser.id },
      },
    ],
  });

  const step = await Step.findOne({
    where: {
      guideId: guide!.id,
    },
  });

  if (!step) throw 'No step';

  if (viewStep) {
    await trackStepViewingStarted({
      stepEntityId: step?.entityId,
      organizationEntityId: organization.entityId,
      accountUserEntityId: accountUser.entityId,
    });

    await trackGuideViewingStarted({
      accountUserEntityId: accountUser.entityId,
      organizationEntityId: organization.entityId,
      guideEntityId: guide!.entityId,
    });
  }

  if (completeStep)
    await setStepCompletion({
      step,
      isComplete: true,
      accountUser,
      completedByType: StepCompletedByType.AccountUser,
    });

  return {
    step,
    guideBase: gb,
  };
};

/*
 *
 * ==== Actual tests below ====
 *
 */

describe('analytics stat helpers - guidebase', () => {
  test('returns zero guidebase views if no views', async () => {
    const { organization, account } = getContext();

    const gb = await findAndLaunch(organization, account);

    const viewData = await getNumberUsersWhoViewedGuideBases([gb.id]);

    const views = total(viewData, 'count');

    expect(views).toEqual(0);
  });

  test('punt query on empty list', async () => {
    const spied = jest.spyOn(dataFns, 'queryRunner');

    spied.mockClear();

    const empty = await getNumberUsersWhoViewedGuideBases([]);

    expect(empty.length).toEqual(0);
    expect(spied).toBeCalledTimes(0);
  });

  test('returns zero percent progress if no progress', async () => {
    const { organization, account } = getContext();

    const gb = await findAndLaunch(organization, account);

    const viewData = await getPercentageProgressOfGuideBase([gb.id]);

    const progress = viewData[0];

    expect(progress).toEqual(0);
  });

  test('returns viewed users', async () => {
    const { organization, account, accountUser } = getContext();

    const { guideBase } = await createStepInteraction({
      organization,
      account,
      accountUser,
    });

    await runStepRollup(rollupPayload);

    const viewData = await getUsersWhoViewedAStepInGuideBases([guideBase.id]);

    const foundData = viewData.find(
      (data) => data.account_user_entity_id === accountUser.entityId
    );

    expect(foundData).toBeTruthy();
  });

  test('viewed users and viewed user counts yield same results', async () => {
    const { organization, account, accountUser } = getContext();

    const { guideBase } = await createStepInteraction({
      organization,
      account,
      accountUser,
    });

    await runStepRollup(rollupPayload);

    const viewData = await getUsersWhoViewedGuideBasesUsingRollup([
      guideBase.id,
    ]);
    const viewDataCount = await getNumberUsersWhoViewedGuideBases([
      guideBase.id,
    ]);

    const totalCount = total(viewDataCount, 'count');

    expect(viewData.length).toEqual(totalCount);
  });

  test('returns viewed user count using sub-helpers', async () => {
    const { organization, account, accountUser } = getContext();

    const { step } = await createStepInteraction({
      organization,
      account,
      accountUser,
    });

    await runStepRollup(rollupPayload);

    const viewCountData = await getNumberUsersWhoViewedGuideStepBases([
      step.createdFromGuideStepBaseId!,
    ]);

    const totalViews = total(viewCountData, 'count');

    expect(totalViews).toEqual(1);
  });

  test('works as loader taking multiple id inputs', async () => {
    const { organization, account, accountUser } = getContext();

    const [otherAccount] = await createDummyAccounts(organization, 1);

    const [otherUser] = await createDummyAccountUsersForAccounts(
      organization,
      [otherAccount],
      1
    );

    const { step } = await createStepInteraction({
      organization,
      account,
      accountUser,
    });
    const { step: otherStep } = await createStepInteraction({
      organization,
      account: otherAccount,
      accountUser: otherUser,
    });

    await runStepRollup(rollupPayload);

    const viewCountData = await getNumberUsersWhoViewedGuideStepBases([
      step.createdFromGuideStepBaseId!,
      otherStep.createdFromGuideStepBaseId!,
    ]);

    const totalViews = total(viewCountData, 'count');

    expect(totalViews).toEqual(2);
  });

  test('finds percentages', async () => {
    const { organization, account, accountUser } = getContext();

    const [otherUser] = await createDummyAccountUsersForAccounts(
      organization,
      [account],
      1
    );

    const { guideBase } = await createStepInteraction({
      organization,
      account,
      accountUser,
      completeStep: true,
    });

    await createStepInteraction({
      organization,
      account,
      accountUser: otherUser,
    });

    await runStepRollup(rollupPayload);

    const allPercentageData = await getPercentageProgressOfGuideBase([
      guideBase.id,
    ]);

    const percentageData = allPercentageData[0];

    const relatedGuides = await Guide.findAll({
      where: { createdFromGuideBaseId: guideBase.id },
      attributes: ['id'],
    });

    const relatedSteps = await Step.findAll({
      where: { guideId: relatedGuides.map((g) => g.id) },
      attributes: ['isComplete'],
    });

    const completed = relatedSteps.filter((s) => s.isComplete);

    const targetPercentage = Math.round(
      100 * (completed.length / relatedSteps.length)
    );

    expect(percentageData).toEqual(targetPercentage);
  });
});

describe('analytics stat helpers - template', () => {
  test('gets aggregated guidebase data', async () => {
    const { organization, account, accountUser } = getContext();

    const { guideBase } = await createStepInteraction({
      organization,
      account,
      accountUser,
    });

    await runGuideRollup(rollupPayload);

    const templateViews = await getUsersWhoViewedTemplates([
      guideBase.createdFromTemplateId!,
    ]);

    const foundData = templateViews.find(
      (data) => data.accountUserId === accountUser.id
    );

    expect(foundData).toBeTruthy();
  });

  test('returns same result as guide base lookups', async () => {
    const { organization, account, accountUser } = getContext();

    const [otherUser] = await createDummyAccountUsersForAccounts(
      organization,
      [account],
      1
    );

    const { guideBase } = await createStepInteraction({
      organization,
      account,
      accountUser,
    });
    await createStepInteraction({
      organization,
      account,
      accountUser: otherUser,
    });

    await runGuideRollup(rollupPayload);

    const templateViews = await getUsersWhoViewedTemplates([
      guideBase.createdFromTemplateId!,
    ]);

    const guideBaseViews = await getUsersWhoViewedGuideBasesUsingRollup([
      guideBase.id,
    ]);

    const gbAuIds = guideBaseViews.map((d) => d.accountUserId);
    const tAuIds = templateViews.map((d) => d.accountUserId);

    const viewsAreSame = isEmpty(xor(gbAuIds, tAuIds));

    expect(viewsAreSame).toBeTruthy();
    expect(guideBaseViews.length).toEqual(templateViews.length);
  });

  test('single loader works', async () => {
    const { organization, account, accountUser } = getContext();

    const { guideBase } = await createStepInteraction({
      organization,
      account,
      accountUser,
    });

    await runGuideRollup(rollupPayload);

    const viewedUsers = await getUsersWhoViewedTemplate(
      guideBase.createdFromTemplateId!
    );

    expect(viewedUsers.length).toEqual(1);
  });
});

describe('analytics stat helpers - account', () => {
  test('viewed guides count is consistent', async () => {
    const { organization, account, accountUser } = getContext();

    const [otherUser] = await createDummyAccountUsersForAccounts(
      organization,
      [account],
      1
    );

    const { guideBase } = await createStepInteraction({
      organization,
      account,
      accountUser,
    });
    await createStepInteraction({
      organization,
      account,
      accountUser: otherUser,
    });

    const accountResultAll = await getNumberUsersWhoViewedGuidesOfAccount([
      account.id,
    ]);
    const accountResult = accountResultAll[0];

    const guideBaseResultAll = await getNumberUsersWhoViewedGuideBases([
      guideBase.id,
    ]);
    const guideBaseResult = total(guideBaseResultAll, 'count');

    expect(guideBaseResult).toEqual(accountResult);
  });
});
