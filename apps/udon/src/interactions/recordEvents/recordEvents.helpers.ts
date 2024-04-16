import { isEqual, isObject, omitBy } from 'lodash';
import { ATTRIBUTE_VALUE_MAX_LENGTH } from 'bento-common/validation/customRules';
import { AttributeType, DataSource, TargetValueType } from 'bento-common/types';

import { CustomAttribute } from 'src/data/models/CustomAttribute.model';
import { logger } from 'src/utils/logger';
import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { getAttributeValueType } from 'src/utils/helpers';
import { enablePersistentAttributes } from 'src/utils/internalFeatures/internalFeatures';

/** Raw attributes hash from customers, different from our CustomAttributes data */
export type Attributes = {
  [attributeName: string]:
    | object
    | string
    | number
    | boolean
    | Date
    | undefined
    | null;
};

export type AttributeTuple = [string, string | number | boolean];

export const standardFields: {
  account_user: Array<keyof AccountUser>;
  account: Array<keyof Account>;
} = {
  account_user: ['fullName', 'email', 'externalId'],
  account: ['name', 'externalId'],
};

/** Remove unsupported attributes from customer payloads */
export const sanitizeAttributes = (attributes: Attributes) =>
  omitBy(attributes, (value, key) => {
    if (Array.isArray(value)) {
      if (value.some((v) => typeof v !== 'string')) {
        logger.debug(
          `[recordAndSetCustomAttributes] Skipping attribute. Unsupported array non-string values for attribute "${key}"`
        );
        return true;
      }
    } else if (isObject(value)) {
      logger.debug(
        `[recordAndSetCustomAttributes] Skipping attribute. Unsupported attribute value type: ${typeof value} for attribute "${key}"`
      );
      return true;
    } else if (typeof value === 'string') {
      const length = (value as string).length;
      if (length > ATTRIBUTE_VALUE_MAX_LENGTH) {
        logger.debug(
          `[recordAndSetCustomAttributes] Skipping attribute. Length (${length}) is too big for attribute "${key}"`
        );
        return true;
      }
    }

    return false;
  });

/** Change tuples into formatted rows ready to insert into db */
export const formatAttributeTuples = (
  keyValueTuples: AttributeTuple[],
  {
    attributeType,
    source,
    organizationId,
  }: {
    attributeType: AttributeType;
    organizationId: number;
    source: DataSource;
  }
) =>
  keyValueTuples
    .map((tuple) => {
      const [attributeName, attributeValue] = tuple;

      const valueType = getAttributeValueType(attributeValue);

      if (valueType == null) {
        logger?.debug(
          `[recordAndSetCustomAttributes] Skipping attribute. Unsupported attribute value type: ${typeof attributeValue} for attribute "${attributeName}"`
        );
        return null;
      }

      return {
        name: attributeName,
        type: attributeType as AttributeType,
        valueType,
        organizationId,
        source,
      };
    })
    .filter(Boolean) as {
    name: string;
    type: AttributeType;
    valueType: TargetValueType;
    organizationId: number;
    source: DataSource;
  }[];

/** Make str comparisons instead of date */
const stringifyDateKeys = (attrs: Attributes) =>
  Object.keys(attrs).reduce((a, v) => {
    a[v] =
      attrs[v] instanceof Date ? (attrs[v] as Date).toISOString() : attrs[v];
    return a;
  }, {});

/** Persist attributes and see if they've updated */
export const writeAttributesToAccountOrAccountUser = async ({
  obj,
  attributes,
}: {
  obj: Account | AccountUser;
  attributes: Attributes;
}) => {
  const existingAttributes = obj.attributes;

  const usePersistentAttributes = await enablePersistentAttributes.enabled();

  let carryoverAttributes: Record<string, any> = {};

  if (usePersistentAttributes) {
    /* Carry everything over */
    carryoverAttributes = Object.assign({}, existingAttributes ?? {});
  } else {
    /* Pluck only manual tags over */
    const manualTags = await CustomAttribute.findAll({
      where: {
        organizationId: obj.organizationId,
        type:
          obj instanceof Account
            ? AttributeType.account
            : AttributeType.accountUser,
        source: DataSource.import,
      },
    });

    carryoverAttributes = manualTags.reduce((a, v) => {
      if (existingAttributes[v.name]) a[v.name] = existingAttributes[v.name];

      return a;
    }, {} as Record<string, any>);
  }

  const updatedAttributes = {
    ...carryoverAttributes,
    ...attributes,
    createdAt: obj.createdInOrganizationAt,
    ...(obj instanceof Account
      ? {
          name: obj.name,
        }
      : {
          fullName: obj.fullName,
          email: obj.email,
        }),
  };

  const changed = !isEqual(
    stringifyDateKeys(existingAttributes),
    stringifyDateKeys(updatedAttributes)
  );

  if (changed) {
    await obj.update({ attributes: updatedAttributes });
  }

  return changed;
};
