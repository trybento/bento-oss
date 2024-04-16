import { GraphQLEnumType, GraphQLEnumValueConfigMap } from 'graphql';
import { $enum } from 'ts-enum-util';

/** Turn a regular Enum to GraphQL type */
export const enumToGraphqlEnum = ({
  name,
  enumType,
  description = '',
}: {
  name: string;
  enumType: { [key: number]: string };
  description?: string;
}) => {
  const values = Object.fromEntries(
    $enum(enumType)
      .getValues()
      .map((value) => [value, { value }])
  );

  return new GraphQLEnumType({ name, description, values });
};

export const arrayToGraphqlEnum = <T extends string = string>({
  name,
  keys,
  description = '',
}: {
  name: string;
  keys: T[];
  description?: string;
}) => {
  const values = keys.reduce<GraphQLEnumValueConfigMap>((a, v) => {
    a[v] = {
      value: v,
    };
    return a;
  }, {});

  return new GraphQLEnumType({ name, description, values });
};
