import { Op } from 'sequelize';
import { isSplitTestGuide } from 'bento-common/data/helpers';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Template } from 'src/data/models/Template.model';
import { TemplateSplitTarget } from 'src/data/models/TemplateSplitTarget.model';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';

type Args = {
  splitTestTemplate: Template;
};

export default async function captureSplitTestGuideAnalytics({
  splitTestTemplate,
}: Args) {
  if (!isSplitTestGuide(splitTestTemplate.type)) return;

  const splitTargets = await TemplateSplitTarget.findAll({
    where: {
      sourceTemplateId: splitTestTemplate.id,
      destinationTemplateId: {
        [Op.ne]: null,
      },
    },
  });

  if (!splitTargets.length) return;

  const createdGuideBases = await GuideBase.count({
    where: {
      organizationId: splitTestTemplate.organizationId,
      createdFromSplitTestId: splitTestTemplate.id,
    },
  });

  if (createdGuideBases === 0) return;

  await queueJob({
    jobType: JobType.CaptureTemplateAnalytics,
    templateIds: splitTargets.map((st) => st.destinationTemplateId),
  });
}
