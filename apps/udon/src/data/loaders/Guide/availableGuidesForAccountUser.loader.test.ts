import promises from 'src/utils/promises';
import { Op } from 'sequelize';
import { applyFinalCleanupHook, MAX_RETRY_TIMES } from 'src/data/datatests';
import {
  GuideFormFactor,
  GuideState,
  GuideTypeEnum,
  SelectedModelAttrs,
  Theme,
} from 'bento-common/types';
import { DEFAULT_PRIORITY_RANKING } from 'bento-common/utils/constants';

import { setupGraphQLTestServer } from 'src/graphql/testHelpers';
import {
  completeGuide,
  createDummyAccountUsers,
  createGuides,
  fakeModule,
  launchDefaultTemplate,
} from 'src/testUtils/dummyDataHelpers';
import availableGuidesForAccountUserLoader from 'src/data/loaders/Guide/availableGuidesForAccountUser.loader';
import recordGuideView from 'src/interactions/recordEvents/recordGuideView';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { TriggeredBranchingPath } from 'src/data/models/TriggeredBranchingPath.model';
import { Guide } from 'src/data/models/Guide.model';
import { setStepSkipped } from 'src/interactions/setStepSkipped';
import { createTemplateForTest } from 'src/graphql/Template/testHelpers';
import { Template } from 'src/data/models/Template.model';
import createGuideFromGuideBase from 'src/interactions/createGuideFromGuideBase';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';
import genLoaders from '..';

applyFinalCleanupHook();
jest.retryTimes(MAX_RETRY_TIMES);

const graphqlTestHelpers = setupGraphQLTestServer('bento');
const { executeAdminQuery, getEmbedContext } = graphqlTestHelpers;
const loaders = genLoaders();

afterEach(() => {
  loaders.reset();
});

type GuideWithTemplate = Guide & {
  createdFromTemplate: SelectedModelAttrs<Template, 'name'>;
};

const getAvailableGuides = async (accountUser: AccountUser) => {
  const guides = await availableGuidesForAccountUserLoader(loaders).load(
    accountUser.id
  );

  return promises.map(
    guides,
    async (guide) => {
      return guide.reload({
        include: [
          {
            model: Template,
            attributes: ['name'],
          },
        ],
      });
    },
    { concurrency: 3 }
  ) as Promise<GuideWithTemplate[]>;
};

const mapGuide = ({ id, createdFromTemplate: { name } }: GuideWithTemplate) => {
  return `${id}:${name}`;
};

const expectGuideOrder = (
  actualGuides: GuideWithTemplate[],
  expectedGuides: GuideWithTemplate[]
) => {
  expect(actualGuides).toHaveLength(expectedGuides.length);
  expect(actualGuides.map(mapGuide)).toEqual(expectedGuides.map(mapGuide));
};

// Some tests can be flaky, the block can be disabled now but dummy test enabled
describe('availableGuidesForAccountUserLoader', () => {
  test('one main quest', async () => {
    const embedContext = getEmbedContext();
    const { mainQuestGuides } = await createGuides({
      executeAdminQuery,
      embedContext,
    });

    const guides = await getAvailableGuides(embedContext.accountUser);
    expectGuideOrder(guides, mainQuestGuides);
  });

  test('two main quests, only one incomplete', async () => {
    const embedContext = getEmbedContext();
    const { mainQuestGuides } = await createGuides({
      executeAdminQuery,
      embedContext,
      mainQuestGuidesCount: 2,
      incompletedMainQuestGuidesCount: 1,
    });

    const guides = await getAvailableGuides(embedContext.accountUser);
    expectGuideOrder(guides, mainQuestGuides);
  });

  test('three main quests, only one incomplete', async () => {
    const embedContext = getEmbedContext();
    const { mainQuestGuides } = await createGuides({
      executeAdminQuery,
      embedContext,
      mainQuestGuidesCount: 3,
      incompletedMainQuestGuidesCount: 1,
    });

    const guides = await getAvailableGuides(embedContext.accountUser);
    expectGuideOrder(guides, mainQuestGuides);
  });

  test('two main quests, both incomplete', async () => {
    const embedContext = getEmbedContext();
    const { mainQuestGuides } = await createGuides({
      executeAdminQuery,
      embedContext,
      mainQuestGuidesCount: 2,
      incompletedMainQuestGuidesCount: 2,
    });

    const guides = await getAvailableGuides(embedContext.accountUser);
    expectGuideOrder(guides, mainQuestGuides);
  });

  test('three main quests, two incomplete', async () => {
    const embedContext = getEmbedContext();
    const { mainQuestGuides } = await createGuides({
      executeAdminQuery,
      embedContext,
      mainQuestGuidesCount: 3,
      incompletedMainQuestGuidesCount: 2,
    });

    const guides = await getAvailableGuides(embedContext.accountUser);
    expectGuideOrder(guides, mainQuestGuides);
  });

  test('four main quests, three incomplete', async () => {
    const embedContext = getEmbedContext();
    const { mainQuestGuides } = await createGuides({
      executeAdminQuery,
      embedContext,
      mainQuestGuidesCount: 4,
      incompletedMainQuestGuidesCount: 3,
    });

    const guides = await getAvailableGuides(embedContext.accountUser);
    expectGuideOrder(guides, mainQuestGuides.slice(0, 3));
  });

  test('three main quests, two incomplete launched at the same time', async () => {
    const embedContext = getEmbedContext();
    const { mainQuestGuides } = await createGuides({
      executeAdminQuery,
      embedContext,
      mainQuestGuidesCount: 3,
      incompletedMainQuestGuidesCount: 2,
      completeFirstStepOfFirstIncompleteMainQuest: false,
    });

    await mainQuestGuides[2].update({
      launchedAt: mainQuestGuides[1].launchedAt,
    });

    const guides = await getAvailableGuides(embedContext.accountUser);
    expectGuideOrder(guides, mainQuestGuides);
  });

  test('four main quests, three incomplete launched at the same time', async () => {
    const embedContext = getEmbedContext();
    const { mainQuestGuides } = await createGuides({
      executeAdminQuery,
      embedContext,
      mainQuestGuidesCount: 4,
      incompletedMainQuestGuidesCount: 3,
      completeFirstStepOfFirstIncompleteMainQuest: false,
    });

    await mainQuestGuides[2].update({
      launchedAt: mainQuestGuides[1].launchedAt,
    });

    const guides = await getAvailableGuides(embedContext.accountUser);
    expectGuideOrder(guides, mainQuestGuides.slice(0, 3));
  });

  test('four main quests, first and second launched in a batch, first is branching guide, fourth is branching destination guide', async () => {
    const embedContext = getEmbedContext();
    const { mainQuestGuides } = await createGuides({
      executeAdminQuery,
      embedContext,
      mainQuestGuidesCount: 4,
      incompletedMainQuestGuidesCount: 3,
      completeFirstStepOfFirstIncompleteMainQuest: false,
      additionalData: [
        { name: 'branching guide' },
        { name: 'second onboarding' },
        { name: 'third onboarding' },
        { name: 'branching destination' },
      ],
    });

    // first and second launched in a batch
    await mainQuestGuides[1].update({
      launchedAt: mainQuestGuides[0].launchedAt,
    });

    // fourth is branching destination
    await TriggeredBranchingPath.create({
      organizationId: embedContext.organization.id,
      createdGuideId: mainQuestGuides[3].id,
      triggeredFromGuideId: mainQuestGuides[0].id,
      accountUserId: embedContext.accountUser.id,
    });

    const guides = await getAvailableGuides(embedContext.accountUser);
    expectGuideOrder(guides, [
      mainQuestGuides[0],
      mainQuestGuides[3],
      mainQuestGuides[1],
    ]);
  });

  test('three main quests, two incomplete, all viewed', async () => {
    const embedContext = getEmbedContext();
    const { mainQuestGuides } = await createGuides({
      executeAdminQuery,
      embedContext,
      mainQuestGuidesCount: 3,
      incompletedMainQuestGuidesCount: 2,
    });

    await recordGuideView({
      entityId: mainQuestGuides[2].entityId,
      accountUser: embedContext.accountUser,
    });

    const guides = await getAvailableGuides(embedContext.accountUser);
    expectGuideOrder(guides, [
      mainQuestGuides[0],
      mainQuestGuides[1],
      mainQuestGuides[2],
    ]);
  });

  test('two main quests, one incomplete, one side quest', async () => {
    const embedContext = getEmbedContext();
    const { mainQuestGuides, sideQuestGuides } = await createGuides({
      executeAdminQuery,
      embedContext,
      mainQuestGuidesCount: 2,
      sideQuestGuidesCount: 1,
    });

    const guides = await getAvailableGuides(embedContext.accountUser);
    expectGuideOrder(guides, [
      mainQuestGuides[0],
      mainQuestGuides[1],
      sideQuestGuides[0],
    ]);
  });

  test('one side quest, one main quest', async () => {
    const embedContext = getEmbedContext();
    const { mainQuestGuides, sideQuestGuides } = await createGuides({
      executeAdminQuery,
      embedContext,
      mainQuestGuidesCount: 1,
      sideQuestGuidesCount: 1,
      incompletedMainQuestGuidesCount: 1,
      completeFirstStepOfFirstIncompleteMainQuest: false,
      priorityRanking: [1, 0], // side quest first
    });

    const guides = await getAvailableGuides(embedContext.accountUser);
    expectGuideOrder(guides, [sideQuestGuides[0], mainQuestGuides[0]]);
  });

  test('one side quest and two main quests (first auto-launched), last quest branched from the first', async () => {
    const embedContext = getEmbedContext();
    const { mainQuestGuides, sideQuestGuides } = await createGuides({
      executeAdminQuery,
      embedContext,
      mainQuestGuidesCount: 2,
      sideQuestGuidesCount: 1,
      incompletedMainQuestGuidesCount: 1,
      completeFirstStepOfFirstIncompleteMainQuest: false,
      priorityRanking: [1, DEFAULT_PRIORITY_RANKING, 0],
    });

    const [branchingGuide, branchedGuide] = mainQuestGuides;
    const [singleSideQuest] = sideQuestGuides;

    await branchedGuide.update({
      launchedAt: branchingGuide.launchedAt,
    });
    await singleSideQuest.update({
      launchedAt: branchingGuide.launchedAt,
    });

    await TriggeredBranchingPath.create({
      organizationId: embedContext.organization.id,
      createdGuideId: mainQuestGuides[1].id,
      triggeredFromGuideId: mainQuestGuides[0].id,
      accountUserId: embedContext.accountUser.id,
    });

    const guides = await getAvailableGuides(embedContext.accountUser);
    expectGuideOrder(guides, [
      sideQuestGuides[0], // sidequest
      branchingGuide, // cyoa guide
      branchedGuide, // branched guide
    ]);
  });

  test('three main quests, two incomplete, two side quests', async () => {
    const embedContext = getEmbedContext();
    const { mainQuestGuides, sideQuestGuides } = await createGuides({
      executeAdminQuery,
      embedContext,
      mainQuestGuidesCount: 3,
      sideQuestGuidesCount: 2,
      incompletedMainQuestGuidesCount: 2,
      completeFirstStepOfFirstIncompleteMainQuest: false,
    });

    const guides = await getAvailableGuides(embedContext.accountUser);
    expectGuideOrder(guides, [...mainQuestGuides, ...sideQuestGuides]);
  });

  test('four main quests, three incomplete, two side quests', async () => {
    const embedContext = getEmbedContext();
    const { mainQuestGuides, sideQuestGuides } = await createGuides({
      executeAdminQuery,
      embedContext,
      mainQuestGuidesCount: 4,
      incompletedMainQuestGuidesCount: 3,
      sideQuestGuidesCount: 2,
      completeFirstStepOfFirstIncompleteMainQuest: false,
    });

    const guides = await getAvailableGuides(embedContext.accountUser);
    expectGuideOrder(
      guides,
      mainQuestGuides.slice(0, 3).concat(sideQuestGuides)
    );
  });

  test('two main quests, both incomplete, two side quests', async () => {
    const embedContext = getEmbedContext();
    const { mainQuestGuides, sideQuestGuides } = await createGuides({
      executeAdminQuery,
      embedContext,
      mainQuestGuidesCount: 2,
      sideQuestGuidesCount: 2,
      incompletedMainQuestGuidesCount: 2,
    });

    const guides = await getAvailableGuides(embedContext.accountUser);
    expectGuideOrder(guides, mainQuestGuides.concat(sideQuestGuides));
  });

  test('three main quests, three incomplete, two side quests', async () => {
    const embedContext = getEmbedContext();
    const { mainQuestGuides, sideQuestGuides } = await createGuides({
      executeAdminQuery,
      embedContext,
      mainQuestGuidesCount: 3,
      incompletedMainQuestGuidesCount: 3,
      sideQuestGuidesCount: 2,
    });

    const guides = await getAvailableGuides(embedContext.accountUser);
    expectGuideOrder(
      guides,
      mainQuestGuides.slice(0, 2).concat(sideQuestGuides)
    );
  });

  test('two main quests, both incomplete, first guide auto-launched, two side quests', async () => {
    const embedContext = getEmbedContext();
    const { mainQuestGuides, sideQuestGuides } = await createGuides({
      executeAdminQuery,
      embedContext,
      mainQuestGuidesCount: 2,
      sideQuestGuidesCount: 2,
      incompletedMainQuestGuidesCount: 2,
    });

    await mainQuestGuides[0].createdFromGuideBase!.createdFromTemplate!.update({
      isAutoLaunchEnabled: true,
    });

    const guides = await getAvailableGuides(embedContext.accountUser);
    expectGuideOrder(guides, mainQuestGuides.concat(sideQuestGuides));
  });

  test('three main quests, two incomplete, first guide auto-launched, last guide branched from first, two side quests', async () => {
    const embedContext = getEmbedContext();
    const { mainQuestGuides, sideQuestGuides } = await createGuides({
      executeAdminQuery,
      embedContext,
      mainQuestGuidesCount: 3,
      sideQuestGuidesCount: 2,
      incompletedMainQuestGuidesCount: 2,
      completeFirstStepOfFirstIncompleteMainQuest: false,
      priorityRanking: [0, 1, DEFAULT_PRIORITY_RANKING, 3, 4],
      additionalData: [
        { name: 'branching' },
        { name: 'incomplete' },
        { name: 'branching destination' },
      ],
    });

    const [branchingGuide, _incompleteGuide, branchedGuide] = mainQuestGuides;

    await mainQuestGuides[0].createdFromGuideBase!.createdFromTemplate!.update({
      isAutoLaunchEnabled: true,
    });

    await TriggeredBranchingPath.create({
      organizationId: embedContext.organization.id,
      createdGuideId: mainQuestGuides[2].id, // last mainQuest
      triggeredFromGuideId: mainQuestGuides[0].id, // first mainQuest
      accountUserId: embedContext.accountUser.id,
    });

    const guides = await getAvailableGuides(embedContext.accountUser);
    expectGuideOrder(guides, [
      branchingGuide,
      branchedGuide,
      _incompleteGuide,
      ...sideQuestGuides,
    ]);
  });

  test('two main quests incomplete, second guide auto-launched, two modals', async () => {
    const embedContext = getEmbedContext();
    const { mainQuestGuides, sideQuestGuides } = await createGuides({
      executeAdminQuery,
      embedContext,
      mainQuestGuidesCount: 2,
      sideQuestGuidesCount: 2,
      incompletedMainQuestGuidesCount: 2,
    });

    await mainQuestGuides[1].createdFromGuideBase!.createdFromTemplate!.update({
      isAutoLaunchEnabled: true,
    });

    await completeGuide(sideQuestGuides[0], embedContext.accountUser);

    const guides = await getAvailableGuides(embedContext.accountUser);
    expectGuideOrder(guides, mainQuestGuides.concat(sideQuestGuides));
  });

  test('three main quests incomplete, second guide auto-launched, two modals', async () => {
    const embedContext = getEmbedContext();
    const { mainQuestGuides, sideQuestGuides } = await createGuides({
      executeAdminQuery,
      embedContext,
      mainQuestGuidesCount: 3,
      sideQuestGuidesCount: 2,
      incompletedMainQuestGuidesCount: 3,
    });

    await mainQuestGuides[1].createdFromGuideBase!.createdFromTemplate!.update({
      isAutoLaunchEnabled: true,
    });

    await completeGuide(sideQuestGuides[0], embedContext.accountUser);

    const guides = await getAvailableGuides(embedContext.accountUser);
    expectGuideOrder(
      guides,
      mainQuestGuides.slice(0, 2).concat(sideQuestGuides)
    );
  });

  test('three modals, one complete, one saved', async () => {
    const embedContext = getEmbedContext();
    const { sideQuestGuides } = await createGuides({
      executeAdminQuery,
      embedContext,
      mainQuestGuidesCount: 0,
      sideQuestGuidesCount: 3,
      incompletedMainQuestGuidesCount: 0,
    });

    await completeGuide(sideQuestGuides[0], embedContext.accountUser);

    await (
      await sideQuestGuides[2].$get('guideParticipants')
    )?.[0].update({ savedAt: new Date() });

    const guides = await getAvailableGuides(embedContext.accountUser);
    expectGuideOrder(guides, [
      sideQuestGuides[0],
      sideQuestGuides[1],
      sideQuestGuides[2],
    ]);
  });

  test('one modal (saved), two context guides, one complete', async () => {
    const embedContext = getEmbedContext();
    const { sideQuestGuides } = await createGuides({
      executeAdminQuery,
      embedContext,
      mainQuestGuidesCount: 0,
      sideQuestGuidesCount: 3,
      incompletedMainQuestGuidesCount: 0,
      modalCount: 1,
      contextGuideCount: 2,
    });

    await completeGuide(sideQuestGuides[2], embedContext.accountUser);

    await (
      await sideQuestGuides[0].$get('guideParticipants')
    )?.[0].update({ savedAt: new Date() });

    const guides = await getAvailableGuides(embedContext.accountUser);
    expectGuideOrder(guides, sideQuestGuides);
  });

  test('one modal (saved), one banner (dismissed), one context guide (incomplete)', async () => {
    const embedContext = getEmbedContext();
    const { sideQuestGuides } = await createGuides({
      executeAdminQuery,
      embedContext,
      mainQuestGuidesCount: 0,
      sideQuestGuidesCount: 3,
      incompletedMainQuestGuidesCount: 0,
      modalCount: 1,
      bannerCount: 1,
      contextGuideCount: 1,
    });

    await (
      await sideQuestGuides[0].$get('guideParticipants')
    )?.[0].update({ savedAt: new Date() });

    await setStepSkipped({
      entityId: (await sideQuestGuides[1].$get('steps'))[0].entityId,
      isSkipped: true,
      accountUser: embedContext.accountUser,
      organization: embedContext.organization,
    });

    const guides = await getAvailableGuides(embedContext.accountUser);

    expectGuideOrder(guides, [
      sideQuestGuides[0],
      sideQuestGuides[1],
      sideQuestGuides[2],
    ]);
  });

  test.each([0, 1, 5, DEFAULT_PRIORITY_RANKING])(
    'correctly sorts branching and destination guides for priority ranking (%p)',
    async (priorityRanking) => {
      const embedContext = getEmbedContext();
      const { mainQuestGuides } = await createGuides({
        executeAdminQuery,
        embedContext,
        mainQuestGuidesCount: 2,
        incompletedMainQuestGuidesCount: 1,
        priorityRanking: [priorityRanking, DEFAULT_PRIORITY_RANKING],
        additionalData: [
          {},
          {
            type: GuideTypeEnum.account,
          },
        ],
      });

      const [branchingGuide, destinationGuide] = mainQuestGuides;

      // if priority ranking for the branching guide is not 999, it means it was auto-launched
      // and therefore we need to enable it for the sake of data correctness, although the sorting logic
      // might not directly use this value
      if (priorityRanking !== DEFAULT_PRIORITY_RANKING) {
        await branchingGuide.createdFromGuideBase!.createdFromTemplate!.update({
          isAutoLaunchEnabled: true,
        });
      }

      // updates the destination guide
      await destinationGuide.update({
        launchedAt: new Date(), // now
        completedAt: null,
      });

      const createdAccountUsers = await createDummyAccountUsers(
        embedContext.organization,
        embedContext.account,
        5
      );

      await promises.mapSeries(
        [
          ...createdAccountUsers.slice(3),
          embedContext.accountUser,
          ...createdAccountUsers.slice(0, 3),
        ],
        async (au) => {
          await TriggeredBranchingPath.create({
            organizationId: embedContext.organization.id,
            accountUserId: au.id,
            triggeredFromGuideId: branchingGuide.id,
            createdGuideId: destinationGuide.id,
          });
        }
      );

      const guides = await getAvailableGuides(embedContext.accountUser);

      expectGuideOrder(guides, [mainQuestGuides[0], mainQuestGuides[1]]);
    }
  );

  test('two account users of same account, two main guides, first user completed the cyoa user-level guide, incomplete account-level branched guide is launched to the whole account', async () => {
    const { account, organization } = getEmbedContext();

    const { template: cyoaTemplate } = await createTemplateForTest(
      executeAdminQuery,
      getEmbedContext(),
      {
        formFactor: GuideFormFactor.legacy,
        isSideQuest: false,
        theme: Theme.nested,
        type: GuideTypeEnum.user,
        modules: fakeModule() as unknown as any,
      },
      false,
      0 // priority ranking
    );

    const { template: branchedTemplate } = await createTemplateForTest(
      executeAdminQuery,
      getEmbedContext(),
      {
        formFactor: GuideFormFactor.legacy,
        isSideQuest: false,
        theme: Theme.nested,
        type: GuideTypeEnum.account,
      },
      false
    );

    const templates = await Template.findAll({
      where: {
        organizationId: organization.id,
        entityId: {
          [Op.in]: [cyoaTemplate.entityId, branchedTemplate.entityId],
        },
      },
      order: [['createdAt', 'ASC']],
    });

    const [cyoaGuideTemplate, branchedGuideTemplate] = templates;

    const cyoaGuideBase = await launchDefaultTemplate({
      organization,
      account,
      templateId: cyoaGuideTemplate.id,
    });

    const branchedGuideBase = await launchDefaultTemplate({
      organization,
      account,
      templateId: branchedGuideTemplate.id,
    });

    const [firstAccountUser, secondAccountUser] = await createDummyAccountUsers(
      organization,
      account,
      2
    );

    // cyoa guide is auto-launched
    await cyoaGuideTemplate?.update({ isAutoLaunchEnabled: true });

    let cyoaGuide: Guide;

    //
    // First user
    //
    // Performs the branching to the account-level guide

    cyoaGuide = await createGuideFromGuideBase({
      guideBase: cyoaGuideBase,
      accountUser: firstAccountUser,
      state: GuideState.active,
      launchedAt: new Date(),
    });

    await GuideParticipant.create({
      organizationId: organization.id,
      accountUserId: firstAccountUser.id,
      guideId: cyoaGuide.id,
    });

    const branchedGuide = await createGuideFromGuideBase({
      guideBase: branchedGuideBase,
      accountUser: firstAccountUser,
      state: GuideState.active,
      launchedAt: new Date(),
    });

    await GuideParticipant.create({
      organizationId: organization.id,
      accountUserId: firstAccountUser.id,
      guideId: branchedGuide.id,
    });

    await TriggeredBranchingPath.create({
      organizationId: organization.id,
      accountUserId: firstAccountUser.id,
      triggeredFromGuideId: cyoaGuide.id,
      createdGuideId: branchedGuide.id,
    });

    await completeGuide(cyoaGuide, firstAccountUser);
    await cyoaGuide.reload();

    const expectedFirstUserGuides = await promises.map(
      [cyoaGuide, branchedGuide],
      async (guide) => {
        return guide.reload({
          include: [Template],
        }) as Promise<GuideWithTemplate>;
      }
    );

    const firstUserGuides = await getAvailableGuides(firstAccountUser);
    expectGuideOrder(firstUserGuides, expectedFirstUserGuides);

    //
    // Second user
    //
    // Does nothing, should still get the CYOA first

    cyoaGuide = await createGuideFromGuideBase({
      guideBase: cyoaGuideBase,
      accountUser: secondAccountUser,
      state: GuideState.active,
      launchedAt: new Date(),
    });

    await GuideParticipant.create({
      organizationId: organization.id,
      accountUserId: secondAccountUser.id,
      guideId: cyoaGuide.id,
    });

    await GuideParticipant.create({
      organizationId: organization.id,
      accountUserId: secondAccountUser.id,
      guideId: branchedGuide.id,
    });

    const expectedSecondUserGuides = await promises.map(
      [cyoaGuide, branchedGuide],
      async (guide) => {
        return guide.reload({
          include: [Template],
        }) as Promise<GuideWithTemplate>;
      }
    );

    const secondUserGuides = await getAvailableGuides(secondAccountUser);
    expectGuideOrder(secondUserGuides, expectedSecondUserGuides);
  });
});
