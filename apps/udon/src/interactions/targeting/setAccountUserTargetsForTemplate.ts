import { TargetingType } from 'bento-common/types';
import { GroupTargetingSegment } from 'bento-common/types/targeting';

import { withTransaction } from 'src/data';
import { Template } from 'src/data/models/Template.model';
import { TemplateTarget } from 'src/data/models/TemplateTarget.model';
import { targetingSegmentToLegacy } from './targeting.helpers';

type Args = {
  template: Template;
  targeting?: GroupTargetingSegment;
};

/**
 * When we launch or save rules
 *   Handles only user targeting rules
 */
export async function setAccountUserTargetsForTemplate({
  template,
  targeting,
}: Args): Promise<void> {
  return withTransaction(async () => {
    await TemplateTarget.destroy({
      where: {
        templateId: template.id,
        organizationId: template.organizationId,
      },
    });

    if (
      targeting &&
      targeting.type === TargetingType.attributeRules &&
      targeting.groups
    ) {
      await TemplateTarget.bulkCreate(
        targetingSegmentToLegacy(targeting, 'targetType').map((t) => ({
          ...t,
          organizationId: template.organizationId,
          templateId: template.id,
        }))
      );
    } else {
      await TemplateTarget.create({
        targetType: TargetingType.all,
        organizationId: template.organizationId,
        templateId: template.id,
      });
    }
  });
}
