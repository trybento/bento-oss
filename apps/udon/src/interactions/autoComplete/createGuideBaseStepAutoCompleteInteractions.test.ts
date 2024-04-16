import { GuideFormFactor } from 'src/../../common/types';
import { applyFinalCleanupHook } from 'src/data/datatests';
import { GuideBaseStepAutoCompleteInteraction } from 'src/data/models/GuideBaseStepAutoCompleteInteraction.model';
import { GuideStepBase } from 'src/data/models/GuideStepBase.model';
import { Module } from 'src/data/models/Module.model';
import { Template } from 'src/data/models/Template.model';
import { setupGraphQLTestServer } from 'src/graphql/testHelpers';
import testUtils from 'src/testUtils/test.util';
import { createGuideBaseStepAutoCompleteInteractions } from './createGuideBaseStepAutoCompleteInteractions';
import { editStepPrototypeAutoCompleteInteraction } from '../editStepPrototypeAutoCompleteInteraction';

const { executeAdminQuery, getEmbedContext } = setupGraphQLTestServer('bento');

applyFinalCleanupHook();

describe('createGuideBaseStepAutoCompleteInteractions', () => {
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

    // first launch the guide without any auto-complete interactions
    const { guideBase } = await testUtils.guides.createGuideForUser(
      templateEntityId,
      organization,
      account,
      accountUser
    );

    // then create the new interaction
    const prototype = await editStepPrototypeAutoCompleteInteraction({
      stepPrototype,
      stepAutoCompleteInteraction: testUtils.fake.stepAutoCompleteInteraction(),
    });

    if (!prototype) {
      throw new Error('Expected the creation of a new interaction prototype');
    }

    // find all the guide step bases
    const guideStepBases = await GuideStepBase.findAll({
      where: {
        guideBaseId: guideBase.id,
      },
    });

    const [bases, steps] = await createGuideBaseStepAutoCompleteInteractions({
      guideStepBases,
    });

    // New instances should be spawned the first time
    expect(bases.length).toEqual(1);
    expect(steps.length).toEqual(1);

    // And not spawned in subsequent times
    for (let i = 0; i < 3; i++) {
      expect(
        await createGuideBaseStepAutoCompleteInteractions({ guideStepBases })
      ).toEqual([[], []]);
    }

    // find the base interaction
    const baseInteractionsCount =
      await GuideBaseStepAutoCompleteInteraction.count({
        where: {
          createdFromSpacInteractionId: prototype!.id,
        },
      });

    expect(baseInteractionsCount).toEqual(1);
  });
});
