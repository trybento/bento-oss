import { NextFunction, Request, Response } from 'express';
import {
  BENTO_INIT_ID_HEADER,
  genTraceId,
  REQUEST_ID_HEADER,
} from 'bento-common/utils/trace';

export interface IdentifiableRequest {
  id: string;
}

export interface RequestWithId extends Request, IdentifiableRequest {}

const requestId = (req: Request, res: Response, next: NextFunction) => {
  const reqId = req.get(REQUEST_ID_HEADER) || genTraceId();
  res.set(REQUEST_ID_HEADER, reqId);

  req['id'] = reqId;
  next();
};

export const getRequestId = (req: Request | RequestWithId) => {
  return req['id'];
};

export const getBentoInitId = (req: Request | RequestWithId) => {
  const initId = req.headers?.[BENTO_INIT_ID_HEADER];
  if (initId && Array.isArray(initId)) {
    return initId[0];
  }
  return initId;
};

export default requestId;
