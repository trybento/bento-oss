import { GuideState, Nullable } from 'bento-common/types';
import { StepState, FullGuide } from 'bento-common/types/globalShoyuState';

import { applyFinalCleanupHook, MAX_RETRY_TIMES } from 'src/data/datatests';
import { launchDefaultTemplate } from 'src/testUtils/dummyDataHelpers';
import { setupGraphQLTestServer } from 'src/graphql/testHelpers';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';
import { Guide } from 'src/data/models/Guide.model';
import { GuideModule } from 'src/data/models/GuideModule.model';
import {
  Step,
  StepCompletedByType,
  StepModelScope,
} from 'src/data/models/Step.model';
import createGuideFromGuideBase from 'src/interactions/createGuideFromGuideBase';
import { setStepSkipped } from 'src/interactions/setStepSkipped';
import { resolveStepState } from './helpers';
import stepParticipantForStepAndAccountUserLoader from 'src/data/loaders/Step/stepParticipantForStepAndAccountUser.loader';
import { setStepCompletion } from 'src/interactions/setStepCompletion';
import { Template } from 'src/data/models/Template.model';

applyFinalCleanupHook();
jest.retryTimes(MAX_RETRY_TIMES);

const { executeEmbedQuery, getEmbedContext } = setupGraphQLTestServer('bento');

/** to be used in conjunction with {@link TestQueryReturnType} */
const testQuery = `
  query EmbedQueryTest($guideEntityId: EntityId!) {
    guide(guideEntityId: $guideEntityId) {
      steps {
        entityId
        state
        orderIndex
        module
        guide
        previousStepEntityId
        nextStepEntityId
        branching {
          key
          question
          multiSelect
          dismissDisabled
          formFactor
          branches {
            key
            label
            selected
          }
        }
      }
    }
  }
`;

type TestQueryReturnType = {
  steps: Pick<
    FullGuide['steps'][number],
    'entityId' | 'state' | 'orderIndex' | 'module' | 'guide'
  > &
    {
      previousStepEntityId: Nullable<string>;
      nextStepEntityId: Nullable<string>;
      branching: Pick<
        Exclude<FullGuide['steps'][number]['branching'], undefined>,
        | 'key'
        | 'question'
        | 'multiSelect'
        | 'dismissDisabled'
        | 'formFactor'
        | 'branches'
      > & {
        branches: Pick<
          Exclude<
            FullGuide['steps'][number]['branching'],
            undefined
          >['branches'][number],
          'key' | 'label' | 'selected'
        >[];
      };
    }[];
};

const createAndGetGuide = async () => {
  const { organization, account, accountUser } = getEmbedContext();
  const guideBase = await launchDefaultTemplate({ account, organization });

  const guide = await Guide.findOne({
    include: [
      {
        model: GuideModule,
        include: [
          {
            model: Step.scope([
              StepModelScope.withBase,
              StepModelScope.withPrototype,
            ]),
            include: [{ model: GuideModule }, { model: Guide }],
            order: [['$createdFromStepBase.orderIndex$', 'ASC']],
          },
        ],
        order: [['$guideModules.orderIndex$', 'ASC']],
      },
    ],
    where: {
      organizationId: organization.id,
      createdFromGuideBaseId: guideBase.id,
    },
  });

  if (!guide) {
    throw new Error('Did not create expected guide');
  }

  await GuideParticipant.create({
    guideId: guide.id,
    accountUserId: accountUser.id,
    organizationId: organization.id,
  });

  return guide;
};

const getGuideFromQuery = async (guideEntityId: string) => {
  const response = (await executeEmbedQuery({
    query: testQuery,
    variables: { guideEntityId },
  })) as {
    data: { guide: any };
  };

  return response.data.guide as TestQueryReturnType;
};

describe('EmbedStep.graphql', () => {
  test('steps are correctly returned', async () => {
    const expectedGuide = await createAndGetGuide();
    const guide = await getGuideFromQuery(expectedGuide!.entityId);

    const expectedStepsSorted = expectedGuide.guideModules.flatMap(
      (gm) => gm.steps
    );

    let accOrderIndex = 0;
    expectedStepsSorted.slice(0, 1).forEach((expectedStep, index) => {
      expect(guide.steps[accOrderIndex]).toMatchObject({
        entityId: expectedStep.entityId,
        state: 'incomplete',
        orderIndex: accOrderIndex,
        module: expectedStep.guideModule!.entityId,
        guide: expectedStep.guide.entityId,
        previousStepEntityId: expectedStepsSorted[index - 1]?.entityId || null,
        nextStepEntityId: expectedStepsSorted[index + 1]?.entityId || null,
        branching: {
          key: null,
          question: null,
          multiSelect: false,
          dismissDisabled: false,
          formFactor: null,
          branches: [],
        },
      });

      accOrderIndex++;
    });
  });

  test('step state is correctly resolved', async () => {
    const embedContext = getEmbedContext();
    const { organization, account, accountUser } = embedContext;

    const template = await Template.findOne({
      where: { organizationId: organization.id },
    });

    const guideBase = await launchDefaultTemplate({
      organization,
      account,
      templateId: template!.id,
    });

    const guide = await createGuideFromGuideBase({
      guideBase,
      accountUser,
      state: GuideState.active,
      launchedAt: new Date(),
    });

    const steps = await Step.findAll({ where: { guideId: guide.id } });

    const skippedStep = await setStepSkipped({
      entityId: steps[0].entityId,
      isSkipped: true,
      accountUser,
      organization,
    });

    const skippedStepState: StepState = await resolveStepState(
      skippedStep,
      {},
      {
        ...embedContext,
        loaders: {
          stepParticipantForStepAndAccountUserLoader:
            stepParticipantForStepAndAccountUserLoader(),
        },
      } as any,
      {} as any
    );

    expect(skippedStepState).toBe(StepState.skipped);

    const completedStep = await setStepCompletion({
      step: steps[0],
      completedByType: StepCompletedByType.AccountUser,
      isComplete: true,
      accountUser,
    });

    const completedStepState: StepState = await resolveStepState(
      completedStep,
      {},
      {
        ...embedContext,
        loaders: {
          stepParticipantForStepAndAccountUserLoader:
            stepParticipantForStepAndAccountUserLoader(),
        },
      } as any,
      {} as any
    );

    expect(completedStepState).toBe(StepState.complete);
  });
});
