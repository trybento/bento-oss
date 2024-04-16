import Dataloader from 'dataloader';

import { Guide } from 'src/data/models/Guide.model';
import OrganizationInlineEmbed from 'src/data/models/OrganizationInlineEmbed.model';
import { Loaders } from '..';

/** Loads whether or not a template has any guide bases in any state. */
const guideForInlineEmbedLoader = (loaders: Loaders) =>
  new Dataloader<
    { inlineEmbedId: number; accountUserId: number },
    Guide | null
  >(async (inlineEmbeds) => {
    const availableGuides =
      await loaders.availableGuidesForAccountUserLoader.loadMany(
        inlineEmbeds.map((ie) => ie.accountUserId)
      );
    const guides = await Guide.findAll({
      where: { id: (availableGuides.flat() as Guide[]).map((g) => g.id) },
      include: [
        {
          model: OrganizationInlineEmbed,
          attributes: ['id'],
          required: true,
          where: {
            id: inlineEmbeds.map((embed) => embed.inlineEmbedId),
          },
        },
      ],
    });
    return inlineEmbeds.map(
      (embed) =>
        guides.find((guide) => guide.inlineEmbed?.id === embed.inlineEmbedId) ||
        null
    );
  });

export default guideForInlineEmbedLoader;
