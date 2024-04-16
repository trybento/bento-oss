import { faker } from '@faker-js/faker';
import { AttributeType, TargetValueType } from 'bento-common/types';

import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import {
  arrayOfRandomLength,
  getDummyString,
} from 'src/testUtils/dummyDataHelpers';
import { CustomAttribute } from 'src/data/models/CustomAttribute.model';
import { CustomAttributeValue } from 'src/data/models/CustomAttributeValue.model';
import persistCustomAttributes, {
  formDedupeKey,
} from './persistCustomAttributes';
import { randomInt } from 'src/utils/helpers';

const getContext = setupAndSeedDatabaseForTests('bento');

describe('persistCustomAttributes', () => {
  test('write an attribute', async () => {
    const { organization } = getContext();
    const attrName = getDummyString();

    await persistCustomAttributes({
      attributesToInsert: [
        {
          name: attrName,
          valueType: TargetValueType.text,
          type: AttributeType.account,
          organizationId: organization.id,
        },
      ],
      attributeValuesByName: {},
      organizationId: organization.id,
    });

    const found = await CustomAttribute.findAll({
      where: { name: attrName, organizationId: organization.id },
    });

    expect(found?.[0]).toBeTruthy();
  });

  test('write attribute with values', async () => {
    const { organization } = getContext();
    const attrName = getDummyString();
    const attrValue = randomInt(0, 1000);

    await persistCustomAttributes({
      attributesToInsert: [
        {
          name: attrName,
          valueType: TargetValueType.number,
          type: AttributeType.account,
          organizationId: organization.id,
        },
      ],
      attributeValuesByName: {
        [attrName]: new Set<number>().add(attrValue),
      },
      organizationId: organization.id,
    });

    const found = await CustomAttribute.findAll({
      where: { name: attrName, organizationId: organization.id },
    });

    expect(found?.[0]).toBeTruthy();

    const foundValue = await CustomAttributeValue.findOne({
      where: { customAttributeId: found[0].id, numberValue: attrValue },
    });

    expect(foundValue).toBeTruthy();
  });

  test('insert multiple values for one attribute', async () => {
    const { organization } = getContext();
    const attrName = getDummyString();
    const attrValues = [0, 1, 2].map(() => randomInt(1, 1000));

    await persistCustomAttributes({
      attributesToInsert: [
        {
          name: attrName,
          valueType: TargetValueType.number,
          type: AttributeType.account,
          organizationId: organization.id,
        },
      ],
      attributeValuesByName: {
        [attrName]: new Set<number>(attrValues),
      },
      organizationId: organization.id,
    });

    const found = await CustomAttribute.findAll({
      where: { name: attrName, organizationId: organization.id },
    });

    expect(found?.[0]).toBeTruthy();

    const foundValues = await CustomAttributeValue.findAll({
      where: {
        customAttributeId: found[0].id,
      },
    });

    const insertedValues = foundValues.map((v) => v.numberValue!);

    attrValues.forEach((value) => {
      expect(insertedValues.find((v) => v === value)).toBeTruthy();
    });
  });

  test('will not insert more values than allowed', async () => {
    const { organization } = getContext();
    const attrName = getDummyString();
    const attrValues = arrayOfRandomLength(10, 20).map(() =>
      randomInt(1, 10000)
    );

    await persistCustomAttributes({
      attributesToInsert: [
        {
          name: attrName,
          valueType: TargetValueType.number,
          type: AttributeType.account,
          organizationId: organization.id,
        },
      ],
      attributeValuesByName: {
        [attrName]: new Set<number>(attrValues),
      },
      organizationId: organization.id,
    });

    const found = await CustomAttribute.findAll({
      where: { name: attrName, organizationId: organization.id },
    });

    expect(found?.[0]).toBeTruthy();

    const foundValues = await CustomAttributeValue.count({
      where: {
        customAttributeId: found[0].id,
      },
    });

    expect(foundValues).toBeLessThan(attrValues.length);
    expect(foundValues).toBeLessThan(10);
  });

  test('insert all values for an array attribute', async () => {
    const { organization } = getContext();
    const attrName = getDummyString();
    const attrValues = new Array(3).fill('').map(() => faker.string.alpha(10));

    await persistCustomAttributes({
      attributesToInsert: [
        {
          name: attrName,
          valueType: TargetValueType.stringArray,
          type: AttributeType.account,
          organizationId: organization.id,
        },
      ],
      attributeValuesByName: {
        [attrName]: new Set<string>(attrValues),
      },
      organizationId: organization.id,
    });

    const found = await CustomAttribute.findAll({
      where: { name: attrName, organizationId: organization.id },
    });

    expect(found?.[0]).toBeTruthy();

    const foundValues = await CustomAttributeValue.findAll({
      where: {
        customAttributeId: found[0].id,
      },
    });

    const insertedValues = foundValues.map((v) => v.textValue!);

    attrValues.forEach((value) => {
      expect(insertedValues.find((v) => v === value)).toBeTruthy();
    });
  });

  test('will not insert an object attr', async () => {
    const { organization } = getContext();
    const attrName = getDummyString();
    const attrValues = [{ key: 'val' }];

    await persistCustomAttributes({
      attributesToInsert: [
        {
          name: attrName,
          valueType: TargetValueType.text,
          type: AttributeType.account,
          organizationId: organization.id,
        },
      ],
      attributeValuesByName: {
        [attrName]: attrValues as any,
      },
      organizationId: organization.id,
    });

    const found = await CustomAttribute.findAll({
      where: { name: attrName, organizationId: organization.id },
    });

    expect(found?.[0]).toBeTruthy();

    const foundValues = await CustomAttributeValue.count({
      where: {
        customAttributeId: found[0].id,
      },
    });

    expect(foundValues).toEqual(0);
  });

  test('should dedupe same values across invocations', async () => {
    const { organization } = getContext();
    const attrName = getDummyString();
    const attrValues = arrayOfRandomLength(10, 20).map(() => 'true');

    await Promise.all(
      [1, 2, 3, 4].map((_) =>
        persistCustomAttributes({
          attributesToInsert: [
            {
              name: attrName,
              valueType: TargetValueType.text,
              type: AttributeType.account,
              organizationId: organization.id,
            },
          ],
          attributeValuesByName: {
            [attrName]: new Set<string>(attrValues),
          },
          organizationId: organization.id,
        })
      )
    );

    const found = await CustomAttribute.findAll({
      where: { name: attrName, organizationId: organization.id },
    });

    expect(found?.[0]).toBeTruthy();

    const foundValues = await CustomAttributeValue.count({
      where: {
        customAttributeId: found[0].id,
      },
    });

    expect(foundValues).toEqual(1);
  });
});

const testDate = new Date();
const randomObj = { qaEngineerName: 'John Barros' };

describe('dedupe key helper', () => {
  test.each([
    /* cspell: disable-next-line */
    ['buon giorno', 'buon giorno'],
    [null, 'null'],
    [undefined, 'undefined'],
    ['true', 'true'],
    [true, 'true'],
    [5000, '5000'],
    [-5000, '-5000'],
    [testDate, testDate.toISOString()],
    [{}, JSON.stringify({})],
    [randomObj, JSON.stringify(randomObj)],
  ])('creates key for %s', (val: any, expected) => {
    const createdKey = formDedupeKey(val);

    expect(createdKey).toEqual(expected);
  });
});
