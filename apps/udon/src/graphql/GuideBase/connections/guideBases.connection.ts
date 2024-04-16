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
import GuideBaseType, {
  GuideCompletionPercentageFilterEnum,
} from 'src/graphql/GuideBase/GuideBase.graphql';
import {
  connectionFromSqlResult,
  sqlFromConnectionArgs,
} from 'src/graphql/helpers/sqlRelayHelpers';

import { QueryDatabase, queryRunner } from 'src/data';
import { GuideLastActiveWithinFilterEnum } from 'src/graphql/Guide/Guide.graphql';
import {
  ALL_ASSIGNED_AND_UNASSIGNED,
  ASSIGNED_TO_NONE,
} from 'src/graphql/constants';
import { Template } from 'src/data/models/Template.model';

const GuideBasesOrderByEnumType = new GraphQLEnumType({
  name: 'GuideBasesOrderBy',
  values: {
    state: { value: 'state' },
    accountName: { value: 'accountName' },
    participantsWhoViewedCount: {
      value: 'participantsWhoViewedCount',
    },
    usersViewedAStep: {
      value: 'usersViewedAStep',
    },
    usersCompletedAStep: {
      value: 'usersCompletedAStep',
    },
    progress: {
      value: 'progress',
    },
    averageStepsViewed: {
      value: 'averageStepsViewed',
    },
    averageStepsCompleted: {
      value: 'averageStepsCompleted',
    },
    lastActiveAt: {
      value: 'lastActiveAt',
    },
    ctasClicked: {
      value: 'ctasClicked',
    },
    stepsCompleted: {
      value: 'stepsCompleted',
    },
    lastCompletedStepAt: {
      deprecationReason: 'not in use',
      value: 'lastCompletedStepAt',
    },
    lastCompletedStepName: {
      deprecationReason: 'not in use',
      value: 'lastCompletedStepName',
    },
  },
});

let connectionDetails;
export const getConnectionDetails = () => {
  if (connectionDetails) return connectionDetails;
  connectionDetails = connectionDefinitions({
    name: 'GuideBasesConnection',
    // @ts-expect-error Node type should be non-nullable
    nodeType: new GraphQLNonNull(GuideBaseType),
    connectionFields: {
      total: { type: GraphQLInt },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
    },
  });
  return connectionDetails;
};

export function guideBasesConnection() {
  const { connectionType } = getConnectionDetails();

  return {
    type: connectionType,
    args: {
      ...connectionArgs,
      completionPercentage: {
        type: GuideCompletionPercentageFilterEnum,
      },
      createdFromTemplateEntityId: {
        type: EntityId,
      },
      lastActiveWithin: {
        type: GuideLastActiveWithinFilterEnum,
        defaultValue: 'all',
      },
      accountNameSearchQuery: {
        type: GraphQLString,
      },
      assignedToEntityId: {
        type: GraphQLString,
      },
      hasBeenViewed: {
        type: GraphQLBoolean,
      },
      orderBy: {
        type: GuideBasesOrderByEnumType,
      },
      orderDirection: {
        type: OrderDirection,
        defaultValue: 'asc',
      },
      includeEmptyGuideBases: {
        type: GraphQLBoolean,
        defaultValue: false,
      },
    },
    resolve: async (_, args, { organization, loaders }) => {
      const {
        accountNameSearchQuery,
        createdFromTemplateEntityId,
        completionPercentage,
        lastActiveWithin,
        assignedToEntityId,
        hasBeenViewed,
        orderBy,
        orderDirection,
        includeEmptyGuideBases = false,
      } = args;

      const { limit, offset } = sqlFromConnectionArgs(args);

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
            queryDatabase: QueryDatabase.follower,
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
            queryDatabase: QueryDatabase.follower,
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

      if (!filterTemplate)
        return connectionFromSqlResult({
          values: [],
          source: null,
          args,
          fullCount: 0,
        });

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
            queryDatabase: QueryDatabase.follower,
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
          queryDatabase: QueryDatabase.follower,
        })) as { id: number }[];

        hasBeenViewedFilter = guideBaseRows.map((row) => row.id);
      }

      let lastActiveGuideBaseIdsFilter;
      if (lastActiveWithin && lastActiveWithin !== 'all') {
        let filterClause;
        if (lastActiveWithin === 'lastDay') {
          filterClause = `AND steps.updated_at >= (NOW() - INTERVAL '1 DAY')`;
        } else if (lastActiveWithin === 'lastWeek') {
          filterClause = `AND steps.updated_at >= (NOW() - INTERVAL '1 WEEK')`;
        } else {
          filterClause = `AND steps.updated_at >= (NOW() - INTERVAL '1 MONTH')`;
        }

        const guideBaseRows = (await queryRunner({
          sql: `--sql
              SELECT guide_bases.id
              FROM core.steps
              JOIN core.guide_modules
              	ON steps.guide_module_id = guide_modules.id
              JOIN core.guides
              	ON guide_modules.guide_id = guides.id
              JOIN core.guide_bases
              	ON guide_bases.id = guides.created_from_guide_base_id
              WHERE steps.is_complete IS TRUE
              	AND guide_bases.organization_id = :organizationId
								AND guide_modules.deleted_at IS NULL
              	${filterClause}
              GROUP BY guide_bases.id
            `,
          replacements: {
            organizationId: organization.id,
          },
          queryDatabase: QueryDatabase.follower,
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
          queryDatabase: QueryDatabase.follower,
        })) as { id: number }[];

        accountNameSearchGuideBaseIdsFilter = guideBaseRows.map(
          (row) => row.id
        );
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

      if (guideBaseIdsFilter && guideBaseIdsFilter.length === 0) {
        return connectionFromSqlResult({
          values: [],
          source: null,
          args,
          fullCount: 0,
        });
      }

      let orderByClause = '';
      let orderByJoinClause = '';
      /** Was necessary for some deprecated queries. May need again just currently not */
      const orderByGroupClause = '';
      if (orderBy) {
        if (orderBy === 'state') {
          orderByClause = `ORDER BY guide_bases.state::text ${orderDirection}`;
        } else if (orderBy === 'accountName') {
          orderByClause = `ORDER BY accounts.name ${orderDirection}`;
        } else if (orderBy === 'participantsWhoViewedCount') {
          orderByClause = `
            ORDER BY COALESCE(gd.participants_who_viewed, 0) ${orderDirection} NULLS LAST
          `;
        } else if (orderBy === 'usersViewedAStep') {
          orderByClause = `
            ORDER BY gd.users_viewed_a_step ${orderDirection} NULLS LAST
          `;
        } else if (orderBy === 'usersCompletedAStep') {
          orderByClause = `
            ORDER BY gd.users_completed_a_step ${orderDirection} NULLS LAST
          `;
        } else if (orderBy === 'progress') {
          orderByClause = `
            ORDER BY gd.avg_progress ${orderDirection} NULLS LAST
          `;
        } else if (orderBy === 'stepsCompleted') {
          orderByClause = `
            ORDER BY gd.completed_steps ${orderDirection} NULLS LAST
          `;
        } else if (orderBy === 'lastActiveAt') {
          orderByJoinClause = `
            LEFT JOIN LATERAL (
              SELECT max(guides.last_active_at) as last_active_at
              FROM core.guides
              WHERE guides.created_from_guide_base_id = guide_bases.id
              ) guides_activity on true
          `;
          orderByClause = `
            ORDER BY guides_activity.last_active_at ${orderDirection} ${
            orderDirection === 'desc' ? 'NULLS LAST' : 'NULLS FIRST'
          }
          `;
        } else if (orderBy === 'ctasClicked') {
          orderByClause = `
            ORDER BY COALESCE(gd.ctas_clicked, 0) ${orderDirection} NULLS LAST
          `;
        } else if (orderBy === 'usersClickedCta') {
          orderByClause = `
            ORDER BY COALESCE(gd.users_clicked_cta, 0) ${orderDirection} NULLS LAST
          `;
        } else if (orderBy === 'averageStepsViewed') {
          orderByClause = `
            ORDER BY gd.avg_steps_viewed ${orderDirection} NULLS LAST
          `;
        } else if (orderBy === 'averageStepsCompleted') {
          orderByClause = `
            ORDER BY gd.avg_steps_completed ${orderDirection} NULLS LAST
          `;
        }
      }

      const sql = `--sql
          SELECT
            guide_bases.id as guide_base_id,
            COUNT(*) OVER() as full_count
          FROM core.guide_bases
					LEFT JOIN analytics.guide_data gd ON gd.guide_base_id = guide_bases.id
					${
            !includeEmptyGuideBases
              ? `
						-- Drop guide bases with no guide participants (e.g. nobody added to the guide)
						JOIN LATERAL (
							SELECT
								g.created_from_guide_base_id
							FROM
								core.guide_participants gp
							JOIN core.guides g ON gp.guide_id = g.id
							WHERE
								g.created_from_guide_base_id = guide_bases.id AND
								gp.organization_id = :organizationId
							LIMIT 1
						) guide_base_guide ON TRUE
						`
              : ''
          }
          ${orderByJoinClause || ''}
          JOIN core.accounts ON guide_bases.account_id = accounts.id
          WHERE guide_bases.organization_id = :organizationId
          ${
            guideBaseIdsFilter
              ? `
            AND guide_bases.id IN (:guideBaseIds)
          `
              : ''
          }
          ${
            filterTemplate?.id
              ? `
            AND guide_bases.created_from_template_id = :createdFromTemplateId
          `
              : ''
          }
           AND accounts.deleted_at IS NULL
          ${orderByGroupClause}
          ${
            orderByClause ||
            'ORDER BY guide_bases.created_at DESC, guide_bases.id ASC'
          }
          ${limit != null ? 'LIMIT :limit' : ''}
          ${offset != null ? 'OFFSET :offset' : ''}
        `;

      const guideBaseIdsResult = (await queryRunner({
        sql,
        replacements: {
          ...(guideBaseIdsFilter
            ? {
                guideBaseIds: guideBaseIdsFilter,
              }
            : {}),
          ...(filterTemplate?.id
            ? {
                createdFromTemplateId: filterTemplate?.id,
              }
            : {}),
          organizationId: organization.id as number,
          ...(limit ? { limit } : {}),
          ...(offset ? { offset } : {}),
          queryDatabase: QueryDatabase.follower,
        },
      })) as { guide_base_id: number; full_count: number }[];

      const guideBaseIds = guideBaseIdsResult.map((row) => row.guide_base_id);
      const totalCount = guideBaseIdsResult[0]?.full_count || 0;

      const guideBases = await loaders.guideBaseLoader.loadMany(guideBaseIds);

      return connectionFromSqlResult({
        values: guideBases,
        source: null,
        args,
        fullCount: totalCount,
      });
    },
  };
}
