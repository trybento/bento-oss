import { GuideFormFactor } from 'src/../../common/types';
import { applyFinalCleanupHook } from 'src/data/datatests';
import { GuideBaseStepAutoCompleteInteraction } from 'src/data/models/GuideBaseStepAutoCompleteInteraction.model';
import { Module } from 'src/data/models/Module.model';
import { StepAutoCompleteInteraction } from 'src/data/models/StepAutoCompleteInteraction.model';
import { StepPrototypeAutoCompleteInteraction } from 'src/data/models/StepPrototypeAutoCompleteInteraction.model';
import { Template } from 'src/data/models/Template.model';
import { setupGraphQLTestServer } from 'src/graphql/testHelpers';
import testUtils from 'src/testUtils/test.util';
import { editStepPrototypeAutoCompleteInteraction } from '../editStepPrototypeAutoCompleteInteraction';
import cleanupDetachedGuideBaseAutoCompleteInteractions from './cleanupDetachedGuideBaseAutoCompleteInteractions';
import cleanupDetachedStepAutoCompleteInteractions from './cleanupDetachedStepAutoCompleteInteractions';

const { executeAdminQuery, getEmbedContext } = setupGraphQLTestServer('bento');

applyFinalCleanupHook();

describe('cleanupDetachedAutoCompleteInteractions', () => {
  test('removes detached auto complete interactions and nothing else', async () => {
    const { organization, account, accountUser } = getEmbedContext();

    const prototypes: StepPrototypeAutoCompleteInteraction[] = [];

    // spawn a few different templates with auto complete interactions
    for (let i = 0; i < 3; i++) {
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

      // find the template with the step prototypes
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

      // create the new interaction prototype
      const prototype = await editStepPrototypeAutoCompleteInteraction({
        stepPrototype,
        stepAutoCompleteInteraction:
          testUtils.fake.stepAutoCompleteInteraction(),
      });

      if (!prototype) {
        throw new Error('Expected the creation of a new interaction prototype');
      }

      // launch the guide (to create the gb/step interaction instances)
      await testUtils.guides.createGuideForUser(
        templateEntityId,
        organization,
        account,
        accountUser
      );

      prototypes.push(prototype);
    }

    // Grabs the last prototype created
    const lastPrototype = prototypes.pop();

    // find the base interaction
    const baseInteraction = await GuideBaseStepAutoCompleteInteraction.findOne({
      where: {
        createdFromSpacInteractionId: lastPrototype!.id,
      },
    });

    expect(baseInteraction).not.toBeNull();

    // find the step interaction
    const stepInteraction = await StepAutoCompleteInteraction.findOne({
      where: {
        createdFromGuideBaseStepAutoCompleteInteractionId: baseInteraction!.id,
      },
    });

    expect(stepInteraction).not.toBeNull();

    // destroy the prototype
    await lastPrototype!.destroy();

    // Cleanup detached guide-base level interactions
    expect(await cleanupDetachedGuideBaseAutoCompleteInteractions()).toEqual(1);
    await expect(baseInteraction!.reload()).rejects.toThrow();

    // Cleanup detached step-level interactions
    expect(await cleanupDetachedStepAutoCompleteInteractions()).toEqual(1);
    await expect(stepInteraction!.reload()).rejects.toThrow();
  });
});
