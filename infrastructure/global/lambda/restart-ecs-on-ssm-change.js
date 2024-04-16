const AWS = require('aws-sdk');

const ecs = new AWS.ECS({ apiVersion: '2014-11-13' });

const applicationToServices = {
  udon: ['udon-web', 'udon-priority-worker', 'udon-worker'],
  miso: ['miso'],
};

const ENVIRONMENT_NAMES = process.env.ENVIRONMENT_NAMES
  ? JSON.parse(process.env.ENVIRONMENT_NAMES)
  : [];

const handleSSMChange = async (detail) => {
  // Example variable name: /production/udon/DATABASE_HOST
  const parts = detail.name.split('/');
  const environment = parts[1];
  const application = parts[2];

  if (!ENVIRONMENT_NAMES.includes(environment)) {
    console.error(`Skipping - unrecognized environment name: ${environment}`);
    return;
  }

  if (!Object.keys(applicationToServices).includes(application)) {
    console.error(`Skipping - unrecognized application name: ${application}`);
    return;
  }

  const servicesToRestart = applicationToServices[application];

  console.log(
    `(${environment}) ${
      detail.name
    } changed - restarting ${servicesToRestart.join(', ')}`,
  );

  for (const service of servicesToRestart) {
    await ecs
      .updateService({
        service: `${environment}-${service}`,
        cluster: `bento-${environment}`,
        forceNewDeployment: true,
      })
      .promise();
  }
};

exports.handler = async function (event, context) {
  try {
    if (
      event.source === 'aws.ssm' &&
      event['detail-type'] === 'Parameter Store Change'
    ) {
      await handleSSMChange(event.detail);
    }
  } catch (err) {
    console.error('Error restarting services on SSM change');
    console.error('Error message: ', err.message);
    console.error('Event: ', JSON.stringify(event, null, 2));
  }
};
