import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import OrganizationInlineEmbed from 'src/data/models/OrganizationInlineEmbed.model';
import { groupLoad } from '../helpers';
import { Loaders } from '..';

/** Loads whether or not a template has any guide bases in any state. */
const inlineEmbedOfTemplateLoader = (loaders: Loaders) =>
  new Dataloader<string, OrganizationInlineEmbed | null>(
    async (templateEntityIds) => {
      const rows = (await queryRunner({
        sql: `--sql
        SELECT 
          t.entity_id as "templateEntityId",
          oie.id as "inlineEmbedId"
        FROM 
          core.organization_inline_embeds oie
          INNER JOIN core.templates t ON t.id = oie.template_id
        WHERE
          t.entity_id IN (:templateEntityIds)
      `,
        replacements: {
          templateEntityIds,
        },
      })) as {
        templateEntityId: string;
        inlineEmbedId: number;
      }[];

      return groupLoad(
        templateEntityIds,
        rows,
        'templateEntityId',
        'inlineEmbedId',
        loaders.organizationInlineEmbedLoader
      );
    }
  );

export default inlineEmbedOfTemplateLoader;
