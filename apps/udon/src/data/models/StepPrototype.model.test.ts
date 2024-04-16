import { faker } from '@faker-js/faker';
import { CYOABackgroundImagePosition, StepType } from 'bento-common/types';
import { BranchingFormFactor } from 'bento-common/types/globalShoyuState';

import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import { StepPrototype } from './StepPrototype.model';

const getContext = setupAndSeedDatabaseForTests('bento');

describe('StepPrototype model', () => {
  test.each([StepType.branching, StepType.branchingOptional])(
    'can create branching steps (%s)',
    async (stepType) => {
      const { organization } = getContext();

      const prototype = await StepPrototype.create({
        organizationId: organization.id,
        stepType,
        name: faker.lorem.words(3),
        branchingQuestion: 'What is your favorite color?',
        branchingMultiple: false,
        branchingDismissDisabled: false,
        branchingChoices: Array(3).map(() => ({
          choiceKey: faker.lorem.slug(3),
          label: faker.lorem.words(3),
          selected: false,
          style: {
            backgroundColor: null,
            backgroundImageUrl: null,
            CYOABackgroundImagePosition: CYOABackgroundImagePosition.background,
          },
        })),
        branchingFormFactor: BranchingFormFactor.cards,
      });

      expect(prototype.id).toBeTruthy();
      // NOTE: The below is temporary and will be removed once branchingKey is removed
      expect(prototype.branchingKey).toEqual(prototype.entityId);
    }
  );

  test.each([
    StepType.fyi,
    StepType.input,
    StepType.optional,
    StepType.required,
  ])('branchingKey is null for non-branching steps (%s)', async (stepType) => {
    const { organization } = getContext();

    const prototype = await StepPrototype.create({
      organizationId: organization.id,
      stepType,
      name: faker.lorem.words(3),
    });

    expect(prototype.branchingKey).toBeNull();
  });
});
