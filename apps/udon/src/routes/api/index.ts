import { Router, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';

import { ApiAuthenticatedRequest, apiTokenMiddleware } from './api.helpers';

import HooksRouter from './paths/hooks.api';
import EventsRouter from './paths/events.api';

const router = Router();

router.use('/v1/hooks', HooksRouter);
router.use('/v1/events', EventsRouter);

/**
 * Test API endpoint to verify tokens. Gets authenticated org.
 *
 * Exists outside of any module/vers because it's generic
 */
router.get('/me', apiTokenMiddleware, async (req: Request, res: Response) => {
  const { user: bentoApiKey } = req as ApiAuthenticatedRequest;

  const { slug, name, entityId: appId } = bentoApiKey.organization;
  res.status(StatusCodes.OK).send({ slug, name, appId });
});

export default router;
