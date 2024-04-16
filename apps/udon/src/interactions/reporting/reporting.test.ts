import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import {
  arrayOfRandomLength,
  createDummyAccounts,
  createDummyAccountUsersForAccounts,
  getDummyOrganization,
  getDummyString,
  getDummyUuid,
} from 'src/testUtils/dummyDataHelpers';
import { randomFromArray, randomInt } from 'src/utils/helpers';
import { AutoLaunchableRow, rowsToCsvData } from './generateAutolaunchAudit';
import { getStepProgressRows } from './generateStepProgress';
import {
  autoLaunchTemplateForAccounts,
  configureAutolaunchForTemplateTest,
} from '../targeting/testHelpers';
import {
  RuleTypeEnum,
  TargetValueType,
  TargetingType,
  GuideTypeEnum,
  TemplateState,
} from 'bento-common/types';
import { Organization } from 'src/data/models/Organization.model';
import { Template } from 'src/data/models/Template.model';
import { Step } from 'src/data/models/Step.model';

const getContext = setupAndSeedDatabaseForTests('bento');

const udonUrl = 'localhost';

const getRandomAutolaunchableRow = (id: number): AutoLaunchableRow => ({
  id,
  state: TemplateState.draft,
  templateEntityId: getDummyUuid(),
  isAutoLaunchEnabled: randomFromArray([true, false]),
  templateName: getDummyString(),
  ruleType: TargetingType.attributeRules,
  rules: [
    {
      valueType: TargetValueType.number,
      attribute: randomFromArray([
        'Bitcoins',
        'NumOfDogs',
        'VodkasDrank',
        'BugsWritten',
        'SurfboardsEatenBySharks',
        'ElectricCellosSold',
      ]),
      value: randomInt(0, 20),
      ruleType: randomFromArray([
        RuleTypeEnum.equals,
        RuleTypeEnum.gt,
        RuleTypeEnum.lt,
      ]),
    },
  ],
});

const baseReportCols = 5;

describe('Autolaunch audit report builder', () => {
  test('returns nothing if no rows', () => {
    const rows: AutoLaunchableRow[] = [];
    const result = rowsToCsvData({ rows, udonUrl });

    expect(result.length).toBe(0);
  });

  test('generates bare minimum report', () => {
    const templateName = getDummyString();
    const rows: AutoLaunchableRow[] = [
      {
        id: 1,
        state: TemplateState.draft,
        templateEntityId: 'asdf',
        isAutoLaunchEnabled: true,
        templateName,
        ruleType: TargetingType.all,
        rules: [],
      },
    ];

    const result = rowsToCsvData({ rows, udonUrl });

    expect(result[0].length).toBeGreaterThanOrEqual(baseReportCols);
    expect(result.length).toBe(2);

    expect(result[1][0]).toBe(templateName);
  });

  test('generates with appropriate attribute rows', () => {
    const rows = arrayOfRandomLength(2, 5).map((id) =>
      getRandomAutolaunchableRow(id)
    );
    const result = rowsToCsvData({ rows, udonUrl });

    const uniqueAttributes = Object.keys(
      rows.reduce((acc, row) => {
        row.rules.forEach((r) => (acc[r.attribute] = 1));
        return acc;
      }, {})
    );

    expect(result[0].length).toBe(baseReportCols + uniqueAttributes.length);

    uniqueAttributes.forEach((attr) => {
      expect(result[0].includes(attr)).toBeTruthy();
    });
  });

  test('generates with appropriate template columns', () => {
    const rows = arrayOfRandomLength(2, 5).map((id) =>
      getRandomAutolaunchableRow(id)
    );
    const result = rowsToCsvData({ rows, udonUrl });

    const firstCol = result.map((r) => r[0]);
    rows
      .map((r) => r.templateName)
      .forEach((name) => {
        expect(firstCol.indexOf(name)).toBeGreaterThan(0);
      });
  });

  test('generates proper values', () => {
    const rows = arrayOfRandomLength(5, 6).map((id) =>
      getRandomAutolaunchableRow(id)
    );
    const result = rowsToCsvData({ rows, udonUrl });

    arrayOfRandomLength(1, 4).forEach((_) => {
      const randomSelected = randomFromArray(rows);
      const firstCol = result.map((r) => r[0]);
      const indexOfChosenTemplate = firstCol.indexOf(
        randomSelected.templateName
      );

      const firstRule = randomSelected.rules[0];
      const indexOfChosenAttr = result[0].indexOf(firstRule.attribute);

      const correspondingCell =
        result[indexOfChosenTemplate][indexOfChosenAttr];

      expect(
        String(correspondingCell).indexOf(firstRule.value as string)
      ).toBeGreaterThan(-1);

      if (firstRule.ruleType === RuleTypeEnum.lt) {
        expect(String(correspondingCell).indexOf('<')).toBeGreaterThan(-1);
      } else if (firstRule.ruleType === RuleTypeEnum.gt) {
        expect(String(correspondingCell).indexOf('>')).toBeGreaterThan(-1);
      }
    });
  });
});

describe('Step progress report builder', () => {
  test('returns nothing if no steps', async () => {
    const emptyOrg = await Organization.create(getDummyOrganization());

    const data = await getStepProgressRows({ organizationId: emptyOrg.id });

    expect(data.length).toEqual(0);
  });

  // TODO: Fix - get rows keeps returning 0
  test.skip('returns data', async () => {
    const { organization } = getContext();

    const accounts = await createDummyAccounts(organization, 3);
    await createDummyAccountUsersForAccounts(organization, accounts);

    const template = (await Template.findOne({
      where: { organizationId: organization.id },
    }))!;

    await configureAutolaunchForTemplateTest({ template });
    await autoLaunchTemplateForAccounts(template, accounts);

    const steps = await Step.findAll({
      where: { organizationId: organization.id },
    });

    expect(steps.length).toBeGreaterThan(0);

    const report = await getStepProgressRows({
      organizationId: organization.id,
    });

    expect(report.length).toBeGreaterThan(0);
    expect(report[0].length).toBeGreaterThan(0);
  });

  // TODO: Fix - get rows keeps returning 0
  test.skip('data has expected items', async () => {
    const { organization } = getContext();

    const accounts = await createDummyAccounts(organization, 3);
    await createDummyAccountUsersForAccounts(organization, accounts);

    const template = (await Template.findOne({
      where: { organizationId: organization.id },
    }))!;

    await configureAutolaunchForTemplateTest({ template });
    await autoLaunchTemplateForAccounts(template, accounts);

    const report = await getStepProgressRows({
      organizationId: organization.id,
    });

    const accountNames = report.map((row) => row[0]);
    accounts.forEach((account) => {
      expect(accountNames.indexOf(account.name!)).toBeGreaterThanOrEqual(0);
    });

    const guideName = report[0][2];
    expect(guideName).toEqual(template.name);
  });
});
