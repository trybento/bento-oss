import type { Logger } from 'winston';
import type { Logger as BullMQLogger } from 'src/jobsBull/logger';
import { AttributeType, DataSource, TargetValueType } from 'bento-common/types';

import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import {
  Attributes,
  AttributeTuple,
  formatAttributeTuples,
  sanitizeAttributes,
  writeAttributesToAccountOrAccountUser,
  standardFields,
} from './recordEvents.helpers';
import persistCustomAttributes from './persistCustomAttributes';

type RecordAndSetCustomAttributesArgs = {
  obj: Account | AccountUser;
  attributes?: Attributes;
  source?: DataSource;
};

type Options = {
  logger?: Logger | BullMQLogger;
  detach?: boolean;
};

/**
 * Record and set custom attributes for an account or account user.
 *
 * Nested (aka complex) objects or Date objects will be ignored,
 * as well as any undefined attributes.
 *
 * Null values will be saved to their respective object.
 *
 * @returns Whether or not the attributes have changed
 */
export default async function recordAndSetCustomAttributes(
  {
    obj,
    attributes = {},
    source = DataSource.snippet,
  }: RecordAndSetCustomAttributesArgs,
  { logger, detach = true }: Options = {}
) {
  if (!obj) throw new Error('No account or account user provided');

  let attrsChanged = false;

  // Don't support complex objects in the attributes hash for now
  const sanitizedAttributes = sanitizeAttributes(attributes);

  const keyValueTuples = Object.entries(
    sanitizedAttributes
  ) as AttributeTuple[];

  const attributeType: AttributeType | null =
    obj instanceof Account ? AttributeType.account : AttributeType.accountUser;

  attrsChanged = await writeAttributesToAccountOrAccountUser({
    obj,
    attributes: sanitizedAttributes,
  });

  try {
    if (attrsChanged) {
      const organizationId = obj.organizationId;

      /** Add standard attributes */
      if (obj !== null && attributeType !== null) {
        for (const k of standardFields[attributeType]) {
          const v = obj[k];
          if (v) {
            keyValueTuples.push([k, v]);
          }
        }
      }

      const attributesToInsertAttrs = formatAttributeTuples(keyValueTuples, {
        attributeType,
        source,
        organizationId,
      });

      /** Add mapped createdAt attribute */
      if (obj?.createdInOrganizationAt) {
        attributesToInsertAttrs.push({
          name: 'createdAt',
          type: attributeType as AttributeType,
          valueType: TargetValueType.date,
          source,
          organizationId,
        });
      }

      const attributeValuesByName = keyValueTuples.reduce(
        (a, [attributeName, value]) => {
          a[attributeName] = new Set(Array.isArray(value) ? value : [value]);
          return a;
        },
        {}
      );

      await persistCustomAttributes({
        attributesToInsert: attributesToInsertAttrs,
        organizationId,
        attributeValuesByName,
        detach,
      });
    }
  } catch (innerError: any) {
    logger?.error(
      `[recordAndSetCustomAttributes] Error writing attributes: ${
        innerError?.message || innerError
      }`
    );
  } finally {
    return attrsChanged;
  }
}

export { Attributes, standardFields } from './recordEvents.helpers';
