import { pick } from 'lodash';
import { AttributeType, DataSource, TargetValueType } from 'bento-common/types';
import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import { CustomAttribute } from 'src/data/models/CustomAttribute.model';
import { CustomAttributeValue } from 'src/data/models/CustomAttributeValue.model';

import recordAndSetCustomAttributes from './recordAndSetCustomAttributes';
import { writeAttributesToAccountOrAccountUser } from './recordEvents.helpers';

jest.mock('src/utils/internalFeatures/internalFeatures', () => ({
  ...jest.requireActual('src/utils/internalFeatures/internalFeatures'),
  enablePersistentAttributes: {
    enabled: jest.fn(() => false),
  },
}));

const getContext = setupAndSeedDatabaseForTests('bento');

describe('recordAndSetCustomAttributes', () => {
  test('record attributes as expected', async () => {
    const { account } = getContext();

    const attributes = {
      text: 'foo',
      number: 99,
      boolean: true,
      date: new Date().toISOString(),
      nullAttr: null,
    };

    await recordAndSetCustomAttributes({
      obj: account,
      attributes,
    });

    await account.reload();

    expect(account.attributes).toMatchObject(attributes);
  });

  test('undefined or complex objects are not recorded', async () => {
    const { account } = getContext();

    const attributes = {
      text: 'Lorem ipsum',
      date: new Date(),
      undefinedAttr: undefined,
      complexObject: {
        foo: 'bar',
      },
    };

    await recordAndSetCustomAttributes({
      obj: account,
      attributes,
    });

    await account.reload();

    expect(account.attributes).toMatchObject(pick(attributes, ['text']));
  });

  test('account attribute of type string is not recorded if too big', async () => {
    const { account } = getContext();

    const attributes = {
      text: 'Lorem ipsum',
      extra: new Array(1025 + 1).join('a'),
    };

    await recordAndSetCustomAttributes({
      obj: account,
      attributes,
    });

    await account.reload();

    expect(account.attributes).toMatchObject(
      pick(attributes, ['text', 'date'])
    );
  });

  test('accountUser attribute of type string is not recorded if too big', async () => {
    const { accountUser } = getContext();

    const attributes = {
      text: 'Lorem ipsum',
      extra: new Array(1025 + 1).join('a'),
    };

    await recordAndSetCustomAttributes({
      obj: accountUser,
      attributes,
    });

    await accountUser.reload();

    expect(accountUser.attributes).toMatchObject(
      pick(attributes, ['text', 'date'])
    );
  });

  test('correctly updates previous attributes', async () => {
    const { account } = getContext();

    await account.update({
      attributes: {
        text: 'foo',
        number: 99,
        boolean: true,
        date: new Date(1960, 1, 1).toISOString(),
        other: null,
      },
    });

    const attributes = {
      text: 'bar',
      number: 1000,
      boolean: false,
      date: new Date().toISOString(),
      other: 'not null anymore',
    };

    await recordAndSetCustomAttributes({
      obj: account,
      attributes,
    });

    await account.reload();

    expect(account.attributes).toMatchObject(attributes);
  });

  test('remove previous attributes if set to undefined', async () => {
    const { account } = getContext();

    const previousAttributes = {
      text: 'foo',
      number: 99,
      boolean: true,
      date: new Date(1960, 1, 1).toISOString(),
      other: null,
    };

    await account.update({ attributes: previousAttributes });

    await recordAndSetCustomAttributes({
      obj: account,
      attributes: {
        text: undefined,
        number: undefined,
        boolean: undefined,
        date: undefined,
        other: undefined,
      },
    });

    await account.reload();

    expect(account.attributes).not.toMatchObject(previousAttributes);
  });

  test('records default fields for Account', async () => {
    const { account } = getContext();
    const now = new Date().toISOString();
    await account.update({ createdInOrganizationAt: now });

    await recordAndSetCustomAttributes({
      obj: account,
      attributes: {},
    });

    await account.reload();

    expect(account.attributes).toEqual({
      name: account.name,
      createdAt: now,
    });
  });

  test('records default fields for AccountUser', async () => {
    const { accountUser } = getContext();

    await recordAndSetCustomAttributes({
      obj: accountUser,
      attributes: {},
    });

    await accountUser.reload();

    expect(accountUser.attributes).toEqual({
      email: accountUser.email,
      fullName: accountUser.fullName,
      createdAt: accountUser.createdInOrganizationAt,
    });
  });

  test('new custom attributes are recorded', async () => {
    const { accountUser } = getContext();
    await recordAndSetCustomAttributes(
      {
        obj: accountUser,
        attributes: {
          foo2: 'bar2',
        },
      },
      {
        detach: false,
      }
    );
    const customAttr = await CustomAttribute.findOne({
      where: {
        organizationId: accountUser.organizationId,
        name: 'foo2',
        valueType: 'text',
      },
    });
    const customAttrValue = await CustomAttributeValue.findOne({
      where: {
        organizationId: accountUser.organizationId,
        customAttributeId: customAttr!.id,
        textValue: 'bar2',
      },
    });

    expect(customAttr).not.toBeUndefined();
    expect(customAttrValue).not.toBeUndefined();
  });

  test('custom attribute records are not duplicated', async () => {
    const { accountUser } = getContext();

    const originalAttr = await CustomAttribute.create({
      organizationId: accountUser.organizationId,
      name: 'foo',
      valueType: TargetValueType.text,
      type: AttributeType.accountUser,
    });
    const originalAttrValue = await CustomAttributeValue.create({
      organizationId: accountUser.organizationId,
      customAttributeId: originalAttr?.id,
      textValue: 'foo',
      type: 'account_user',
    });

    await recordAndSetCustomAttributes(
      {
        obj: accountUser,
        attributes: {
          foo: 'bar',
        },
      },
      {
        detach: false,
      }
    );

    const customAttr = await CustomAttribute.findOne({
      where: {
        organizationId: accountUser.organizationId,
        name: 'foo',
        valueType: 'text',
      },
      order: [['createdAt', 'desc']],
    });
    const customAttrValue = await CustomAttributeValue.findOne({
      where: {
        organizationId: accountUser.organizationId,
        customAttributeId: customAttr?.id,
        textValue: 'foo',
      },
      order: [['createdAt', 'desc']],
    });

    expect(customAttr?.id).toEqual(originalAttr?.id);
    expect(customAttrValue?.id).toEqual(originalAttrValue?.id);
  });
});

describe('writeAttributesToAccountOrAccountUser', () => {
  beforeEach(async () => {
    const { accountUser } = getContext();

    /* Populate the core attrs */
    await writeAttributesToAccountOrAccountUser({
      obj: accountUser,
      attributes: accountUser.attributes,
    });
  });

  test('detect no changes', async () => {
    const { accountUser } = getContext();

    const newAttributes = accountUser.attributes;
    const changed = await writeAttributesToAccountOrAccountUser({
      obj: accountUser,
      attributes: newAttributes,
    });

    expect(changed).toBeFalsy();
  });

  test('detect added attribute changes', async () => {
    const { accountUser } = getContext();

    const newAttributes = {
      ...accountUser.attributes,
      currentLocationOfJoao: 'France',
    };

    const changed = await writeAttributesToAccountOrAccountUser({
      obj: accountUser,
      attributes: newAttributes,
    });

    expect(changed).toBeTruthy();
  });

  test('detect primitive changes', async () => {
    const { accountUser } = getContext();

    const startingAttributes = {
      ...accountUser.attributes,
      praetor: 'Ricky RZ',
      prsSubmitted: 500,
    };

    await accountUser.update({ attributes: startingAttributes });
    await accountUser.reload();

    const newAttributes = {
      ...startingAttributes,
      praetor: 'Dmitriy Cherchenko',
    };

    const changed = await writeAttributesToAccountOrAccountUser({
      obj: accountUser,
      attributes: newAttributes,
    });

    expect(changed).toBeTruthy();

    const newAttributesAgain = {
      ...newAttributes,
      prsSubmitted: 10,
    };

    const changedAgain = await writeAttributesToAccountOrAccountUser({
      obj: accountUser,
      attributes: newAttributesAgain,
    });

    expect(changedAgain).toBeTruthy();
  });

  test('detect date changes', async () => {
    const { accountUser } = getContext();

    const startingAttributes = {
      ...accountUser.attributes,
      born: new Date('1940-12-06'),
    };

    await accountUser.update({ attributes: startingAttributes });
    await accountUser.reload();

    const newAttributes = {
      ...startingAttributes,
      born: new Date('1970-08-07'),
    };

    const changed = await writeAttributesToAccountOrAccountUser({
      obj: accountUser,
      attributes: newAttributes,
    });

    expect(changed).toBeTruthy();
  });

  test('detect list changes', async () => {
    const { accountUser } = getContext();

    const startingAttributes = {
      ...accountUser.attributes,
      list: ['one', 'two'],
    };

    await accountUser.update({ attributes: startingAttributes });
    await accountUser.reload();

    const newAttributes = {
      ...startingAttributes,
      list: ['two', 'three'],
    };

    const changed = await writeAttributesToAccountOrAccountUser({
      obj: accountUser,
      attributes: newAttributes,
    });

    expect(changed).toBeTruthy();
  });

  test('preserves tags', async () => {
    const { accountUser } = getContext();
    const attrName = `tag-${Math.random()}`;

    await recordAndSetCustomAttributes(
      {
        obj: accountUser,
        attributes: {
          [attrName]: 'yes.',
        },
      },
      {
        detach: false,
      }
    );

    const customAttr = await CustomAttribute.findOne({
      where: {
        organizationId: accountUser.organizationId,
        name: attrName,
        valueType: 'text',
      },
    });

    expect(customAttr).toBeDefined();

    await customAttr!.update({ source: DataSource.import });

    await recordAndSetCustomAttributes(
      {
        obj: accountUser,
        attributes: {
          someOtherAttribute: 'more yes.',
        },
      },
      {
        detach: false,
      }
    );

    await accountUser.reload();

    expect(accountUser.attributes[attrName]).toBeDefined();
  });
});
