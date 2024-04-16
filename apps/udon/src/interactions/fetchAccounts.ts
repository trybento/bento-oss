import { intersection } from 'lodash';
import { QueryDatabase, queryRunner } from 'src/data';
import { Account } from 'src/data/models/Account.model';
import { Organization } from 'src/data/models/Organization.model';
import {
  ALL_ASSIGNED_AND_UNASSIGNED,
  ASSIGNED_TO_NONE,
} from 'src/graphql/constants';

type Args = {
  withoutGuidesFromTemplateEntityId?: string;
  assignedToEntityId?: string;
  hasLaunchedGuides?: boolean;
  searchQuery?: string;
  blocked?: boolean;
  limit?: number;
};

export default async function fetchAccounts(
  args: Args,
  organization: Organization
) {
  const {
    withoutGuidesFromTemplateEntityId,
    assignedToEntityId,
    hasLaunchedGuides,
    searchQuery,
    blocked,
    limit,
  } = args;

  let withoutGuidesFromTemplateEntityIdAccountIdsFilter: number[] | undefined;
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
            AND accounts.deleted_at IS NULL
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
    let rows;
    if (assignedToEntityId === ASSIGNED_TO_NONE) {
      rows = await queryRunner({
        sql: `
                SELECT accounts.id
                FROM core.accounts
                WHERE accounts.organization_id = :organizationId
                  AND accounts.deleted_at IS NULL
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
                  AND accounts.deleted_at IS NULL
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
    const accountRows = (await queryRunner({
      sql: `
              SELECT accounts.id
              FROM core.accounts
              WHERE LOWER(accounts.name) ILIKE :searchQuery
                AND accounts.deleted_at IS NULL
                AND accounts.organization_id = :organizationId;
            `,
      replacements: {
        searchQuery: `%${searchQuery}%`,
        organizationId: organization.id,
      },
      queryDatabase: QueryDatabase.primary,
    })) as { id: number }[];

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
    const accountRows = (await queryRunner({
      sql: `--sql
        SELECT accounts.id
        FROM core.accounts
        LEFT JOIN core.guide_bases
        ON accounts.id = guide_bases.account_id AND guide_bases.state = 'active'
        WHERE accounts.organization_id = :organizationId
          AND accounts.deleted_at IS NULL
        GROUP BY accounts.id
        ${hasLaunchedGuidesClause}
      `,
      replacements: {
        searchQuery: `%${searchQuery}%`,
        organizationId: organization.id,
      },
      queryDatabase: QueryDatabase.primary,
    })) as { id: number }[];

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

  const scopes = ['notArchived'];

  if (blocked === true) scopes.push('blocked');
  else if (blocked === false) scopes.push('notBlocked');

  return Account.scope(scopes).findAll({
    where: {
      ...(accountIdsFilter
        ? {
            id: accountIdsFilter,
          }
        : {}),
      organizationId: organization.id,
    },
    order: [['id', 'DESC']],
    ...(limit ? { limit } : {}),
  });
}
