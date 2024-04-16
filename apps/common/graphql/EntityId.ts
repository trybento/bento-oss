import { GraphQLError, GraphQLNonNull, GraphQLScalarType, Kind } from 'graphql';
import { InputFieldConfigMap } from '../types/graphql';

export const UUID_REGEX_STR =
  '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
export const UUID_REGEX = new RegExp(UUID_REGEX_STR);

const validate = (value: any) => {
  if (typeof value !== 'string') {
    throw new TypeError(`Value is not string`);
  }

  const _value =
    value && value !== 'undefined' && value !== 'null' ? value : '';

  if (_value && !UUID_REGEX.test(_value)) {
    throw new TypeError(`Value is not a valid UUID: ${_value}`);
  }

  return _value;
};

export const validateEntityId = validate;

export const entityIdField = (): InputFieldConfigMap => ({
  entityId: {
    type: new GraphQLNonNull(EntityIdType),
  },
});

const EntityIdType = new GraphQLScalarType({
  name: `EntityId`,
  description: 'A unique identifier for a particular database entity.',
  serialize(value) {
    return validate(value);
  },
  parseValue(value) {
    return validate(value);
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(
        `Can only validate strings as EntityId's but got a: ${ast.kind}`
      );
    }

    return validate(ast.value);
  },
});

export default EntityIdType;
