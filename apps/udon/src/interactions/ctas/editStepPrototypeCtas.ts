import promises from 'src/utils/promises';
import { Op } from 'sequelize';
import { chain, keyBy, pick, partition } from 'lodash';
import { CtaInput } from 'bento-common/types';
import { MAX_STEP_CTA_TEXT_LENGTH } from 'bento-common/data/helpers';

import { StepPrototypeCta } from 'src/data/models/StepPrototypeCta.model';
import { Template } from 'src/data/models/Template.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';

type Args = {
  stepPrototype: StepPrototype;
  ctas: CtaInput[] | undefined | null;
};

interface CtaInputWithRanking extends CtaInput {
  orderIndex: number;
}

const commonCtaFields: Array<keyof StepPrototypeCta> = [
  'text',
  'url',
  'type',
  'style',
  'launchableTemplateId',
  'settings',
  'orderIndex',
];

/** Update CTAs of a step */
export async function editStepPrototypeCtas({
  stepPrototype,
  ctas,
}: Args): Promise<StepPrototypeCta[]> {
  // Should have at least received one CTA. Do nothing.
  if (!ctas?.length) return [];

  const ctasByDestinationGuide = chain(ctas)
    .filter('destinationGuide')
    .keyBy('destinationGuide')
    .value();
  const destinationGuideEntityIds = Object.keys(ctasByDestinationGuide);

  const guideTemplates = await Template.findAll({
    where: {
      entityId: Object.keys(ctasByDestinationGuide),
    },
  });

  const guideTemplatesByEntityId = keyBy(guideTemplates, 'entityId');

  // make sure template exists
  if (
    destinationGuideEntityIds.length !==
    Object.keys(guideTemplatesByEntityId).length
  ) {
    throw new Error(`Some CTA guide destination is missing`);
  }

  const [ctasToUpdate, ctasToCreate] = partition(
    ctas.map((cta, ctaIdx) => ({
      ...cta,
      text: (cta.text || '').slice(0, MAX_STEP_CTA_TEXT_LENGTH),
      launchableTemplateId: cta.destinationGuide
        ? guideTemplatesByEntityId[cta.destinationGuide].id
        : undefined,
      orderIndex: ctaIdx,
    })),
    (cta) => cta.entityId
  );

  const stepPrototypeCtasToUpdate = await StepPrototypeCta.findAll({
    where: {
      entityId: ctasToUpdate.map((cta) => cta.entityId!),
      stepPrototypeId: stepPrototype.id,
    },
  });

  // Arrange cta data by id.
  const ctaDataByStepPrototypeCtaId: { [id: number]: CtaInputWithRanking } =
    ctasToUpdate.reduce((a, ctaData) => {
      const ctaId = stepPrototypeCtasToUpdate.find(
        (cta) => cta.entityId === ctaData.entityId
      )?.id;
      if (ctaId) a[ctaId] = ctaData;
      return a;
    }, {});

  // Update step prototype ctas.
  await promises.each(stepPrototypeCtasToUpdate, async (cta) => {
    return cta.update(
      pick(ctaDataByStepPrototypeCtaId[cta.id], commonCtaFields)
    );
  });

  const stepPrototypeCtasToDelete = await StepPrototypeCta.findAll({
    where: {
      stepPrototypeId: stepPrototype.id,
      entityId: {
        [Op.not]: ctasToUpdate.map((cta) => cta.entityId) as any,
      },
    },
  });

  const stepPrototypeCtaToDeleteIds = stepPrototypeCtasToDelete.map(
    (cta) => cta.id
  );

  // Create step prototype ctas.
  const createdStepPrototypeCtas = await StepPrototypeCta.bulkCreate(
    ctasToCreate.map((cta) => ({
      ...pick(cta, commonCtaFields),
      stepPrototypeId: stepPrototype.id,
      organizationId: stepPrototype.organizationId,
    })),
    {
      returning: true,
    }
  );

  // Delete step prototype ctas.
  await StepPrototypeCta.destroy({
    where: {
      id: stepPrototypeCtaToDeleteIds,
    },
  });

  return [...stepPrototypeCtasToUpdate, ...createdStepPrototypeCtas];
}
