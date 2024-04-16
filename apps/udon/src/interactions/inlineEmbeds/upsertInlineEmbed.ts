import { CreationAttributes } from 'sequelize';
import { merge } from 'lodash';
import { InlineEmbedState, SelectedModelAttrs } from 'bento-common/types';

import { Organization } from 'src/data/models/Organization.model';
import OrganizationInlineEmbed from 'src/data/models/OrganizationInlineEmbed.model';
import { extractId } from 'src/utils/helpers';
import { Template } from 'src/data/models/Template.model';
import { templateAllowsInlineEmbedding } from './helpers';

type UpsertInlineEmbedArgs = {
  organization: SelectedModelAttrs<Organization, 'id'> | number;
  template?: SelectedModelAttrs<Template, 'id'> | number;
  inlineEmbed: Omit<
    CreationAttributes<OrganizationInlineEmbed>,
    'organizationId' | 'templateId'
  >;
};

/**
 * Create new inline placement either globally or for a given template.
 *
 * NOTE: Currently, only everboarding templates that are inline can have inline placements (i.e. cards).
 * Onboarding guides are not directly associated with inline placements.
 *
 * @todo unit test
 * @returns Promise the OrganizationInlineEmbed instance
 */
export default async function upsertInlineEmbed(args: UpsertInlineEmbedArgs) {
  const organizationId = extractId(args.organization);

  const upsertData = {
    ...args.inlineEmbed,
    organizationId,
  };

  if (args.template) {
    const templateId = extractId(args.template);

    // check if template is allowed to have an inline placement
    const template = await Template.findByPk(templateId, {
      attributes: ['id', 'formFactor', 'theme', 'isSideQuest'],
    });

    if (!template) {
      throw new Error('Associated template is missing');
    }

    if (!templateAllowsInlineEmbedding(template)) {
      throw new Error(
        'Refused to create inline placement for un-allowed template'
      );
    }

    // mutates the source object
    merge<
      CreationAttributes<OrganizationInlineEmbed>,
      Partial<CreationAttributes<OrganizationInlineEmbed>>
    >(upsertData, {
      templateId: template.id,
      state: InlineEmbedState.active,
    });
  }

  return OrganizationInlineEmbed.upsert(upsertData, {
    returning: true,
  });
}
