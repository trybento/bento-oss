import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import OrganizationInlineEmbed from 'src/data/models/OrganizationInlineEmbed.model';
import { groupLoad } from '../helpers';
import { Loaders } from '..';

/** Loads whether or not a template has any guide bases in any state. */
const templateInlineEmbedLoader = (loaders: Loaders) =>
  new Dataloader<number, OrganizationInlineEmbed | null>(
    async (templateIds) => {
      const rows = (await queryRunner({
        sql: `--sql
        SELECT 
          oie.template_id as "templateId",
          oie.id as "inlineEmbedId"
        FROM
          core.organization_inline_embeds oie
        WHERE
          oie.template_id IN (:templateIds)
      `,
        replacements: {
          templateIds,
        },
      })) as {
        templateId: number;
        inlineEmbedId: number;
      }[];

      return groupLoad(
        templateIds,
        rows,
        'templateId',
        'inlineEmbedId',
        loaders.organizationInlineEmbedLoader
      );
    }
  );

export default templateInlineEmbedLoader;
