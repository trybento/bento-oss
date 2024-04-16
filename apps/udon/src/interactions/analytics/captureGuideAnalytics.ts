import promises from 'src/utils/promises';

import { Account } from 'src/data/models/Account.model';
import { CapturedGuideAnalytics } from 'src/data/models/Analytics/CapturedGuideAnalytics.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Template } from 'src/data/models/Template.model';
import fetchTemplateStats from './fetchTemplateStats';

type Args = {
  templates: Template[];
};

export default async function captureGuideAnalytics({ templates }: Args) {
  if (templates.length === 0) return;

  const capturedStats: Array<Partial<CapturedGuideAnalytics>> = [];

  await promises.each(templates, async (template) => {
    if (!template) return;

    const stats = await fetchTemplateStats({ template });

    if (!stats) return;

    const accountsSeen = await GuideBase.count({
      where: {
        createdFromTemplateId: template.id,
      },
      include: [
        {
          model: Account.scope('notArchived'),
        },
      ],
    });

    capturedStats.push({
      stats: {
        ...stats,
        accountsSeen,
      },
      templateId: template.id,
      organizationId: template.organizationId,
    });
  });

  await CapturedGuideAnalytics.bulkCreate(capturedStats, {
    ignoreDuplicates: true,
  });
}
