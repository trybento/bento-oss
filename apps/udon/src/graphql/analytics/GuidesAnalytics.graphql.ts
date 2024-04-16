import {
  GraphQLEnumType,
  GraphQLFieldConfig,
  GraphQLInt,
  GraphQLObjectType,
} from 'graphql';
import { connectionArgs, connectionDefinitions } from 'graphql-relay';
import { QueryDatabase, queryRunner } from 'src/data';
import {
  connectionFromSqlResult,
  sqlFromConnectionArgs,
} from '../helpers/sqlRelayHelpers';
import TemplateType from '../Template/Template.graphql';
import { AnalyticsBase } from './types';
import { GraphQLContext } from 'src/graphql/types';
import { OrderDirection } from '../helpers/types';
import withPerfTimer from 'src/utils/perfTimer';
import { GuideFormFactor, GuideTypeEnum } from 'bento-common/types';
import { logger } from 'src/utils/logger';

const GuidesAnalyticsType = new GraphQLObjectType<
  GuidesAnalyticsQueryResult,
  GraphQLContext
>({
  name: 'GuidesAnalytics',
  fields: {
    template: {
      type: TemplateType,
      resolve: (result, _, { loaders }) =>
        loaders.templateLoader.load(result.template_id),
    },
    usersSeenGuide: { type: GraphQLInt },
    completedAStep: { type: GraphQLInt },
    totalStepsCompleted: { type: GraphQLInt },
  },
  description: 'analytics on guides usage/completion',
});

const { connectionType: GuidesAnalyticsConnection } = connectionDefinitions({
  nodeType: GuidesAnalyticsType,
  connectionFields: {
    total: { type: GraphQLInt },
    limit: { type: GraphQLInt },
    offset: { type: GraphQLInt },
  },
});

type GuidesAnalyticsQueryResult = {
  template_id: number;
  completedAStep: number;
  usersSeenGuide: number;
  totalStepsCompleted: number;
  full_count: number;
};

type GuidesAnalyticsArgs = {
  orderBy:
    | 'completedAStep'
    | 'usersSeenGuide'
    | 'totalStepsCompleted'
    | 'templateName';
  orderDirection: 'asc' | 'desc';
  first?: number;
  last?: number;
  before?: string;
  after?: string;
};

const GuidesAnalyticsOrderByType = new GraphQLEnumType({
  name: 'GuidesAnalyticsOrderBy',
  values: {
    completedAStep: { value: 'completedAStep' },
    usersSeenGuide: { value: 'usersSeenGuide' },
    totalStepsCompleted: { value: 'totalStepsCompleted' },
    templateName: { value: 'templateName' },
  },
});

export const guidesAnalytics: GraphQLFieldConfig<
  AnalyticsBase,
  GraphQLContext
> = {
  deprecationReason: 'Not in use (soon)',
  description: 'Analytics on guides',
  type: GuidesAnalyticsConnection,
  args: {
    ...connectionArgs,
    orderBy: { type: GuidesAnalyticsOrderByType },
    orderDirection: { type: OrderDirection },
  },
  resolve: async (analytics: AnalyticsBase, _args, { organization }) => {
    const where = analytics.where();
    return withPerfTimer(
      'analytics.guideAnalytics',
      async () => {
        const args = _args as GuidesAnalyticsArgs;
        const { orderBy, orderDirection } = args;
        let orderClause = '';
        const orderCol = orderBy || 'usersSeenGuide';
        const dir = orderDirection || 'desc';
        switch (orderCol) {
          case 'completedAStep':
          case 'totalStepsCompleted':
          case 'usersSeenGuide':
            orderClause = `"${orderCol}" ${dir}, r.template_id ${dir}`;
            break;
          case 'templateName':
            orderClause = `t.name ${dir}, r.template_id ${dir}`;
        }
        const QUERY = `--sql
					select
						r.template_id
						, count(distinct s.completed_by_account_user_id) as "completedAStep"
						, count(distinct r.account_user_id) as "usersSeenGuide"
						, CASE WHEN t.form_factor = '${GuideFormFactor.modal}' THEN NULL ELSE count(distinct s.id) END as "totalStepsCompleted"
						, count(*) OVER () as full_count
					from
						analytics.guide_daily_rollup r
					JOIN core.guides g ON g.id = r.guide_id
					JOIN core.guide_bases gb ON g.created_from_guide_base_id = gb.id
					join core.templates t ON gb.created_from_template_id = t.id
					join core.account_users au ON r.account_user_id = au.id
					JOIN core.accounts a ON au.account_id = a.id AND a.deleted_at IS NULL
					left join
						core.steps s on (s.guide_id = r.guide_id and s.completed_by_account_user_id = r.account_user_id
							and s.completed_at between :startDate and :endDate)
					WHERE
						r.organization_id = :organizationId
					AND
						r.date >= :startDate
					AND
						r.date <= :endDate
					AND
						t.type != '${GuideTypeEnum.splitTest}'
					GROUP BY
						r.template_id, t.name, t.form_factor
					ORDER BY
						${orderClause}
					LIMIT :limit
					OFFSET :offset
				;
				`;

        const { limit, offset } = sqlFromConnectionArgs(args);
        const statistics = (await queryRunner({
          sql: QUERY,
          replacements: { ...where, limit: limit || 20, offset: offset || 0 },
          queryDatabase: QueryDatabase.follower,
        })) as GuidesAnalyticsQueryResult[];

        return connectionFromSqlResult({
          values: statistics,
          source: null,
          args,
        });
      },
      (time) =>
        logger.info(
          `[analytics] guideAnalytics run time for orgId ${where.organizationId}: ${time}`
        )
    );
  },
};
