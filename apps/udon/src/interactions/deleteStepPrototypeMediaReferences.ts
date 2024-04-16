import { withTransaction } from 'src/data';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import MediaReference from 'src/data/models/MediaReference.model';
import { MediaReferenceType } from 'bento-common/types/media';

type Args = {
  stepPrototype: StepPrototype;
};

/** Delete medias of a step */
export async function deleteStepPrototypeMedia({
  stepPrototype,
}: Args): Promise<void> {
  return await withTransaction(async () => {
    const stepPrototypeMediaReferences = await MediaReference.findAll({
      attributes: ['id'],
      where: {
        referenceId: stepPrototype.id,
        referenceType: MediaReferenceType.stepPrototype,
      },
    });

    if (!stepPrototypeMediaReferences.length) return;

    const ids = stepPrototypeMediaReferences.map((mr) => mr.id);

    // Delete step prototype media.
    await MediaReference.destroy({
      where: {
        id: ids,
      },
    });

    return;
  });
}
