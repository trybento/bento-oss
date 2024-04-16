import { AtLeast } from 'bento-common/types';

import { Organization } from 'src/data/models/Organization.model';
import { Template } from 'src/data/models/Template.model';
import { StepPrototypeTaggedElement } from 'src/data/models/StepPrototypeTaggedElement.model';
import { pickCommonTaggedElementFields } from './helpers';
import { extractId } from 'src/utils/helpers';

type Args = {
  organization: number | AtLeast<Organization, 'id'>;
  originalTemplate: number | AtLeast<Template, 'id'>;
  copyTemplate: number | AtLeast<Template, 'id'>;
};

export default async function duplicatePrototypeTaggedElementOfTemplate({
  organization,
  originalTemplate,
  copyTemplate,
}: Args): Promise<StepPrototypeTaggedElement | null> {
  const organizationId = extractId(organization);

  const originalTag = await StepPrototypeTaggedElement.findOne({
    where: {
      templateId: extractId(originalTemplate),
      stepPrototypeId: null,
    },
  });

  if (originalTag) {
    return StepPrototypeTaggedElement.create({
      stepPrototypeId: null,
      organizationId,
      templateId: extractId(copyTemplate),
      ...pickCommonTaggedElementFields(originalTag),
    });
  }

  return null;
}
