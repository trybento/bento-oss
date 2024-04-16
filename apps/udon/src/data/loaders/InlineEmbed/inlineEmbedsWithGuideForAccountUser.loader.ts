import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { loadBulk } from '../helpers';
import OrganizationInlineEmbed from 'src/data/models/OrganizationInlineEmbed.model';
import { Loaders } from '..';

const inlineEmbedsWithGuideForAccountUserLoader = (loaders: Loaders) =>
  new Dataloader<number, OrganizationInlineEmbed[]>(async (accountUserIds) => {
    const availableGuides =
      await loaders.availableGuidesForAccountUserLoader.loadMany(
        accountUserIds
      );
    const availableGuideIds = availableGuides.flatMap((guides) =>
      Array.isArray(guides) ? guides.map((g) => g.id) : []
    );
    if (availableGuideIds.length === 0) return [];
    const rows = (await queryRunner({
      sql: `--sql
      SELECT
        oie.id as "inlineEmbedId",
        gp.account_user_id as "accountUserId"
      FROM
        core.guide_participants gp
        JOIN core.guides g
          ON gp.guide_id = g.id
        JOIN core.organization_inline_embeds oie
          ON oie.template_id = g.created_from_template_id
      WHERE
        gp.account_user_id IN (:accountUserIds)
        AND gp.guide_id IN (:availableGuideIds)
				AND g.deleted_at IS NULL
    `,
      replacements: { accountUserIds, availableGuideIds },
    })) as { inlineEmbedId: number; accountUserId: number }[];

    return loadBulk(
      accountUserIds,
      rows,
      'accountUserId',
      'inlineEmbedId',
      loaders.organizationInlineEmbedLoader
    );
  });
export default inlineEmbedsWithGuideForAccountUserLoader;
