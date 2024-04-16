import promises from 'src/utils/promises';
import { Op } from 'sequelize';

import { setupGraphQLTestServer } from 'src/graphql/testHelpers';

import {
  BranchingEntityType,
  GuideFormFactor,
  GuideState,
  GuideTypeEnum,
  Theme,
} from 'bento-common/types';

import { BranchingPath } from 'src/data/models/BranchingPath.model';
import { createTemplateForTest } from 'src/graphql/Template/testHelpers';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';
import {
  makeTemplateBranching,
  fakeModule,
  launchDefaultTemplate,
  createDummyAccountUsers,
} from 'src/testUtils/dummyDataHelpers';
import { Organization } from 'src/data/models/Organization.model';
import { Step, StepModelScope } from 'src/data/models/Step.model';
import { Template } from 'src/data/models/Template.model';
import createGuideFromGuideBase from 'src/interactions/createGuideFromGuideBase';
import { Guide } from 'src/data/models/Guide.model';
import { useDummyTest } from 'src/data/datatests';

jest.mock('src/utils/detachPromise');

type QueryReturnType = {
  data: { selectBranchingPath: { errors: object[] } };
};

const graphQLTestHelpers = setupGraphQLTestServer('bento');
const { executeAdminQuery, executeEmbedQuery, getEmbedContext } =
  graphQLTestHelpers;

/** To be used in conjunction with {@link QueryReturnType} */
const testQuery = `
  mutation SelectBranchingPathMutation($input: selectBranchingPathInput!) {
    selectBranchingPath(input: $input) {
      errors
    }
  }
`;

const transformTemplateIntoBranching = async ({
  templates,
  organization,
}: {
  organization: Organization;
  templates: Template[];
}) => {
  const choiceKey = 'a';
  const branchingKey = await makeTemplateBranching(templates[0].id);

  const pathData = {
    organizationId: organization.id,
    entityType: BranchingEntityType.Guide,
    actionType: 'create',
    templateId: templates[1].id,
    branchingKey,
    choiceKey,
  };

  await BranchingPath.create(pathData);

  return { branchingKey, choiceKey };
};

useDummyTest();

/**
 * These tests are broken for unknown reason. A trx failure unrelated
 * to the actual branching logic appears to be the cause.
 *
 * Do not re-enable until this has been investigated.
 */
describe.skip('selectBranchingPaths mutation', () => {
  test('new account/user level guide is correctly launched', async () => {
    const { account, accountUser, organization } = getEmbedContext();

    expect.assertions(8);

    await promises.mapSeries(
      [GuideTypeEnum.user, GuideTypeEnum.account],
      async (scope) => {
        const { template: branchingTemplate } = await createTemplateForTest(
          executeAdminQuery,
          getEmbedContext(),
          {
            formFactor: GuideFormFactor.legacy,
            isSideQuest: false,
            theme: Theme.nested,
            type: GuideTypeEnum.user,
            modules: fakeModule() as unknown as any,
          },
          false
        );

        const { template: destinationTemplate } = await createTemplateForTest(
          executeAdminQuery,
          getEmbedContext(),
          {
            formFactor: GuideFormFactor.legacy,
            isSideQuest: false,
            theme: Theme.nested,
            type: scope as GuideTypeEnum,
          },
          false
        );

        const templates = await Template.findAll({
          where: {
            organizationId: organization.id,
            entityId: {
              [Op.in]: [
                branchingTemplate.entityId,
                destinationTemplate.entityId,
              ],
            },
          },
          order: [['createdAt', 'ASC']],
        });

        const { branchingKey, choiceKey } =
          await transformTemplateIntoBranching({
            templates,
            organization,
          });

        const guideBase = await launchDefaultTemplate({
          organization,
          account,
          templateId: templates[0].id,
        });

        const guide = await createGuideFromGuideBase({
          guideBase,
          accountUser,
          state: GuideState.active,
          launchedAt: new Date(),
        });

        await GuideParticipant.create({
          guideId: guide.id,
          accountUserId: accountUser.id,
          organizationId: organization.id,
        });

        const step = await Step.scope(
          StepModelScope.withPrototypeBranchingInfo
        ).findOne({
          where: {
            guideId: guide.id,
            // @ts-ignore
            '$createdFromStepPrototype.entity_id$': branchingKey,
          },
        });

        const {
          data: {
            selectBranchingPath: { errors },
          },
        } = await executeEmbedQuery<QueryReturnType>({
          query: testQuery,
          variables: {
            input: {
              branchingKey,
              choiceKeys: [choiceKey],
              choiceLabels: [choiceKey],
              stepEntityId: step?.entityId ?? '',
              shouldCompleteStep: true,
            },
          },
        });

        const destinationGuide = await Guide.findOne({
          where: {
            organizationId: organization.id,
            createdFromTemplateId: templates[1]?.id,
          },
          include: ['guideParticipants'],
        });

        expect(errors).toHaveLength(0);
        // destination guide is created
        expect(destinationGuide).not.toBeNull();
        // guide has only one participant
        expect(destinationGuide?.guideParticipants).toHaveLength(1);
        // participant is the one expected
        expect(destinationGuide?.guideParticipants).toContainEqual(
          expect.objectContaining({
            accountUserId: accountUser.id,
          })
        );
      }
    );
  });

  test('branching to account level guide results in multiple participants added to the same guide instance', async () => {
    const { account, organization } = getEmbedContext();

    const { template: branchingTemplate } = await createTemplateForTest(
      executeAdminQuery,
      getEmbedContext(),
      {
        formFactor: GuideFormFactor.legacy,
        isSideQuest: false,
        theme: Theme.nested,
        type: GuideTypeEnum.user,
        modules: fakeModule() as unknown as any,
      },
      false
    );

    const { template: destinationTemplate } = await createTemplateForTest(
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
          [Op.in]: [branchingTemplate.entityId, destinationTemplate.entityId],
        },
      },
      order: [['createdAt', 'ASC']],
    });

    const { branchingKey, choiceKey } = await transformTemplateIntoBranching({
      templates,
      organization,
    });

    const branchingGuideBase = await launchDefaultTemplate({
      organization,
      account,
      templateId: templates[0].id,
    });

    const accountUsers = await createDummyAccountUsers(
      organization,
      account,
      2
    );

    expect.assertions(6);

    await promises.mapSeries(accountUsers, async (accountUser) => {
      const branchingGuide = await createGuideFromGuideBase({
        guideBase: branchingGuideBase,
        accountUser,
        state: GuideState.active,
        launchedAt: new Date(),
      });

      const step = await Step.scope(
        StepModelScope.withPrototypeBranchingInfo
      ).findOne({
        where: {
          guideId: branchingGuide.id,
          // @ts-ignore
          '$createdFromStepPrototype.entity_id$': branchingKey,
        },
      });

      await GuideParticipant.create({
        guideId: branchingGuide.id,
        accountUserId: accountUser.id,
        organizationId: organization.id,
      });

      const {
        data: {
          selectBranchingPath: { errors },
        },
      } = await executeEmbedQuery<QueryReturnType>({
        query: testQuery,
        variables: {
          input: {
            branchingKey,
            choiceKeys: [choiceKey],
            choiceLabels: [choiceKey],
            stepEntityId: step?.entityId || '',
            shouldCompleteStep: true,
          },
        },
        context: {
          account,
          accountUser,
          organization,
        },
      });

      expect(errors).toHaveLength(0);
    });

    const destinationGuides = await Guide.findAll({
      where: {
        organizationId: organization.id,
        createdFromTemplateId: templates[1]?.id,
      },
      include: ['guideParticipants'],
    });

    // only one guide is created
    expect(destinationGuides).toHaveLength(1);
    // guide has the 2 participants we're expecting
    expect(destinationGuides?.[0]?.guideParticipants).toHaveLength(2);
    // participants are the ones expected
    expect(destinationGuides?.[0]?.guideParticipants).toContainEqual(
      expect.objectContaining({
        accountUserId: accountUsers[0].id,
      })
    );
    expect(destinationGuides?.[0]?.guideParticipants).toContainEqual(
      expect.objectContaining({
        accountUserId: accountUsers[1].id,
      })
    );
  });
});
