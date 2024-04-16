import { keyBy } from 'lodash';
import { AtLeast } from 'bento-common/types';

import { Organization } from 'src/data/models/Organization.model';
import { Template } from 'src/data/models/Template.model';
import { TemplateModule } from 'src/data/models/TemplateModule.model';
import { StepPrototypeTaggedElement } from 'src/data/models/StepPrototypeTaggedElement.model';
import { pickCommonTaggedElementFields } from './helpers';
import { extractId } from 'src/utils/helpers';

type Args = {
  organization: number | AtLeast<Organization, 'id'>;
  originalTemplate: number | AtLeast<Template, 'id'>;
  copyTemplate: number | AtLeast<Template, 'id'>;
};

/**
 * Duplicate all step prototype tagged elements from one template to another right after
 * one is duplicated from the other.
 *
 * WARNING: Returns the duplicated tag prototypes unsorted.
 */
export default async function duplicatePrototypeTaggedElementOfSteps({
  organization,
  originalTemplate,
  copyTemplate,
}: Args): Promise<StepPrototypeTaggedElement[]> {
  const organizationId = extractId(organization);
  const originalTemplateId = extractId(originalTemplate);
  const copyTemplateId = extractId(copyTemplate);

  const originalModules = (
    await TemplateModule.scope([
      { method: ['withModule', true] },
      'byOrderIndex',
    ]).findAll({
      where: {
        organizationId,
        templateId: originalTemplateId,
      },
    })
  ).map((tm) => tm.module);

  // finish if no original modules are found
  if (!originalModules.length) return [];

  const copyModules = (
    await TemplateModule.scope([
      { method: ['withModule', true] },
      'byOrderIndex',
    ]).findAll({
      where: {
        organizationId,
        templateId: copyTemplateId,
      },
    })
  ).map((tm) => tm.module);

  if (copyModules.length !== originalModules.length) {
    throw new Error('Expected same number of modules from copy of Template');
  }

  // flatten all original step prototype ids
  const originalStepPrototypeIds = originalModules.flatMap((m) => {
    return m.moduleStepPrototypes.map((msp) => msp.stepPrototype.id);
  });

  // find all original step prototypes
  const originalTagPrototypes = await StepPrototypeTaggedElement.findAll({
    where: {
      organizationId,
      templateId: originalTemplateId,
      stepPrototypeId: originalStepPrototypeIds,
    },
  });

  // finish if no prototype tags are found
  if (!originalTagPrototypes.length) return [];

  // key original tag prototypes by step prototype id
  const originalTagPrototypesByStepPrototypeId = keyBy(
    originalTagPrototypes,
    'stepPrototypeId'
  );

  // for each original module
  const tagPrototypesToCreate = originalModules.flatMap(
    (originalModule, mIndex) => {
      // continue if no step prototypes are found
      if (!originalModule.moduleStepPrototypes.length) return;

      const tagPrototypesOfModule: any[] = [];

      originalModule.moduleStepPrototypes.forEach((originalMsp, mspIndex) => {
        const originalStepPrototype = originalMsp.stepPrototype;
        const originalTagPrototype =
          originalTagPrototypesByStepPrototypeId[originalStepPrototype.id];

        // continue if step prototype does not contain a tag
        if (!originalTagPrototype) return undefined;

        // map the copy of the original step prototype id
        const copyStepPrototypeId =
          copyModules[mIndex]?.moduleStepPrototypes[mspIndex]?.stepPrototype
            ?.id;

        if (!copyStepPrototypeId) {
          throw new Error('Cannot map original Step Prototype Id to copy');
        }

        // compose the new tag prototype
        tagPrototypesOfModule.push({
          organizationId,
          templateId: copyTemplateId,
          stepPrototypeId: copyStepPrototypeId,
          ...pickCommonTaggedElementFields(originalTagPrototype),
        });
      });

      return tagPrototypesOfModule;
    }
  );

  return StepPrototypeTaggedElement.bulkCreate(tagPrototypesToCreate);
}
