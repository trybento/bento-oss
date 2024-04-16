'use strict';

const { createFeatureFlag } = require('../../../utils/features/db');

const featureFlags = [
  {
    name: 'enable custom CSS',
    sendToAdmin: true,
    sendToEmbeddable: true,
    enabledForNewOrgs: false,
  },
  {
    name: 'enable step progress sync',
    sendToAdmin: false,
    sendToEmbeddable: true,
    enabledForNewOrgs: false,
  },
  {
    name: 'enable branching selection targeting',
    sendToAdmin: false,
    sendToEmbeddable: true,
    enabledForNewOrgs: false,
  },
  {
    name: 'debug blank guides',
    sendToAdmin: false,
    sendToEmbeddable: true,
    enabledForNewOrgs: false,
  },
  {
    name: 'targeting gpt',
    sendToAdmin: false,
    sendToEmbeddable: false,
    enabledForNewOrgs: true,
  },
  {
    name: 'internal guide names',
    sendToAdmin: true,
    sendToEmbeddable: false,
    enabledForNewOrgs: false,
  },
  {
    name: 'auto inject inline',
    sendToAdmin: true,
    sendToEmbeddable: false,
    enabledForNewOrgs: true,
  },
  {
    name: 'easter eggs',
    sendToAdmin: true,
    sendToEmbeddable: false,
    enabledForNewOrgs: false,
  },
  {
    name: 'analytics maintenance page',
    sendToAdmin: true,
    sendToEmbeddable: false,
    enabledForNewOrgs: false,
  },
  {
    name: 'dynamic modules',
    sendToAdmin: true,
    sendToEmbeddable: false,
    enabledForNewOrgs: false,
  },
  {
    name: 'enable internal guide events',
    sendToAdmin: false,
    sendToEmbeddable: false,
    enabledForNewOrgs: false,
  },
  {
    name: 'observe styling attributes',
    sendToAdmin: false,
    sendToEmbeddable: true,
    enabledForNewOrgs: false,
  },
  {
    name: 'enable webhooks',
    sendToAdmin: true,
    sendToEmbeddable: true,
    enabledForNewOrgs: false,
  },
  {
    name: 'advanced inline contextual customizations',
    sendToAdmin: true,
    sendToEmbeddable: false,
    enabledForNewOrgs: false,
  },
  {
    name: 'enable autolaunch csv',
    sendToAdmin: true,
    sendToEmbeddable: false,
    enabledForNewOrgs: false,
  },
  {
    name: 'forced available guides hydration',
    sendToAdmin: false,
    sendToEmbeddable: true,
    enabledForNewOrgs: false,
  },
  {
    name: 'advanced sidebar settings',
    sendToAdmin: true,
    sendToEmbeddable: true,
    enabledForNewOrgs: false,
  },
  {
    name: 'enable amplitude',
    sendToAdmin: true,
    sendToEmbeddable: false,
    enabledForNewOrgs: false,
  },
  {
    name: 'override diagnostics',
    sendToAdmin: true,
    sendToEmbeddable: false,
    enabledForNewOrgs: false,
  },
  {
    name: 'guide scheduling throttling',
    sendToAdmin: true,
    sendToEmbeddable: false,
    enabledForNewOrgs: false,
  },
  {
    name: 'enable fullstory',
    sendToAdmin: true,
    sendToEmbeddable: false,
    enabledForNewOrgs: true,
  },
  {
    name: 'enable split testing',
    sendToAdmin: true,
    sendToEmbeddable: false,
    enabledForNewOrgs: false,
  },
  {
    name: 'force google sso',
    sendToAdmin: true,
    sendToEmbeddable: false,
    enabledForNewOrgs: false,
  },
  {
    name: 'enable zendesk',
    sendToAdmin: true,
    sendToEmbeddable: false,
    enabledForNewOrgs: false,
  },
  {
    name: 'defer propagation',
    sendToAdmin: false,
    sendToEmbeddable: false,
    enabledForNewOrgs: false,
  },
  {
    name: 'enable guide viewed emails',
    sendToAdmin: false,
    sendToEmbeddable: false,
    enabledForNewOrgs: false,
  },
  {
    name: 'enable tooltip inside window',
    sendToAdmin: false,
    sendToEmbeddable: true,
    enabledForNewOrgs: false,
  },
  {
    name: 'enable salesforce integration',
    sendToAdmin: false,
    sendToEmbeddable: true,
    enabledForNewOrgs: false,
  },
  {
    name: 'hide chart of new guides launched',
    sendToAdmin: true,
    sendToEmbeddable: false,
    enabledForNewOrgs: false,
  },
  {
    name: 'serial cyoa',
    sendToAdmin: false,
    sendToEmbeddable: false,
    enabledForNewOrgs: false,
  },
  {
    name: 'enable useDisableWindowScroll hook',
    sendToAdmin: false,
    sendToEmbeddable: true,
    enabledForNewOrgs: false,
  },
  {
    name: 'gated guide-n-step propagation',
    sendToAdmin: true,
    sendToEmbeddable: false,
    enabledForNewOrgs: false,
  },
  {
    name: 'nps',
    sendToAdmin: true,
    sendToEmbeddable: true,
    enabledForNewOrgs: false,
  },
  {
    name: 'end user nudges',
    sendToAdmin: true,
    sendToEmbeddable: true,
    enabledForNewOrgs: false,
  },
];

const createDefaultOrganization = async (queryInterface) => {
  if (!process.env.INITIAL_ORGANIZATION_UUID) {
    throw new Error("Missing 'process.env.INITIAL_ORGANIZATION_UUID");
  }

  if (!process.env.INITIAL_ORGANIZATION_NAME) {
    throw new Error("Missing 'process.env.INITIAL_ORGANIZATION_NAME");
  }

  if (!process.env.INITIAL_ORGANIZATION_DOMAIN) {
    throw new Error("Missing 'process.env.INITIAL_ORGANIZATION_DOMAIN");
  }

  const [organization] = await queryInterface.bulkInsert(
    {
      tableName: 'organizations',
      schema: 'core',
    },
    [
      {
        entity_id: process.env.INITIAL_ORGANIZATION_UUID,
        name: process.env.INITIAL_ORGANIZATION_NAME,
        slug: process.env.INITIAL_ORGANIZATION_NAME.toLocaleLowerCase()
          .replace(/\s/g, '-')
          .replace(/[^\w]/gi, ''),
        domain: process.env.INITIAL_ORGANIZATION_DOMAIN,
      },
    ],
    { returning: true }
  );

  await queryInterface.bulkInsert(
    {
      tableName: 'organization_settings',
      schema: 'core',
    },
    [
      {
        organization_id: organization.id,
      },
    ]
  );

  return organization.id;
};

const createDefaultUser = async (queryInterface, organizationId, Sequelize) => {
  if (!process.env.INITIAL_USER_EMAIL) {
    throw new Error("Missing 'process.env.INITIAL_USER_EMAIL");
  }

  if (!process.env.INITIAL_USER_PASSWORD) {
    throw new Error("Missing 'process.env.INITIAL_USER_PASSWORD");
  }

  const [user] = await queryInterface.bulkInsert(
    {
      tableName: 'users',
      schema: 'core',
    },
    [
      {
        email: process.env.INITIAL_USER_EMAIL,
        is_superadmin: true,
        organization_id: organizationId,
      },
    ],
    { returning: true }
  );

  await queryInterface.bulkInsert(
    {
      tableName: 'user_auths',
      schema: 'core',
    },
    [
      {
        type: 'email',
        user_id: user.id,
        key: Sequelize.literal(
          `crypt('${process.env.INITIAL_USER_PASSWORD}', gen_salt('bf'))`
        ),
      },
    ]
  );

  await queryInterface.bulkInsert(
    {
      tableName: 'users_organizations',
      schema: 'core',
    },
    [
      {
        user_id: user.id,
        organization_id: organizationId,
        is_default: true,
      },
    ]
  );
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    for (const featureFlag of featureFlags) {
      await createFeatureFlag(featureFlag, queryInterface);
    }

    const organizationId = await createDefaultOrganization(queryInterface);

    await createDefaultUser(queryInterface, organizationId, Sequelize);
  },

  async down() {
    // Noop
  },
};
