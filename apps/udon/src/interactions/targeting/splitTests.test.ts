import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import { Template } from 'src/data/models/Template.model';
import { allElementsEqual } from 'src/utils/helpers';
import getSplitTestTemplate from './getSplitTestTemplate';
import { generateTemplates, getDummySplitTestTemplate } from './testHelpers';

const getContext = setupAndSeedDatabaseForTests('paydayio');

const NUM_SELECTIONS = 100;

describe('split tests', () => {
  test('selects a path randomly', async () => {
    const { organization } = getContext();

    const source = await Template.findOne({
      where: {
        organizationId: organization.id,
      },
    });

    if (!source) throw new Error('No source template');

    const newTemplates = await generateTemplates({
      organization,
      source,
      count: 2,
    });

    const splitTestTemplate = await getDummySplitTestTemplate(
      organization,
      newTemplates.map((t) => t.entityId)
    );

    const selected: number[] = [];

    for (let i = 0; i < NUM_SELECTIONS; i++) {
      const pick = await getSplitTestTemplate({ splitTestTemplate });
      if (!!pick) selected.push(pick.id);
    }

    expect(allElementsEqual(selected)).toBeFalsy();
  });

  test('selects null paths', async () => {
    const { organization } = getContext();

    const source = await Template.findOne({
      where: {
        organizationId: organization.id,
      },
    });

    if (!source) throw new Error('No source template');

    const splitTestTemplate = await getDummySplitTestTemplate(organization, [
      source.entityId,
      null,
    ]);

    const selected: number[] = [];

    for (let i = 0; i < NUM_SELECTIONS; i++) {
      const pick = await getSplitTestTemplate({ splitTestTemplate });
      if (!!pick) selected.push(pick.id);
    }

    expect(selected.length).toBeLessThan(NUM_SELECTIONS);
  });
});
