import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import InvalidPayloadError from 'src/errors/InvalidPayloadError';
import InvalidRequestError from 'src/errors/InvalidRequest';

/**
 * Base API handler to provide defaults and expected methods
 */
export default class BaseController {
  /** Supplements error message */
  public routeName = 'this route';

  /** Fallback if we didn't implement a method yet */
  throwUnsupportedMethod = (method: string) => {
    throw new InvalidRequestError(
      `Method ${method} is not supported on ${this.routeName}`
    );
  };

  throwInvalidParams = (message: string) => {
    throw new InvalidPayloadError(message);
  };

  /** Set appropriate headers and status code for success response */
  sendSuccessResponse = (
    res: Response,
    data: { message?: string; data?: any }
  ) => {
    if (!data.message) data.message = 'OK';

    res.status(StatusCodes.OK).json(data);
  };

  constructor(routeName = 'this route') {
    this.routeName = routeName;
  }

  get = async (_req: Request, _res: Response) => {
    this.throwUnsupportedMethod('get');
  };

  post = async (_req: Request, _res: Response) => {
    this.throwUnsupportedMethod('post');
  };

  delete = async (_req: Request, _res: Response) => {
    this.throwUnsupportedMethod('delete');
  };

  put = async (_req: Request, _res: Response) => {
    this.throwUnsupportedMethod('put');
  };

  list = async (_req: Request, _res: Response) => {
    this.throwUnsupportedMethod('list');
  };
}
