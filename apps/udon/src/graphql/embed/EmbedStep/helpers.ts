import { StepState } from 'bento-common/types/globalShoyuState';
import { GraphQLFieldResolver } from 'graphql';

import { Step } from 'src/data/models/Step.model';
import { EmbedContext } from 'src/graphql/types';

export const isStepSkipped: GraphQLFieldResolver<Step, EmbedContext> = async (
  step,
  _args,
  context
): Promise<boolean> => {
  const { loaders, accountUser } = context;

  const stepParticipant =
    await loaders.stepParticipantForStepAndAccountUserLoader.load({
      accountUserId: accountUser.id,
      stepId: step.id,
    });

  /**
   * Since we store both skip and complete states
   * for steps, determine which action was performed
   * last to let dismissed guides to work properly.
   * Dismissible guides: CYOA, Modal, Banner, InlineContextual.
   */
  return (
    !!stepParticipant?.[0]?.skippedAt &&
    (step.completedAt ? stepParticipant[0].skippedAt > step.completedAt : true)
  );
};

export const resolveStepState: GraphQLFieldResolver<
  Step,
  EmbedContext
> = async (...args): Promise<StepState> => {
  const [step] = args;
  if (await isStepSkipped(...args)) {
    return StepState.skipped;
  }
  if (step.isComplete) {
    return StepState.complete;
  }
  return StepState.incomplete;
};
