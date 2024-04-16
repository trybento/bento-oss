import { GraphQLFieldConfig, GraphQLFieldResolver } from 'graphql';
import { keyBy } from 'lodash';
import { StepState } from 'bento-common/types/globalShoyuState';
import { FormFactorStyleUnionType } from 'bento-common/graphql/formFactorStyle';

import { Loaders } from 'src/data/loaders';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Guide } from 'src/data/models/Guide.model';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';
import { Step } from 'src/data/models/Step.model';
import { resolveStepState } from '../embed/EmbedStep/helpers';

import { EmbedContext, GraphQLContext } from '../types';
import { Template } from 'src/data/models/Template.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import {
  isModalGuide,
  isTooltipGuide,
  isFlowGuide,
} from 'bento-common/utils/formFactor';
import { ChecklistStyle, StepBodyOrientation } from 'bento-common/types';
import {
  getDefaultCtasOrientation,
  isGuideEligibleToHideCompletedSteps,
} from 'bento-common/data/helpers';

/*
 * Shared resolvers between different Guide handlers
 * Moved out so logic is consistent in how we determine these properties.
 */

const _guideParticipantResolver = (
  guide: Guide,
  _: unknown,
  { accountUser, loaders }: EmbedContext
): Promise<GuideParticipant> => {
  return loaders.guideParticipantForGuideAndAccountUserLoader.load({
    guideId: guide.id,
    accountUserId: accountUser.id,
  });
};

export const doneAtResolver = async (
  ...args: [guide: Guide, _: unknown, context: EmbedContext]
): Promise<Date | null | undefined> => {
  const [guide] = args;
  if (guide.doneAt) {
    return guide.doneAt;
  }
  const guideParticipant = await _guideParticipantResolver(...args);
  return guideParticipant?.doneAt;
};

export const savedAtResolver = async (
  ...args: [guide: Guide, _: unknown, context: EmbedContext]
): Promise<Date | null | undefined> => {
  const guideParticipant = await _guideParticipantResolver(...args);

  return guideParticipant?.savedAt;
};

export const completedStepsCountResolver = async (
  guide: Guide,
  _,
  { loaders }: GraphQLContext | EmbedContext
) => {
  const allSteps = await loaders.stepsOfGuideLoader.load(guide.id);
  const completedStepsCount = allSteps.filter((step) => step.isComplete).length;
  return completedStepsCount;
};

export const guideStepsByState: GraphQLFieldResolver<
  Guide,
  EmbedContext
> = async (...args) => {
  const allSteps = await args[2].loaders.stepsOfGuideLoader.load(args[0].id);
  const stepsByState: Record<StepState, Step[]> = {
    [StepState.incomplete]: [],
    [StepState.complete]: [],
    [StepState.skipped]: [],
  };
  for (const step of allSteps) {
    const state = await resolveStepState(step, args[1], args[2], args[3]);
    stepsByState[state].push(step);
  }
  return stepsByState;
};

export const guideViewedSteps = async (
  guide: Guide,
  accountUser: AccountUser,
  loaders: Loaders
) => {
  const allSteps = await loaders.stepsOfGuideLoader.load(guide.id);
  const stepsById = keyBy(allSteps, 'id');
  const stepParticipantsForSteps =
    await loaders.stepParticipantForStepAndAccountUserLoader.loadMany(
      allSteps.map((s) => ({
        accountUserId: accountUser.id,
        stepId: s.id,
      }))
    );

  return stepParticipantsForSteps
    .filter((sp) => sp?.[0].firstViewedAt)
    .map((sp) => stepsById[sp[0].stepId]);
};

export const FormFactorStyleResolverField: GraphQLFieldConfig<
  Template | GuideBase | Guide,
  EmbedContext | GraphQLContext
> = {
  description: 'Style properties for this guides form factor',
  type: FormFactorStyleUnionType,
  resolve: async (source, _, { loaders, organization }) => {
    let ref = source;
    if (source instanceof Guide || source instanceof GuideBase) {
      ref = await loaders.templateLoader.load(
        source.createdFromTemplateId || 0
      );
      if (!ref)
        throw new Error('Missing template associated with guide or guide base');
    }

    const template = ref as Template;

    const stepBodyOrientation =
      isModalGuide(template.formFactor!) ||
      isTooltipGuide(template.formFactor!) ||
      isFlowGuide(template.formFactor!)
        ? (template.formFactorStyle as any)?.stepBodyOrientation ||
          StepBodyOrientation.vertical
        : (template.formFactorStyle as any)?.stepBodyOrientation;

    const organizationSettings =
      await loaders.organizationSettingsOfOrganizationLoader.load(
        organization.id
      );

    const hideCompletedSteps =
      isGuideEligibleToHideCompletedSteps(template.theme!) &&
      (template.formFactorStyle as ChecklistStyle)?.hideCompletedSteps;

    return {
      ...(template.formFactorStyle || {}),
      /** Consider undefined to be truthy since the user hasn't explicitly disabled it. */
      canDismiss: (template.formFactorStyle as any)?.canDismiss !== false,
      formFactor: template.formFactor!,
      stepBodyOrientation,
      theme: template.theme,
      hideCompletedSteps,
      ctasOrientation: template.isCyoa
        ? undefined
        : (template.formFactorStyle as ChecklistStyle)?.ctasOrientation ||
          getDefaultCtasOrientation(template.formFactor!, template.theme!),
      mediaFontSize: (template.formFactorStyle as any)?.mediaFontSize || 40,
      mediaTextColor:
        (template.formFactorStyle as any)?.mediaTextColor ||
        `#${organizationSettings?.primaryColorHex}`,
    };
  },
};
