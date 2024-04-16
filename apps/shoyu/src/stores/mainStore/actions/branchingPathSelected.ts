import { denormalize } from 'normalizr';
import { BranchingEntityType } from 'bento-common/types';
import {
  FullGuide,
  GlobalStateActionPayload,
  Guide,
  StepState,
} from 'bento-common/types/globalShoyuState';
import {
  deProxify,
  isFlatTheme,
  isSerialCyoa,
} from 'bento-common/data/helpers';
import { isModulelessGuide } from 'bento-common/utils/formFactor';

import selectBranchingPath from '../mutators/selectBranchingPath';
import { WorkingState } from './../types';
import {
  branchingChoiceResourceSelector,
  stepSelector,
  guideSelector,
  moduleSelector,
  stepsSelectorOfGuide,
  modulesSelectorOfGuide,
} from '../helpers/selectors';
import { getGuideCompletionUpdateData } from '../helpers';
import normalizrSchema from '../schema';
import mainStore from '..';
import moduleBranchingReset from './moduleBranchingReset';
import { omit } from 'bento-common/utils/lodash';

export default function branchingPathSelected(
  state: WorkingState,
  {
    updateCompletionOnServer,
    ...payload
  }: GlobalStateActionPayload<'branchingPathSelected'>
) {
  const step = stepSelector(payload.stepEntityId, state);
  const module = moduleSelector(step?.module, state);
  const guide = guideSelector(step?.guide, state);
  const steps = stepsSelectorOfGuide(guide?.entityId, state);
  const guideModules = modulesSelectorOfGuide(guide?.entityId, state);
  const isPreview = !!guide?.isPreview;

  const shouldCompleteStep = payload.choiceKeys.length > 0;

  const serialCyoa = isSerialCyoa(
    step?.branching?.type,
    step?.branching?.multiSelect
  );

  if (guide) {
    if (!updateCompletionOnServer) {
      // Patch state with selections.
      (step?.branching?.branches || []).map((branch) => {
        branch.selected = payload.choiceKeys.includes(branch.key);
      });

      return;
    } else if (!guide.isPreview) {
      selectBranchingPath({
        ...payload,
        shouldCompleteStep,
      });
    } else if (step?.branching?.type === BranchingEntityType.Module) {
      // Reset choices.
      moduleBranchingReset(state, { stepEntityId: payload.stepEntityId });
    }
  }

  // optimisitic/preview mode branching updates
  const { guides, modules } = branchingChoiceResourceSelector(
    state,
    payload.branchingKey,
    payload.choiceKeys
  );
  if (guides || modules) {
    // only do all the fancy optimistic stuff if we actually know where we're
    // going next
    if (guide && step) {
      const completedBranchingGuidesToKeep: Guide[] = [];

      // update the branching selection in the current step, and change
      const updatedStep = {
        ...step,
        isComplete: shouldCompleteStep,
        completedAt: shouldCompleteStep
          ? step.completedAt || new Date()
          : undefined,
        state: shouldCompleteStep ? StepState.complete : StepState.incomplete,
        branching: step.branching && {
          ...step.branching,
          branches: step.branching.branches.map((b) => {
            const branchingGuideToKeep =
              serialCyoa && b.selected
                ? Object.values<Guide>(state.guides).find(
                    (g) =>
                      g.isPreview === isPreview &&
                      g.isComplete &&
                      g.branchedFromChoice?.choiceKey === b.key
                  )
                : null;
            if (branchingGuideToKeep)
              completedBranchingGuidesToKeep.push(branchingGuideToKeep);

            return {
              ...b,
              selected:
                payload.choiceKeys.includes(b.key) ||
                /**
                 * For serial CYOA guides, reset selected branches that
                 * are not complete.
                 */
                !!branchingGuideToKeep,
            };
          }),
        },
      };

      /**
       * NOTE:
       * For these optimistic updates we want to mimic as closely as possible
       * what would happen if the server were handling all of this since the
       * logic to handle all the transitions has to specify very specific
       * conditions for each transition.
       *
       * In general when a branch is selected the guide changed subscription
       * for the branching guide will trigger first, then for guide branching
       * the available guides changed subscription, and finally the new guide
       * will be hydrated (effectively `guideChanged` as well). Module branching
       * will only trigger the initial
       */
      const updatedGuideSteps = steps.map((s) =>
        s.entityId === step.entityId ? updatedStep : s
      );

      const { moduleCompletedStepsCounts, ...guideCompletionData } =
        getGuideCompletionUpdateData(guide, updatedGuideSteps);

      if (guides) {
        // make sure all the new guides have the correct indicies and next/previous guides
        const newGuides = deProxify(
          guides.map((g, i) => ({
            ...g,
            /**
             * Two or more guide branches might share
             * the same module. Since a module/step can only
             * point to one parent, update the guide reference to
             * avoid hydrating incomplete guides.
             */
            modules: g.modules.map((m) => {
              m.guide = g.entityId;
              m.steps = m.steps.map((s) => {
                s.guide = g.entityId;
                return s;
              });
              return m;
            }),
            firstIncompleteModule: g.modules[0].entityId,
            firstIncompleteStep: g.steps[0].entityId,
            orderIndex: guides.length - i - 1,
            previousGuide: i === 0 ? guide.entityId : guides[i - 1].entityId,
            nextGuide: guides[i + 1]?.entityId,
            branchedFromGuide: step.guide,
          }))
        );
        const updatedGuideData = deProxify({
          ...guideCompletionData,
          // set the first new guide as the next guide
          nextGuide: guides?.[0].entityId,
          // the order index is descending order so the most recent guide is always index: 0
          orderIndex: guides?.length,
          steps: updatedGuideSteps,
          canResetOnboarding: true,
          modules: guideModules.map((m) => ({
            ...m,
            completedStepsCount:
              moduleCompletedStepsCounts[m.entityId] ?? m.completedStepsCount,
            isComplete:
              (moduleCompletedStepsCounts[m.entityId] ??
                m.completedStepsCount) === m.totalStepsCount,
            steps: m.steps!.map(
              (stepEntityId) =>
                updatedGuideSteps.find((s) => s.entityId === stepEntityId)!
            ),
          })),
        });

        const availableGuides = deProxify([
          {
            ...omit(guide, ['modules', 'steps']),
            ...omit(updatedGuideData, ['modules', 'steps']),
          },
          ...[...completedBranchingGuidesToKeep, ...newGuides].map((g) =>
            omit(g, ['modules', 'steps'])
          ),
        ]) as Guide[];
        setTimeout(() => {
          mainStore.getState().dispatch({
            type: 'availableGuidesChanged',
            availableGuides,
            keepExistingSelections: true,
          });
          // mimic guide hydration
          for (const newGuide of newGuides) {
            mainStore
              .getState()
              .dispatch({ type: 'guideChanged', guide: newGuide });
          }
          mainStore.getState().dispatch({
            type: 'guideChanged',
            guide: updatedGuideData,
          });
        }, 1);
      } else if (modules && module) {
        // get the full guide including all full modules and steps
        let fullGuide = denormalize(
          step?.guide,
          normalizrSchema.guide,
          state
        ) as FullGuide;

        const currentModule = fullGuide.modules.find(
          (m) => m.entityId === module.entityId
        )!;
        currentModule.nextModule = modules[0].entityId;
        currentModule.steps = currentModule.steps.map((s) =>
          s.entityId === step.entityId ? updatedStep : s
        );
        currentModule.completedStepsCount =
          moduleCompletedStepsCounts[currentModule.entityId] ??
          currentModule.completedStepsCount;
        fullGuide.steps = updatedGuideSteps;

        const prevNextModule = moduleSelector(module.nextModule, state);

        const isModuleless = isModulelessGuide(guide.theme, guide.formFactor);

        let startingStepIndex =
          isModuleless || isFlatTheme(guide.theme)
            ? module.steps?.length || 0
            : 0;
        // ensure all the modules and steps point to the correct next/previous
        // and the order index is correct
        const newModules = modules.map((m, i) => {
          if (i > 0) {
            startingStepIndex = isModuleless
              ? startingStepIndex + m.steps.length
              : 0;
          }
          return {
            ...m,
            orderIndex: module.orderIndex + i + 1,
            previousModule: modules[i - 1]?.entityId || module.entityId,
            nextModule: modules[i + 1]?.entityId || module.nextModule,
            guide: guide.entityId,
            steps: m.steps.map((s) => ({
              ...s,
              orderIndex: startingStepIndex + s.orderIndex,
              guide: guide.entityId,
            })),
          };
        });

        if (prevNextModule) {
          prevNextModule.previousModule = modules.slice(-1)[0].entityId;
          prevNextModule.orderIndex = module.orderIndex + modules.length;
        }

        // insert the new modules after the current module
        fullGuide.modules.splice(module.orderIndex, 0, ...newModules);

        // rebuild full step list
        fullGuide.steps = Object.values(fullGuide.modules).flatMap(
          (m) => m.steps
        );

        // make sure to remove any proxies because they're revoked by the time
        // the action below is dispatched
        fullGuide = deProxify(fullGuide);

        setTimeout(() => {
          mainStore
            .getState()
            .dispatch({ type: 'guideChanged', guide: fullGuide });
        }, 10);
      }
    }
  }
}
