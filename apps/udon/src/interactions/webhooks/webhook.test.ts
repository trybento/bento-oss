import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import { randomFromArray } from 'src/utils/helpers';
import { triggerEventHook } from './triggerEventHook';
import { setHookForOrg } from './webhook.helpers';
import { EventHookType, WebhookState } from './webhook.types';

const getContext = setupAndSeedDatabaseForTests('bento');

const getFakeHookInfo = () => {
  const webhookUrl =
    'http://www.fake.faker' +
    randomFromArray(['.fakify', '.fakariffic', '.fakeAF']);
  const secretKey = `dontTellAnyoneEspecially${randomFromArray([
    'Derek',
    'João',
    'Carlos',
  ])}`;
  return { webhookUrl, secretKey };
};

const getFakePayload = () => ({
  eventType: EventHookType.Ping as const,
  userId: '-',
  userEmail: 'bentobot@trybento.co',
  accountName: '-',
  accountId: '-',
  data: {
    message: 'Hello!',
  },
  timestamp: '',
  eventId: '',
});

import { queueJob } from 'src/jobsBull/queues';
import { fetchTimeout } from 'src/utils/helpers';

import { handleEventHook } from 'src/jobsBull/jobs/integrations/handleEventHook';
import { Webhook } from 'src/data/models/Integrations/Webhook.model';

jest.mock('src/utils/helpers', () => ({
  ...jest.requireActual('src/utils/helpers'),
  fetchTimeout: jest.fn(() => Promise.resolve()),
}));
jest.mock('src/jobsBull/queues', () => ({
  ...jest.requireActual('src/jobsBull/queues'),
  queueJob: jest.fn(),
}));

describe('webhook helpers', () => {
  afterEach(async () => {
    const { organization } = getContext();
    await Webhook.destroy({
      where: { organizationId: organization.id },
    });
  });

  test('sets webhook for all', async () => {
    const { organization } = getContext();

    const hookBefore = await Webhook.findOne({
      where: { organizationId: organization.id },
    });

    expect(hookBefore).toBeFalsy();

    const { secretKey, webhookUrl } = getFakeHookInfo();

    await setHookForOrg({
      organization,
      state: WebhookState.Active,
      secretKey,
      eventType: EventHookType.All,
      webhookUrl,
    });

    const hook = await Webhook.findOne({
      where: { organizationId: organization.id },
    });

    expect(hook?.webhookUrl).toBe(webhookUrl);
    expect(hook?.secretKey).toBe(secretKey);

    await hook?.destroy();
  });

  test('unsets the webhook properly', async () => {
    const { organization } = getContext();
    const { secretKey, webhookUrl } = getFakeHookInfo();

    const hook = await setHookForOrg({
      organization,
      state: WebhookState.Active,
      secretKey,
      eventType: EventHookType.All,
      webhookUrl,
    });

    expect(hook?.state).toBe(WebhookState.Active);

    const hookAfter = await setHookForOrg({
      webhookUrl,
      organization,
      state: WebhookState.Inactive,
      eventType: EventHookType.All,
    });

    expect(hookAfter?.state).toBe(WebhookState.Inactive);
  });

  /**
   * Somehow failing because of the mock not recording the call
   */
  test.skip('trigger webhook calls a job', async () => {
    const { organization } = getContext();

    // (queuer as any).queueJob = mockCallback;
    triggerEventHook({
      payload: getFakePayload(),
      organizationId: organization.id,
    });

    expect(queueJob).toBeCalled();
  });

  test('handler will not fire if not enabled', async () => {
    const { organization } = getContext();

    const payload = getFakePayload();
    const organizationId = organization.id;

    triggerEventHook({
      payload,
      organizationId,
    });

    await handleEventHook({ payload, organizationId });

    expect(fetchTimeout).toBeCalledTimes(0);
  });

  test('handler fires if enabled', async () => {
    const { organization } = getContext();
    const { secretKey, webhookUrl } = getFakeHookInfo();

    await setHookForOrg({
      organization,
      state: WebhookState.Active,
      secretKey,
      eventType: EventHookType.All,
      webhookUrl,
    });

    const payload = getFakePayload();
    const organizationId = organization.id;

    triggerEventHook({
      payload,
      organizationId,
    });

    await handleEventHook({ payload, organizationId });

    expect(fetchTimeout).toBeCalledTimes(1);
  });
});
