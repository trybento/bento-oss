import { keyBy } from 'lodash';
import { Template } from 'src/data/models/Template.model';
import { TemplateSplitTarget } from 'src/data/models/TemplateSplitTarget.model';

type Args = {
  sourceTemplate: Template;
  targetTemplateEntityIds: Array<string | null>;
};

export default async function createTemplateSplitTargets({
  sourceTemplate,
  targetTemplateEntityIds,
}: Args) {
  const { organizationId } = sourceTemplate;
  const validEntityIds = targetTemplateEntityIds.filter(Boolean) as string[];

  const targetTemplates = await Template.findAll({
    where: {
      entityId: validEntityIds,
      organizationId,
    },
  });

  if (!targetTemplates) return [];

  const templatesByEntityId = keyBy(targetTemplates, 'entityId');

  const templateSplitTargets = await TemplateSplitTarget.bulkCreate(
    targetTemplateEntityIds.map((tte) => ({
      sourceTemplateId: sourceTemplate.id,
      destinationTemplateId: tte ? templatesByEntityId[tte]?.id : null,
      organizationId,
    })),
    {
      returning: true,
      ignoreDuplicates: true,
    }
  );

  return templateSplitTargets;
}
