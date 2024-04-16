import {
  GraphQLEnumType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import {
  connectionDefinitions,
  connectionArgs,
  GraphQLConnectionDefinitions,
} from 'graphql-relay';
import { EntityId, OrderDirection } from 'src/graphql/helpers/types';
import {
  connectionFromSqlResult,
  sqlFromConnectionArgs,
} from 'src/graphql/helpers/sqlRelayHelpers';
import { QueryDatabase, queryRunner } from 'src/data';
import EntityIdType from 'src/../../common/graphql/EntityId';

const NpsSurveyAccountType = new GraphQLObjectType({
  name: 'NpsSurveyAccount',
  fields: {
    accountEntityId: {
      type: new GraphQLNonNull(EntityIdType),
    },
    accountName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    score: {
      type: GraphQLInt,
    },
    responses: {
      type: GraphQLInt,
    },
  },
});

let connectionDetails: GraphQLConnectionDefinitions;

export const getConnectionDetails = () => {
  if (connectionDetails) {
    return connectionDetails;
  }

  connectionDetails = connectionDefinitions({
    name: 'NpsSurveyAccountsConnection',
    // @ts-expect-error Node type should be non-nullable
    nodeType: new GraphQLNonNull(NpsSurveyAccountType),
    connectionFields: {
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      total: { type: GraphQLInt },
    },
  });

  return connectionDetails;
};

const NpsSurveyAccountsOrderByEnumType = new GraphQLEnumType({
  name: 'NpsSurveyAccountsOrderBy',
  values: {
    accountName: { value: 'accountName' },
    score: {
      value: 'score',
    },
    responses: {
      value: 'responses',
    },
  },
});

export function npsSurveyAccountsConnections() {
  const { connectionType } = getConnectionDetails();

  return {
    type: connectionType,
    args: {
      ...connectionArgs,
      npsSurveyEntityId: {
        type: new GraphQLNonNull(EntityId),
      },
      orderBy: {
        type: NpsSurveyAccountsOrderByEnumType,
      },
      orderDirection: {
        type: OrderDirection,
      },
    },
    resolve: async (_, args) => {
      const { npsSurveyEntityId, orderBy, orderDirection } = args;
      const { limit, offset } = sqlFromConnectionArgs(args);
      const orderByClause = `ORDER BY "${orderBy || 'responses'}" ${
        orderDirection || ''
      }`;

      const results = (await queryRunner({
        sql: `--sql
          SELECT
            t.*,
            CASE
              WHEN COALESCE(t.responses, 0) > 0 THEN
                ROUND(
                  ((CAST(t.promoters as DECIMAL) / t.responses) * 100) -
                  ((CAST(t.detractors AS DECIMAL) / t.responses) * 100)
                )
              ELSE NULL
            END AS "score"
          FROM (
            SELECT
              a.entity_id AS "accountEntityId",
              a.name AS "accountName",
              COUNT(np.answered_at) AS "responses",
              SUM(CASE WHEN np.answer < 7 THEN 1 ELSE 0 END) AS "detractors",
              SUM(CASE WHEN np.answer > 8 THEN 1 ELSE 0 END) AS "promoters"
            FROM core.nps_surveys ns
            JOIN core.nps_survey_instances nsi
              ON nsi.created_from_nps_survey_id = ns.id
            JOIN core.nps_participants np
              ON nsi.id = np.nps_survey_instance_id
            JOIN core.accounts a
              ON np.account_id = a.id
            WHERE ns.entity_id = :npsSurveyEntityId
            GROUP BY a.entity_id, a.name
          ) t
          ${orderByClause}
          ${limit != null ? 'LIMIT :limit' : ''}
          ${offset != null ? 'OFFSET :offset' : ''}
        `,
        replacements: {
          npsSurveyEntityId,
          ...(limit ? { limit } : {}),
          ...(offset ? { offset } : {}),
        },
        queryDatabase: QueryDatabase.primary,
      })) as Record<string, unknown>[];

      return connectionFromSqlResult({
        values: results,
        source: null,
        args,
        skipFullCount: true,
      });
    },
  };
}
