import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { connectionDefinitions, connectionArgs } from 'graphql-relay';
import { intersection } from 'lodash';

import { EntityId, OrderDirection } from 'src/graphql/helpers/types';
import AccountType from 'src/graphql/Account/Account.graphql';
import {
  connectionFromSqlResult,
  sqlFromConnectionArgs,
} from 'src/graphql/helpers/sqlRelayHelpers';

import { QueryDatabase, queryRunner } from 'src/data';
import { AccountStatus } from 'src/data/models/types';
import {
  ALL_ASSIGNED_AND_UNASSIGNED,
  ASSIGNED_TO_NONE,
} from 'src/graphql/constants';

let connectionDetails;
export const getConnectionDetails = () => {
  if (connectionDetails) return connectionDetails;
  connectionDetails = connectionDefinitions({
    name: 'AccountsConnection',
    // @ts-expect-error Node type should be non-nullable
    nodeType: new GraphQLNonNull(AccountType),
    connectionFields: {
      total: { type: GraphQLInt },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
    },
  });
  return connectionDetails;
};

const AccountsOrderByEnumType = new GraphQLEnumType({
  name: 'AccountsOrderBy',
  values: {
    name: { value: 'name' },
    guidesCount: {
      value: 'guidesCount',
    },
    totalUsersWithGuidesCount: {
      value: 'totalUsersWithGuidesCount',
    },
    lastActiveAt: {
      value: 'lastActiveAt',
    },
    csmName: {
      value: 'csmName',
    },
    createdInOrganizationAt: {
      value: 'createdInOrganizationAt',
    },
  },
});

type Args = {
  withoutGuidesFromTemplateEntityId: string;
  assignedToEntityId: string;
  hasLaunchedGuides: boolean;
  searchQuery?: string;
  orderBy:
    | 'name'
    | 'guidesCount'
    | 'totalUsersWithGuidesCount'
    | 'lastActiveAt'
    | 'csmName'
    | 'createdInOrganizationAt';
  status: string;
  orderDirection: 'asc' | 'desc';
};

type IdRow = { id: number };

export function accountsConnection() {
  const { connectionType } = getConnectionDetails();

  return {
    type: connectionType,
    args: {
      ...connectionArgs,
      searchQuery: {
        type: GraphQLString,
      },
      assignedToEntityId: {
        deprecationReason: 'not in use',
        type: GraphQLString,
      },
      hasLaunchedGuides: {
        deprecationReason: 'not in use',
        type: GraphQLBoolean,
      },
      withoutGuidesFromTemplateEntityId: {
        deprecationReason: 'not in use',
        type: EntityId,
      },
      status: {
        deprecationReason: 'not in use',
        type: GraphQLString,
      },
      orderBy: {
        type: AccountsOrderByEnumType,
      },
      orderDirection: {
        type: OrderDirection,
        defaultValue: 'asc',
      },
    },
    resolve: async (_source, args, { organization, loaders }) => {
      const {
        withoutGuidesFromTemplateEntityId,
        assignedToEntityId,
        hasLaunchedGuides,
        searchQuery,
        orderBy,
        status,
        orderDirection,
      } = args as Args;

      const { limit, offset } = sqlFromConnectionArgs(args);
      const accountStatusCondition = `AND accounts.deleted_at ${
        status === AccountStatus.archived ? 'IS NOT NULL' : 'IS NULL'
      }`;

      let withoutGuidesFromTemplateEntityIdAccountIdsFilter:
        | number[]
        | undefined;
      if (withoutGuidesFromTemplateEntityId) {
        const accountRows = (await queryRunner({
          sql: `--sql
          SELECT accounts.id
          FROM core.organizations
          JOIN core.templates
          ON organizations.id = templates.organization_id
          JOIN core.accounts
          ON accounts.organization_id = organizations.id
          LEFT JOIN core.guide_bases
          ON guide_bases.created_from_template_id = templates.id AND guide_bases.account_id = accounts.id
          WHERE organizations.id = :organizationId
            ${accountStatusCondition}
            AND templates.entity_id = :withoutGuidesFromTemplateEntityId
            AND guide_bases.id IS NULL
          `,
          replacements: {
            organizationId: organization.id,
            withoutGuidesFromTemplateEntityId,
          },
          queryDatabase: QueryDatabase.primary,
        })) as { id: number }[];

        withoutGuidesFromTemplateEntityIdAccountIdsFilter = accountRows.map(
          (account) => account.id
        );
      }

      let assignedToAccountIdsFilter;
      if (
        assignedToEntityId &&
        assignedToEntityId !== ALL_ASSIGNED_AND_UNASSIGNED
      ) {
        let rows: IdRow[];
        if (assignedToEntityId === ASSIGNED_TO_NONE) {
          rows = await queryRunner({
            sql: `--sql
              SELECT accounts.id
              FROM core.accounts
              WHERE accounts.organization_id = :organizationId
                ${accountStatusCondition}
                AND accounts.primary_organization_user_id IS NULL
            `,
            replacements: {
              organizationId: organization.id,
            },
            queryDatabase: QueryDatabase.primary,
          });
        } else {
          rows = await queryRunner({
            sql: `--sql
              SELECT accounts.id
              FROM core.accounts
              JOIN core.users
              ON accounts.primary_organization_user_id = users.id
              WHERE accounts.organization_id = :organizationId
                ${accountStatusCondition}
                AND users.entity_id = :assignedToEntityId
								AND users.deleted_at IS NULL
            `,
            replacements: {
              assignedToEntityId: assignedToEntityId,
              organizationId: organization.id,
            },
            queryDatabase: QueryDatabase.primary,
          });
        }

        assignedToAccountIdsFilter = rows.map((row) => row.id);
      }

      let searchQueryAccountIdsFilter: number[] | undefined;
      if (searchQuery) {
        const accountRows = await queryRunner<IdRow[]>({
          sql: `--sql
            SELECT accounts.id
            FROM core.accounts
            WHERE (
								LOWER(accounts.name) ILIKE :searchQuery
								OR accounts.external_id ILIKE :searchQuery
							)
              ${accountStatusCondition}
              AND accounts.organization_id = :organizationId;
          `,
          replacements: {
            searchQuery: `%${searchQuery}%`,
            organizationId: organization.id,
          },
          queryDatabase: QueryDatabase.primary,
        });

        searchQueryAccountIdsFilter = accountRows.map((row) => row.id);
      }

      let hasLaunchedGuidesAccountIdsFilter: number[] | undefined;
      if (hasLaunchedGuides != null) {
        let hasLaunchedGuidesClause: string;
        if (hasLaunchedGuides) {
          hasLaunchedGuidesClause = `HAVING COUNT(guide_bases.id) > 0`;
        } else {
          hasLaunchedGuidesClause = `HAVING COUNT(guide_bases.id) = 0`;
        }
        const accountRows = await queryRunner<IdRow[]>({
          sql: `--sql
            SELECT accounts.id
            FROM core.accounts
            LEFT JOIN core.guide_bases
            ON accounts.id = guide_bases.account_id AND guide_bases.state = 'active'
            WHERE accounts.organization_id = :organizationId
            ${accountStatusCondition}
            GROUP BY accounts.id
            ${hasLaunchedGuidesClause}
          `,
          replacements: {
            searchQuery: `%${searchQuery}%`,
            organizationId: organization.id,
          },
          queryDatabase: QueryDatabase.primary,
        });

        hasLaunchedGuidesAccountIdsFilter = accountRows.map((row) => row.id);
      }

      let accountIdsFilter: number[] | undefined;
      [
        assignedToAccountIdsFilter,
        hasLaunchedGuidesAccountIdsFilter,
        searchQueryAccountIdsFilter,
        withoutGuidesFromTemplateEntityIdAccountIdsFilter,
      ].forEach((filter) => {
        if (!filter) return;
        if (!accountIdsFilter) {
          accountIdsFilter = [...filter];
        } else {
          accountIdsFilter = intersection(accountIdsFilter, filter);
        }
      });

      if (accountIdsFilter && accountIdsFilter.length === 0) {
        return connectionFromSqlResult({
          values: [],
          source: null,
          args,
          skipFullCount: true,
        });
      }

      let orderByClause = '';
      let orderByJoinClause = '';
      let orderByGroupClause = '';
      if (orderBy) {
        if (orderBy === 'name') {
          orderByClause = `ORDER BY accounts.name ${orderDirection}`;
        } else if (orderBy === 'guidesCount') {
          orderByJoinClause = `
            LEFT JOIN core.guide_bases
            ON guide_bases.account_id = accounts.id AND guide_bases.obsoleted_at IS NULL
            LEFT JOIN core.templates
            ON templates.id = guide_bases.created_from_template_id
          `;
          orderByClause = `ORDER BY COUNT(DISTINCT templates.id) ${orderDirection}`;
          orderByGroupClause = 'GROUP BY accounts.id';
        } else if (orderBy === 'totalUsersWithGuidesCount') {
          orderByJoinClause = `
            LEFT JOIN core.guides
            ON guides.account_id = accounts.id
            LEFT JOIN core.guide_participants gp
              ON gp.guide_id = guides.id
            LEFT JOIN core.account_users
            ON gp.account_user_id = account_users.id
          `;
          orderByClause = `ORDER BY COUNT(DISTINCT account_users.id) ${orderDirection}`;
          orderByGroupClause = 'GROUP BY accounts.id';
        } else if (orderBy === 'lastActiveAt') {
          orderByClause = `ORDER BY accounts.last_active_at ${orderDirection} NULLS LAST`;
        } else if (orderBy === 'csmName') {
          orderByJoinClause = `
            LEFT JOIN core.users
            	ON users.id = accounts.primary_organization_user_id
							AND users.deleted_at IS NULL
          `;
          orderByClause = `ORDER BY users.full_name ${orderDirection}`;
          orderByGroupClause = `GROUP BY accounts.id, users.full_name`;
        } else if (orderBy === 'createdInOrganizationAt') {
          orderByClause = `ORDER BY accounts.created_in_organization_at ${orderDirection}`;
        }
      }

      const accountIdRows = await queryRunner<IdRow[]>({
        sql: `--sql
          SELECT
            accounts.id
          FROM core.accounts
          ${orderByJoinClause || ''}
          WHERE accounts.organization_id = :organizationId
          ${accountStatusCondition}
          ${
            accountIdsFilter
              ? `
            AND accounts.id IN (:accountIds)
          `
              : ``
          }
          ${orderByGroupClause}
          ${orderByClause || 'ORDER BY created_at DESC, id ASC'}
          ${limit != null ? 'LIMIT :limit' : ''}
          ${offset != null ? 'OFFSET :offset' : ''}
        `,
        replacements: {
          organizationId: organization.id,
          ...(accountIdsFilter
            ? {
                accountIds: accountIdsFilter,
              }
            : {}),
          ...(limit ? { limit } : {}),
          ...(offset ? { offset } : {}),
        },
        queryDatabase: QueryDatabase.primary,
      });

      const accountIds = accountIdRows.map((row) => row.id);
      const accounts = await loaders.accountLoader.loadMany(accountIds);

      return connectionFromSqlResult({
        values: accounts,
        source: null,
        args,
        skipFullCount: true,
      });
    },
  };
}
