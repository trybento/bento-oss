import { isNumber } from 'lodash';
import { SelectedModelAttrs } from 'bento-common/types';

import OrganizationInlineEmbed from 'src/data/models/OrganizationInlineEmbed.model';
import {
  inlineEmbedsChanged,
  templateInlineEmbedChanged,
} from 'src/data/events';
import { Template } from 'src/data/models/Template.model';

type Args = {
  /** Template id for which we should remove inline placements */
  template:
    | number
    | SelectedModelAttrs<Template, 'id' | 'entityId' | 'organizationId'>;
};

/**
 * This is intended to be used when making changes to a Template and, as a
 * side effect, the template is no longer targeted to an inline embed.
 *
 * @returns Promise the number of destroyed rows
 */
export async function deleteExistingInlineEmbed(args: Args): Promise<number> {
  let existingTemplate: Exclude<Args['template'], number> | null;

  if (isNumber(args.template)) {
    existingTemplate = await Template.findByPk(args.template, {
      attributes: ['id', 'entityId', 'organizationId'],
      paranoid: false,
    });

    if (!existingTemplate) return 0;
  } else {
    existingTemplate = args.template;
  }

  const affectedRows = await OrganizationInlineEmbed.destroy({
    where: {
      organizationId: existingTemplate.organizationId,
      templateId: existingTemplate.id,
    },
    limit: 1,
  });

  if (affectedRows) {
    inlineEmbedsChanged(existingTemplate.organizationId);
    templateInlineEmbedChanged(existingTemplate.entityId);
  }

  return affectedRows;
}
