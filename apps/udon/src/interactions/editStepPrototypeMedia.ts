import promises from 'src/utils/promises';
import { Op, WhereOptions } from 'sequelize';
import { partition } from 'lodash';
import { withTransaction } from 'src/data';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import {
  MediaReferenceInput,
  MediaReferenceType,
} from 'bento-common/types/media';
import Media from 'src/data/models/Media.model';
import MediaReference from 'src/data/models/MediaReference.model';
import { sanitizeMediaSettingsToSave } from './createStepPrototypeMedia';

type Args = {
  stepPrototype: StepPrototype;
  mediaReferencesData: MediaReferenceInput[] | undefined | null;
};

interface MediaReferenceInputWithRanking extends MediaReferenceInput {
  orderIndex: number;
}

/** Update media of a step. */
export async function editStepPrototypeMedia({
  stepPrototype,
  mediaReferencesData,
}: Args): Promise<void> {
  return await withTransaction(async () => {
    // Should have at least received one media reference. Do nothing.
    if (!mediaReferencesData?.length) return;

    // Existing media.
    // TODO: Create DB index for this search.
    const orderedMedias: Media[] = [];
    for (const mrData of mediaReferencesData) {
      const where: WhereOptions<Media> = {
        type: mrData.media.type,
        url: mrData.media.url,
        organizationId: stepPrototype.organizationId,
      };
      const [media] = await Media.findOrCreate({
        where,
        defaults: { ...where, meta: mrData.media.meta },
      });
      orderedMedias.push(media);
    }

    const [mediaReferencesToUpdate, mediaReferencesToCreate] = partition(
      mediaReferencesData.map((mr, mrIndex) => {
        return {
          entityId: mr.entityId,
          settings: sanitizeMediaSettingsToSave(mr.settings),
          mediaId: orderedMedias[mrIndex].id,
          referenceId: stepPrototype.id,
          referenceType: MediaReferenceType.stepPrototype,
          organizationId: stepPrototype.organizationId,
          orderIndex: mrIndex,
        };
      }),
      (mr) => mr.entityId
    );

    const stepPrototypeMediaReferencesToUpdate = await MediaReference.findAll({
      attributes: ['id', 'entityId'],
      where: {
        entityId: mediaReferencesToUpdate.map((mr) => mr.entityId!),
        referenceId: stepPrototype.id,
        referenceType: MediaReferenceType.stepPrototype,
      },
    });

    // Arrange media references data by id.
    const mediaReferenceDataByStepPrototypeMediaReferenceId: {
      [id: number]: MediaReferenceInputWithRanking;
    } = mediaReferencesToUpdate.reduce((a, mrData) => {
      const mrId = stepPrototypeMediaReferencesToUpdate.find(
        (mr) => mr.entityId === mrData.entityId
      )?.id;
      if (mrId) a[mrId] = mrData;
      return a;
    }, {});

    // Update step prototype medias.
    await promises.each(stepPrototypeMediaReferencesToUpdate, async (mr) => {
      await mr.update(mediaReferenceDataByStepPrototypeMediaReferenceId[mr.id]);
    });

    const stepPrototypeMediaReferencesToDelete = await MediaReference.findAll({
      attributes: ['id'],
      where: {
        referenceId: stepPrototype.id,
        referenceType: MediaReferenceType.stepPrototype,
        entityId: {
          [Op.not]: mediaReferencesToUpdate.map((mr) => mr.entityId) as any,
        },
      },
    });

    const stepPrototypeMediaReferencesToDeleteIds =
      stepPrototypeMediaReferencesToDelete.map((mr) => mr.id);

    // Create step prototype media references.
    await MediaReference.bulkCreate(
      mediaReferencesToCreate.map((mr) => ({
        ...mr,
        stepPrototypeId: stepPrototype.id,
        organizationId: stepPrototype.organizationId,
      })),
      {
        returning: false,
      }
    );

    // Delete step prototype media references.
    await MediaReference.destroy({
      where: {
        id: stepPrototypeMediaReferencesToDeleteIds,
      },
    });

    return;
  });
}
