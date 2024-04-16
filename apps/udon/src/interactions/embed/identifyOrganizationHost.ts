import { OrganizationHost } from 'src/data/models/OrganizationHost.model';
import { JobType } from 'src/jobsBull/job';
import { queueJob } from 'src/jobsBull/queues';

/** Log a known host. We'll use this to see where snippets are installed */
export default async function identifyOrganizationHost(
  organizationId: number,
  hostname: string
) {
  if (!hostname) return;

  const [_oh, created] = await OrganizationHost.findOrCreate({
    where: {
      organizationId,
      hostname,
    },
  });

  if (created) {
    /* Only check if a new host is added to see if it's the first host */
    const hosts = await OrganizationHost.count({ where: { organizationId } });

    /* First host created = first snippet login */
    if (hosts === 1) {
      await queueJob({ jobType: JobType.DeleteExtensionData, organizationId });
    }
  }
}
