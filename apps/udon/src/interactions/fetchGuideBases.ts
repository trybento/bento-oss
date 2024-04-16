import { intersection } from 'lodash';
import { queryRunner } from 'src/data';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Organization } from 'src/data/models/Organization.model';
import { Template } from 'src/data/models/Template.model';
import {
  ALL_ASSIGNED_AND_UNASSIGNED,
  ASSIGNED_TO_NONE,
} from 'src/graphql/constants';

const fetchGuideBases = async (args, organization: Organization) => {
  const {
    accountNameSearchQuery,
    createdFromTemplateEntityId,
    completionPercentage,
    lastActiveWithin,
    assignedToEntityId,
    hasBeenViewed,
  } = args;

  let assignedToGuideBaseIdsFilter;
  if (
    assignedToEntityId &&
    assignedToEntityId !== ALL_ASSIGNED_AND_UNASSIGNED
  ) {
    let rows;
    if (assignedToEntityId === ASSIGNED_TO_NONE) {
      rows = await queryRunner({
        sql: `--sql
          SELECT guide_bases.id
          FROM core.guide_bases
          JOIN core.accounts
          ON accounts.id = guide_bases.account_id
          WHERE accounts.organization_id = :organizationId
            AND accounts.deleted_at IS NULL
            AND accounts.primary_organization_user_id IS NULL
        `,
        replacements: {
          organizationId: organization.id,
        },
      });
    } else {
      rows = await queryRunner({
        sql: `--sql
          SELECT guide_bases.id
          FROM core.guide_bases
          JOIN core.accounts
          ON accounts.id = guide_bases.account_id
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
      });
    }

    assignedToGuideBaseIdsFilter = rows.map((row) => row.id);
  }

  let filterTemplate;
  if (createdFromTemplateEntityId) {
    filterTemplate = await Template.findOne({
      where: {
        entityId: createdFromTemplateEntityId,
        organizationId: organization.id,
      },
    });
  } else {
    filterTemplate = await Template.findOne({
      where: {
        organizationId: organization.id,
      },
      order: [['createdAt', 'ASC']],
    });
  }

  if (!filterTemplate) return [];

  let completionGuideBaseIdsFilter;
  if (completionPercentage) {
    let filterClause;
    if (completionPercentage && completionPercentage !== 'all') {
      switch (completionPercentage) {
        case 'notStarted':
          filterClause = `
                WHERE percentage_complete = 0
              `;
          break;
        case 'any':
          filterClause = `
                  WHERE percentage_complete > 0
                `;
          break;
        case 'complete':
          filterClause = `
                WHERE percentage_complete = 100
              `;
          break;
        case 'lessThanOneQuarter':
          filterClause = `
                WHERE percentage_complete <= 25
              `;
          break;
        case 'lessThanHalf':
          filterClause = `
                WHERE percentage_complete <= 50
              `;
          break;
        case 'lessThanThreeQuarters':
          filterClause = `
                WHERE percentage_complete <= 75
              `;
          break;
        case 'lessThanOneHundred':
          filterClause = `
                WHERE percentage_complete <= 99
              `;
          break;
        default:
          filterClause = '';
          break;
      }

      const query = `--sql
            WITH guide_bases_with_percentages_complete AS (
              SELECT
                guide_bases.id,
                ROUND((
                  (COUNT(steps.is_complete) FILTER (WHERE steps.is_complete IS TRUE))::float /
                  (COUNT(steps.is_complete))::float
                ) * 100) as percentage_complete
              FROM core.guide_bases
              JOIN core.guides ON guides.created_from_guide_base_id = guide_bases.id
              JOIN core.steps ON steps.guide_id = guides.id
              WHERE guide_bases.organization_id = :organizationId
              GROUP BY guide_bases.id
            )
            SELECT guide_bases_with_percentages_complete.id
            FROM guide_bases_with_percentages_complete
            ${filterClause}
          `;

      const rows = (await queryRunner({
        sql: query,
        replacements: {
          organizationId: organization.id,
        },
      })) as { id: number }[];

      completionGuideBaseIdsFilter = rows.map((row) => row.id);
    }
  }

  let hasBeenViewedFilter;
  if (hasBeenViewed != null) {
    const guideBaseRows = (await queryRunner({
      sql: `--sql
              SELECT guide_bases.id
              FROM core.guide_bases
              JOIN core.guides
              ON guides.created_from_guide_base_id = guide_bases.id
              WHERE guide_bases.organization_id = :organizationId
              AND ${hasBeenViewed ? '' : 'NOT'} EXISTS (
                SELECT 1
                FROM core.guide_participants
                WHERE guide_participants.guide_id = guides.id
                AND guide_participants.first_viewed_at IS NOT NULL
              )
              GROUP BY guide_bases.id
            `,
      replacements: {
        organizationId: organization.id,
      },
    })) as { id: number }[];

    hasBeenViewedFilter = guideBaseRows.map((row) => row.id);
  }

  let lastActiveGuideBaseIdsFilter;
  if (lastActiveWithin && lastActiveWithin !== 'all') {
    let filterClause;
    if (lastActiveWithin === 'lastDay') {
      filterClause = `WHERE guides.last_active_at >= (NOW() - INTERVAL '1 DAY')`;
    } else if (lastActiveWithin === 'lastWeek') {
      filterClause = `WHERE guides.last_active_at >= (NOW() - INTERVAL '1 WEEK')`;
    } else {
      filterClause = `WHERE guides.last_active_at >= (NOW() - INTERVAL '1 MONTH')`;
    }

    const guideBaseRows = (await queryRunner({
      sql: `--sql
        SELECT guide_bases.id
        FROM core.guide_bases
        JOIN core.guides
        ON guide_bases.id = guides.created_from_guide_base_id
        ${filterClause}
        GROUP BY guide_bases.id
      `,
      replacements: {
        organizationId: organization.id,
      },
    })) as { id: number }[];

    lastActiveGuideBaseIdsFilter = guideBaseRows.map((row) => row.id);
  }

  let accountNameSearchGuideBaseIdsFilter;
  if (accountNameSearchQuery) {
    const guideBaseRows = (await queryRunner({
      sql: `--sql
        SELECT guide_bases.id
        FROM core.guide_bases
        JOIN core.accounts
        ON guide_bases.account_id = accounts.id
        WHERE guide_bases.organization_id = :organizationId
          AND accounts.deleted_at IS NULL
          AND LOWER(accounts.name) ILIKE :accountNameSearchQuery;
      `,
      replacements: {
        accountNameSearchQuery: `%${accountNameSearchQuery}%`,
        organizationId: organization.id,
      },
    })) as { id: number }[];

    accountNameSearchGuideBaseIdsFilter = guideBaseRows.map((row) => row.id);
  }

  let guideBaseIdsFilter: number[] | undefined;
  [
    completionGuideBaseIdsFilter,
    lastActiveGuideBaseIdsFilter,
    accountNameSearchGuideBaseIdsFilter,
    assignedToGuideBaseIdsFilter,
    hasBeenViewedFilter,
  ].forEach((filter) => {
    if (!filter) return;
    if (!guideBaseIdsFilter) {
      guideBaseIdsFilter = [...filter];
    } else {
      guideBaseIdsFilter = intersection(guideBaseIdsFilter, filter);
    }
  });

  return GuideBase.findAll({
    where: {
      ...(guideBaseIdsFilter
        ? {
            id: guideBaseIdsFilter,
          }
        : {}),
      createdFromTemplateId: filterTemplate.id,
      organizationId: organization.id,
    },
    order: [
      ['createdAt', 'DESC'],
      ['id', 'ASC'],
    ],
  });
};

export default fetchGuideBases;
