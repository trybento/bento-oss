import {
  GraphQLFieldConfigMap,
  GraphQLInputFieldConfigMap,
  Thunk,
} from 'graphql';

export type InputFieldConfigMap = GraphQLInputFieldConfigMap;

export type FieldConfigMap<TSource, TContext> = Thunk<
  GraphQLFieldConfigMap<TSource, TContext>
>;
