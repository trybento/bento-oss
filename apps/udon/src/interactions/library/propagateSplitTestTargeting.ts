import { isSplitTestGuide } from 'bento-common/data/helpers';
import { pick } from 'lodash';
import { Template } from 'src/data/models/Template.model';
import { TemplateAutoLaunchRule } from 'src/data/models/TemplateAutoLaunchRule.model';
import { TemplateSplitTarget } from 'src/data/models/TemplateSplitTarget.model';
import { TemplateTarget } from 'src/data/models/TemplateTarget.model';

type Args = {
  splitTestTemplate: Template;
};

export default async function propagateSplitTestTargeting({
  splitTestTemplate,
}: Args) {
  if (!isSplitTestGuide(splitTestTemplate.type)) return;

  const sourceTargeting = await TemplateTarget.findOne({
    where: {
      templateId: splitTestTemplate.id,
    },
  });
  const sourceAutolaunchRules = await TemplateAutoLaunchRule.findOne({
    where: {
      templateId: splitTestTemplate.id,
    },
  });

  const splitTargets = await TemplateSplitTarget.findAll({
    where: {
      sourceTemplateId: splitTestTemplate.id,
    },
  });

  if (!splitTargets.length) return;

  /* Target guides to override */
  const targetTemplateIds = splitTargets
    .filter(Boolean)
    .map((st) => st.destinationTemplateId);

  await TemplateAutoLaunchRule.update(
    pick(sourceAutolaunchRules, ['rules', 'ruleType']),
    {
      where: {
        templateId: targetTemplateIds,
      },
    }
  );

  await TemplateTarget.update(pick(sourceTargeting, ['rules', 'targetType']), {
    where: {
      templateId: targetTemplateIds,
    },
  });
}
