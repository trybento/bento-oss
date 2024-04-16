import { StepPrototype } from 'src/data/models/StepPrototype.model';
import MediaReference from 'src/data/models/MediaReference.model';
import Media from 'src/data/models/Media.model';
import {
  ImageMediaReferenceSettings,
  MediaReferenceInput,
  MediaReferenceSettings,
  MediaReferenceType,
} from 'bento-common/types/media';
import { hasKey } from 'bento-common/data/helpers';
import { WhereOptions } from 'sequelize';

type Args = {
  stepPrototype: StepPrototype;
  mediaReferencesData: MediaReferenceInput[] | undefined | null;
};

export const sanitizeMediaSettingsToSave = (
  settings: MediaReferenceSettings | undefined
): MediaReferenceSettings => {
  if (!settings) return {};
  const result = { ...settings };

  if (
    hasKey(result as ImageMediaReferenceSettings, 'hyperlink') &&
    !(result as ImageMediaReferenceSettings).hyperlink
  ) {
    (result as ImageMediaReferenceSettings).hyperlink = null;
  }

  return result;
};

/** Create media of a step */
export async function createStepPrototypeMedia({
  stepPrototype,
  mediaReferencesData,
}: Args): Promise<MediaReference[]> {
  // Should have at least received one media.
  if (!mediaReferencesData?.length) return [];

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

  // Create step prototype media.
  return await MediaReference.bulkCreate(
    mediaReferencesData.map((mr, mrIdx) => ({
      entityId: mr.entityId,
      settings: sanitizeMediaSettingsToSave(mr.settings),
      mediaId: orderedMedias[mrIdx].id,
      referenceId: stepPrototype.id,
      referenceType: MediaReferenceType.stepPrototype,
      organizationId: stepPrototype.organizationId,
      orderIndex: mrIdx,
    })),
    { returning: true }
  );
}
