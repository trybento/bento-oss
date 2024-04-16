import { isArray, trim } from 'lodash';
import { Op } from 'sequelize';
import { AttributeType } from 'bento-common/types';

import { QueryDatabase, queryRunner } from 'src/data';
import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { CustomAttribute } from 'src/data/models/CustomAttribute.model';
import { CustomAttributeValue } from 'src/data/models/CustomAttributeValue.model';
import { Organization } from 'src/data/models/Organization.model';
import { standardFields } from './recordEvents/recordAndSetCustomAttributes';
import { getCustomAttributeValueColumnName } from 'src/utils/helpers';
import withPerfTimer from 'src/utils/perfTimer';
import { logger } from 'src/utils/logger';
import withSentrySpan from 'src/utils/instrumentation/withSentrySpan';

/**
 * Time threshold for logging slow attribute value lookups.
 */
const TIME_LOG_THRESHOLD = 300; // 300ms

type TargetTable = {
  tableName: string;
  table: string;
  schema: string;
  delimiter: string;
};

/**
 * Searches through account, account users or custom attribute values returning
 * all matching results according to the search term and limit options.
 *
 * @return Promise the list of matching results
 */
const findCoreAttributes = async (
  organization: Organization,
  targetTable: string | TargetTable,
  field: string,
  options?: {
    /** Single search term, which is preferred over `qs` */
    q?: string;
    /** Multiple search terms */
    qs?: string[];
    /**
     * Maximum number of results to return
     * @default 20
     */
    limit?: number;
  }
) => {
  return withSentrySpan(
    async () => {
      const targetTableName =
        typeof targetTable === 'string' ? targetTable : targetTable.table;

      let substringCondition = '';
      let substring: string | string[] = '';

      if (trim(options?.q)) {
        substringCondition = `AND s.${field} ILIKE :substring`;
        substring = `%${options?.q}%`;
      } else if (options?.qs) {
        substring = options.qs.reduce<string[]>((acc, q) => {
          if (trim(q)) acc.push(`%${q}%`);
          return acc;
        }, []);

        // will only set the substring condition if there are any non-empty strings
        if (substring.length > 0) {
          substringCondition = `AND s.${field} ILIKE ANY(ARRAY[:substring])`;
        }
      }

      let sql: string;

      switch (targetTableName) {
        case 'account_users':
          sql = `--sql
            SELECT DISTINCT
              s.${field} as value
            FROM
              ${targetTable} s
              JOIN core.accounts a ON s.account_id = a.id
            WHERE
              s.organization_id = :organizationId
              ${substringCondition}
              AND a.deleted_at IS NULL
              AND a.blocked_at IS NULL
              AND s.${field} IS NOT NULL
            LIMIT
              :limit;
          `;
          break;

        case 'accounts':
          sql = `--sql
            SELECT DISTINCT
              s.${field} as value
            FROM
              ${targetTable} s
            WHERE
              s.organization_id = :organizationId
              ${substringCondition}
              AND s.deleted_at IS NULL
              AND s.blocked_at IS NULL
              AND s.${field} IS NOT NULL
            LIMIT
              :limit;
          `;
          break;

        default:
          sql = `--sql
            SELECT DISTINCT
              s.${field} as value
            FROM
              ${targetTable} s
            WHERE
              s.organization_id = :organizationId
              ${substringCondition}
              AND s.${field} IS NOT NULL
            LIMIT
              :limit;
          `;
      }

      const rows = await queryRunner<{ value: string }[]>({
        sql,
        replacements: {
          organizationId: organization.id,
          substring,
          limit: options?.limit || 20,
        },
        queryDatabase: QueryDatabase.primary,
      });

      return rows.map((row) => row.value);
    },
    {
      name: 'findCoreAttributes',
      data: {
        organizationId: organization.id,
        targetTable,
        field,
        options,
      },
    }
  );
};

/** Gets values of attributes from accounts/account_users.attributes jsonb */
export async function findCustomAttributes(
  organization: Organization,
  type: AttributeType,
  name: string,
  options?: {
    /** Single search term, currently only implemented for textValue */
    q?: string;
    /** Multiple search terms */
    qs?: string[];
    /**
     * Maximum number of results to return
     * @default 20
     */
    limit?: number;
  }
) {
  return withSentrySpan(
    async () => {
      let substring: string | string[] = '';

      if (trim(options?.q)) {
        substring = `%${options!.q}%`;
      } else if (options?.qs) {
        substring = options.qs.reduce<string[]>((acc, q) => {
          if (trim(q)) acc.push(`%${q}%`);
          return acc;
        }, []);
      }

      /**
       * Not using JOIN to avoid fetching all
       * [type]_value columns for an attribute.
       */
      const customAttribute = await CustomAttribute.findOne({
        attributes: ['id', 'valueType'],
        where: {
          name,
          type,
          organizationId: organization.id,
        },
      });

      if (!customAttribute) return [];

      const valueField = getCustomAttributeValueColumnName(
        customAttribute.valueType
      );

      /**
       * No need to check duplicates or nulls
       */
      const customAttributeValues = await CustomAttributeValue.findAll({
        attributes: [valueField],
        where: {
          customAttributeId: customAttribute.id,
          ...(substring.length && {
            [valueField]: isArray(substring)
              ? { [Op.or]: substring.map((q) => ({ [Op.iLike]: q })) }
              : { [Op.iLike]: substring },
          }),
        },
        limit: options?.limit || 20,
      });

      return customAttributeValues.map((cav) => cav[valueField]);
    },
    {
      name: 'findCustomAttributes',
      data: {
        organizationId: organization.id,
        type,
        name,
        options,
      },
    }
  );
}

/** Find current values used for an attribute */
const findAttributeValues = async (
  organization: Organization,
  name?: string,
  type?: string,
  q?: string,
  qs?: string[]
) => {
  return withPerfTimer(
    'findAttributeValues',
    async () => {
      if (!organization || !name) {
        return [];
      }

      let targetObject: typeof Account | typeof AccountUser | undefined;
      let allowedFields: string[] | undefined;
      switch (type) {
        case AttributeType.account:
          targetObject = Account;
          allowedFields = standardFields.account;
          break;

        case AttributeType.accountUser:
          targetObject = AccountUser;
          allowedFields = standardFields.account_user;
          break;

        default:
          return [];
      }

      // Override *:id with *:externalId
      if (name === 'id') {
        name = 'externalId';
      }

      // this will include 'core.' at the beginning
      const targetTable = targetObject.getTableName() as TargetTable;

      // whether we're targeting a "raw" column
      const rawColumn =
        allowedFields.includes(name) && targetObject.rawAttributes[name];

      if (rawColumn) {
        const field = rawColumn.field || name;
        return findCoreAttributes(
          organization,
          targetTable as TargetTable,
          field,
          {
            q,
            qs,
          }
        );
      }

      return findCustomAttributes(
        organization,
        type === 'account' ? AttributeType.account : AttributeType.accountUser,
        name,
        { q, qs }
      );
    },
    (time) => {
      if (time > TIME_LOG_THRESHOLD)
        logger.warn(
          `[findAttributeValues] Slow attribute value lookup took ${time}ms: ${type}.${name} for ${organization.slug}`,
          {
            type,
            name,
            q,
            qs,
          }
        );
    }
  );
};

export default findAttributeValues;
