import { keyBy } from 'lodash';
import promises from 'src/utils/promises';

import { isInputStep } from 'bento-common/data/helpers';

import { withTransaction } from 'src/data';
import { Module } from 'src/data/models/Module.model';
import { ModuleStepPrototype } from 'src/data/models/ModuleStepPrototype.model';
import { Organization } from 'src/data/models/Organization.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { User } from 'src/data/models/User.model';
import AuditContext, { AuditEvent } from 'src/utils/auditContext';
import { removeUndefined } from 'src/utils/helpers';
import {
  formatBranchingChoices,
  setBranchingPaths,
} from '../branching/setBranchingPaths';
import {
  ModuleInput,
  updateAffectedTemplates,
  validateStepPrototypes,
} from 'src/graphql/Module/mutations/moduleMutations.helpers';
import { editStepPrototypeCtas } from '../ctas/editStepPrototypeCtas';
import { deleteStepPrototypeCtas } from '../ctas/deleteStepPrototypeCtas';
import { editStepPrototypeAutoCompleteInteraction } from '../editStepPrototypeAutoCompleteInteraction';
import { deleteStepPrototypeAutoCompleteInteraction } from '../deleteStepPrototypeAutoCompleteInteraction';
import editInputsOfStepPrototype from '../inputFields/editInputsOfStepPrototype';
import deleteInputsOfStepPrototype from '../inputFields/deleteInputsOfStepPrototype';
import { editStepPrototypeEventMappings } from '../editStepPrototypeEventMappings';
import detachPromise from 'src/utils/detachPromise';
import { deleteStepPrototypeAutoCompleteInteractions } from '../autoComplete/deleteStepPrototypeAutoCompleteInteractions';
import { editStepPrototypeAutoCompleteInteractions } from '../autoComplete/editStepPrototypeAutoCompleteInteractions';
import { editStepPrototypeMedia } from '../editStepPrototypeMedia';
import { deleteStepPrototypeMedia } from '../deleteStepPrototypeMediaReferences';
import deletePrototypeTaggedElement from '../taggedElements/deletePrototypeTaggedElement';
import upsertPrototypeTaggedElement from '../taggedElements/upsertPrototypeTaggedElement';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';

type Args = {
  moduleData: ModuleInput;
  module: Module;
  organization: Organization;
  user: User;
  updatedFromTemplateId?: number;
  skipStepNameValidation?: boolean;
  onChangesCommitted?: (changes: number) => void;
};

type Options = {
  auditContext?: AuditContext;
};

/** Apply mutation input changes to modules */
export default async function editModule(
  {
    module,
    moduleData,
    organization,
    user,
    updatedFromTemplateId,
    skipStepNameValidation,
    onChangesCommitted,
  }: Args,
  { auditContext }: Options
) {
  return withTransaction(async () => {
    let moduleChanges = 0;

    if (moduleData.stepPrototypes.length === 0)
      throw new Error('At least one step is required');

    // Validate step branching and inputs
    const validationErrors = await validateStepPrototypes({
      input: moduleData.stepPrototypes || [],
      theme: undefined,
      allowNamelessSteps: skipStepNameValidation,
    });

    if (validationErrors) return validationErrors;

    const stepPrototypeEntityIds = moduleData.stepPrototypes.flatMap((sp) =>
      sp.entityId ? [sp.entityId] : []
    );
    let stepPrototypes;
    if (stepPrototypeEntityIds.length > 0) {
      stepPrototypes = await StepPrototype.findAll({
        where: {
          entityId: stepPrototypeEntityIds,
        },
      });
    } else {
      stepPrototypes = [];
    }

    const stepPrototypesByEntityId: Record<string, StepPrototype> = keyBy(
      stepPrototypes,
      'entityId'
    );

    const data = {
      name: moduleData.name || '',
      description: moduleData.description,
      updatedByUserId: user.id,
    };

    removeUndefined(data);
    module.set(data as unknown as Module);

    const changes = module.changed();
    moduleChanges += Array.isArray(changes) ? changes.length : 0;

    // Update template 'updatedAt' timestamp.
    module.changed('displayTitle', true);
    await module.save();

    await ModuleStepPrototype.destroy({
      where: {
        moduleId: module.id,
      },
    });

    await promises.mapSeries(
      moduleData.stepPrototypes,
      async (stepPrototypeData, stepPrototypeIdx) => {
        const existingStep =
          stepPrototypeData.entityId &&
          stepPrototypesByEntityId[stepPrototypeData.entityId];

        const {
          branchingEntityType,
          branchingPathData,
          eventMappings,
          autoCompleteInteraction,
          autoCompleteInteractions,
        } = stepPrototypeData || {};

        let stepPrototype: StepPrototype;
        if (existingStep) {
          stepPrototype = existingStep;
          const stepData = {
            name: stepPrototypeData.name,
            body: stepPrototypeData.body,
            bodySlate: stepPrototypeData.bodySlate,
            stepType: stepPrototypeData.stepType,
            branchingQuestion: stepPrototypeData.branchingQuestion,
            branchingMultiple: stepPrototypeData.branchingMultiple,
            branchingDismissDisabled:
              stepPrototypeData.branchingDismissDisabled,
            branchingChoices: formatBranchingChoices(branchingPathData),
            branchingFormFactor: stepPrototypeData.branchingFormFactor,
            manualCompletionDisabled:
              !eventMappings?.length &&
              !autoCompleteInteraction &&
              !autoCompleteInteractions?.length
                ? false // override for manually completed steps
                : !!stepPrototypeData.manualCompletionDisabled,
            updatedByUserId: user.id,
            snappyAt: stepPrototypeData.snappyAt,
          };

          removeUndefined(stepData);
          stepPrototype.set(stepData as unknown as StepPrototype);

          const changes = stepPrototype.changed();
          moduleChanges += Array.isArray(changes) ? changes.length : 0;

          await stepPrototype.save();
        } else {
          stepPrototype = await StepPrototype.create({
            name: stepPrototypeData.name,
            body: stepPrototypeData.body,
            bodySlate: stepPrototypeData.bodySlate,
            stepType: stepPrototypeData.stepType,
            branchingQuestion: stepPrototypeData.branchingQuestion,
            branchingMultiple: stepPrototypeData.branchingMultiple,
            branchingDismissDisabled:
              stepPrototypeData.branchingDismissDisabled,
            branchingChoices: formatBranchingChoices(branchingPathData),
            branchingFormFactor: stepPrototypeData.branchingFormFactor,
            manualCompletionDisabled:
              stepPrototypeData.manualCompletionDisabled,
            organizationId: organization.id,
            createdByUserId: user.id,
            updatedByUserId: user.id,
            snappyAt: stepPrototypeData.snappyAt,
          });
          moduleChanges++;
        }

        await ModuleStepPrototype.create({
          moduleId: module.id,
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

        if (stepPrototypeData?.ctas?.length) {
          // Update step ctas.
          await editStepPrototypeCtas({
            stepPrototype,
            ctas: stepPrototypeData.ctas,
          });
        } else {
          // Delete step ctas.
          await deleteStepPrototypeCtas({
            stepPrototype,
          });
        }

        if (stepPrototypeData?.mediaReferences?.length) {
          // Update step medias.
          await editStepPrototypeMedia({
            stepPrototype,
            mediaReferencesData: stepPrototypeData.mediaReferences,
          });
        } else {
          // Delete step media.
          await deleteStepPrototypeMedia({
            stepPrototype,
          });
        }

        if (stepPrototypeData.autoCompleteInteraction) {
          // Update auto complete interaction.
          await editStepPrototypeAutoCompleteInteraction({
            stepPrototype,
            stepAutoCompleteInteraction:
              stepPrototypeData.autoCompleteInteraction,
          });
        } else {
          // Delete step auto complete interaction.
          await deleteStepPrototypeAutoCompleteInteraction({
            stepPrototype,
          });
        }

        if (stepPrototypeData?.autoCompleteInteractions?.length) {
          // Upsert auto-complete interactions
          await editStepPrototypeAutoCompleteInteractions({
            stepPrototype,
            interactions: stepPrototypeData.autoCompleteInteractions,
          });
        } else {
          // Delete all auto-complete interactions
          await deleteStepPrototypeAutoCompleteInteractions({
            stepPrototype,
          });
        }

        if (updatedFromTemplateId) {
          const tag = stepPrototypeData?.taggedElements?.[0];

          if (tag) {
            await upsertPrototypeTaggedElement({
              input: tag,
              template: updatedFromTemplateId,
              stepPrototype,
              organization,
            });
          } else {
            await deletePrototypeTaggedElement({
              stepPrototype,
              organization,
              template: updatedFromTemplateId,
            });
          }
        }

        if (isInputStep(stepPrototypeData?.stepType)) {
          if (stepPrototypeData?.inputs) {
            // update inputs
            await editInputsOfStepPrototype({
              stepPrototype,
              inputs: stepPrototypeData.inputs,
            });
          } else {
            // fully delete inputs
            await deleteInputsOfStepPrototype(stepPrototype);
          }
        }
      }
    );

    // Always sync the module to all associated templates, otherwise
    // we run the risk of missing updates to underlying objects (i.e. ctas, inputs, etc)
    await queueJob({
      jobType: JobType.SyncTemplateChanges,
      type: 'module',
      moduleId: module.id,
      skipTemplateId: updatedFromTemplateId,
      organizationId: organization.id,
    });

    if (moduleChanges > 0) {
      if (auditContext) {
        /**
         * If modified from a template, the template will update its own audit
         * This would just create a duplicate content updated log
         */
        if (!updatedFromTemplateId)
          auditContext.logEvent({
            eventName: AuditEvent.contentChanged,
          });

        detachPromise(
          () =>
            updateAffectedTemplates({
              auditContext,
              module,
              updatedFromTemplateId,
            }),
          'editModule: updateAffectedTemplates'
        );
      }
    }

    await module.reload();

    onChangesCommitted?.(moduleChanges);

    return module;
  });
}
