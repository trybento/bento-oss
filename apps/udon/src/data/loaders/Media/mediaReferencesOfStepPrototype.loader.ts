import Dataloader from 'dataloader';
import { MediaReferenceType } from 'bento-common/types/media';
import { loadBulk } from 'src/data/loaders/helpers';
import MediaReference from 'src/data/models/MediaReference.model';
import { Loaders } from '..';
import { getMediaReferenceLoaderRows } from './helpers';

export default function mediaReferencesOfStepPrototypeLoader(loaders: Loaders) {
  return new Dataloader<number, MediaReference[]>(async (stepPrototypeIds) => {
    const rows = await getMediaReferenceLoaderRows({
      referenceIds: stepPrototypeIds as number[],
      referenceType: MediaReferenceType.stepPrototype,
    });

    return loadBulk(
      stepPrototypeIds,
      rows,
      'mediaReferenceId',
      'id',
      loaders.mediaReferenceLoader
    );
  });
}
