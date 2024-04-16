import request from 'supertest';
import { faker } from '@faker-js/faker';
import { omit } from 'lodash';

import { setupAndSeedDatabaseForTests } from 'src/data/datatests';

import { queueJob } from 'src/jobsBull/queues';
import server from 'src/server';
import { BENTO_DOMAIN } from 'shared/constants';
import { JobType } from 'src/jobsBull/job';

setupAndSeedDatabaseForTests('bento');

function getDummySignupData(forcedDomain?: string) {
  const name = [faker.person.firstName(), faker.person.lastName()];
  const domain = forcedDomain || faker.internet.domainName();
  return {
    email: faker.internet.email({
      firstName: name[0],
      lastName: name[1],
      provider: domain,
    }),
    password: faker.internet.password(),
    orgName: faker.company.name(),
    fullName: name.join(' '),
  };
}

describe('/auth/email/signup', () => {
  test('happy path', async () => {
    const signupData = getDummySignupData();
    const response = await request(server)
      .post('/auth/email/signup')
      .send(signupData);
    expect(response.status).toBe(204);
    expect(queueJob).toHaveBeenCalledWith({
      jobType: JobType.SendEmailVerificationEmail,
      email: signupData.email,
    });
  });

  test('fails when missing data', async () => {
    const signupData = getDummySignupData();
    for (const key of Object.keys(signupData)) {
      const response = await request(server)
        .post('/auth/email/signup')
        .send(omit(signupData, key));
      expect(response.status).toBe(400);
      expect(queueJob).not.toHaveBeenCalledWith({
        jobType: JobType.SendEmailVerificationEmail,
        email: signupData.email,
      });
    }
  });

  test('fails when org already exists', async () => {
    const signupData = getDummySignupData(BENTO_DOMAIN);
    const response = await request(server)
      .post('/auth/email/signup')
      .send(signupData);
    expect(response.status).toBe(400);
    expect(queueJob).not.toHaveBeenCalledWith({
      jobType: JobType.SendEmailVerificationEmail,
      email: signupData.email,
    });
  });
});
