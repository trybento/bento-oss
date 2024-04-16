import Dataloader from 'dataloader';

import { queryRunner } from 'src/data';
import { loadBulk } from '../helpers';
import OrganizationInlineEmbed from 'src/data/models/OrganizationInlineEmbed.model';
import { Loaders } from '..';

const onboardingInlineEmbedsLoader = (loaders: Loaders) =>
  new Dataloader<number, OrganizationInlineEmbed[]>(async (organizationIds) => {
    const rows = (await queryRunner({
      sql: `--sql
        SELECT
          oie.id as "inlineEmbedId",
          oie.organization_id as "organizationId"
        FROM
          core.organization_inline_embeds oie
        WHERE
          oie.organization_id IN (:organizationIds)
          AND oie.template_id IS NULL
      `,
      replacements: {
        organizationIds: organizationIds as number[],
      },
    })) as { inlineEmbedId: number; organizationId: number }[];

    return loadBulk(
      organizationIds,
      rows,
      'organizationId',
      'inlineEmbedId',
      loaders.organizationInlineEmbedLoader
    );
  });

export default onboardingInlineEmbedsLoader;
