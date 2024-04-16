import { TemplateState } from 'src/../../common/types';
import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import { Template } from 'src/data/models/Template.model';
import { setAccountTargetsForTemplate } from 'src/interactions/targeting/setAccountTargetsForTemplate';

const getContext = setupAndSeedDatabaseForTests('paydayio');

describe('setAccountTargetsForTemplate', () => {
  test('should set template to live when enabling autolaunch', async () => {
    const { organization } = getContext();

    const template = await Template.findOne({
      where: { organizationId: organization.id },
    });

    if (!template) {
      throw new Error('Expected template');
    }

    await template.update({ state: TemplateState.draft });

    await setAccountTargetsForTemplate({
      template,
      isAutoLaunchEnabled: true,
    });

    await template.reload();

    expect(template).toHaveProperty('state', TemplateState.live);
  });

  test('should set template to stopped when disabling autolaunch', async () => {
    const { organization } = getContext();

    const template = await Template.findOne({
      where: { organizationId: organization.id },
    });

    if (!template) {
      throw new Error('Expected template');
    }

    await template.update({
      state: TemplateState.live,
      isAutoLaunchEnabled: true,
    });

    await setAccountTargetsForTemplate({
      template,
      isAutoLaunchEnabled: false,
    });

    await template.reload();

    expect(template).toHaveProperty('state', TemplateState.stopped);
  });

  test("should leave template in current state if autolaunch isn't changed", async () => {
    const { organization } = getContext();

    const template = await Template.findOne({
      where: { organizationId: organization.id },
    });

    if (!template) {
      throw new Error('Expected template');
    }

    await template.update({
      state: TemplateState.draft,
      isAutoLaunchEnabled: false,
    });

    await setAccountTargetsForTemplate({
      template,
      isAutoLaunchEnabled: false,
    });

    await template.reload();

    expect(template).toHaveProperty('state', TemplateState.draft);
  });
});
