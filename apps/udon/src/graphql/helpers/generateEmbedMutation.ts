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
  InputFieldConfigMap,
  FieldConfigMap,
} from 'bento-common/types/graphql';

import { EmbedContext } from '../types';

interface MutationConfig<
  TContext = EmbedContext,
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

export default function generateEmbedMutation<
  TSource = unknown,
  TArgs = { [argName: string]: any }
>(
  config: MutationConfig<EmbedContext, TArgs>
): GraphQLFieldConfig<TSource, EmbedContext, any> {
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
    errors: {
      type: new GraphQLList(new GraphQLNonNull(GraphQLString)),
    },
  };
  const outputType = new GraphQLObjectType<unknown, EmbedContext>({
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
    resolve: async (_source, args, context, info): Promise<MutationPayload> => {
      const finish = (payload: MutationPayload) => {
        const finishedPayload: {
          [payloadObject: string]: any;
          errors?: string[];
        } = { ...payload };

        if (finishedPayload.errors == null) {
          finishedPayload.errors = [];
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
  thingOrThunk: InputFieldConfigMap | FieldConfigMap<any, EmbedContext>
) {
  return typeof thingOrThunk === 'function' ? thingOrThunk() : thingOrThunk;
}
