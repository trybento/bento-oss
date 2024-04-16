import Dataloader from 'dataloader';
import { StepPrototypeTaggedElement } from 'src/data/models/StepPrototypeTaggedElement.model';
import { Template } from 'src/data/models/Template.model';

type Args = {
  /** Which step prototype the tag prototype belongs to */
  stepPrototypeId: number;
  /** Which template the tag prototype belongs to */
  templateEntityId: string | undefined;
};

/**
 * This is intended for cases where we might be searching by Step Prototype Id and/or Template Entity Id.
 *
 * WARNING: If you won't ever be searching by a given Template Entity Id, please use
 * `stepPrototypeTaggedElementsOfStepPrototypeLoader` instead to improve performance.
 */
export default function stepPrototypeTaggedElementsOfStepPrototypeAndTemplate() {
  return new Dataloader<Args, StepPrototypeTaggedElement[], string>(
    async (args) => {
      const stepPrototypeIds = Array.from(
        new Set(args.map(({ stepPrototypeId }) => stepPrototypeId))
      );
      const templateEntityIds = Array.from(
        new Set(
          args.flatMap(({ templateEntityId }) =>
            templateEntityId ? [templateEntityId] : []
          )
        )
      );

      /**
       * Will have the following shape:
       *
       * {
       *   [stepPrototypeId]: {
       *     [templateId]: StepPrototypeTaggedElement[],
       *     ...
       *   }
       *   ...
       * }
       */
      const taggedElements = (
        await StepPrototypeTaggedElement.findAll({
          where: {
            stepPrototypeId: stepPrototypeIds,
          },
          include: [
            {
              model: Template,
              required: true,
              attributes: ['entityId'],
              where:
                templateEntityIds.length > 0
                  ? { entityId: templateEntityIds }
                  : {},
            },
          ],
        })
      ).reduce((out, curr) => {
        const stepPrototypeId = curr.stepPrototypeId;
        const templateEntityId = curr.template.entityId;

        if (stepPrototypeId) {
          if (!out[stepPrototypeId]) {
            out[stepPrototypeId] = {};
          }

          if (!out[stepPrototypeId][templateEntityId]) {
            out[stepPrototypeId][templateEntityId] = [];
          }

          out[stepPrototypeId][templateEntityId].push(curr);
        }

        return out;
      }, {} as { [key: number]: { [key: string]: StepPrototypeTaggedElement[] } });

      return args.map(({ stepPrototypeId, templateEntityId }) => {
        if (templateEntityId) {
          if (
            taggedElements[stepPrototypeId] &&
            taggedElements[stepPrototypeId][templateEntityId]
          ) {
            return taggedElements[stepPrototypeId][templateEntityId];
          }
        } else {
          return Object.values(taggedElements[stepPrototypeId]).flat();
        }

        return [];
      });
    },
    {
      cacheKeyFn: (args) => `${args.stepPrototypeId}-${args.templateEntityId}`,
    }
  );
}
