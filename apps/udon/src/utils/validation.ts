import { GraphQLError } from 'graphql';
import { assert, Struct, StructError } from 'superstruct';

/**
 * Wraps `assert` from `superstruct` in a try/catch block and automatically
 * transforms any StructErrors into GraphqlErrors that can be immediately returned to the
 * end-user to explain what went wrong.
 *
 * NOTE: This is intended to be used only within the GQL context.
 *
 * @todo extend graphql error with additional details (i.e. path)
 */
export function assertWithGraphqlError<T, S>(
  value: unknown,
  struct: Struct<T, S>
): asserts value is T {
  try {
    assert(value, struct);
  } catch (innerError) {
    if (innerError instanceof StructError) {
      throw new GraphQLError(innerError.message);
    }
    throw innerError;
  }
}
