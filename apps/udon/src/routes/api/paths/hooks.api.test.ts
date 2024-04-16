import request from 'supertest';
import { StatusCodes } from 'http-status-codes';

import { setupAndSeedDatabaseForTests } from 'src/data/datatests';

import server from 'src/server';
import {
  BentoApiKeyType,
  SegmentApiKey,
} from 'src/data/models/SegmentApiKey.model';
import { handleBase64String, randomInt } from 'src/utils/helpers';
import { EventHookType } from 'src/interactions/webhooks/webhook.types';
import { WebhookType } from 'bento-common/types';
import {
  Webhook,
  WebhookState,
} from 'src/data/models/Integrations/Webhook.model';
import { Organization } from 'src/data/models/Organization.model';

const getContext = setupAndSeedDatabaseForTests('bento');

describe('hooks api', () => {
  let authHeader = '';
  let org: Organization;

  beforeEach(async () => {
    const { organization } = getContext();

    const createdKey = await SegmentApiKey.create({
      organizationId: organization.id,
      type: BentoApiKeyType.api,
    });

    org = organization;
    authHeader = `Bearer ${handleBase64String(createdKey.key)}`;
  });

  test('sample list throws error when missing list type', async () => {
    const res = await request(server)
      .get('/api/v1/hooks/sampleList')
      .set('Authorization', authHeader)
      .send('');

    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test('gets sample list', async () => {
    const res = await request(server)
      .get(`/api/v1/hooks/sampleList?type=${EventHookType.GuideViewed}`)
      .set('Authorization', authHeader)
      .send('');

    expect(Array.isArray(res.body.data)).toBeTruthy();
  });

  test('can set up a new hook', async () => {
    const hookTypes = [
      EventHookType.GuideViewed,
      EventHookType.GuideCompleted,
      EventHookType.StepCompleted,
    ];

    for (const type of hookTypes) {
      const hookUrl = 'http://dummy.dumdum.co';
      const res = await request(server)
        .post('/api/v1/hooks')
        .set('Authorization', authHeader)
        .send({
          type,
          hookUrl,
          webhookType: WebhookType.standard,
        });

      expect(res.status).toBe(StatusCodes.OK);

      const newHook = await Webhook.findOne({
        where: {
          webhookUrl: hookUrl,
          organizationId: org.id,
          eventType: type,
        },
      });

      expect(newHook).toBeTruthy();
    }

    await Webhook.destroy({
      where: {
        organizationId: org.id,
      },
    });
  });

  test('rejects setting up ping hooks', async () => {
    const noUrlRes = await request(server)
      .post('/api/v1/hooks')
      .set('Authorization', authHeader)
      .send({
        hookUrl: 'http://the.carlos.mx',
        type: EventHookType.Ping,
        webhookType: WebhookType.standard,
      });

    expect(noUrlRes.status).toEqual(StatusCodes.BAD_REQUEST);
  });

  test('validates hook data', async () => {
    const noUrlRes = await request(server)
      .post('/api/v1/hooks')
      .set('Authorization', authHeader)
      .send({
        type: EventHookType.GuideViewed,
        webhookType: WebhookType.standard,
      });

    expect(noUrlRes.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(noUrlRes.body?.error).toBeTruthy();
    expect((noUrlRes.body?.error as string).includes('hookUrl')).toBeTruthy();

    const noHooktypeRes = await request(server)
      .post('/api/v1/hooks')
      .set('Authorization', authHeader)
      .send({
        hookUrl: 'http://partypeople.andy.ch',
        webhookType: WebhookType.standard,
      });

    expect(noHooktypeRes.status).toEqual(StatusCodes.BAD_REQUEST);
    expect((noUrlRes.body?.error as string).includes('type')).toBeTruthy();
  });

  test('removes hooks', async () => {
    const hookUrl = `http://dummy.jo.wow/${randomInt(1, 1000)}`;

    const hook = await Webhook.create({
      eventType: EventHookType.GuideCompleted,
      webhookUrl: hookUrl,
      state: WebhookState.Active,
      webhookType: WebhookType.standard,
      organizationId: org.id,
    });

    expect(hook).toBeTruthy();

    const res = await request(server)
      .delete('/api/v1/hooks')
      .set('Authorization', authHeader)
      .send({
        type: EventHookType.GuideCompleted,
        hookUrl,
        webhookType: WebhookType.standard,
      });

    expect(res.status).toBe(StatusCodes.OK);

    const findHook = await Webhook.findOne({
      where: {
        organizationId: org.id,
        webhookUrl: hookUrl,
      },
    });

    expect(findHook).toBeFalsy();
  });
});
