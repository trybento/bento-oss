import { omit } from 'lodash';
import promises from 'src/utils/promises';
import { Theme, StepAutoCompleteRule } from 'bento-common/types';
import { isBranchingTypeSupported } from 'bento-common/data/helpers';

import { StepPrototypeCta } from 'src/data/models/StepPrototypeCta.model';
import { Module } from 'src/data/models/Module.model';
import { withTransaction } from 'src/data';
import duplicateModule from './duplicateModule';
import { setStepAutoCompleteMapping } from '../setStepAutoCompleteMapping';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { ModuleStepPrototype } from 'src/data/models/ModuleStepPrototype.model';
import { StepEventMapping } from 'src/data/models/StepEventMapping.model';
import { StepEventMappingRule } from 'src/data/models/StepEventMappingRule.model';
import { BranchingPath } from 'src/data/models/BranchingPath.model';
import { Organization } from 'src/data/models/Organization.model';
import { User } from 'src/data/models/User.model';
import { InputStepPrototype } from 'src/data/models/InputStepPrototype.model';
import MediaReference from 'src/data/models/MediaReference.model';
import { MediaReferenceType } from 'bento-common/types/media';

type Args = {
  moduleStepPrototypes: ModuleStepPrototype[];
  module: Module;
  theme?: Theme;
  organization: Organization;
  user?: User;
};

export default async function duplicateStepPrototypes({
  moduleStepPrototypes,
  module,
  theme,
  organization,
  user,
}: Args) {
  return withTransaction(() =>
    promises.mapSeries(moduleStepPrototypes, async (moduleStepPrototype) => {
      const stepPrototype = moduleStepPrototype.stepPrototype!;
      const branchingArgs = {
        stepType: stepPrototype.stepType,
        branchingQuestion: stepPrototype.branchingQuestion,
        branchingMultiple: stepPrototype.branchingMultiple,
        branchingDismissDisabled: stepPrototype.branchingDismissDisabled,
        branchingChoices: stepPrototype.branchingChoices,
        branchingFormFactor: stepPrototype.branchingFormFactor,
      };

      const stepPrototypeCopy = await StepPrototype.create({
        name: stepPrototype.name,
        body: stepPrototype.body,
        bodySlate: stepPrototype.bodySlate,
        inputType: stepPrototype.inputType,
        organizationId: organization.id,
        dismissLabel: stepPrototype.dismissLabel,
        createdByUserId: user?.id,
        updatedByUserId: user?.id,
        manualCompletionDisabled: stepPrototype.manualCompletionDisabled,
        snappyAt: stepPrototype.snappyAt,
        ...branchingArgs,
      });

      const ctas = await stepPrototype.$get('ctas');
      const duplicateCtasData = ctas.map((cta) => ({
        ...omit(cta.toJSON(), [
          'id',
          'entityId',
          'stepPrototypeId',
          'createdAt',
          'updatedAt',
        ]),
        stepPrototypeId: stepPrototypeCopy.id,
      }));
      await StepPrototypeCta.bulkCreate(duplicateCtasData);

      const mediaReferences = await MediaReference.findAll({
        where: {
          referenceId: stepPrototype.id,
          referenceType: MediaReferenceType.stepPrototype,
        },
      });
      const duplicateMediaReferencesData = mediaReferences.map((mr) => ({
        ...omit(mr.toJSON(), [
          'id',
          'entityId',
          'referenceId',
          'createdAt',
          'updatedAt',
        ]),
        referenceId: stepPrototypeCopy.id,
      }));
      await MediaReference.bulkCreate(duplicateMediaReferencesData);

      const originalInputs = await stepPrototype.$get('inputs');
      if (originalInputs?.length)
        await InputStepPrototype.bulkCreate(
          originalInputs.map((oi) => ({
            ...omit(oi.toJSON(), [
              'id',
              'entityId',
              'createdAt',
              'updatedAt',
              'stepPrototypeId',
            ]),
            stepPrototypeId: stepPrototypeCopy.id,
          }))
        );

      await stepPrototypeCopy.update({
        branchingKey: stepPrototypeCopy.entityId,
      });

      await ModuleStepPrototype.create({
        moduleId: module.id,
        stepPrototypeId: stepPrototypeCopy.id,
        organizationId: organization.id,
        orderIndex: moduleStepPrototype.orderIndex,
      });

      const stepEventMapping = await StepEventMapping.findOne({
        where: {
          stepPrototypeId: stepPrototype.id,
          organizationId: stepPrototype.organizationId,
        },
      });

      if (stepEventMapping) {
        const eventName = stepEventMapping.eventName;
        const completeForWholeAccount =
          stepEventMapping.completeForWholeAccount;
        const rules = (await StepEventMappingRule.findAll({
          where: {
            stepEventMappingId: stepEventMapping.id,
          },
        })) as StepAutoCompleteRule[];

        await setStepAutoCompleteMapping({
          stepPrototype: stepPrototypeCopy,
          eventName,
          completeForWholeAccount,
          rules,
        });
      }

      const originalBranchingPaths = await BranchingPath.findAll({
        where: { branchingKey: stepPrototype.entityId },
      });

      if (originalBranchingPaths && originalBranchingPaths.length) {
        await promises.mapSeries(
          originalBranchingPaths as BranchingPath[],
          async (originalBranchingPath) => {
            const { entityType, actionType, choiceKey, templateId, moduleId } =
              originalBranchingPath;

            const crossOrgDuplicate =
              stepPrototype.organizationId !== organization.id;

            let newModuleId: number | undefined;

            if (crossOrgDuplicate && moduleId) {
              const targetModule = await Module.findOne({
                where: {
                  id: moduleId,
                },
              });

              if (targetModule) {
                const duplicated = await duplicateModule({
                  organization,
                  module: targetModule,
                  user,
                  preserveName: true,
                  theme,
                });

                newModuleId = duplicated.id;
              }
            }

            // Copy branching paths if branching type
            // is supported.
            if (
              isBranchingTypeSupported({
                entityType,
                theme,
                isCyoa: module.isCyoa,
              })
            ) {
              await BranchingPath.create({
                entityType,
                actionType,
                choiceKey,
                templateId,
                moduleId: newModuleId || moduleId,
                branchingKey: stepPrototypeCopy.entityId,
                organizationId: organization.id,
              });
            }
          }
        );
      }

      return stepPrototypeCopy;
    })
  );
}
