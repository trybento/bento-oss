import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { connectionArgs, connectionDefinitions } from 'graphql-relay';
import { QueryDatabase, queryRunner } from 'src/data';
import AccountUserType from 'src/graphql/AccountUser/AccountUser.graphql';
import {
  connectionFromSqlResult,
  sqlFromConnectionArgs,
} from 'src/graphql/helpers/sqlRelayHelpers';
import { EntityId, OrderDirection } from 'src/graphql/helpers/types';
import StepType from 'src/graphql/Step/Step.graphql';
import { GraphQLContext } from 'src/graphql/types';

type AccountUserAnalytics = {
  accountUserId: number;
  stepsViewed: number;
  stepsCompleted: number;
  currentStepId: number;
  stepLastSeen: Date;
  lastActiveInApp: Date;
  createdInOrganizationAt: Date;
  total_count: number;
};

const AccountUserAnalyticsType = new GraphQLObjectType<
  AccountUserAnalytics,
  GraphQLContext
>({
  name: 'AccountUserAnalytics',
  fields: {
    accountUser: {
      type: GraphQLNonNull(AccountUserType),
      resolve: (source, _args, { loaders }) =>
        loaders.accountUserLoader.load(source.accountUserId),
    },
    stepsViewed: { type: GraphQLNonNull(GraphQLInt) },
    stepsCompleted: { type: GraphQLNonNull(GraphQLInt) },
    stepLastSeen: { type: GraphQLDateTime },
    lastActiveInApp: { type: GraphQLDateTime },
    currentStep: {
      type: StepType,
      resolve: (source, _args, { loaders }) =>
        source.currentStepId && loaders.stepLoader.load(source.currentStepId),
    },
  },
});

const details = connectionDefinitions({
  nodeType: AccountUserAnalyticsType,
  connectionFields: {
    total: { type: GraphQLInt },
    limit: { type: GraphQLInt },
    offset: { type: GraphQLInt },
  },
});

type AccountConnectionArgs = {
  accountEntityId: string;
  searchQuery?: string;
  includeInternal?: boolean;
  orderBy?: string;
  orderDirection: 'asc' | 'desc';
  first?: number;
  last?: number;
  before?: string;
  after?: string;
};

export function accountUserAnalyticsConnection() {
  const { connectionType } = details;
  return {
    type: connectionType,
    args: {
      ...connectionArgs,
      accountEntityId: { type: GraphQLNonNull(EntityId) },
      searchQuery: { type: GraphQLString },
      includeInternal: { type: GraphQLBoolean },
      orderBy: { type: GraphQLString },
      orderDirection: {
        type: OrderDirection,
        defaultValue: 'desc',
      },
    },
    resolve: async (
      _source: unknown,
      _args: any,
      { organization }: GraphQLContext
    ) => {
      const args = _args as AccountConnectionArgs;

      const { limit, offset } = sqlFromConnectionArgs(args);
      const { accountEntityId, searchQuery, includeInternal, orderBy } = args;
      const orderDirection = args.orderDirection || 'desc';
      const extraWhereClause = searchQuery
        ? 'AND (au.full_name ILIKE :searchQuery OR au.email ILIKE :searchQuery OR au.external_id ILIKE :searchQuery)'
        : '';
      let orderClause = '';
      switch (orderBy) {
        case 'fullName':
          orderClause = 'order by full_name';
          break;
        case 'stepsCompleted':
          orderClause = 'order by "stepsCompleted"';
          break;
        case 'stepName':
          orderClause = 'order by step_name';
          break;

        case 'createdInOrganizationAt':
          orderClause = 'order by created_in_organization_at';
          break;

        case 'stepLastSeen':
          orderClause = 'order by aud.step_last_seen';
          break;

        case 'lastActiveInApp':
          orderClause = 'order by aud.last_active_in_app';
          break;

        case 'stepsViewed':
          orderClause = 'order by "stepsViewed"';
          break;

        default: {
          if (orderBy) {
            orderClause = `order by su.attributes->>'${orderBy}'`;
          } else {
            orderClause = 'order by "stepsViewed"';
          }
          break;
        }
      }
      orderClause = `${orderClause} ${orderDirection} NULLS LAST, su.account_user_id ${orderDirection}`;
      const limitClause = limit ? `LIMIT :limit` : '';
      const offsetClause = offset ? `OFFSET :offset` : '';

      const QUERY = `--sql
				WITH selected_users AS (
					select au.id as account_user_id
					, au.entity_id as account_user_entity_id
					, au.full_name
					, au.created_in_organization_at
          , au.attributes
					, count(*) OVER() as total_count
					from core.account_users au
					join core.accounts a on (a.id = au.account_id)
					where a.organization_id = :organizationId
          AND a.deleted_at IS NULL
					and a.entity_id = :accountEntityId
					${includeInternal ? '' : 'and au.internal = FALSE'}
					${extraWhereClause}
				)
				SELECT su.account_user_id as "accountUserId"
					, COALESCE(aud.steps_viewed, 0) AS "stepsViewed"
					, COALESCE(aud.steps_completed, 0) AS "stepsCompleted"
					, aud.current_step_id as "currentStepId"
					, COALESCE(gsb.name, sp.name) AS step_name
					, aud.step_last_seen "stepLastSeen"
					, aud.last_active_in_app AS "lastActiveInApp"
					, su.total_count
				FROM
					selected_users su
				LEFT JOIN analytics.account_user_data aud
					ON aud.account_user_id = su.account_user_id
				LEFT JOIN core.steps s
					ON aud.current_step_id = s.id
        LEFT JOIN core.guide_step_bases gsb
					ON gsb.id = s.created_from_guide_step_base_id
					AND gsb.deleted_at IS NULL
        LEFT JOIN core.step_prototypes sp 
					ON sp.id = s.created_from_step_prototype_id
				${orderClause}
				${limitClause}
				${offsetClause}
				;
			`;

      const results = (await queryRunner({
        sql: QUERY,
        replacements: {
          organizationId: organization.id,
          accountEntityId,
          searchQuery: `%${searchQuery}%`,
          limit: limit || 1,
          offset: offset || 0,
        },
        queryDatabase: QueryDatabase.follower,
      })) as AccountUserAnalytics[];

      const totalCount = results[0]?.total_count || 0;

      return connectionFromSqlResult({
        values: results as any,
        source: null,
        args,
        fullCount: totalCount,
      });
    },
  };
}
