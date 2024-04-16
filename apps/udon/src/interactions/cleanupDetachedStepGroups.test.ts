import { faker } from '@faker-js/faker';
import { $enum } from 'ts-enum-util';
import { GuideFormFactor } from 'bento-common/types';
import { REUSABLE_STEP_GROUP_FORM_FACTORS } from 'bento-common/utils/stepGroups';

import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import { Template } from 'src/data/models/Template.model';
import cleanupDetachedStepGroups from './cleanupDetachedStepGroups';
import createModule from './library/createModule';
import { TemplateModule } from 'src/data/models/TemplateModule.model';

const getContext = setupAndSeedDatabaseForTests('bento');

describe('cleanupDetachedStepGroups', () => {
  test.each(REUSABLE_STEP_GROUP_FORM_FACTORS)(
    'wont remove orphan module from reusable form factor: %s',
    async (ff) => {
      const { organization, user } = getContext();

      await createModule({
        user,
        organization,
        moduleData: {
          name: faker.lorem.words(),
          createdFromFormFactor: ff,
          stepPrototypes: [],
        },
      });

      const rows = await cleanupDetachedStepGroups();
      expect(rows).toEqual(0);
    }
  );

  test.each(
    $enum(GuideFormFactor)
      .getValues()
      .filter((ff) => !REUSABLE_STEP_GROUP_FORM_FACTORS.includes(ff))
  )('wont remove used module from not reusable form factor: %s', async (ff) => {
    const { organization, user } = getContext();

    const module = await createModule({
      user,
      organization,
      moduleData: {
        name: faker.lorem.words(),
        createdFromFormFactor: ff,
        stepPrototypes: [],
      },
    });

    // leverages the default template
    const template = await Template.findOne();

    await TemplateModule.create({
      templateId: template!.id,
      moduleId: module.id,
      organizationId: organization.id,
      orderIndex: 999,
    });

    const rows = await cleanupDetachedStepGroups();
    expect(rows).toEqual(0);
  });

  test.each(
    $enum(GuideFormFactor)
      .getValues()
      .filter((ff) => !REUSABLE_STEP_GROUP_FORM_FACTORS.includes(ff))
  )('remove orphan module from not reusable form factor: %s', async (ff) => {
    const { organization, user } = getContext();

    await createModule({
      user,
      organization,
      moduleData: {
        name: faker.lorem.words(),
        createdFromFormFactor: ff,
        stepPrototypes: [],
      },
    });

    const rows = await cleanupDetachedStepGroups();
    expect(rows).toEqual(1);
  });
});
