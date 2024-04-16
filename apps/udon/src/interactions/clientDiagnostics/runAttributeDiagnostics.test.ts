import {
  DiagnosticModules,
  DiagnosticStates,
  TargetValueType,
  AttributeType,
} from 'bento-common/types';
import { faker } from '@faker-js/faker';

import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import { OrganizationData } from 'src/data/models/Analytics/OrganizationData.model';
import { Organization } from 'src/data/models/Organization.model';
import runAttributeDiagnostics, {
  AccountAttrs,
  AccountUserAttrs,
} from './runAttributeDiagnostics';
import { CustomAttribute } from 'src/data/models/CustomAttribute.model';

const getContext = setupAndSeedDatabaseForTests('paydayio');

const testValues = {
  [TargetValueType.text]: 'string',
  [TargetValueType.number]: 3,
  [TargetValueType.stringArray]: ['one', 'two'],
  [TargetValueType.boolean]: true,
};

let org: Organization;
let accountAttrs: AccountAttrs;
let accountUserAttrs: AccountUserAttrs;

async function checkHealth(diagnostics: Record<string, DiagnosticStates>) {
  const orgData = await OrganizationData.findOne({
    where: { organizationId: org.id },
    raw: true,
  });
  for (const [diagnostic, health] of Object.entries(diagnostics)) {
    expect(orgData?.diagnostics[diagnostic].state).toBe(health);
    // Doesn't need to be specific just as long as the updated time is in the
    // very recent past
    expect(
      new Date(orgData?.diagnostics[diagnostic].updatedAt).getTime()
    ).toBeGreaterThan(Date.now() - 100);
  }
}

beforeEach(() => {
  ({ organization: org } = getContext());
  accountAttrs = {
    id: faker.string.alphanumeric(),
    name: faker.company.name(),
    createdAt: faker.date.past().toISOString(),
  };
  accountUserAttrs = {
    id: faker.string.alphanumeric(),
    fullName: faker.person.fullName(),
    email: faker.internet.email(),
    createdAt: faker.date.past().toISOString(),
  };
});

test('all correct attributes', async () => {
  await runAttributeDiagnostics(org.id, accountAttrs, accountUserAttrs);
  await checkHealth({
    [DiagnosticModules.nonIsoDates]: DiagnosticStates.healthy,
    [DiagnosticModules.inconsistentTypes]: DiagnosticStates.healthy,
  });
});

describe.each([
  ['account', () => accountAttrs, AttributeType.account],
  ['account user', () => accountUserAttrs, AttributeType.accountUser],
])('%s', (_, getAttrs, attributeType) => {
  let attrs: AccountAttrs | AccountUserAttrs;
  beforeEach(() => {
    attrs = getAttrs();
  });

  test('non-ISO createdAt', async () => {
    attrs.createdAt = '2/2/23';
    await runAttributeDiagnostics(org.id, accountAttrs, accountUserAttrs);
    await checkHealth({
      [DiagnosticModules.nonIsoDates]: DiagnosticStates.warning,
      [DiagnosticModules.inconsistentTypes]: DiagnosticStates.healthy,
    });
  });

  describe('custom date attr', () => {
    beforeEach(async () => {
      await CustomAttribute.create({
        organizationId: org.id,
        name: 'date',
        valueType: TargetValueType.date,
        type: attributeType,
      });
    });
    test('missing', async () => {
      await runAttributeDiagnostics(org.id, accountAttrs, accountUserAttrs);
      await checkHealth({
        [DiagnosticModules.nonIsoDates]: DiagnosticStates.healthy,
        [DiagnosticModules.inconsistentTypes]: DiagnosticStates.healthy,
      });
    });
    test('ISO', async () => {
      attrs.date = faker.date.past().toISOString();
      await runAttributeDiagnostics(org.id, accountAttrs, accountUserAttrs);
      await checkHealth({
        [DiagnosticModules.nonIsoDates]: DiagnosticStates.healthy,
        [DiagnosticModules.inconsistentTypes]: DiagnosticStates.healthy,
      });
    });
    test('non-ISO', async () => {
      attrs.date = '2/2/23';
      await runAttributeDiagnostics(org.id, accountAttrs, accountUserAttrs);
      await checkHealth({
        [DiagnosticModules.nonIsoDates]: DiagnosticStates.warning,
        // warns on inconsistent type as well because it's a custom attribute and
        // the date format isn't ISO
        [DiagnosticModules.inconsistentTypes]: DiagnosticStates.warning,
      });
    });
  });

  describe.each([
    TargetValueType.boolean,
    TargetValueType.number,
    TargetValueType.text,
    TargetValueType.stringArray,
  ])('custom account user attr (%s)', (valueType) => {
    beforeEach(async () => {
      await CustomAttribute.create({
        organizationId: org.id,
        name: 'attr',
        valueType,
        type: attributeType,
      });
    });
    test('missing', async () => {
      await runAttributeDiagnostics(org.id, accountAttrs, accountUserAttrs);
      await checkHealth({
        [DiagnosticModules.nonIsoDates]: DiagnosticStates.healthy,
        [DiagnosticModules.inconsistentTypes]: DiagnosticStates.healthy,
      });
    });
    test('correct', async () => {
      attrs.attr = testValues[valueType];
      await runAttributeDiagnostics(org.id, accountAttrs, accountUserAttrs);
      await checkHealth({
        [DiagnosticModules.nonIsoDates]: DiagnosticStates.healthy,
        [DiagnosticModules.inconsistentTypes]: DiagnosticStates.healthy,
      });
    });
    test.each(Object.keys(testValues).filter((type) => type !== valueType))(
      'incorrect (%s)',
      async (incorrectValueType) => {
        attrs.attr = testValues[incorrectValueType];
        await runAttributeDiagnostics(org.id, accountAttrs, accountUserAttrs);
        await checkHealth({
          [DiagnosticModules.nonIsoDates]: DiagnosticStates.healthy,
          [DiagnosticModules.inconsistentTypes]: DiagnosticStates.warning,
        });
      }
    );
  });
});
