import {
  GraphQLFieldConfig,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { connectionArgs, connectionDefinitions } from 'graphql-relay';
import { enumToGraphqlEnum } from 'bento-common/utils/graphql';

import { queryRunner } from 'src/data';
import {
  connectionFromSqlResult,
  sqlFromConnectionArgs,
} from 'src/graphql/helpers/sqlRelayHelpers';
import { OrderDirection } from 'src/graphql/helpers/types';
import StepPrototypeTaggedElementType from 'src/graphql/StepPrototypeTaggedElement/StepPrototypeTaggedElement.graphql';
import { GraphQLContext } from 'src/graphql/types';
import { AllTaggedElementsOrderBy } from 'bento-common/types';

const StepPrototypeTaggedElementEntryType = new GraphQLObjectType<
  {
    id: number;
  },
  GraphQLContext
>({
  name: 'StepPrototypeTaggedElementEntryType',
  fields: {
    taggedElement: {
      type: new GraphQLNonNull(StepPrototypeTaggedElementType),
      resolve: (input, _, { loaders }) =>
        loaders.stepPrototypeTaggedElementLoader.load(input.id),
    },
  },
});

const AllTaggedElementsOrderByType = enumToGraphqlEnum({
  name: 'AllTaggedElementsOrderBy',
  description: 'sort order for allTaggedElements connection',
  enumType: AllTaggedElementsOrderBy,
});

const allTaggedElements = (): GraphQLFieldConfig<unknown, GraphQLContext> => {
  const definition = connectionDefinitions({
    nodeType: StepPrototypeTaggedElementEntryType,
    connectionFields: {
      total: { type: GraphQLInt },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
    },
  });
  const { connectionType } = definition;
  return {
    deprecationReason: 'not used, likely to be removed',
    type: connectionType,
    args: {
      ...connectionArgs,
      orderBy: { type: AllTaggedElementsOrderByType },
      orderDirection: { type: OrderDirection },
    },
    resolve: async (_src, args, { organization }) => {
      const orderBy = AllTaggedElementsOrderBy[args.orderBy || 'step'];
      const orderDirection = args.orderDirection || 'asc';
      const { limit, offset } = sqlFromConnectionArgs(args);

      let orderClause = '';
      let orderJoin = '';
      switch (orderBy) {
        case AllTaggedElementsOrderBy.step:
          orderClause = 'lower(sp.name)';
          orderJoin = `
          LEFT JOIN core.step_prototypes sp ON sp.id = te.step_prototype_id
          JOIN core.templates t ON te.template_id = t.id
          `;
          break;
        case AllTaggedElementsOrderBy.template:
          orderClause = "lower(coalesce(nullif(t.name, ''), t.display_title))";
          orderJoin = `JOIN core.templates t on te.template_id = t.id`;
          break;
        case AllTaggedElementsOrderBy.url:
          orderClause = 'te.url';
          break;
        case AllTaggedElementsOrderBy.type:
          orderClause = 'te.type';
          break;
      }
      orderClause = `${orderClause} ${orderDirection}, te.id ${orderDirection}`;
      const rows = (await queryRunner({
        sql: `
            SELECT
                te.id
                , count(*) OVER() as full_count
            FROM core.step_prototype_tagged_elements te
            ${orderJoin}
            WHERE te.organization_id = :organizationId
            ORDER BY ${orderClause}
            LIMIT :limit
            OFFSET :offset
        `,
        replacements: {
          organizationId: organization.id,
          limit: limit || 20,
          offset: offset || 0,
        },
      })) as { id: number; full_count: number }[];
      return connectionFromSqlResult({ values: rows, source: null, args });
    },
  };
};

export default allTaggedElements;
