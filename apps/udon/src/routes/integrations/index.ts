import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AsyncReturnType, Events, ReturnPromiseType } from 'bento-common/types';
import { GptGuideRequest } from 'bento-common/types/integrations';

import passport from 'src/middlewares/passport';
import gptConcise from 'src/interactions/gpt/gptconcise';
import { handleGptError, withGptHelpers } from './integrationsRoute.helpers';
import gptGenerateGuide from 'src/interactions/gpt/gptGenerateGuide';
import detachPromise from 'src/utils/detachPromise';
import { Template } from 'src/data/models/Template.model';
import withPerfTimer from 'src/utils/perfTimer';
import { analytics } from 'src/interactions/analytics/analytics';
import targetingGpt, {
  applyAttributeTypes,
} from 'src/interactions/gpt/gptTargeting';
import GptNoOutputError from 'src/errors/GptNoOutput';

const router = Router();

router.post(
  '/targeting-gpt',
  passport.authenticate(['jwt'], { session: false }),
  async (req: Request, res: Response) =>
    withGptHelpers(req, res, async (authRequest) => {
      const organization = authRequest.user?.organization;

      const { prompt, templateEntityId, requestId } = req.body || {};

      let gptOutput: AsyncReturnType<typeof targetingGpt> | null = null;

      await withPerfTimer(
        'targeting-gpt',
        async () => {
          try {
            gptOutput = await targetingGpt({
              prompt,
              organization,
            });

            if (!gptOutput.output) throw new GptNoOutputError();

            await applyAttributeTypes(gptOutput.output, organization);
          } catch (e) {
            return handleGptError(res, e);
          }

          res.status(StatusCodes.OK).send({ gptOutput: gptOutput.output });
        },
        (time) =>
          detachPromise(async () => {
            await analytics.newEvent(Events.gptEvent, {
              event: 'Targeting GPT',
              subEvent: 'Request',
              requestUser: authRequest.user.user.email,
              organizationEntityId: organization.entityId,
              userEntityId: authRequest.user.user.entityId,
              generateTime: time,
              requestId,
              payload: {
                templateEntityId,
                prompt,
                gptOutput: gptOutput?.output ?? 'Errored',
                ...(gptOutput?.eventContext ? gptOutput.eventContext : {}),
              },
            });
          })
      );
    })
);

router.post(
  '/step-gpt',
  passport.authenticate(['jwt'], { session: false }),
  async (req: Request, res: Response) =>
    withGptHelpers(req, res, async (authRequest) => {
      const organization = authRequest.user.organization;

      const { text } = req.body || {};
      // Suspend processing if no content was received.
      if (!text) {
        res.status(StatusCodes.OK).send({ choices: [] });
        return;
      }

      try {
        const choices = await gptConcise(text);

        await analytics.newEvent(Events.gptEvent, {
          event: 'Snazzy GPT',
          numChoice: choices?.length ?? 0,
          requestUser: authRequest.user.user.email,
          organizationEntityId: organization.entityId,
          userEntityId: authRequest.user.user.entityId,
        });

        if (!choices) throw new GptNoOutputError();

        res.status(StatusCodes.OK).send({ choices });
      } catch (e) {
        handleGptError(res, e);
      }
    })
);

router.post(
  '/guide-gpt',
  passport.authenticate(['jwt'], { session: false }),
  async (req: Request, res: Response) =>
    withGptHelpers(req, res, async (authRequest) => {
      const {
        transcript,
        templateEntityId,
        links,
        articleText,
        pageText,
        method,
      } = (req.body as GptGuideRequest) || {};
      // Suspend processing if no content was received.
      if (!transcript && !links && !articleText)
        return res.status(StatusCodes.OK).send({ choices: [] });

      let choices: AsyncReturnType<typeof gptGenerateGuide> | null = null;

      await withPerfTimer(
        'guide-gpt',
        async () => {
          try {
            choices = await gptGenerateGuide({
              transcript,
              links,
              articleText,
              pageText,
              method,
            });

            if (
              !choices ||
              !(choices as ReturnPromiseType<typeof gptGenerateGuide>).length
            )
              throw new GptNoOutputError();

            res.status(StatusCodes.OK).send({ choices });
          } catch (e: any) {
            handleGptError(res, e);
          }
        },
        (time: number) => {
          detachPromise(async () => {
            const template = await Template.findOne({
              where: { entityId: templateEntityId },
              attributes: ['id'],
            });
            if (!template) return;

            await analytics.newEvent(Events.gptEvent, {
              event: 'Generate request',
              templateId: template.id,
              numChoice: choices?.length ?? 0,
              generateTime: time,
              transcriptLength: transcript?.length ?? 0,
              method: articleText
                ? 'articleText'
                : transcript
                ? 'transcript'
                : pageText
                ? 'autoflow'
                : 'link',
              requestUser: authRequest.user.user.email,
              organizationEntityId: authRequest.user.organization.entityId,
              userEntityId: authRequest.user.user.entityId,
            });
          }, 'log gpt usage');
        }
      );
    })
);

export default router;
