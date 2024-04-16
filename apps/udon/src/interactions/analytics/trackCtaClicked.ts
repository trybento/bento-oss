import { Nullable, SelectedModelAttrsPick } from 'bento-common/types';

import detachPromise from 'src/utils/detachPromise';
import { StepCompletedPayload } from './analytics.types';
import {
  GuideBaseStepCta,
  GuideBaseStepCtaModelScope,
  GuideBaseStepCtaWithPrototype,
} from 'src/data/models/GuideBaseStepCta.model';
import { Events, analytics } from './analytics';

/**
 * Inserts a row indicating that a CTA was interacted with
 * This will affect the counts we show in guide analytics.
 */
export default function trackCtaClicked(
  args: StepCompletedPayload & { ctaEntityId?: string }
) {
  detachPromise(async () => {
    const { ctaEntityId } = args;

    /* We want the text in case a user updates/changes the CTA */
    const cta = ctaEntityId
      ? ((await GuideBaseStepCta.scope(
          GuideBaseStepCtaModelScope.withPrototype
        ).findOne({
          where: {
            entityId: ctaEntityId,
          },
          attributes: ['entityId'],
        })) as Nullable<
          GuideBaseStepCtaWithPrototype<
            SelectedModelAttrsPick<GuideBaseStepCta, 'entityId'>
          >
        >)
      : undefined;

    await analytics.step.newEvent(Events.ctaClicked, {
      ...args,
      ...(cta
        ? {
            data: {
              ctaEntityId,
              ctaText: cta.stepPrototypeCta.text,
            },
          }
        : {}),
    });
  }, 'track cta clicked');
}
