import { Router, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const router = Router();

router.get('/health', (_req, res: Response) => {
  res.status(StatusCodes.OK).end();
});

export default router;
