import { Organization } from 'src/data/models/Organization.model';
import { Template } from 'src/data/models/Template.model';
import removeTemplate from 'src/interactions/library/removeTemplate';
import { JobHandler } from 'src/jobsBull/handler';
import { RemoveTemplateJob } from 'src/jobsBull/job';

const handler: JobHandler<RemoveTemplateJob> = async (job, logger) => {
  const { data } = job;
  const { templateId, organizationId, userId } = data;

  const organization = await Organization.findOne({
    where: {
      id: organizationId,
    },
  });

  if (!organization) {
    throw new Error(`Organization with ID '${organizationId}' not found`);
  }

  const template = await Template.findOne({
    where: {
      id: templateId,
      organizationId,
    },
  });

  if (!template) {
    throw new Error(`Template with ID '${templateId}' not found`);
  }

  await removeTemplate({ template, organization, userId });
};

export default handler;
