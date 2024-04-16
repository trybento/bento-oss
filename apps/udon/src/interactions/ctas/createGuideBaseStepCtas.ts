import { CreationAttributes } from 'sequelize';
import { chunk, groupBy } from 'lodash';
import { SelectedModelAttrs, SelectedModelAttrsPick } from 'bento-common/types';

import { StepPrototypeCta } from 'src/data/models/StepPrototypeCta.model';
import {
  GuideBaseStepCta,
  GuideBaseStepCtaModelScope,
} from 'src/data/models/GuideBaseStepCta.model';
import { GuideStepBase } from 'src/data/models/GuideStepBase.model';
import withSentrySpan from 'src/utils/instrumentation/withSentrySpan';
import promises from 'src/utils/promises';

type Args = {
  guideStepBases: SelectedModelAttrs<
    GuideStepBase,
    'id' | 'organizationId' | 'createdFromStepPrototypeId'
  >[];
};

/**
 * Note: The PostgreSQL rows limit for a single insert statement should be 1000 (1k).
 *
 * @link https://databasefaqs.com/postgresql-insert-multiple-rows/
 */
const CHUNK_SIZE = 100;

/**
 * Creates the CTA instances for each guide base step based on the step prototypes.
 *
 * NOTE: This leverages the bulkCreation method and ignores any duplicates.
 */
export async function createGuideBaseStepCtas({
  guideStepBases,
}: Args): Promise<void> {
  return withSentrySpan(
    async () => {
      if (guideStepBases.length === 0) return;

      const ctaPrototypes = (await StepPrototypeCta.findAll({
        attributes: ['id', 'stepPrototypeId'],
        where: {
          stepPrototypeId: guideStepBases.map(
            (gsb) => gsb.createdFromStepPrototypeId
          ),
        },
      })) as SelectedModelAttrsPick<
        StepPrototypeCta,
        'id' | 'stepPrototypeId'
      >[];

      const ctaPrototypesByStepPrototypeId = groupBy(
        ctaPrototypes,
        'stepPrototypeId'
      );

      // Find existing CTA bases to compare later
      const ctaBases = (await GuideBaseStepCta.scope(
        GuideBaseStepCtaModelScope.active
      ).findAll({
        attributes: ['id', 'guideBaseStepId', 'createdFromStepPrototypeCtaId'],
        where: {
          guideBaseStepId: guideStepBases.map((gsb) => gsb.id),
        },
      })) as SelectedModelAttrsPick<
        GuideBaseStepCta,
        'id' | 'guideBaseStepId' | 'createdFromStepPrototypeCtaId'
      >[];

      // Group the existing CTA bases by base step id
      const ctaBasesByGuideBaseStepId = groupBy(ctaBases, 'guideBaseStepId');

      // Prepare the bulk creation data, excluding existing instances
      const bulkCreateData = guideStepBases.reduce<
        CreationAttributes<GuideBaseStepCta>[]
      >((acc, gsb) => {
        const ctaPrototypesOfStep =
          ctaPrototypesByStepPrototypeId[gsb.createdFromStepPrototypeId || 0] ||
          [];

        ctaPrototypesOfStep.forEach((stepPrototypeCta) => {
          const guideStepBaseCta = ctaBasesByGuideBaseStepId[gsb.id]?.find(
            (ctaBase) =>
              ctaBase.createdFromStepPrototypeCtaId === stepPrototypeCta.id
          );

          // wont unnecessarily consider existing instances
          if (!guideStepBaseCta) {
            acc.push({
              organizationId: gsb.organizationId,
              guideBaseStepId: gsb.id,
              createdFromStepPrototypeCtaId: stepPrototypeCta.id,
            });
          }
        });

        return acc;
      }, []);

      await promises.each(
        chunk(bulkCreateData, CHUNK_SIZE),
        async (createDataChunk) => {
          return GuideBaseStepCta.bulkCreate(createDataChunk, {
            // extra safety measure, since we already filtered out existing instances
            ignoreDuplicates: true,
            returning: false,
          });
        }
      );
    },
    {
      name: 'createGuideBaseStepCtas',
    }
  );
}
