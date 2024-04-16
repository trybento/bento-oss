import { GuideFormFactor } from 'src/../../common/types';
import { applyFinalCleanupHook } from 'src/data/datatests';
import { Module } from 'src/data/models/Module.model';
import { Template } from 'src/data/models/Template.model';
import { setupGraphQLTestServer } from 'src/graphql/testHelpers';
import testUtils from 'src/testUtils/test.util';
import { editStepPrototypeAutoCompleteInteraction } from '../editStepPrototypeAutoCompleteInteraction';
import { createStepAutoCompleteInteractions } from './createStepAutoCompleteInteractions';
import { Step } from 'src/data/models/Step.model';
import { StepAutoCompleteInteraction } from 'src/data/models/StepAutoCompleteInteraction.model';

const { executeAdminQuery, getEmbedContext } = setupGraphQLTestServer('bento');

applyFinalCleanupHook();

describe('createStepAutoCompleteInteractions', () => {
  test('can create new instances but wont create duplicates', async () => {
    const { organization, account, accountUser } = getEmbedContext();

    const {
      template: { entityId: templateEntityId },
    } = await testUtils.gql.createTemplateForTest(
      executeAdminQuery,
      getEmbedContext(),
      {
        formFactor: GuideFormFactor.legacy,
        modules: testUtils.fake.module() as unknown as any,
      },
      false
    );

    const template = await Template.findOne({
      where: {
        entityId: templateEntityId,
      },
      include: {
        model: Module.scope(['withStepPrototypes']),
      },
    });

    // find the step prototype
    const stepPrototype = template?.modules[0].stepPrototypes[0];

    if (!stepPrototype) {
      throw new Error('Failed to find a step prototype');
    }

    // then create the new interaction
    const prototype = await editStepPrototypeAutoCompleteInteraction({
      stepPrototype,
      stepAutoCompleteInteraction: testUtils.fake.stepAutoCompleteInteraction(),
    });

    if (!prototype) {
      throw new Error('Expected the creation of a new interaction prototype');
    }

    // first launch the guide without any auto-complete interactions
    // NOTE: Launching the guide will create the first auto-complete interaction
    const { guide } = await testUtils.guides.createGuideForUser(
      templateEntityId,
      organization,
      account,
      accountUser
    );

    // find all the guide step bases
    const steps = await Step.findAll({
      where: {
        guideId: guide.id,
      },
    });

    // find how many step interactions were created
    const getCount = () => {
      return StepAutoCompleteInteraction.count({
        where: {
          stepId: steps.map((s) => s.id),
        },
      });
    };

    // one should already exist
    expect(await getCount()).toEqual(1);

    // Duplicate instances should not be spawned
    for (let i = 0; i < 3; i++) {
      expect(await createStepAutoCompleteInteractions({ steps })).toEqual([]);
    }

    // and the count should still be 1
    expect(await getCount()).toEqual(1);
  });
});
