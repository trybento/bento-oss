import { setupAndSeedDatabaseForTests } from 'src/data/datatests';

import csvStringToArray from 'bento-common/utils/csvStringToArray';
import { handleUploadedUserAttributes } from './handleUploadedUserAttributes';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { createDummyAccountUsers } from 'src/testUtils/dummyDataHelpers';
import { AttributeType } from 'bento-common/types';
import { CustomAttribute } from 'src/data/models/CustomAttribute.model';

const getContext = setupAndSeedDatabaseForTests('paydayio');

describe('csv uploads', () => {
  test('parses csv', () => {
    const csvString = `a,b
		1,2`;

    const result = csvStringToArray(csvString);

    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toEqual(1);
    expect(result[0].a).toEqual('1');
  });

  test('parses csv with windows return character', () => {
    const csvString = `a,b\r
		1,2`;

    const result = csvStringToArray(csvString);

    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toEqual(1);
    expect(result[0].a).toEqual('1');
    expect(result[0].b).toEqual('2');
  });

  test('can ignore empty row columns', () => {
    const csvString = `a,b\r
		1,2\n\n\n`;

    const result = csvStringToArray(csvString);
    expect(Array.isArray(result)).toBeTruthy();

    const foundIntendedEle = result.find((r) => !!r.a);

    expect(foundIntendedEle).toBeTruthy();
  });

  test('modifies attribute with externalId', async () => {
    const { organization, accountUser } = getContext();

    const attributeName = 'misoMaster';
    const csvString = `user_id,value\n${accountUser.externalId},karlos`;

    const currAttrs = Object.keys(accountUser.attributes || {});

    expect(currAttrs.indexOf(attributeName)).toEqual(-1);

    await handleUploadedUserAttributes({
      csvString,
      organization,
      attributeName,
      attributeType: AttributeType.accountUser,
    });

    await accountUser.reload();

    const newAttrs = Object.keys(accountUser.attributes || {});
    expect(newAttrs.indexOf(attributeName)).toBeGreaterThanOrEqual(0);
  });

  test('creates custom attribute', async () => {
    const { organization, accountUser } = getContext();

    const attributeName = 'misoMaster';
    const csvString = `user_id,value\n${accountUser.externalId},karlos`;

    const currAttrs = Object.keys(accountUser.attributes || {});

    expect(currAttrs.indexOf(attributeName)).toEqual(-1);

    await handleUploadedUserAttributes({
      csvString,
      organization,
      attributeName,
      attributeType: AttributeType.accountUser,
    });

    const ca = await CustomAttribute.findOne({
      where: {
        name: attributeName,
        organizationId: organization.id,
      },
    });

    expect(ca).toBeTruthy();
  });

  test('modifies attribute with email', async () => {
    const { organization, accountUser } = getContext();

    await accountUser.update({
      email: `${accountUser.fullName || 'a'}@testoramus.orgs`,
    });

    const attributeName = 'misoMaster';
    const csvString = `user_email,value\n${accountUser.email},karlos`;

    const currAttrs = Object.keys(accountUser.attributes || {});

    expect(currAttrs.indexOf(attributeName)).toEqual(-1);

    await handleUploadedUserAttributes({
      csvString,
      organization,
      attributeName,
      attributeType: AttributeType.accountUser,
    });

    await accountUser.reload();

    const newAttrs = Object.keys(accountUser.attributes || {});
    expect(newAttrs.indexOf(attributeName)).toBeGreaterThanOrEqual(0);
  });

  test('will not create new users', async () => {
    const { organization } = getContext();

    const attributeName = 'misoMaster';
    const csvString = `user_id,value\nidontexistid,karlos`;

    const beforeCount = await AccountUser.count({
      where: { organizationId: organization.id },
    });

    await handleUploadedUserAttributes({
      csvString,
      attributeName,
      attributeType: AttributeType.accountUser,
      organization,
    });

    const afterCount = await AccountUser.count({
      where: { organizationId: organization.id },
    });

    expect(beforeCount).toEqual(afterCount);
  });

  test('can bulk update', async () => {
    const { organization, account } = getContext();
    const users = await createDummyAccountUsers(organization, account, 5);

    const user1 = users[0].externalId;
    const user2 = users[1].externalId;

    const attributeName = 'vtMasterMedals';
    const csvString = `user_id,value\n${user1},1\n${user2},1`;

    await handleUploadedUserAttributes({
      csvString,
      attributeName,
      organization,
    });

    for (const user of users) {
      await user.reload();
    }

    users.forEach((user) => {
      const userAttributes = Object.keys(user.attributes);

      if (user.externalId === user1 || user.externalId === user2) {
        expect(userAttributes.indexOf(attributeName)).toBeGreaterThanOrEqual(0);
      } else {
        expect(userAttributes.indexOf(attributeName)).toEqual(-1);
      }
    });
  });

  test('ignores unnecessary columns', async () => {
    const { organization, accountUser } = getContext();

    const attributeName = 'misoMaster';
    const csvString = `user_id,value,useless,more_useless\n${accountUser.externalId},karlos,trains,whybrown`;

    const currAttrs = Object.keys(accountUser.attributes || {});

    expect(currAttrs.indexOf(attributeName)).toEqual(-1);

    await handleUploadedUserAttributes({
      csvString,
      organization,
      attributeName,
      attributeType: AttributeType.accountUser,
    });

    await accountUser.reload();

    const newAttrs = Object.keys(accountUser.attributes || {});
    expect(newAttrs.indexOf(attributeName)).toBeGreaterThanOrEqual(0);
  });

  test('throws if headers not present', async () => {
    const { organization, accountUser } = getContext();

    const attributeName = 'misoMaster';
    const csvString = `userid,valoo\n${accountUser.externalId},karlos`;

    const makeCall = async () => {
      await handleUploadedUserAttributes({
        csvString,
        organization,
        attributeName,
        attributeType: AttributeType.accountUser,
      });
    };

    await expect(makeCall).rejects.toThrow();
  });
});
