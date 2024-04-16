import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import {
  getDummyAccount,
  getDummyAccountUser,
} from 'src/testUtils/dummyDataHelpers';
import { Organization } from 'src/data/models/Organization.model';
import { setHookForOrg } from 'src/interactions/webhooks/webhook.helpers';
import {
  EventHookType,
  WebhookState,
} from 'src/interactions/webhooks/webhook.types';

import * as utils from 'src/utils/helpers';
import * as queuer from 'src/jobsBull/queues';

import {
  EventHookDestination,
  EventHookJobPayload,
  runEventHookHandlers,
} from './integrations.helpers';
import { Webhook } from 'src/data/models/Integrations/Webhook.model';
import { WebhookType } from 'bento-common/types';

const getContext = setupAndSeedDatabaseForTests('paydayio');

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock('src/utils/helpers', () => ({
  ...jest.requireActual('src/utils/helpers'),
  fetchTimeout: jest.fn(),
}));

const getMockPayload = (
  organization: Organization,
  custom?: Partial<EventHookJobPayload>
): EventHookJobPayload => {
  const dummyAccount = { ...getDummyAccount(organization), id: 1 };
  const dummyUser = getDummyAccountUser(organization, dummyAccount);

  return {
    payload: {
      eventId: 'putYourUuidHere',
      timestamp: 'NowLol',
      eventType: EventHookType.Ping,
      accountId: dummyAccount.externalId,
      userId: dummyUser.externalId,
      accountName: dummyAccount.name,
      userEmail: dummyUser.email,
      data: {},
    },
    organizationId: organization.id,
    ...(custom || {}),
  };
};

describe('event hooks', () => {
  /* By default, nothing should be enabled. */
  test('does not act if no integrations', async () => {
    const { organization } = getContext();

    const spied = jest.spyOn(utils, 'fetchTimeout');

    const payload = getMockPayload(organization);

    await runEventHookHandlers({
      type: EventHookDestination.webhook,
      payload,
    });

    expect(spied).toBeCalledTimes(0);
  });

  test('fires if integrated', async () => {
    const { organization } = getContext();

    const spied = jest.spyOn(utils, 'fetchTimeout');

    const payload = getMockPayload(organization);

    await setHookForOrg({
      organization,
      eventType: EventHookType.All,
      webhookUrl: 'https://curesocialanxiety.nope',
    });

    await runEventHookHandlers({
      type: EventHookDestination.webhook,
      payload,
    });

    expect(spied).toBeCalledTimes(1);
  });

  test('requeue if fail', async () => {
    const { organization } = getContext();

    jest.resetAllMocks();

    jest.spyOn(utils, 'fetchTimeout').mockImplementationOnce(() => {
      throw new Error('aha');
    });

    const spied = jest.spyOn(queuer, 'queueJob');

    const payload = getMockPayload(organization, { customTimeout: 10 });

    await setHookForOrg({
      organization,
      eventType: EventHookType.All,
      webhookUrl: 'https://curesocialanxiety.nope',
    });

    await runEventHookHandlers({
      type: EventHookDestination.webhook,
      payload,
    });

    expect(spied).toBeCalledTimes(1);
  });

  test('disables integration if max fails reached', async () => {
    const { organization } = getContext();

    jest.resetAllMocks();

    jest.spyOn(utils, 'fetchTimeout').mockImplementationOnce(() => {
      throw new Error('aha');
    });

    const payload = getMockPayload(organization, {
      retryInfo: {
        type: EventHookDestination.webhook,
        times: 1000,
      },
    });

    await setHookForOrg({
      organization,
      eventType: EventHookType.All,
      webhookUrl: 'https://braziliananimalidioms.nope',
    });

    await runEventHookHandlers({
      type: EventHookDestination.webhook,
      payload,
    });

    const integration = await Webhook.findOne({
      where: {
        organizationId: organization.id,
        webhookType: WebhookType.standard,
      },
      attributes: ['id', 'state'],
    });

    expect(integration?.state).toEqual(WebhookState.Inactive);
  });
});
