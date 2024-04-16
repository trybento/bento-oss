import omit from 'lodash/omit';
import { CtaInput } from 'bento-common/types';
import { MAX_STEP_CTA_TEXT_LENGTH } from 'bento-common/data/helpers';

import { StepPrototypeCta } from 'src/data/models/StepPrototypeCta.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';

type Args = {
  stepPrototype: StepPrototype;
  ctas: CtaInput[] | undefined | null;
};

/**
 * Create the CTAs for a given StepPrototype instance.
 *
 * @returns Promise the created StepPrototypeCta instances
 */
export async function createStepPrototypeCtas({
  stepPrototype,
  ctas,
}: Args): Promise<StepPrototypeCta[]> {
  // Should have at least received one CTA.
  if (!ctas?.length) return [];

  // Create step prototype ctas.
  return StepPrototypeCta.bulkCreate(
    ctas.map((cta, ctaIdx) => ({
      ...omit(cta, 'entityId'),
      text: (cta.text || '').slice(0, MAX_STEP_CTA_TEXT_LENGTH),
      orderIndex: ctaIdx,
      stepPrototypeId: stepPrototype.id,
      organizationId: stepPrototype.organizationId,
    })),
    { returning: true }
  );
}
