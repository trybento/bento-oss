import { OrgState } from 'bento-common/types';
import { queryRunner } from 'src/data';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { AccountUserEvent } from 'src/data/models/Analytics/AccountUserEvent.model';
import { Event } from 'src/data/models/Analytics/Event.model';
import { StepEvent } from 'src/data/models/Analytics/StepEvent.model';
import { Organization } from 'src/data/models/Organization.model';
import { JobHandler } from 'src/jobsBull/handler';
import { DeleteOrganizationJob, JobType } from 'src/jobsBull/job';
import { queueJob } from 'src/jobsBull/queues';

const JOB_NAME = 'deleteOrg';
const BATCH_SIZE = 200;
/** Bigger batch size for non-cascading */
const EVENT_BATCH_SIZE = 2000;

type CleanupStep = {
  stepName: string;
  batchSize: number;
  /** Return the number of rows cleaned up so we can determine if we move to next step */
  fn: (organizationId: number) => Promise<number>;
};

/** Steps of cleanup */
const steps: CleanupStep[] = [
  {
    stepName: 'events',
    batchSize: EVENT_BATCH_SIZE,
    fn: async (organizationId: number) => {
      const eventsRows = (await queryRunner({
        sql: `SELECT e.id FROM analytics.events e
					JOIN core.organizations o ON o.entity_id = e.organization_entity_id
					WHERE o.id = :organizationId LIMIT :limit;`,
        replacements: { organizationId, limit: EVENT_BATCH_SIZE },
      })) as { id: number }[];

      await Event.destroy({
        where: {
          id: eventsRows.map((r) => r.id),
        },
      });

      return eventsRows.length;
    },
  },
  {
    stepName: 'accountUserEvents',
    batchSize: EVENT_BATCH_SIZE,
    fn: async (organizationId: number) => {
      const auEventsRows = (await queryRunner({
        sql: `SELECT e.id FROM analytics.account_user_events e
					JOIN core.organizations o ON o.entity_id = e.organization_entity_id
					WHERE o.id = :organizationId LIMIT :limit;`,
        replacements: { organizationId, limit: EVENT_BATCH_SIZE },
      })) as { id: number }[];

      await AccountUserEvent.destroy({
        where: {
          id: auEventsRows.map((r) => r.id),
        },
      });

      return auEventsRows.length;
    },
  },
  {
    stepName: 'stepEvents',
    batchSize: EVENT_BATCH_SIZE,
    fn: async (organizationId: number) => {
      const sEventsRows = (await queryRunner({
        sql: `SELECT e.id FROM analytics.step_events e
					JOIN core.organizations o ON o.entity_id = e.organization_entity_id
					WHERE o.id = :organizationId LIMIT :limit;`,
        replacements: { organizationId, limit: EVENT_BATCH_SIZE },
      })) as { id: number }[];

      await StepEvent.destroy({
        where: {
          id: sEventsRows.map((r) => r.id),
        },
      });

      return sEventsRows.length;
    },
  },
  {
    stepName: 'accountUsers',
    batchSize: BATCH_SIZE,
    fn: async (organizationId: number) => {
      const res = await AccountUser.destroy({
        where: {
          organizationId,
        },
        limit: BATCH_SIZE,
      });

      return res;
    },
  },
  {
    stepName: 'organization',
    batchSize: 5,
    fn: async (organizationId: number) => {
      const res = await Organization.destroy({
        where: {
          id: organizationId,
        },
      });

      return res;
    },
  },
];

const handler: JobHandler<DeleteOrganizationJob> = async (job, logger) => {
  const { stepNumber = 0, rowsRemoved = 0, organizationId } = job.data;

  /* No org = find all inactives */
  if (!organizationId) {
    const orgs = await Organization.scope('inactive').findAll({
      attributes: ['id', 'name'],
    });

    logger.info(
      `[${JOB_NAME}] No org provided; queue for ${orgs.length} orgs`,
      { orgNames: orgs.map((org) => org.name) }
    );

    for (const org of orgs) {
      await queueJob({
        jobType: JobType.DeleteOrganization,
        organizationId: org.id,
      });
    }

    return;
  }

  const org = await Organization.findOne({ where: { id: organizationId } });

  if (!org || org.state !== OrgState.Inactive)
    throw new Error('Invalid org requested for delete job.');

  const currentStep = steps[stepNumber];

  const removed = await currentStep.fn(organizationId);

  if (removed < currentStep.batchSize) {
    /* Done with final step, wrap up. */
    if (stepNumber === steps.length - 1) {
      logger.info(
        `[${JOB_NAME}] Done running all steps. Removed ${rowsRemoved} rows for ${org.name}.`
      );
      return;
    }

    /* Done with current step, more to go. Queue next step */
    logger.info(
      `[${JOB_NAME}] Finished with cleanup step "${
        currentStep.stepName
      }", starting next phase: "${steps[stepNumber + 1].stepName}"`
    );

    await queueJob({
      jobType: JobType.DeleteOrganization,
      stepNumber: stepNumber + 1,
      rowsRemoved: rowsRemoved + removed,
      organizationId,
    });
  } else {
    /* Not done, keep doing this step */
    await queueJob({
      jobType: JobType.DeleteOrganization,
      stepNumber,
      rowsRemoved: rowsRemoved + removed,
      organizationId,
    });
  }
};

export default handler;
