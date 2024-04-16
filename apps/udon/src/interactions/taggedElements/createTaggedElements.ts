import { Op } from 'sequelize';
import { SelectedModelAttrs } from 'bento-common/types';

import { StepTaggedElement } from 'src/data/models/StepTaggedElement.model';
import { Guide } from 'src/data/models/Guide.model';
import { Step } from 'src/data/models/Step.model';
import { StepPrototypeTaggedElement } from 'src/data/models/StepPrototypeTaggedElement.model';
import { logger } from 'src/utils/logger';
import { guideChanged } from 'src/data/events';
import { pickCommonTaggedElementFields } from './helpers';
import withSentrySpan from 'src/utils/instrumentation/withSentrySpan';

type CreateStepTaggedElementsArgs = {
  steps: SelectedModelAttrs<
    Step,
    'id' | 'guideId' | 'createdFromStepPrototypeId'
  >[];
  guide: SelectedModelAttrs<
    Guide,
    'id' | 'entityId' | 'createdFromGuideBaseId' | 'createdFromTemplateId'
  >;
  organizationId: number;
  stopEvents?: boolean;
};

/**
 * (Idempotent) Create tagged elements associated with a Guide/Steps that have not been created yet.
 *
 * WARNING: This will NOT update existing instances but that shouldn't be needed since we're not anymore
 * propagating common fields to the StepTaggedElement level and those can be simply referenced
 * from the prototype.
 *
 * @returns Promise the created StepTaggedElement instances
 */
export default async function createTaggedElements({
  steps,
  guide,
  organizationId,
  stopEvents,
}: CreateStepTaggedElementsArgs): Promise<StepTaggedElement[]> {
  return withSentrySpan(
    async () => {
      if (!guide.createdFromTemplateId) {
        logger.warn(
          `Cannot create tags for Guide #${guide.id} which is missing their Template reference`
        );
        return [];
      }

      /**
       * This is to prevent this method from creating inconsistent rows with step ids that does not belong
       * to the given guide id.
       */
      const validSteps = steps.reduce<CreateStepTaggedElementsArgs['steps']>(
        (acc, step) => {
          if (step.guideId === guide.id) {
            acc.push(step);
          } else {
            const stack = new Error().stack;
            logger.error(
              `[createTaggedElements] Skipping Step #${step.id} which does not belong to Guide #${guide.id}.`,
              {
                guide,
                step,
                stack,
              }
            );
          }
          return acc;
        },
        []
      );

      const stepPrototypeIds = validSteps
        .map((step) => step.createdFromStepPrototypeId)
        .filter(Boolean);

      const tagPrototypes = await StepPrototypeTaggedElement.findAll({
        where: {
          [Op.or]: [
            {
              stepPrototypeId: {
                [Op.in]: stepPrototypeIds,
              },
            },
            {
              stepPrototypeId: {
                [Op.is]: null,
              },
            },
          ],
          templateId: guide.createdFromTemplateId,
          // filter-out instances for which there already is a tag created for the same org/guide
          // by performing a left join where B.key is null, otherwise we could be attempting
          // to create a duplicate
          '$stepTaggedElements.id$': {
            [Op.is]: null,
          },
        },
        include: [
          {
            model: StepTaggedElement,
            attributes: ['id'],
            where: {
              guideId: guide.id,
              organizationId,
            },
            required: false,
          },
        ],
      });

      const stepTaggedElementsAttrs = tagPrototypes.map((spte) => {
        const isStepBased = spte.stepPrototypeId;
        const associatedStep = isStepBased
          ? validSteps.find(
              (step) => step.createdFromStepPrototypeId === spte.stepPrototypeId
            )
          : undefined;

        if (isStepBased && !associatedStep) {
          throw new Error(
            'Cannot create Step-level tag if associated step is missing'
          );
        }

        return {
          stepId: associatedStep?.id || null,
          guideId: guide.id,
          organizationId,
          guideBaseId: guide.createdFromGuideBaseId,
          guideBaseStepId: associatedStep?.createdFromGuideStepBaseId,
          createdFromPrototypeId: spte.id,
          ...pickCommonTaggedElementFields(spte),
        };
      });

      const created = await StepTaggedElement.bulkCreate(
        stepTaggedElementsAttrs,
        {
          ignoreDuplicates: true,
        }
      );

      if (!stopEvents) guideChanged(guide.entityId);

      return created;
    },

    {
      name: 'createTaggedElements',
      data: {
        guideBaseId: guide.createdFromGuideBaseId,
        guideId: guide.id,
      },
    }
  );
}
