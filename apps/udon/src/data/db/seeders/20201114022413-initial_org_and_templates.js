'use strict';

const { keyBy } = require('lodash');
const { v4: uuidv4 } = require('uuid');

const SHOULD_RUN = !(
  process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'e2e'
);

const SCRIPT_NAMESPACE = `[SEED COMPANY TEMPLATES]`;

if (process.argv.length < 4 && SHOULD_RUN) {
  console.error('Seed argument not provided');
  process.exit(1);
}

let seedCompany;
if (SHOULD_RUN) {
  seedCompany = process.argv[process.argv.length - 1] || 'bento';
  console.log(
    `${SCRIPT_NAMESPACE} SEEDING TEMPLATES BASED ON COMPANY:`,
    seedCompany
  );
}

function upFactory(companyName = seedCompany, makeUnique = false) {
  const {
    MODULES,
    ORGANIZATION,
    TEMPLATES,
  } = require(`./fixtures/${companyName}Templates`);

  return async (queryInterface, Sequelize) => {
    const orgData = {
      name: ORGANIZATION.name,
      slug: makeUnique ? uuidv4() : ORGANIZATION.slug,
      domain: ORGANIZATION.domain,
    };

    if (!makeUnique && ORGANIZATION.entityId) {
      orgData.entity_id = ORGANIZATION.entityId;
    }

    const [organization] = await queryInterface.bulkInsert(
      {
        tableName: 'organizations',
        schema: 'core',
      },
      [orgData],
      {
        returning: true,
      }
    );

    const createdModules = [];

    for (const moduleFixture of MODULES) {
      // Insert module
      const [module] = await queryInterface.bulkInsert(
        {
          tableName: 'modules',
          schema: 'core',
        },
        [
          {
            name: moduleFixture.name,
            display_title: moduleFixture.name,
            organization_id: organization.id,
          },
        ],
        {
          returning: true,
        }
      );

      // Insert step_prototypes
      const stepFixtures = moduleFixture.steps;
      if (!stepFixtures.length) return;

      for (let stepIdx = 0; stepIdx < stepFixtures.length; stepIdx++) {
        const stepFixture = stepFixtures[stepIdx];

        const [stepPrototype] = await queryInterface.bulkInsert(
          {
            tableName: 'step_prototypes',
            schema: 'core',
          },
          [
            {
              name: stepFixture.name,
              body: stepFixture.body,
              input_type: stepFixture.inputType,
              organization_id: organization.id,
            },
          ],
          {
            returning: true,
          }
        );

        await queryInterface.bulkInsert(
          {
            tableName: 'modules_step_prototypes',
            schema: 'core',
          },
          [
            {
              order_index: stepIdx,
              module_id: module.id,
              step_prototype_id: stepPrototype.id,
              organization_id: organization.id,
            },
          ],
          {
            returning: true,
          }
        );
      }

      createdModules.push(module);
    }

    const createdModulesByName = keyBy(createdModules, 'name');

    for (const templateFixture of TEMPLATES) {
      const [template] = await queryInterface.bulkInsert(
        {
          tableName: 'templates',
          schema: 'core',
        },
        [
          {
            name: templateFixture.name,
            description: templateFixture.description,
            organization_id: organization.id,
            state: 'draft',
          },
        ],
        {
          returning: true,
        }
      );

      for (
        let moduleIdx = 0;
        moduleIdx < templateFixture.modules.length;
        moduleIdx++
      ) {
        const moduleName = templateFixture.modules[moduleIdx];
        const module = createdModulesByName[moduleName];
        if (!module) throw new Error('Module not found');

        // Insert templates_modules
        await queryInterface.bulkInsert(
          {
            tableName: 'templates_modules',
            schema: 'core',
          },
          [
            {
              template_id: template.id,
              module_id: module.id,
              organization_id: organization.id,
              order_index: moduleIdx,
            },
          ]
        );
      }
    }

    return organization;
  };
}

function downFactory(companyName = seedCompany, slug) {
  return async (queryInterface, _Sequelize) => {
    const where = slug ? { slug } : { name: companyName };
    await queryInterface.bulkDelete(
      {
        tableName: 'organizations',
        schema: 'core',
      },
      where
    );
  };
}

const emptyFn = async () => {};

module.exports = {
  up: !SHOULD_RUN ? emptyFn : upFactory(),
  upFactory,

  down: !SHOULD_RUN ? emptyFn : downFactory(),
  downFactory,
};
