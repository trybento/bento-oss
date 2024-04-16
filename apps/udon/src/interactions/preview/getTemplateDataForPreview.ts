import { pick } from 'lodash';
import { transformedFullGuideAssociations } from 'bento-common/utils/previews';
import {
  FullGuide,
  FullModule,
  Guide,
  GuideEntityId,
  Module,
  ModuleEntityId,
  Step,
  StepEntityId,
  StepState,
} from 'bento-common/types/globalShoyuState';
import { guideNameOrFallback } from 'bento-common/utils/naming';

import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { Template } from 'src/data/models/Template.model';
import { Module as ModuleModel } from 'src/data/models/Module.model';

type Args = {
  template: Template;
};

/**
 * Given a template, returns all the preview data including
 * modules and steps in the shape of Embed types, useful
 * to handle high fidelity previews.
 */
export async function getTemplateDataForPreview({
  template,
}: Args): Promise<FullGuide | undefined> {
  if (!template) return undefined;

  // loads all modules with step prototypes
  const modules = await template.$get('modules', {
    include: [StepPrototype],
  });

  return transformedFullGuideAssociations({
    ...getGuideObject(template),
    modules: modules.map(getModuleObject),
  });
}

/**
 * Builds the guide object from the template, setting
 * all progress indicator props as "untouched".
 */
function getGuideObject(template: Template): FullGuide {
  const guideObject = pick(template, [
    'type',
    'theme',
    'isSideQuest',
    'formFactor',
    'formFactorStyle',
    'designType',
    'pageTargetingType',
    'pageTargetingUrl',
  ]) as unknown as Guide;

  return {
    ...guideObject,
    name: guideNameOrFallback(template.name),
    entityId: template.entityId as GuideEntityId,
    isComplete: false,
    isDone: false,
    isViewed: false,
    completedStepsCount: 0,
    totalSteps: 0, // should be overridden later
    pageTargeting: {
      type: guideObject.pageTargetingType,
      url: guideObject.pageTargetingUrl || undefined,
    },
    orderIndex: 0,
    isPreview: true,
    modules: [], // should be overridden later
    steps: [], // should be overridden later
    taggedElements: [], // should/can be overriden later
  };
}

/**
 * Builds the module object from the module.
 */
function getModuleObject(
  module: ModuleModel,
  moduleIndex: number,
  modules: ModuleModel[]
): FullModule {
  const moduleObject = pick(module, ['entityId', 'name']) as unknown as Module;

  return {
    ...moduleObject,
    entityId: module.entityId as ModuleEntityId,
    orderIndex: moduleIndex,
    steps: module.stepPrototypes.map(getStepObject),
    totalStepsCount: module.stepPrototypes.length,
    completedStepsCount: 0,
    isComplete: false,
    firstIncompleteStep: module.stepPrototypes[0]?.entityId as StepEntityId,
    isPreview: true,
    previousModule: modules[moduleIndex - 1]?.entityId as ModuleEntityId,
    nextModule: modules[moduleIndex + 1]?.entityId as ModuleEntityId,
  };
}

/**
 * Builds the step object from the stepPrototype,
 * setting all progress indicator props as "untouched".
 *
 * @todo Add branching support
 */
function getStepObject(
  step: StepPrototype,
  index: number,
  steps: StepPrototype[]
): Step {
  const stepObject = pick(step, [
    'name',
    'stepType',
    'bodySlate',
    'ctas',
    'branching',
  ]) as unknown as Step;

  return {
    ...stepObject,
    entityId: step.entityId as StepEntityId,
    hasViewedStep: false,
    isComplete: false,
    orderIndex: index,
    state: StepState.incomplete,
    wasCompletedAutomatically: false,
    isPreview: true,
    nextStep: steps[index + 1]?.entityId as StepEntityId,
    previousStep: steps[index - 1]?.entityId as StepEntityId,
  };
}
