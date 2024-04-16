import {
  VisualTagHighlightType,
  TooltipShowOn,
  TooltipStyle,
  TagInput,
  SelectedModelAttrs,
} from 'bento-common/types';
import { isFlowGuide, isTooltipGuide } from 'bento-common/utils/formFactor';

import { Template } from 'src/data/models/Template.model';
import { StepPrototypeTaggedElement } from 'src/data/models/StepPrototypeTaggedElement.model';
import { withTransaction } from 'src/data';
import { pickCommonTaggedElementFields } from './helpers';
import { Organization } from 'src/data/models/Organization.model';
import { extractId } from 'src/utils/helpers';
import NoContentError from 'src/errors/NoContentError';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';

type Args = {
  input: TagInput;
  template: number | Template;
  stepPrototype?: number | StepPrototype;
  organization: number | SelectedModelAttrs<Organization, 'id'>;
};

/**
 * Upserts a tagged element prototype associated with a Template or Step prototype.
 *
 * @returns Promise the updated StepPrototypeTaggedElement
 */
export default async function upsertPrototypeTaggedElement({
  input,
  template: templateOrId,
  stepPrototype,
  organization,
}: Args): Promise<StepPrototypeTaggedElement | void> {
  const { entityId } = input;
  const fieldsToUpdate = pickCommonTaggedElementFields<TagInput>(input);

  if (!Object.keys(fieldsToUpdate).length) {
    return;
  }

  const template =
    templateOrId instanceof Template
      ? templateOrId
      : await Template.findByPk(templateOrId);

  if (!template) {
    throw new NoContentError(templateOrId as number, 'template');
  }

  return await withTransaction(async () => {
    /**
     * Cannot use the upsert method here due to lack of DB-level constraints,
     * therefore we leverage findOrCreate to achieve a similar behavior.
     */
    const [upserted, created] = await StepPrototypeTaggedElement.findOrCreate({
      where: {
        ...(entityId && { entityId }),
        templateId: template.id,
        stepPrototypeId: stepPrototype ? extractId(stepPrototype) : null,
        organizationId: extractId(organization),
      },
      defaults: pickCommonTaggedElementFields(input),
    });

    if (!created) {
      await upserted.update(pickCommonTaggedElementFields(input));
    }

    /**
     * Tooltips of overlay-style should always show on page load, therefore
     * this checks whether this is the case and forcefully update the template form factor styles
     * when needed.
     */
    if (
      (isTooltipGuide(template.formFactor) ||
        isFlowGuide(template.formFactor)) &&
      upserted.style?.type === VisualTagHighlightType.overlay &&
      (template.formFactorStyle as TooltipStyle)?.tooltipShowOn !==
        TooltipShowOn.load
    ) {
      // overlay highlight type is not allowed to be shown on hover
      await template.update({
        formFactorStyle: {
          ...(template.formFactorStyle || {}),
          tooltipShowOn: TooltipShowOn.load,
        } as TooltipStyle,
      });
    }

    await queueJob({
      jobType: JobType.SyncTemplateChanges,
      type: 'template',
      templateId: template.id,
      organizationId: extractId(organization),
    });

    return upserted;
  });
}
