'use strict';

const { faker } = require('@faker-js/faker');
const flatMap = require('lodash/flatMap');

const IS_E2E = process.env.NODE_ENV === 'e2e';

const fakeOrganization = (extrasOrOverrides = {}) => ({
  name: faker.company.name(),
  slug: faker.string.uuid(),
  domain: faker.internet.domainName(),
  ...extrasOrOverrides,
});

const createOrgs = async (queryInterface, data = [{}]) => {
  const orgs = await queryInterface.bulkInsert(
    {
      tableName: 'organizations',
      schema: 'core',
    },
    data.map((d) => fakeOrganization(d)),
    { returning: true }
  );

  await queryInterface.bulkInsert(
    {
      tableName: 'organization_settings',
      schema: 'core',
    },
    orgs.map((o) => ({ organization_id: o.id }))
  );

  return orgs;
};

const fakeAccount = (extrasOrOverrides) => ({
  name: faker.company.name(),
  external_id: faker.string.uuid(),
  ...extrasOrOverrides,
});

const fakeUser = (extrasOrOverrides) => ({
  email: faker.internet.email(),
  full_name: faker.person.fullName(),
  ...extrasOrOverrides,
});

const fakeTemplate = (extrasOrOverrides) => {
  const title = faker.lorem.sentence(5);
  return {
    name: title,
    display_title: title,
    type: 'user',
    state: 'live',
    is_auto_launch_enabled: true,
    ...extrasOrOverrides,
  };
};

const fakeModule = (extrasOrOverrides) => ({
  name: faker.lorem.sentence(3),
  ...extrasOrOverrides,
});

const fakeStep = (extrasOrOverrides) => ({
  name: faker.lorem.sentence(3),
  ...extrasOrOverrides,
});

const fakeStepAutoCompleteInteraction = (extrasOrOverrides) => {
  const url = faker.internet.url();
  const text = faker.lorem.sentence();
  return {
    url,
    wildcard_url: url,
    type: 'click',
    element_selector: `#${faker.lorem.slug()} .${faker.hacker.adjective}`,
    element_text: text,
    element_html: `<div>${text}</div>`,
    ...extrasOrOverrides,
  };
};

const createUsers = async (queryInterface, Sequelize, data = [{}]) => {
  const users = await queryInterface.bulkInsert(
    {
      tableName: 'users',
      schema: 'core',
    },
    data.map((d) => fakeUser(d)),
    { returning: true }
  );

  await queryInterface.bulkInsert(
    {
      tableName: 'user_auths',
      schema: 'core',
    },
    users.map((u) => ({
      type: 'email',
      user_id: u.id,
      key: Sequelize.literal("crypt('supersecret', gen_salt('bf'))"),
    }))
  );

  await queryInterface.bulkInsert(
    {
      tableName: 'users_organizations',
      schema: 'core',
    },
    users.map((u) => ({
      user_id: u.id,
      organization_id: u.organization_id,
      is_default: true,
    }))
  );

  return users;
};

const createAccounts = async (queryInterface, data = [{}]) => {
  const accounts = await queryInterface.bulkInsert(
    {
      tableName: 'accounts',
      schema: 'core',
    },
    data.map((d) => fakeAccount(d)),
    { returning: true }
  );

  return accounts;
};

const addUsersToAdditionalOrganizations = async (queryInterface, data = []) => {
  await queryInterface.bulkInsert(
    {
      tableName: 'users_organizations',
      schema: 'core',
    },
    data.map((d) => ({
      user_id: d.user_id,
      organization_id: d.organization_id,
    }))
  );
};

const createTemplates = async (queryInterface, data = [{}]) => {
  const templates = await queryInterface.bulkInsert(
    {
      tableName: 'templates',
      schema: 'core',
    },
    data.map((d) => fakeTemplate(d)),
    { returning: true }
  );

  await queryInterface.bulkInsert(
    {
      tableName: 'template_auto_launch_rules',
      schema: 'core',
    },
    templates.map((t) => ({
      template_id: t.id,
      organization_id: t.organization_id,
      rule_type: 'all',
    })),
    { returning: true }
  );

  await queryInterface.bulkInsert(
    {
      tableName: 'template_targets',
      schema: 'core',
    },
    templates.map((t) => ({
      target_type: 'all',
      template_id: t.id,
      organization_id: t.organization_id,
    })),
    { returning: true }
  );

  const modules = await queryInterface.bulkInsert(
    {
      tableName: 'modules',
      schema: 'core',
    },
    templates.map((t) =>
      fakeModule({
        organization_id: t.organization_id,
      })
    ),
    { returning: true }
  );

  await queryInterface.bulkInsert(
    {
      tableName: 'templates_modules',
      schema: 'core',
    },
    flatMap(templates, (t) =>
      modules.map((m, mIndex) => ({
        organization_id: t.organization_id,
        template_id: t.id,
        module_id: m.id,
        order_index: mIndex,
      }))
    )
  );

  const steps = await queryInterface.bulkInsert(
    {
      tableName: 'step_prototypes',
      schema: 'core',
    },
    templates.map((t) =>
      fakeStep({
        organization_id: t.organization_id,
      })
    ),
    { returning: true }
  );

  await queryInterface.bulkInsert(
    {
      tableName: 'modules_step_prototypes',
      schema: 'core',
    },
    flatMap(modules, (m) =>
      steps.map((s, sIndex) => ({
        organization_id: m.organization_id,
        module_id: m.id,
        step_prototype_id: s.id,
        order_index: sIndex,
      }))
    )
  );

  await queryInterface.bulkInsert(
    {
      tableName: 'step_prototype_auto_complete_interactions',
      schema: 'core',
    },
    steps.map((s) =>
      fakeStepAutoCompleteInteraction({
        organization_id: s.organization_id,
        step_prototype_id: s.id,
      })
    )
  );

  return templates;
};

module.exports = {
  async up(queryInterface, Sequelize) {
    if (!IS_E2E) return;

    const [acmeOrg, mirrorOrg] = await createOrgs(queryInterface, [
      { entity_id: 'b20eda3b-bef1-4504-8b92-6c4b35cb42a4', name: 'ACME' },
      { entity_id: '71764ae5-e997-4c44-b902-b12db6abd361', name: 'Mirror' },
    ]);

    const [acmeUser] = await createUsers(queryInterface, Sequelize, [
      {
        organization_id: acmeOrg.id,
        email: 'admin@acme.org',
        full_name: 'Test Admin',
      },
      {
        organization_id: mirrorOrg.id,
        email: 'admin@mirror.it',
        full_name: 'Mirror Admin',
      },
    ]);

    await createAccounts(queryInterface, [
      {
        name: 'Blue Weave',
        organization_id: acmeOrg.id,
      },
      {
        name: 'DayPay',
        organization_id: acmeOrg.id,
      },
    ]);

    await addUsersToAdditionalOrganizations(queryInterface, [
      {
        user_id: acmeUser.id,
        organization_id: mirrorOrg.id,
      },
    ]);

    await createTemplates(queryInterface, [
      {
        entity_id: 'bec157c0-6021-4814-8c9f-bf21903a844c',
        organization_id: acmeOrg.id,
      },
    ]);
  },

  async down(queryInterface, _Sequelize) {
    if (!IS_E2E) return;

    // simply delete all orgs
    await queryInterface.bulkDelete({
      tableName: 'organizations',
      schema: 'core',
    });
  },
};
