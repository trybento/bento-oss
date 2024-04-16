import { GroupTargetingSegment } from 'bento-common/types/targeting';
import { targetingSegmentToTargetingRuleRows } from 'bento-common/utils/targeting';
import { queryRunner, withTransaction } from 'src/data';

import { Template } from 'src/data/models/Template.model';
import { TemplateAudience } from 'src/data/models/TemplateAudience.model';

type Args = {
  template: Template;
  targeting?: GroupTargetingSegment;
};

/**
 * Create template audience rule rows.
 */
export async function setAudiencesForTemplate({ template, targeting }: Args) {
  await withTransaction(async () => {
    await TemplateAudience.destroy({
      where: {
        organizationId: template.organizationId,
        templateId: template.id,
      },
    });

    if (targeting?.groups) {
      const transformedRows = targetingSegmentToTargetingRuleRows(targeting);

      const createData = transformedRows.map(
        ({ attribute, value, valueType, ...restRule }) => ({
          ...restRule,
          organizationId: template.organizationId,
          templateId: template.id,
          audienceEntityId: String(value),
        })
      );

      await TemplateAudience.bulkCreate(createData);
    }
  });
}
