import { RequestHandler } from 'express';
import InvalidPayloadError from 'src/errors/InvalidPayloadError';
import { Struct, assert, StructError } from 'superstruct';

export const validate: <TParams, TBody, TQuery>(params: {
  params?: Struct<TParams>;
  body?: Struct<TBody>;
  query?: Struct<TQuery>;
}) => RequestHandler<TParams, unknown, TBody, TQuery> =
  ({ body, params, query }) =>
  (req, _, next) => {
    try {
      if (body) {
        assert(req.body, body);
      }

      if (params) {
        assert(req.params, params);
      }

      if (query) {
        assert(req.query, query);
      }

      next();
    } catch (error) {
      if (error instanceof StructError) {
        next(new InvalidPayloadError(error.message));
      } else {
        next(error);
      }
    }
  };
