import Dataloader from 'dataloader';
import { GuidePageTargetingType } from 'bento-common/types';

import { queryRunner } from 'src/data';
import OrganizationInlineEmbed from 'src/data/models/OrganizationInlineEmbed.model';
import { groupLoad } from '../helpers';
import { Loaders } from '..';

/** Loads whether or not a template has any guide bases in any state. */
const guideInlineEmbedLoader = (loaders: Loaders) =>
  new Dataloader<number, OrganizationInlineEmbed | null>(async (guideIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT 
          g.id as "guideId",
          oie.id as "inlineEmbedId"
        FROM
          core.guides g
          JOIN core.organization_inline_embeds oie
            ON g.created_from_template_id = oie.template_id
          JOIN core.templates t
            ON t.id = oie.template_id
        WHERE
          g.id IN (:guideIds)
          AND t.page_targeting_type = :pageTargetingType
      `,
      replacements: {
        guideIds,
        pageTargetingType: GuidePageTargetingType.inline,
      },
    })) as { guideId: number; inlineEmbedId: number }[];

    return groupLoad(
      guideIds,
      rows,
      'guideId',
      'inlineEmbedId',
      loaders.organizationInlineEmbedLoader
    );
  });

export default guideInlineEmbedLoader;
