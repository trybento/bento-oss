import request from 'supertest';
import { StatusCodes } from 'http-status-codes';

import { setupAndSeedDatabaseForTests } from 'src/data/datatests';

import server from 'src/server';
import {
  BentoApiKeyType,
  SegmentApiKey,
} from 'src/data/models/SegmentApiKey.model';
import { handleBase64String } from 'src/utils/helpers';

const getContext = setupAndSeedDatabaseForTests('bento');

describe('/me', () => {
  test('fails if no auth', async () => {
    const res = await request(server).get('/api/me').send('');

    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
  });

  test('fails if bad auth', async () => {
    const res = await request(server)
      .get('/api/me')
      .set('Authorization', 'Bearer booboofoo')
      .send('');

    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
  });

  test('passes with proper key', async () => {
    const { organization } = getContext();

    const createdKey = await SegmentApiKey.create({
      organizationId: organization.id,
      type: BentoApiKeyType.api,
    });

    const encodedKey = handleBase64String(createdKey.key);

    const res = await request(server)
      .get('/api/me')
      .set('Authorization', `Bearer ${encodedKey}`)
      .send('');

    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body?.appId).toEqual(organization.entityId);
  });
});

/* Routes that we have imported and added to the router */
const SUPPORTED_ROUTES = ['hooks'];

describe('routes', () => {
  let authHeader = '';

  beforeEach(async () => {
    const { organization } = getContext();

    const createdKey = await SegmentApiKey.create({
      organizationId: organization.id,
      type: BentoApiKeyType.api,
    });

    authHeader = `Bearer ${handleBase64String(createdKey.key)}`;
  });

  test('handles supported routes', async () => {
    for (const route of SUPPORTED_ROUTES) {
      const res = await request(server)
        .get(`/api/v1/${route}`)
        .set('Authorization', authHeader)
        .send('');

      /* Either supported or indicates not yet implemented */
      expect(res.status).not.toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.status).not.toBe(StatusCodes.NOT_FOUND);
    }
  });

  test('api routes also handle auth', async () => {
    const route = SUPPORTED_ROUTES[0];

    const res = await request(server).get(`/api/v1/${route}`).send('');

    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
  });
});
