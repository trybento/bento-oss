import { CreationAttributes } from 'sequelize';
import { merge } from 'lodash';
import { InlineEmbedState, SelectedModelAttrs } from 'bento-common/types';

import { Organization } from 'src/data/models/Organization.model';
import OrganizationInlineEmbed from 'src/data/models/OrganizationInlineEmbed.model';
import { extractId } from 'src/utils/helpers';
import { Template } from 'src/data/models/Template.model';
import { templateAllowsInlineEmbedding } from './helpers';

type CreateInlineEmbedArgs = {
  /** Organization for which the inline embed placement should be created */
  organization: SelectedModelAttrs<Organization, 'id'> | number;
  /** Inline embed details */
  inlineEmbed: Omit<
    CreationAttributes<OrganizationInlineEmbed>,
    'organizationId' | 'templateId'
  >;
  /** Template for which the inline embed placement should be created, if template-specific */
  templateEntityId?: string;
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
export default async function createInlineEmbed(args: CreateInlineEmbedArgs) {
  const organizationId = extractId(args.organization);

  const creationData = {
    ...args.inlineEmbed,
    organizationId,
  };

  if (args.templateEntityId) {
    // check if template is allowed to have an inline placement
    const template = await Template.findOne({
      where: {
        entityId: args.templateEntityId,
        organizationId,
      },
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
    >(creationData, {
      templateId: template.id,
      state: InlineEmbedState.active,
    });
  } else {
    const existingCount = await OrganizationInlineEmbed.scope('global').findOne(
      {
        attributes: ['id'],
        where: {
          organizationId,
        },
        raw: true,
      }
    );

    if (existingCount) {
      throw new Error(
        'Refused to create inline placement since one already exists'
      );
    }
  }

  return OrganizationInlineEmbed.create(creationData);
}
