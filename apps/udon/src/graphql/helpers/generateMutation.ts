import {
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLResolveInfo,
  GraphQLString,
} from 'graphql';

import {
  FieldConfigMap,
  InputFieldConfigMap,
} from 'bento-common/types/graphql';

import OrganizationType from 'src/graphql/Organization/Organization.graphql';
import { GraphQLContext } from 'src/graphql/types';

interface MutationConfig<
  TContext = GraphQLContext,
  TArgs = { [argName: string]: any }
> {
  name: string;
  description?: string;
  deprecationReason?: string;
  inputFields: InputFieldConfigMap;
  outputFields: FieldConfigMap<unknown, TContext>;
  mutateAndGetPayload: (
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo
  ) => any;
}

type MutationPayload = {
  [payloadObject: string]: any;
  errors?: string[];
};

export default function generateMutation<
  TSource = unknown,
  TArgs = { [argName: string]: any }
>(
  config: MutationConfig<GraphQLContext, TArgs>
): GraphQLFieldConfig<TSource, GraphQLContext, any> {
  const {
    name,
    description,
    deprecationReason,
    inputFields,
    outputFields,
    mutateAndGetPayload,
  } = config;

  const inputType = new GraphQLInputObjectType({
    name: `${name}Input`,
    fields: {
      ...inputFields,
    },
  });

  const augmentedOutputFields = {
    ...resolveMaybeThunk(outputFields),
    organization: {
      type: OrganizationType,
    },
    errors: {
      type: new GraphQLList(new GraphQLNonNull(GraphQLString)),
    },
  };

  const outputType = new GraphQLObjectType<unknown, GraphQLContext>({
    name: `${name}Payload`,
    fields: augmentedOutputFields,
  });

  return {
    type: outputType,
    description,
    deprecationReason,
    args: {
      input: {
        type: new GraphQLNonNull(inputType),
      },
    },
    resolve: async (
      _source: unknown,
      args,
      context,
      info
    ): Promise<MutationPayload> => {
      const { organization } = context;

      const finish = (payload: MutationPayload) => {
        const finishedPayload: {
          [payloadObject: string]: any;
          errors?: string[];
        } = { ...payload };

        if (finishedPayload.errors == null) {
          finishedPayload.errors = [];
        }

        if (finishedPayload.organization == null) {
          finishedPayload.organization = organization;
        }

        return finishedPayload;
      };

      return Promise.resolve(
        mutateAndGetPayload(args.input, context, info)
      ).then(finish);
    },
  };
}

function resolveMaybeThunk(
  thingOrThunk: InputFieldConfigMap | FieldConfigMap<any, GraphQLContext>
) {
  return typeof thingOrThunk === 'function' ? thingOrThunk() : thingOrThunk;
}
