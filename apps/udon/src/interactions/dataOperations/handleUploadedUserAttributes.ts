import promises from 'src/utils/promises';
import { keyBy, omit } from 'lodash';
import csvStringToArray from 'bento-common/utils/csvStringToArray';
import { AttributeType, DataSource, TargetValueType } from 'bento-common/types';

import { AccountUser } from 'src/data/models/AccountUser.model';
import { logger } from 'src/utils/logger';
import { Organization } from 'src/data/models/Organization.model';
import { chunkArray } from 'src/utils/helpers';
import { Account } from 'src/data/models/Account.model';
import persistCustomAttributes from '../recordEvents/persistCustomAttributes';

type Args = {
  csvString: string;
  attributeName: string;
  defaultAttributeValue?: string;
  attributeType?: AttributeType;
  organization: Organization;
};

type BaseRow = {
  user_id?: string;
  user_email?: string;
  account_id?: string;

  /* Support previous iterations */
  value?: string;
  tag_name?: string;
  user_attribute?: string;
  account_attribute?: string;
};

type ParsedRow = BaseRow & {
  /* Other attributes for custom creation */
  [customAttr: string]: string;
};

const MAX_ROWS = 5000;

export const handleUploadedUserAttributes = async ({
  csvString,
  attributeName,
  defaultAttributeValue,
  attributeType = AttributeType.accountUser,
  organization,
}: Args) => {
  const parsedRows = csvStringToArray(csvString) as ParsedRow[];

  if (parsedRows.length === 0) return 0;

  if (parsedRows.length > MAX_ROWS) {
    logger.warn(
      `[handleUploadedUserAttributes] ${organization.name} requested too many rows: ${parsedRows.length} > ${MAX_ROWS}`
    );
    return 0;
  }

  logger.info(
    `[handleUploadedUserAttributes] orgId ${organization.id} requested csv import with ${parsedRows.length} rows`
  );

  /* Validate we have the fields needed to proceed */
  const exampleRow = parsedRows[0];

  if (
    (!('user_id' in exampleRow) &&
      !('user_email' in exampleRow) &&
      attributeType === AttributeType.accountUser) ||
    (attributeType === AttributeType.account && !('account_id' in exampleRow))
  )
    throw new Error('Invalid rows: no ids provided');

  /* Perform in small bits to avoid loading in too many users at once */
  const chunkedRows = chunkArray(parsedRows, 100);

  let affectedCount = 0;
  let attrNames: string[] = [];
  let attrValues: Record<string, Set<string>> = {};

  /* We have ids, attribute name, and corresponding values. Look up existing entries */
  await promises.mapSeries(chunkedRows, async (chunk) => {
    let res: any[];

    switch (attributeType) {
      case AttributeType.account:
        {
          const processed = await applyAccountAttributes(
            chunk,
            attributeName,
            organization.id,
            defaultAttributeValue
          );
          res = processed.accounts;
          attrNames = processed.attributes;
          attrValues = processed.attributeValues;
        }
        break;
      case AttributeType.accountUser:
        {
          const processed = await applyAccountUserAttributes(
            chunk,
            attributeName,
            organization.id,
            defaultAttributeValue
          );
          res = processed.accountUsers;
          attrNames = processed.attributes;
          attrValues = processed.attributeValues;
        }
        break;
      default:
        throw new Error(`Invalid attribute type ${attributeType}`);
    }

    affectedCount += res.length;
  });

  const attributesToInsert = attrNames.map((attrName) => ({
    name: attrName,
    type: attributeType,
    organizationId: organization.id,
    valueType: TargetValueType.text,
    source: DataSource.import,
  }));

  await persistCustomAttributes({
    attributesToInsert,
    attributeValuesByName: attrValues,
    organizationId: organization.id,
  });

  return affectedCount;
};

const applyAccountUserAttributes = async (
  rows: ParsedRow[],
  attributeName: string,
  organizationId: number,
  defaultAttributeValue = 'Tagged User'
) => {
  const [lookupById, lookupByEmail] = rows.reduce(
    (a, v) => {
      v.user_id && a[0].push(v.user_id);
      v.user_email && !v.user_id && a[1].push(v.user_email);
      return a;
    },
    [[], []] as [string[], string[]]
  );

  const accountUsersMatchingExternalId = await AccountUser.findAll({
    where: {
      externalId: lookupById,
      organizationId,
    },
  });

  const accountUsersByExternalId = keyBy(
    accountUsersMatchingExternalId,
    'externalId'
  );

  /* Emails are fallback used only if no id provided */
  const accountUsersMatchingEmail = await AccountUser.findAll({
    where: {
      email: lookupByEmail,
      organizationId,
    },
  });

  const accountUsersByEmail = keyBy(accountUsersMatchingEmail, 'email');

  logger.debug(
    `[applyAccountUserAttributes] matched ${
      accountUsersMatchingEmail.length + accountUsersMatchingExternalId.length
    } users with ${rows.length} input rows`
  );

  const attributeValues: Record<string, Set<string>> = {};

  const creationAttrs = rows.reduce((a, row) => {
    let accountUser: AccountUser | undefined = undefined;
    if (row.user_id) accountUser = accountUsersByExternalId[row.user_id];
    else if (row.user_email) accountUser = accountUsersByEmail[row.user_email];

    if (!accountUser) return a;

    const attrValue =
      row.user_attribute || row.value || row.tag_name || defaultAttributeValue;
    const attrPackage = attributeName
      ? {
          [attributeName]: attrValue,
        }
      : omit(row, ['user_id', 'user_email']);

    accountUser.set('attributes', {
      ...accountUser.attributes,
      ...attrPackage,
    });

    /* Track for creating values */
    Object.entries(attrPackage).forEach(([key, value]) => {
      if (!attributeValues[key]) attributeValues[key] = new Set();

      attributeValues[key]?.add(value);
    });

    /* Strip all the sequelize properties */
    a[accountUser.externalId] = accountUser.toJSON();
    return a;
  }, {} as Record<string, Partial<AccountUser>>);

  const accountUsers = await AccountUser.bulkCreate(
    Object.values(creationAttrs),
    {
      updateOnDuplicate: ['attributes'],
    }
  );

  return {
    accountUsers,
    attributes: attributeName
      ? [attributeName]
      : Object.keys(omit(rows[0], ['user_id', 'user_email'])),
    attributeValues,
  };
};

const applyAccountAttributes = async (
  rows: ParsedRow[],
  attributeName: string,
  organizationId: number,
  defaultAttributeValue = 'Tagged User'
) => {
  const accountExternalIds = rows.reduce((a, v) => {
    v.account_id && a.push(v.account_id);
    return a;
  }, [] as string[]);
  const accountsMatchingExternalId = await Account.findAll({
    where: {
      externalId: accountExternalIds,
      organizationId,
    },
  });

  const accountsByExternalId = keyBy(accountsMatchingExternalId, 'externalId');

  logger.debug(
    `[applyAccountAttributes] matched ${accountsMatchingExternalId.length} users with ${rows.length} input rows`
  );

  const attributeValues: Record<string, Set<string>> = {};

  const creationAttrs = rows.reduce((a, row) => {
    let account: Account | undefined = undefined;
    if (row.account_id) account = accountsByExternalId[row.account_id];

    if (!account || !account.externalId) return a;

    const attrValue =
      row.account_attribute ||
      row.value ||
      row.tag_name ||
      defaultAttributeValue;

    const attrPackage = attributeName
      ? {
          [attributeName]: attrValue,
        }
      : omit(row, ['account_id']);

    /* Track for creating values */
    Object.entries(attrPackage).forEach(([key, value]) => {
      if (!attributeValues[key]) attributeValues[key] = new Set();

      attributeValues[key]?.add(value);
    });

    account.set('attributes', {
      ...account.attributes,
      ...attrPackage,
    });

    /* Strip all the sequelize properties */
    a[account.externalId] = account.toJSON();
    return a;
  }, {} as Record<string, Partial<Account>>);

  const accounts = await Account.bulkCreate(Object.values(creationAttrs), {
    updateOnDuplicate: ['attributes'],
  });

  return {
    accounts,
    attributes: attributeName
      ? [attributeName]
      : Object.keys(omit(rows[0], 'account_id')),
    attributeValues,
  };
};
