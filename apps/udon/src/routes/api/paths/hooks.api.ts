import { Router } from 'express';
import { defaultRoutesFactory, apiTokenMiddleware } from '../api.helpers';
import HooksController from '../controllers/Hooks.controller';

const router = Router();
const controller = new HooksController();

defaultRoutesFactory({ controller, router });

/** For getting sample data of a specified event type */
router.get('/sampleList', apiTokenMiddleware, controller.getSampleList);

export default router;
