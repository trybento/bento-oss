import promises from 'src/utils/promises';
import { getDefaultStepCtas } from 'bento-common/data/helpers';
import { CtaInput } from 'bento-common/types';
import { isFlowGuide } from 'bento-common/utils/formFactor';

import {
  formatBranchingChoices,
  setBranchingPaths,
} from '../branching/setBranchingPaths';
import { createStepPrototypeCtas } from 'src/interactions/ctas/createStepPrototypeCtas';
import { editStepPrototypeEventMappings } from 'src/interactions/editStepPrototypeEventMappings';
import { Organization } from 'src/data/models/Organization.model';
import { User } from 'src/data/models/User.model';
import {
  NewModuleInput,
  StepPrototypeInput,
} from 'src/graphql/Module/mutations/moduleMutations.helpers';
import { Module } from 'src/data/models/Module.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { ModuleStepPrototype } from 'src/data/models/ModuleStepPrototype.model';
import { Template } from 'src/data/models/Template.model';
import { createStepPrototypeMedia } from '../createStepPrototypeMedia';
import upsertPrototypeTaggedElement from '../taggedElements/upsertPrototypeTaggedElement';

type Args = {
  moduleData: NewModuleInput;
  user: User;
  organization: Organization;
} & (
  | {
      createCtasForTemplate?: true;
      template: Template | undefined;
    }
  | { createCtasForTemplate?: false; template?: never }
);

export default async function createModule({
  user,
  organization,
  moduleData,
  template,
  createCtasForTemplate,
}: Args) {
  const createdModule = await Module.create({
    name: moduleData.name,
    description: moduleData.description,
    organizationId: organization.id,
    isCyoa: moduleData?.isCyoa,
    createdFromFormFactor: moduleData.createdFromFormFactor,
    createdByUserId: user.id,
    updatedByUserId: user.id,
  });

  await promises.mapSeries(
    moduleData.stepPrototypes as StepPrototypeInput[],
    async (stepPrototypeData, stepPrototypeIdx) => {
      const { branchingEntityType, branchingPathData } =
        stepPrototypeData || {};

      const stepPrototype = await StepPrototype.create({
        name: stepPrototypeData.name,
        body: stepPrototypeData.body,
        bodySlate: stepPrototypeData.bodySlate,
        stepType: stepPrototypeData.stepType,
        branchingQuestion: stepPrototypeData.branchingQuestion,
        branchingMultiple: stepPrototypeData.branchingMultiple,
        branchingDismissDisabled: stepPrototypeData.branchingDismissDisabled,
        branchingFormFactor: stepPrototypeData.branchingFormFactor,
        manualCompletionDisabled: stepPrototypeData.manualCompletionDisabled,
        branchingChoices: formatBranchingChoices(branchingPathData),
        organizationId: organization.id,
        createdByUserId: user.id,
        updatedByUserId: user.id,
        snappyAt: stepPrototypeData.snappyAt,
      });

      await ModuleStepPrototype.create({
        moduleId: createdModule.id,
        stepPrototypeId: stepPrototype.id,
        organizationId: organization.id,
        orderIndex: stepPrototypeIdx,
      });

      if (stepPrototypeData?.eventName) {
        await editStepPrototypeEventMappings({
          stepPrototype,
          /**
           * DEPRECATED: Use eventMappings. Temporarily leaving to avoid
           * mutation errors for cached clients.
           */
          eventMappings: [
            {
              eventName: stepPrototypeData?.eventName,
              completeForWholeAccount:
                stepPrototypeData?.completeForWholeAccount,
              rules: stepPrototypeData?.stepEventMappingRules,
            },
          ],
        });
      } else {
        await editStepPrototypeEventMappings({
          stepPrototype,
          eventMappings: stepPrototypeData?.eventMappings,
        });
      }

      await setBranchingPaths({
        branchingKey: stepPrototype.entityId,
        branchingEntityType,
        organization,
        branchingPathData,
      });

      await createStepPrototypeCtas({
        stepPrototype,
        ctas: createCtasForTemplate
          ? (getDefaultStepCtas({
              stepType: stepPrototype.stepType,
              theme: template?.theme,
              branchingMultiple: stepPrototype.branchingMultiple,
              branchingType: branchingEntityType,
              guideFormFactor: template?.formFactor,
            }) as CtaInput[])
          : stepPrototypeData?.ctas,
      });

      await createStepPrototypeMedia({
        stepPrototype,
        mediaReferencesData: stepPrototypeData?.mediaReferences,
      });

      /**
       * Creation of new tags for new steps is currently
       * allowed only for Flow guides when the auto builder is being
       * used, due to existing propagation issues for other guide types.
       */
      if (isFlowGuide(template?.formFactor) && template) {
        const tag = stepPrototypeData?.taggedElements?.[0];
        if (tag) {
          await upsertPrototypeTaggedElement({
            template,
            stepPrototype,
            input: tag,
            organization,
          });
        }
      }
    }
  );

  return createdModule;
}
