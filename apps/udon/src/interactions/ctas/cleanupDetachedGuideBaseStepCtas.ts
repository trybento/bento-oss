import {
  GuideBaseStepCta,
  GuideBaseStepCtaModelScope,
} from 'src/data/models/GuideBaseStepCta.model';
import withSentrySpan from 'src/utils/instrumentation/withSentrySpan';

/**
 * Cleanup orphaned GuideStepBase CTAs missing reference to their StepPrototypeCta counterpart,
 * which indicates they need to be removed.
 *
 * @returns Promise the number of destroyed rows
 */
export default async function cleanupDetachedGuideBaseStepCtas(): Promise<number> {
  return withSentrySpan(
    async () => {
      const rows = (await GuideBaseStepCta.scope(
        GuideBaseStepCtaModelScope.orphan
      ).findAll({
        attributes: ['id'],
        raw: true,
      })) as { id: number }[];

      return GuideBaseStepCta.destroy({
        where: {
          id: rows.map((r) => r.id),
        },
      });
    },
    {
      name: 'cleanupDetachedGuideBaseStepCtas',
    }
  );
}
