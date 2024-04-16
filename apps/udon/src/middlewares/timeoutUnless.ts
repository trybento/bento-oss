import { NextFunction, Request, Response } from 'express';
import timeout from 'connect-timeout';
import { unless } from 'express-unless';

export default function timeoutUnless(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return timeout('30s')(req, res, next);
}

timeoutUnless.unless = unless;
