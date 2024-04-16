import {
  GraphQLFieldConfig,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { GraphQLDate } from 'graphql-iso-date';
import { QueryDatabase, queryRunner } from 'src/data';
import TemplateType from '../Template/Template.graphql';
import { GraphQLContext } from 'src/graphql/types';
import { AnalyticsBase } from './types';
import withPerfTimer from 'src/utils/perfTimer';
import { logger } from 'src/utils/logger';

type LaunchAnalyticsNode = {
  seenDate: string;
  templateId: number;
  count: number;
};

const LaunchAnalyticsNodeType = new GraphQLObjectType<
  LaunchAnalyticsNode,
  GraphQLContext
>({
  name: 'LaunchAnalyticsNode',
  description: 'Details about how many guides were launched on a given date',
  fields: {
    count: { type: GraphQLNonNull(GraphQLInt) },
    seenDate: { type: GraphQLNonNull(GraphQLDate) },
    template: {
      type: GraphQLNonNull(TemplateType),
      resolve: (node, _args, { loaders }) =>
        loaders.templateLoader.load(node.templateId),
    },
  },
});

/** Strictly fetches last 30 days and uses rollup table */
const STATIC_QUERY = `
	SELECT
		gdr.date AS "seenDate",
		g.created_from_template_id AS "templateId",
		COUNT(DISTINCT gdr.account_user_id::text || gdr.template_id::text) AS count
	FROM analytics.guide_daily_rollup gdr
	JOIN core.guides g ON gdr.guide_id = g.id
	JOIN core.account_users au ON gdr.account_user_id = au.id
	JOIN core.accounts a ON a.id = au.account_id AND a.deleted_at IS NULL
	WHERE
		gdr.date > NOW() - INTERVAL '30 days'
		AND gdr.organization_id = :organizationId
		AND g.created_from_template_id IS NOT NULL
	GROUP BY "seenDate", "templateId"
	ORDER BY "seenDate" ASC, COUNT(*) DESC;
`;

const launchAnalytics: GraphQLFieldConfig<AnalyticsBase, GraphQLContext> = {
  type: GraphQLNonNull(GraphQLList(GraphQLNonNull(LaunchAnalyticsNodeType))),
  description: 'Information about when guides were launched',
  resolve: async (analytics, _args, { organization }) => {
    const where = analytics.where();
    return withPerfTimer(
      'analytics.launchAnalytics',
      async () => {
        const results = (await queryRunner({
          sql: STATIC_QUERY,
          replacements: where,
          queryDatabase: QueryDatabase.follower,
        })) as LaunchAnalyticsNode[];
        return results;
      },
      (time) =>
        logger.info(
          `[analytics] launchAnalytics run time for orgId ${where.organizationId}: ${time}`
        )
    );
  },
};

export default launchAnalytics;
