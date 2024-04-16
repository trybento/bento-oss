import { SelectedModelAttrs } from 'bento-common/types';

import { StepPrototypeCta } from 'src/data/models/StepPrototypeCta.model';
import { GuideBaseStepCta } from 'src/data/models/GuideBaseStepCta.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';

type Args = {
  stepPrototype: SelectedModelAttrs<StepPrototype, 'id' | 'organizationId'>;
};

/**
 * Delete all CTAs of a Step prototype.
 *
 * NOTE: Indirectly affects GuideBaseStepCta instances via DB cascade, but wont consider those in the number
 * of affected rows. Also, those will be left detached to be later cleaned up on a weekly basis.
 *
 * @returns Promise the number of destroyed StepPrototypeCta rows
 */
export async function deleteStepPrototypeCtas({
  stepPrototype,
}: Args): Promise<number> {
  const stepPrototypeCtas = await StepPrototypeCta.findAll({
    attributes: ['id'],
    where: {
      stepPrototypeId: stepPrototype.id,
      organizationId: stepPrototype.organizationId,
    },
  });

  if (!stepPrototypeCtas.length) return 0;

  const prototypeIds = stepPrototypeCtas.map((cta) => cta.id);

  // Delete step prototype ctas.
  return StepPrototypeCta.destroy({
    where: {
      id: prototypeIds,
      organizationId: stepPrototype.organizationId,
    },
  });
}
