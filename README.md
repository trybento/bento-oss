# Introduction

This codebase contains the open-source distribution of Bento, including:

- The back-end API (Udon)
- The admin dashboard used to create, edit, and launch Bento experiences (Miso)
- The Bento JavaScript embeddable (Shoyu)
- The Bento Visual Builder Chrome extension (Pontis)
- Terraform workspaces to provision a Bento environment in your AWS account

We follow a monorepo structure using Yarn workspaces. Using this documentation, you should be able to build and run a private instance of the full Bento stack for your organization.

# Getting started

## Dependencies

| Dependency                             | Version   | Description                                                               |
| -------------------------------------- | --------- | ------------------------------------------------------------------------- |
| [Node.JS](http://Node.JS)              | 20        | Used to build parts of the Bento stack (Udon and Miso).                   |
| [Yarn](https://yarnpkg.com)            | 3         | Manages dependencies and runs project commands across the Bento monorepo. |
| [Docker](https://www.docker.com)       | >= 25     | Used to build parts of the Bento stack (Udon and Miso).                   |
| [Terraform](https://www.terraform.io)  | >= 1.8.0  | Runs the provided Terraform scripts to provision resources.               |
| [AWS CLI](https://aws.amazon.com/cli/) | >= 2.7.12 | Used to run once-off scripts against the AWS environment.                 |

## Setup

Before building and running Bento, you will need to bootstrap the codebase. Run the following commands locally to clone the codebase and install dependencies:

- `git clone git@github.com:trybento/bento-oss.git`
- `cd bento-oss`
- Copy the `.yarnrc.yml.example` file to `.yarnrc.yml`, and fill in the BullMQ Pro NPM token (as outlined in the third-party dependencies section).
- Run `yarn` to install dependencies.

# Developing locally

To set up a local development stack, start by setting up the necessary environment variables:

- Copy `apps/udon/.env.example` to `apps/udon/development.env`, and populate the relevant variables.
- Copy `apps/miso/.env.example` to `apps/miso/.env`, and populate the relevant variables.
- Copy `apps/shoyu/env/.env.example` to `apps/shoyu/env/.env.development`, and populate the relevant variables.
- Copy `apps/pontis/.env.example` to `apps/pontis/.env.dev`, and populate the relevant variables.

> Most of the values in the example files have been set to suitable development values.

In a separate terminal instance, spin up the Docker infrastructure by running the following from the project root directory:

```bash
docker-compose up
```

Then run the following command from the project root directory to migrate and seed the database:

```bash
yarn migrate
```

And finally, spin up the development stack by running the following command from the project root directory:

```bash
yarn start
```

You should be able to access the admin dashboard from http://localhost:8080, and log in with the default user as set up in the Udon environment variables.

# Hosting Bento

The easiest way to host and run Bento is by using the provided Terraform workspaces and infrastructure scripts to provision a full Bento stack in your own AWS account.

## AWS architecture

The Terraform scripts will create the following AWS resources:

- **Virtual Private Network (VPC):** used to create a virtualized network stack, using private and public subnets to ring-fence access to parts of the infrastructure.
- **NAT Gateway:** used to provide outbound internet access to resources within private subnets.
- **Application Load Balancer (ALB):** distributes traffic across application instances.
- **Elastic Container Service (ECS), using ECS Fargate:** runs the Dockerized builds of Udon/Miso, with configuration for environment variables, CPU/RAM, auto-scaling etc.
- **Elastic Container Repository (ECR):** used to store Dockerized builds of Udon/Miso..
- **ElastiCache for Redis:** used to provision Redis instances for caching and worker queues.
- **S3:** provides file storage for things like user file uploads and serving the Bento embed.
- **Elastic Cloud Compute (EC2):** provisions bastion instances used for creating SSH tunnels to access infrastructure in private subnets, as these resources are physically disconnected from internet-facing traffic.

## Environment variables

### Udon and Miso

Environment variables for Udon and Miso are managed using [Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html), which is part of the AWS System Manager suite of tools. Parameter naming follows a specific structure to determine the environment and service to which the environment variable applies, as follows:

```
/<environment>/<service>/<environment variable name>
```

For example:

- `/production/udon/BASE_CLIENT_URL`
- `/staging/miso/NEXT_PUBLIC_API_HOST`
- `/test/miso/NEXT_PUBLIC_BENTO_APP_ID`

> ⚠️ This naming convention is important - there are several areas that rely on this format to automatically populate environment variables for services. When making changes to an environment variable, the dependent services in ECS will automatically be restarted within a few minutes.

Before provisioning the infrastructure via Terraform, you will need to configure the required environment variables. Refer to the following files for a list of environment variables that must be configured in Parameter Store, along with a description of each variable:

- `apps/udon/.env.example`
- `apps/miso/.env.example`

> ⚠️ Note that some variables such as PostgreSQL/Redis connection strings, are automatically configured for you via Terraform, and therefore should be excluded when configuring Parameter Store. This has been indicated in the example files above.

### Shoyu

Given the provided deploy script builds Shoyu locally on your machine, you need to create a set of environment variables locally for each environment you want to deploy to.

Make a copy of `apps/shoyu/env/.env.example` in the same directory named `.env.<environment name>`, substituting the name of the environment (e.g., “development”, “staging”, “production” etc).

> ⚠️ When deploying to AWS, the environment name should match the `environment_name` variable set in Terraform in order for the Terraform setup and deployment script to work as expected.

## IAM credentials

In order for Terraform to provision infrastructure and for deployment scripts to make changes in your AWS account, you will need to set up a new IAM credential. Given the breadth of services and actions used by Terraform, this credential requires full admin access, and therefore should be kept safe.

## Terraform setup

There are two Terraform projects included in the monorepo under the infrastructure directory:

- **Global:** provisions shared infrastructure (e.g., ECR for Docker images).
- **Environment:** provisions environment-specific infrastructure (e.g., staging or production).

> ⚠️ Ensure that the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables are set when running Terraform commands, as per the credential created in Terraform IAM credentials.

### Global

Make a copy of `infrastructure/global/vars/global.tfvars.example` named `global.tfvars` in the same directory, and configure the required Terraform configuration. Then, run the following commands from the project root:

```bash
cd infrastructure/global
terraform init
AWS_ACCESS_KEY_ID=<AWS access key ID> AWS_SECRET_ACCESS_KEY=<AWS access key secret> terraform apply -var-file="vars/global.tfvars"
```

The resources should be provisioned within a few minutes.

### Environment

Make a copy of `infrastructure/environment/vars/environment.tfvars.example` named `environment.tfvars` in the same directory, and configure the required Terraform configuration. Then, run the following commands from the project root:

```bash
cd infrastructure/environment
terraform init
terraform apply -var-file="vars/environment.tfvars"
```

The resources should be provisioned within a few minutes.

## Chrome extension

The Chrome extension (Pontis) is an important part of Bento. It interfaces with Miso (Admin UI) and Shoyu (Embeddable) to support the WYSIWYG features allowing you to place Bento experiences into your App with no-code changes required.

To set up the Apps that communicate with the extension you will first need to secure a CRX_KEY and, as a consequence, a static Extension ID which should be set as an env variable for both Miso and Shoyu.

### Packaging the extension for local distribution

Follow the steps below to package and distribute the extension outside of the Chrome Store, while still maintaining a fixed **Extension ID** to allow the Bento apps to communicate back and forth with it.

1. Make sure you've created the `.env.prod` file from the `.env.example` and updated the values accordingly. For the purpose of this documentation, we assume you want to build for the `prod` environment.
2. Build the project with the following command:

```bash
yarn workspace pontis build --tag=prod
```

3. The above will build the extension and output field to the following directory:

```bash
apps/pontis/build/chrome-mv3-prod
```

4. Launch your Chromium-based browser (preferably Chrome) and navigate to ["Manage extensions"](chrome://extensions/)
5. Click "Pack extension" and provide the following on the dialog window that appears:
   - As "Extension root directory", select the build directory above on which the built extension files were created.
   - As "Private key file" you can leave that empty for the browser to generate one for you, which you should then preserve at a secure location in case you need it again in the future.
6. Press "Pack extension" and another dialog window should appear telling you it generated two different files (as siblings of the directory you've selected before):
   - An extension file named `chrome-mv3-prod.crx`. This file can be used to distribute the extension to your colleagues, which should then [install it from the LOCAL CRX file](https://developer.chrome.com/docs/extensions/how-to/distribute/install-extensions#prereq-crx).
   - A private key file named `chrome-mv3-prod.pem`. This key (or its content) will be necessary to package your extension going forward and guarantee the same **Extension ID** will be kept, therefore you should keep this file in a secure place.
7. To find out what your **Extension ID** is, simply install the extension you've now packaged by opening the generated CRX file (`chrome-mv3-dev.crx`) in the same browser and you should be able to see it on the ["Manage extensions"](chrome://extensions/) page.

### Building for development (and installing)

Follow the steps below to build the extension locally for development purposes:

1. Make sure you've created an env (`.env.dev`) file from the `.env.example` and updated the values accordingly.
   - Set `CRX_PUBLIC_KEY` to match the contents of `chrome-mv3-prod.pem` you've generated on the step above so that the **Extension ID** remains the same. You should only consider what is between `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`, and remove all line breaks:

```
CRX_PUBLIC_KEY={KEY_IN_SINGLE_LINE}
```

2. Watch and build the extension for development:

```bash
yarn workspace pontis dev
```

3. To test it during the development phase, navigate to ["Manage extensions"](chrome://extensions/), click "Load unpacked" and select the target directory, which in this case should be `apps/pontis/build/chrome-mv3-dev`.
4. During development, the extension should be rebuilt and the browser should automatically update after each code change but depending on the changes you're making you might need to:
   - Remove and re-install the unpacked version, for which you would simply follow this process once again.
   - Or click the "refresh" (↩️) icon on the extension card.

## Deployments

> ⚠️ You should run an initial deployment after the infrastructure has been set up, to ensure the initial Docker image is published and the database has been migrated.

You can use the deployment script included in `scripts/deploy.sh` to deploy new versions of Bento. Refer to the comments in the script to understand each part of the deployment.

It can be run as follows:

```bash
cd scripts
./deploy
```

Note that the script requires several environment variables to be present, as outlined in the opening comment.

## Access private infrastructure

Most of the infrastructure created via Terraform resides in private subnets, which are not directly accessible from internet-facing traffic. This therefore means that, by design, you cannot directly connect to things like RDS or ElastiCache instances. Instead, you will need to proxy traffic through the bastion instance.

Depending on the infrastructure you are trying to access, you will need to use a client that supports SSH tunneling. For MacOS, [Postico](https://eggerapps.at/postico2/) supports this for connecting to Postgres, and [RedisInsight](https://redis.com/redis-enterprise/redis-insight/) for connecting to Redis. You can use the following details to setup the SSH tunnel:

- **IP address:** will be the Elastic IP address assigned to the bastion instance during the environment-based Terraform setup. This IP address will be included as an output variable in Terraform named `bastion_ip`.
- **SSH username:** `ubuntu`
- **SSH private key:** will be the private key corresponding to the `bastion_public_key` variable provided when running the environment-based Terraform setup.

# Third-party services

In order to run your own Bento stack, you will need to set up accounts with the following providers:

| Dependency                                                           | Description                                                                                                                                                                   |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Courier](https://www.courier.com/)                                  | Used to send transactional emails (e.g., guide activity, password reset etc.) and Slack notifications for guide activity, if configured via your organization’s integrations. |
| [OpenAI](https://platform.openai.com/overview)                       | All of Bento’s AI features use Chat GPT.                                                                                                                                      |
| [Ironclad Rivet](https://www.npmjs.com/package/@ironclad/rivet-node) | Used to build and edit Chat GPT prompts for Bento’s AI features.                                                                                                              |
| [SendGrid](https://sendgrid.com/en-us)                               | Used to send other transactional emails (i.e. CSV report generated, etc).                                                                                                     |
| [BullMQ Pro](https://docs.bullmq.io/bullmq-pro/introduction)         | Used to manage and process background jobs. Currently depends on a PRO subscription, that will have to be provided by whoever is setting Bento up on their environment.       |
| Google SSO                                                           | Used to allow users to sign in to Bento using their organization's Google account.                                                                                            |
| [ScraperAPI](https://www.scraperapi.com)                             | Used to scrape URLs in order to provide additional context for Bento's Build with AI features.                                                                                |
