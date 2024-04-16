import { Guide } from 'src/data/models/Guide.model';
import { createSingleLoader } from './stats.helpers';
import { groupBy } from 'lodash';

export default async function getPercentageGuidesCompletedOfTemplates(
  templateIds: readonly number[]
) {
  const allGuides = await Guide.findAll({
    where: {
      createdFromTemplateId: templateIds,
    },
    attributes: ['completedAt', 'createdFromTemplateId'],
  });

  const guidesByTemplateId = groupBy(allGuides, 'createdFromTemplateId');

  return templateIds.map((templateId) => {
    const guides = guidesByTemplateId[templateId] ?? [];

    if (guides.length === 0) return 0;

    const completedGuides = guides.filter((g) => !!g.completedAt);
    return (completedGuides.length / guides.length) * 100;
  });
}

export const getPercentageGuidesCompletedOfTemplate = createSingleLoader(
  getPercentageGuidesCompletedOfTemplates
);
