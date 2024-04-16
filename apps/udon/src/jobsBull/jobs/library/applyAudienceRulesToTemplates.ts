import { GroupTargeting, RawRule } from 'bento-common/types/targeting';
import { Organization } from 'src/data/models/Organization.model';
import { Template } from 'src/data/models/Template.model';
import { User } from 'src/data/models/User.model';
import setAutoLaunchConfig from 'src/interactions/targeting/setAutoLaunch.helpers';
import { JobHandler } from 'src/jobsBull/handler';
import { ApplyAudienceRulesToTemplatesJob, JobType } from 'src/jobsBull/job';
import { queueJob } from 'src/jobsBull/queues';
import promises from 'src/utils/promises';

const handler: JobHandler<ApplyAudienceRulesToTemplatesJob> = async (
  job,
  logger
) => {
  const {
    targeting: targets,
    templateIds,
    userId,
    deleteAudienceId,
  } = job.data;

  const templates = await Template.findAll({
    where: {
      id: templateIds,
    },
    include: [Organization],
  });

  const user = userId
    ? (await User.findOne({
        where: {
          id: userId,
        },
      })) ?? undefined
    : undefined;

  if (templates.length === 0) return;

  logger.debug(`Applying targeting to ${templates.length} templates`);

  await promises.each(
    templates,
    async (template) =>
      setAutoLaunchConfig(
        {
          template,
          isAutoLaunchEnabled: template.isAutoLaunchEnabled,
          targets: targets as GroupTargeting<RawRule>,
          onlySetAutolaunchState: false,
        },
        {
          user,
          organization: template.organization,
        }
      ),
    {
      concurrency: 3,
    }
  );

  if (deleteAudienceId)
    await queueJob({
      jobType: JobType.DeleteObjects,
      type: 'audience',
      objectIds: [deleteAudienceId],
      organizationId: templates[0].organizationId,
    });
};

export default handler;
