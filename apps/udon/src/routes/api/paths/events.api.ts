import { Router } from 'express';
import { defaultRoutesFactory, apiTokenMiddleware } from '../api.helpers';
import EventsController from '../controllers/Events.controller';

const router = Router();
const controller = new EventsController();

defaultRoutesFactory({ controller, router });

/** For getting sample data of a specified event type */
router.post('/track', apiTokenMiddleware, controller.track);

export default router;
