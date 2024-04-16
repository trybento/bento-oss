import { Request, Response } from 'express';
import BaseController from './BaseController';
import { StatusCodes } from 'http-status-codes';

export default class EventsController extends BaseController {
  constructor() {
    super('events');
  }

  validate = () => {};

  /** Post track event */
  track = async (req: Request, res: Response) => {
    res.status(StatusCodes.NOT_IMPLEMENTED).send({ message: 'Coming soon' });
  };
}
