import { omit } from 'lodash';
import { InferAttributes } from 'sequelize';

import OrganizationInlineEmbed from 'src/data/models/OrganizationInlineEmbed.model';
import { Template } from 'src/data/models/Template.model';
import upsertInlineEmbed from '../inlineEmbeds/upsertInlineEmbed';

type Args = {
  sourceTemplate: Template;
  destinationTemplate: Template;
};

export default async function duplicateInlineEmbeds({
  sourceTemplate,
  destinationTemplate,
}: Args) {
  const existingInlineEmbed = await OrganizationInlineEmbed.findOne({
    where: {
      templateId: sourceTemplate.id,
    },
  });

  if (!existingInlineEmbed) return;

  const attrsToClone = omit(
    existingInlineEmbed.toJSON() as InferAttributes<OrganizationInlineEmbed>,
    ['id', 'entityId', 'templateId', 'createdAt', 'updatedAt']
  );

  const [newInlineEmbed] = await upsertInlineEmbed({
    organization: existingInlineEmbed.organizationId,
    template: destinationTemplate,
    // @ts-ignore
    inlineEmbed: attrsToClone,
  });

  return newInlineEmbed;
}
