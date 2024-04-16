import { v4 as uuidv4 } from 'uuid';

import { IntegrationType, WebhookType } from 'bento-common/types';
import {
  Webhook,
  WebhookState,
} from 'src/data/models/Integrations/Webhook.model';
import { IntegrationState } from 'bento-common/types/integrations';

import { Organization } from 'src/data/models/Organization.model';
import { User } from 'src/data/models/User.model';
import { EventHookType } from './webhook.types';
import { WebhookPayload } from 'src/interactions/webhooks/webhook.types';
import { Op } from 'sequelize';
import { randomInt } from 'src/utils/helpers';
import { getRedisClient } from 'src/utils/redis';
import { IntegrationApiKey } from 'src/data/models/IntegrationApiKey.model';
import { RedisConnections } from 'src/utils/redis/getRedisClient';

const redis = getRedisClient(RedisConnections.general);

type SetOneHookArgs = {
  organization: Organization;
  secretKey?: string;
  webhookUrl?: string;
  eventType: EventHookType;
  state?: WebhookState;
  user?: User;
  webhookType?: WebhookType;
};

export async function setHookForOrg({
  organization,
  secretKey,
  state = WebhookState.Active,
  eventType,
  webhookUrl,
  user,
  webhookType = WebhookType.standard,
}: SetOneHookArgs) {
  if (!eventType) throw new Error('Missing webhook params');

  if (!webhookUrl) {
    /* Support removing a hook if an empty URL is passed. */
    await Webhook.destroy({
      where: {
        organizationId: organization.id,
        eventType,
        webhookType,
        webhookUrl: {
          [Op.ne]: null,
        },
      },
    });
    return;
  }

  const [webhook, isNew] = await Webhook.findOrCreate({
    where: {
      organizationId: organization.id,
      eventType,
      webhookType,
    },
    defaults: {
      organizationId: organization.id,
      eventType,
      webhookType,
      state,
      secretKey,
      webhookUrl,
      createdByUserId: user?.id,
      updatedByUserId: user?.id,
    },
  });

  if (!isNew)
    await webhook.update({
      organizationId: organization.id,
      eventType,
      state,
      secretKey,
      webhookUrl,
      updatedByUserId: user?.id,
    });

  void invalidateHookListenersCache(organization.id);

  return webhook;
}

/**
 * Returns a fake webhook payload for testing purposes.
 */
export const getSampleWebhookPayload = (
  eventType: EventHookType
): WebhookPayload => {
  const basePayload = {
    eventType,
    userId: uuidv4(),
    userEmail: `bentobot-${randomInt(1, 1000)}@trybento.co`,
    accountName: 'AcmeCo.',
    accountId: '30d652c8-ceef-46d6-b85b-dd2d7d0d70e2',
  } as any;

  switch (eventType) {
    case EventHookType.Ping:
      return {
        ...basePayload,
        data: {
          message: 'Hello!',
        },
      };
    case EventHookType.GuideViewed:
    case EventHookType.GuideCompleted:
      return {
        ...basePayload,
        data: {
          guideEntityId: '4e071d6f-6f17-40e4-a8cb-73ecb1b3xxxx',
          guideName: 'Sample guide',
        },
      };
    case EventHookType.StepCompleted:
    case EventHookType.StepViewed:
      return {
        ...basePayload,
        data: {
          guideEntityId: '4e071d6f-6f17-40e4-a8cb-73ecb1b3xxxx',
          guideName: 'Sample guide',
          stepEntityId: '4e071d6f-6f17-40e4-a8cb-73ecb1b3yyyy',
          stepName: 'Sample step',
          ...(eventType === EventHookType.StepCompleted
            ? {
                inputAnswers: [
                  { label: 'Enter input here', value: 'Sample value' },
                ],
                branchingChoices: {
                  question: 'Sample question',
                  choice: 'Selected choice',
                },
              }
            : {}),
        },
      };
    default:
      throw new Error(`Unsupported sample event type ${eventType}`);
  }
};

const getActiveHooksCacheKey = (orgId: number) => `${orgId}-has-hooks`;

/**
 * Do not keep cache for over half a day, in case
 *   This is our fallback in case invalidation is missed
 */
const ACTIVE_HOOKS_TTL = 12 * 60 * 60;

/**
 * We only need to call the job if the org requested outgoing data
 *   As of Apr '23 this includes webhooks.
 *
 * @todo Ideally this can check per event/integration and punt on even more cases
 *   In the future I would imagine it storing more detailed data than T/F
 */
export const hasActiveHookListeners = async (
  organizationId: number
): Promise<boolean> => {
  const cacheKey = getActiveHooksCacheKey(organizationId);
  const cached = await redis.get(cacheKey);

  if (cached) return cached === 'true';

  const hasActiveHookListeners =
    (await Webhook.count({
      where: {
        organizationId,
        state: WebhookState.Active,
      },
    })) > 0;

  await redis.set(
    cacheKey,
    String(hasActiveHookListeners),
    'EX',
    ACTIVE_HOOKS_TTL
  );

  return hasActiveHookListeners;
};

export const invalidateHookListenersCache = async (organizationId: number) => {
  await redis.del(getActiveHooksCacheKey(organizationId));
};
