import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { WebhookType } from 'bento-common/types';
import {
  getSampleWebhookPayload,
  setHookForOrg,
} from 'src/interactions/webhooks/webhook.helpers';
import {
  EventHookType,
  WebhookState,
} from 'src/interactions/webhooks/webhook.types';
import {
  ApiAuthenticatedRequest,
  getAuthenticatedOrgFromReq,
} from '../api.helpers';
import BaseController from './BaseController';
import { Webhook } from 'src/data/models/Integrations/Webhook.model';
import InvalidPayloadError from 'src/errors/InvalidPayloadError';

type HookOperationParams = {
  type: EventHookType;
  secretKey?: string;
  hookUrl: string;
  webhookType: WebhookType;
};

export const SUPPORTED_HOOK_TYPES = Object.values(EventHookType).filter(
  (t) => t !== EventHookType.All && t !== EventHookType.Ping
);

export default class HooksController extends BaseController {
  constructor() {
    super('hooks');
  }

  validate = (body: HookOperationParams) => {
    const { type, hookUrl, webhookType } = body;

    if (!type || !hookUrl) return 'Hooks require a type and hookUrl';

    if (!SUPPORTED_HOOK_TYPES.includes(type))
      return `type needs to be one of the following: ${SUPPORTED_HOOK_TYPES.join(
        ', '
      )}`;

    if (!webhookType || !Object.values(WebhookType).includes(webhookType))
      return;
    `webhookType needs to be one of the following: ${Object.values(
      WebhookType
    ).join(', ')}`;
  };

  post = async (
    req: Request<
      ParamsDictionary,
      any,
      HookOperationParams,
      ParsedQs,
      Record<string, any>
    >,
    res: Response<any, Record<string, any>>
  ) => {
    const organization = getAuthenticatedOrgFromReq(req);
    const { type, hookUrl, secretKey, webhookType } = req.body;

    const error = this.validate(req.body);
    if (error) this.throwInvalidParams(error);

    await setHookForOrg({
      organization,
      state: WebhookState.Active,
      eventType: type,
      webhookUrl: hookUrl,
      webhookType,
      secretKey,
    });

    this.sendSuccessResponse(res, {
      message: 'OK',
    });
  };

  delete = async (
    req: Request<
      ParamsDictionary,
      any,
      HookOperationParams,
      ParsedQs,
      Record<string, any>
    >,
    res: Response<any, Record<string, any>>
  ) => {
    const organization = getAuthenticatedOrgFromReq(req);
    const { type, hookUrl, webhookType } = req.body;

    const error = this.validate(req.body);
    if (error) this.throwInvalidParams(error);

    const hook = await Webhook.findOne({
      where: {
        organizationId: organization.id,
        webhookUrl: hookUrl,
        eventType: type,
        webhookType,
      },
    });

    if (hook) await hook.destroy();

    this.sendSuccessResponse(res, {
      message: 'OK',
    });
  };

  getSampleList = (req: Request, res: Response) => {
    const _req = req as ApiAuthenticatedRequest;
    const { type } = _req.query;

    if (!type) throw new InvalidPayloadError('Must provide an event hook type');
    if (!SUPPORTED_HOOK_TYPES.includes(type as EventHookType))
      throw new InvalidPayloadError(`Type ${type} not supported.`);

    const samples = [...new Array(4)].map((_) => {
      return getSampleWebhookPayload(type as EventHookType);
    });

    this.sendSuccessResponse(res, { data: samples });
  };
}
