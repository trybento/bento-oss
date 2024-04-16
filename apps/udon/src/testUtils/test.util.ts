import { faker } from '@faker-js/faker';
import {
  applyFinalCleanupHook,
  setupAndSeedDatabaseForTests,
} from 'src/data/datatests';
import {
  createModuleForTest,
  createTemplateForTest,
  launchTemplateForTest,
  populateTemplateWithContent,
} from 'src/graphql/Template/testHelpers';
import { setupGraphQLTestServer } from 'src/graphql/testHelpers';
import { randomFromArray, randomInt } from 'src/utils/helpers';
import {
  arrayOfRandomLength,
  autoLaunchTemplateForAccounts,
  completeFirstStepOfGuide,
  completeGuide,
  configureAndLaunchToUser,
  configureAutolaunchForTemplateTest,
  createDummyAccounts,
  createDummyAccountUsers,
  createDummyAccountUsersForAccounts,
  createGuides,
  fakeModule,
  fakeStepAutoCompleteInteraction,
  fakeStepPrototype,
  fakeStepPrototypeTaggedElement,
  generateTemplates,
  getDefaultTemplate,
  getDummyAccount,
  getDummyAccountUser,
  getDummyOrganization,
  getDummySegmentUser,
  getDummySplitTestTemplate,
  getDummyUser,
  getGuide,
  launchDefaultTemplate,
  makeTemplateBranching,
  moduleToTemplateInputModule,
  createNewAudience,
} from './dummyDataHelpers';
import {
  createDummyNps,
  propagateTemplateChangesInPlace,
  getParticipantForUserAndTemplate,
  getDummyAccountUserNameRule,
} from './tests.helpers';

/**
 * Centralized toolkit for creating test suites.
 *
 * Generate faker data, actual dummy data in DB, or operate on guides.
 * Hopefully solves "do we have a helper for" and 1000 imports
 *
 * Import before other src files for datatests to operate properly
 */
const testUtils = {
  setup: {
    /** Seeds database for test data */
    setupAndSeed: setupAndSeedDatabaseForTests,
    /** For non-data tests to make sure all processes shut down */
    applyCleanup: applyFinalCleanupHook,
    /** Wraps setup and seed with GraphQL server mocks */
    setupGraphQL: setupGraphQLTestServer,
  },
  /**
   * Fakes data. Doesn't commit anything to database.
   */
  fake: {
    organization: getDummyOrganization,
    accountUser: getDummyAccountUser,
    account: getDummyAccount,
    user: getDummyUser,
    /** Returns formatted as an incoming segment event */
    segmentUser: getDummySegmentUser,
    stepAutoCompleteInteraction: fakeStepAutoCompleteInteraction,
    stepPrototype: fakeStepPrototype,
    taggedElement: fakeStepPrototypeTaggedElement,
    module: fakeModule,
    splitTestTemplate: getDummySplitTestTemplate,
    /** Random junk string useful for unique "names" */
    string: faker.string.alpha,
    phrase: faker.hacker.phrase,
    /** Shortcut to creating an account user matching segment */
    singleNameTargeting: getDummyAccountUserNameRule,
  },
  /**
   * Creates items in the database for usage.
   */
  users: {
    accounts: createDummyAccounts,
    accountUsers: createDummyAccountUsers,
    /** Creates dummy account users for a list of accounts */
    accountUsersForAccount: createDummyAccountUsersForAccounts,
  },
  /**
   * Guide actions to prep templates for testing
   * Creates raw objects. If you are in a gql context consider the gwl interface.
   *
   * - Launch methods only set content to launch, like normal
   * - Create methods simulate an identify happening and will create sub objects
   * */
  guides: {
    /** Launches the first template for the org */
    createGuideBaseForAccount: launchDefaultTemplate,
    /** Makes a template into a branching guide */
    makeTemplateBranching,
    /** Launch n surveys to a given user */
    launchNps: createDummyNps,
    /** Creates guide bases for accounts based on template's targeting */
    createGuideBasesForAccounts: autoLaunchTemplateForAccounts,
    /** Adjust a template's targeting and set launching to true */
    launchTemplate: configureAutolaunchForTemplateTest,
    /** Takes template entityId and creates all the way down to guide and participant */
    createGuideForUser: launchTemplateForTest,
    /** Adjust a template before launching to an account, and user if provided */
    createModifiedGuideForTarget: configureAndLaunchToUser,
    /** Generates n "new" templates by duplicating an existing */
    generateTemplates,
    /** Creates a new "saved audience", defaulting to all rules if not modified */
    createNewAudience,
  },
  modules: {
    /** Creates new module for test */
    createModule: createModuleForTest,
  },
  /** Convert data formats easily */
  transformers: {
    moduleToTemplateInputModule,
  },
  /** Fetch something */
  getters: {
    /** Gets a guide with guide base, template, module, steps */
    getGuide,
    /** Gets the seeded template for an org */
    getTemplate: getDefaultTemplate,
    /** Useful for confirming this user was added to a guide */
    getParticipantForUserAndTemplate,
  },
  /** Utils to simulate a user's activity on a guide/template */
  actions: {
    completeFirstStepOfGuide,
    completeGuide,
    propagateTemplateChangesInPlace,
  },
  /**
   * Gql helpers require an embed/admin gql context and server initiated
   *   instead of just a setup and seed.
   */
  gql: {
    createGuides,
    createTemplateForTest,
    createModuleForTest,
    populateTemplateWithContent,
  },
  /** Misc tools, rng and fillers */
  tools: {
    int: randomInt,
    fromArray: randomFromArray,
    arrayOfRandomLength,
  },
};

export default testUtils;
