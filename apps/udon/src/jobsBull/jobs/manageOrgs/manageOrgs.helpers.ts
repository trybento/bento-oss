import promises from 'src/utils/promises';
import { Op } from 'sequelize';
import { addMonths, addWeeks, format } from 'date-fns';
import { OrgState } from 'bento-common/types';
import { Organization } from 'src/data/models/Organization.model';
import { sendInternalEmail } from 'src/utils/notifications/notifications.helpers';
import { Logger } from 'src/jobsBull/logger';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';

/**
 * This method will watch for Orgs on trial that have an expired trial period,
 * and those will be marked as `inactive`.
 */
export const endOrgTrials = async (logger?: Logger) => {
  const { count, rows: orgs } = await Organization.findAndCountAll({
    where: {
      state: 'trial',
      trial_ended_at: {
        [Op.lte]: new Date(),
      },
    },
  });

  if (count === 0) {
    logger?.info(`[Trial] No Orgs with ended trials found`);
    return;
  }

  // Grab orgIds
  const orgIds = orgs.map((o) => o.id);

  const inThreeMonths = addMonths(new Date(), 3);

  // Set all orgs as inactive
  await Organization.update(
    { state: OrgState.Inactive, deleteAt: inThreeMonths },
    { where: { id: { [Op.in]: orgIds } } }
  );

  logger?.info(
    `[Trial] Marked ${count} (Ids: ${orgIds.join(',')}) orgs as inactive`
  );
};

/** A value unlikely for allocatedGuides to be populated at for test partitioning */
export const TESTMODE_ALLOTTED_GUIDES = 83470;

/**
 * Warn on orgs that have a deleteAt in the next week
 *   and schedule orgs with a past deleteAt to be cleaned
 *
 * TestMode is a hacky workaround to let tests run alongside other tests that might
 *   create orgs. This lets us identify what subset of orgs we're testing against.
 */
export const manageExpiredOrgs = async (logger?: Logger, testMode = false) => {
  const nextWeek = addWeeks(new Date(), 1);

  /* Gets all the orgs with a deleteAt in coming week */
  const pendingOrgs = await Organization.findAll({
    where: {
      deleteAt: {
        [Op.lte]: nextWeek,
      },
      ...(testMode
        ? { 'options.allottedGuides': TESTMODE_ALLOTTED_GUIDES }
        : {}),
    },
  });

  if (pendingOrgs.length === 0) return;

  const now = new Date();
  const { orgsToDelete, orgsToNotifyOn } = await promises.reduce(
    pendingOrgs,
    async (acc, pendingOrg) => {
      if (pendingOrg.state === OrgState.Active) {
        if (pendingOrg.deleteAt) await pendingOrg.update({ deleteAt: null });
        logger?.info(
          `[manageExpiredOrgs] ${pendingOrg.slug} picked up, but is active - resetting deleteAt`
        );
      } else {
        const list =
          pendingOrg.deleteAt! < now ? acc.orgsToDelete : acc.orgsToNotifyOn;
        list.push(pendingOrg);
      }

      return acc;
    },
    {
      orgsToDelete: [] as Organization[],
      orgsToNotifyOn: [] as Organization[],
    }
  );

  logger?.info(
    `[manageExpiredOrgs] Found ${orgsToDelete.length} to remove, ${orgsToNotifyOn.length} to warn on`
  );

  /* Everything past its time, queue delete */
  for (const org of orgsToDelete) {
    await queueJob({
      jobType: JobType.DeleteOrganization,
      organizationId: org.id,
    });
  }

  /* Everything in coming week, warn on */
  await sendDeleteWarning(orgsToNotifyOn);
};

const sendDeleteWarning = async (orgs: Organization[]) => {
  if (!orgs.length) return;

  const html = `
		<ul>${orgs.reduce((a, v) => {
      a += `<li><strong>${v.name || v.slug}</strong> : Scheduled for ${format(
        v.deleteAt!,
        'MM/dd/yyyy'
      )}</li>`;

      return a;
    }, '')}<ul>
	`;
  const subject = 'Some orgs are pending deletion';
  const text = 'These orgs are scheduled to be deleted next weekend';

  await sendInternalEmail({
    subject,
    html,
    text,
    title: 'Organizations pending cleanup',
  });
};
