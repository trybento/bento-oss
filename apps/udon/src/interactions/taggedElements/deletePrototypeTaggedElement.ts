import { SelectedModelAttrs } from 'bento-common/types';

import { StepPrototypeTaggedElement } from 'src/data/models/StepPrototypeTaggedElement.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { Organization } from 'src/data/models/Organization.model';
import { Template } from 'src/data/models/Template.model';
import { extractId } from 'src/utils/helpers';

type Args = {
  /** Org to which the prototype belongs to */
  organization: number | SelectedModelAttrs<Organization, 'id'>;
  /** Template id to which the tag prototype belongs to */
  template: number | SelectedModelAttrs<Template, 'id'>;
  /** Step prototype to which the tag prototype belongs to */
  stepPrototype?: number | SelectedModelAttrs<StepPrototype, 'id'>;
};

/**
 * Remove prototypes of tagged elements associated with a Template or Step prototype.
 *
 * @returns Promise the number of destroyed rows
 */
export default async function deletePrototypeTaggedElement({
  stepPrototype,
  template,
  organization,
}: Args): Promise<number> {
  return StepPrototypeTaggedElement.destroy({
    where: {
      organizationId: extractId(organization),
      stepPrototypeId: stepPrototype ? extractId(stepPrototype) : null,
      templateId: extractId(template),
    },
    limit: 1,
  });
}
