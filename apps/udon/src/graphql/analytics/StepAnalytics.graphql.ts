import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLObjectType,
} from 'graphql';
import { connectionDefinitions, connectionArgs } from 'graphql-relay';

import { queryRunner } from 'src/data';
import {
  connectionFromSqlResult,
  sqlFromConnectionArgs,
} from '../helpers/sqlRelayHelpers';
import { OrderDirection } from '../helpers/types';
import StepPrototypeType from '../StepPrototype/StepPrototype.graphql';
import { GraphQLContext } from 'src/graphql/types';
import { AnalyticsBase } from './types';
import withPerfTimer from 'src/utils/perfTimer';
import { GuideFormFactor } from 'bento-common/types';
import { logger } from 'src/utils/logger';

/** How long before we give up and return the results anyway */
const STEP_TIMEOUT = 15 * 1000;

const StepAnalyticsType = new GraphQLObjectType<
  StepAnalyticsQueryResult,
  GraphQLContext
>({
  name: 'StepAnalytics',
  fields: {
    step: {
      type: StepPrototypeType,
      resolve: (source, _, { loaders }) => {
        return loaders.stepPrototypeLoader.load(source.step_prototype_id);
      },
    },
    seenStep: { type: GraphQLInt },
    percentCompleted: { type: GraphQLFloat },
    daysToComplete: { type: GraphQLInt },
  },
  description: 'analytics on step usage and completion',
});

type StepAnalyticsQueryResult = {
  step_prototype_id: number;
  seenStep: number;
  completionCount: number;
  percentCompleted: number;
  daysToComplete: number;
  full_count: number;
};

export const { connectionType: StepAnalyticsConnection } =
  connectionDefinitions({
    nodeType: StepAnalyticsType,
    connectionFields: {
      total: { type: GraphQLInt },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
    },
  });

const StepAnalyticsOrderByType = new GraphQLEnumType({
  name: 'StepAnalyticsOrderBy',
  values: {
    seenStep: { value: 'seenStep' },
    percentCompleted: { value: 'percentCompleted' },
    daysToComplete: { value: 'daysToComplete' },
    stepName: { value: 'stepName' },
  },
});

type StepAnalyticsArgs = {
  orderBy: 'seenStep' | 'percentCompleted' | 'daysToComplete' | 'stepName';
  orderDirection: 'asc' | 'desc';
  first?: number;
  last?: number;
  before?: string;
  after?: string;
};

export const stepAnalytics = {
  deprecationReason: 'Not in use (soon)',
  description: 'Analytics on steps',
  type: StepAnalyticsConnection,
  args: {
    ...connectionArgs,
    orderBy: { type: StepAnalyticsOrderByType },
    orderDirection: { type: OrderDirection, default: 'desc' },
  },
  resolve: async (
    analytics: AnalyticsBase,
    _args,
    { organization }: GraphQLContext
  ) => {
    const args = _args as StepAnalyticsArgs;

    const { limit, offset } = sqlFromConnectionArgs(args);
    const { orderBy } = args;
    const orderDirection = args.orderDirection || 'desc';
    let sortClause: string;

    switch (orderBy) {
      case 'daysToComplete':
        sortClause = `coalesce("daysToComplete", 0) ${orderDirection}, coalesce("seenStep", 0) ${orderDirection}`;
        break;
      case 'percentCompleted':
        sortClause = `coalesce("completionRate", 0) ${orderDirection}, coalesce("seenStep", 0) ${orderDirection}`;
        break;
      case 'stepName':
        sortClause = `sp.name ${orderDirection}, coalesce("seenStep", 0) ${orderDirection}`;
        break;
      case 'seenStep':
      default:
        sortClause = `coalesce("seenStep", 0) ${orderDirection}, coalesce("completionRate", 0) ${orderDirection}`;
    }

    sortClause = `${sortClause}, step_prototype_id ${orderDirection}`;

    /**
     * This query needs to:
     * - Exclude orphaned steps
     * - Exclude "Internal" users
     * - Exclude "archived" accounts
     */
    const QUERY = `
      WITH rollup_steps AS (
        SELECT *
        FROM analytics.step_daily_rollup r
        WHERE r.organization_id = :organizationId
          AND r.date BETWEEN :startDate AND :endDate
      ),
      viewed AS (
        SELECT
          r.step_prototype_id,
          count(distinct r.account_user_id) AS "seenStep",
          count(distinct s.id) AS completedCount,
          TRUNC(1.0 * count(distinct s.id) / count(distinct r.step_id), 4) AS "completionRate"
        FROM rollup_steps r
        JOIN core.account_users au ON r.account_user_id = au.id
        JOIN core.accounts a ON au.account_id = a.id AND a.deleted_at IS NULL
        LEFT JOIN core.steps s
          ON s.id = r.step_id
            AND s.completed_at BETWEEN :startDate AND :endDate
        GROUP BY r.step_prototype_id
      ),
      -- For filtering step prototypes down to what we want
      used_modules AS (
        -- Used in non-announcement templates
        SELECT tm.module_id AS id
        FROM core.templates t
        JOIN core.templates_modules tm ON tm.template_id = t.id
        WHERE t.organization_id = :organizationId
          AND t.form_factor != '${GuideFormFactor.banner}'
          AND t.form_factor != '${GuideFormFactor.modal}'

        UNION

        -- Branching targets
        SELECT bp.module_id AS id
        FROM core.branching_paths bp
        WHERE bp.organization_id = :organizationId
      ),
      completed as (
        SELECT
          s.created_from_step_prototype_id AS step_prototype_id,
          count(*) AS "completionCount",
          -- s.completed_at is in the coalesce() to deal with cases when the user clicks the button without viewing the step,
          -- so they've, by our measure, never "seen" it.
          date_part(
            'day',
            avg(s.completed_at - coalesce(seen1.first_viewed, seen2.first_viewed, s.completed_at))
          ) AS "daysToComplete"
        FROM core.steps s
        LEFT JOIN core.account_users au ON s.completed_by_account_user_id = au.id
        LEFT JOIN core.accounts a ON au.account_id = a.id AND a.deleted_at IS NULL
        LEFT JOIN (
          -- try to find when the user who completed the step first saw it
          SELECT r.step_id, r.account_user_id, min(date) AS first_viewed
          FROM rollup_steps r
          GROUP BY r.step_id, r.account_user_id
        ) seen1
          ON s.id = seen1.step_id
            AND s.completed_by_account_user_id = seen1.account_user_id
        LEFT JOIN (
          -- try to find the first time anyone saw it
          SELECT r.step_id, min(date) AS first_viewed
          FROM rollup_steps r
          GROUP BY r.step_id
        ) seen2
          ON seen1.step_id IS NULL AND s.id = seen2.step_id
        WHERE
          s.completed_at BETwEEN :startDate AND :endDate
          AND s.organization_id = :organizationId
          AND (
            s.completed_by_type != 'account_user'
            OR au.id IS NOT NULL
          )
        GROUP BY s.created_from_step_prototype_id
      )
      SELECT
        coalesce(viewed.step_prototype_id, completed.step_prototype_id) AS step_prototype_id
        , "seenStep"
        , "completionCount"
        , trunc(100 * "completionRate", 1) AS "percentCompleted"
        , "daysToComplete"
        , count(*) OVER() AS full_count
      FROM viewed
      FULL OUTER JOIN completed USING (step_prototype_id)
      JOIN core.step_prototypes sp ON (step_prototype_id = sp.id)
      JOIN (
        -- dedupes
        SELECT
          msp.step_prototype_id AS id,
          ROW_NUMBER() OVER (PARTITION BY msp.step_prototype_id) rn
        FROM used_modules um
        JOIN core.modules_step_prototypes msp ON um.id = msp.module_id
      ) used ON sp.id = used.id AND used.rn = 1
      ORDER BY ${sortClause}
      LIMIT :limit
      OFFSET :offset;
		`;

    const where = analytics.where();
    return withPerfTimer(
      'analytics.stepAnalytics',
      async () => {
        const statistics = (await Promise.race([
          queryRunner({
            sql: QUERY,
            replacements: {
              ...where,
              limit: limit || 20,
              offset: offset || 0,
            },
          }),
          new Promise((resolve) =>
            setTimeout(() => resolve(null), STEP_TIMEOUT)
          ),
        ])) as StepAnalyticsQueryResult[] | null;
        if (statistics === null) {
          logger.warn(
            `[analytics] step analytics timed out for ${where.organizationId} at ${STEP_TIMEOUT}ms`
          );
        }
        return connectionFromSqlResult({
          values: statistics || [],
          source: null,
          args,
        });
      },
      (time) =>
        logger.info(
          `[analytics] stepAnalytics run time for orgId ${where.organizationId}: ${time}`
        )
    );
  },
};
