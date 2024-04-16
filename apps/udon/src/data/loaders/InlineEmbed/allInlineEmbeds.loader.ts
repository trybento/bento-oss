import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { loadBulk } from '../helpers';
import OrganizationInlineEmbed from 'src/data/models/OrganizationInlineEmbed.model';
import { Loaders } from '..';

const allInlineEmbedsLoader = (loaders: Loaders) =>
  new Dataloader<number, OrganizationInlineEmbed[]>(async (organizationIds) => {
    const rows = (await queryRunner({
      sql: `
        SELECT
          oie.id as "organizationInlineEmbedId",
          o.id as "organizationId"
        FROM core.organization_inline_embeds oie
        JOIN core.organizations o ON oie.organization_id = o.id
        WHERE o.id IN (:organizationIds)
      `,
      replacements: {
        organizationIds: organizationIds as number[],
      },
    })) as { organizationInlineEmbedId: number; organizationId: number }[];

    return loadBulk(
      organizationIds,
      rows,
      'organizationId',
      'organizationInlineEmbedId',
      loaders.organizationInlineEmbedLoader
    );
  });

export default allInlineEmbedsLoader;
