export enum AutoCompleteInteractionType {
  guideCompletion = 'guide_completion',
  // NOTE: the types below will likely be created once we migrate existing
  // step auto-complete features
  // event = 'event',
  // attribute = 'attribute',
  // interaction = 'interaction',
}

export enum AutoCompleteInteractionCompletableType {
  stepPrototype = 'step_prototype',
}

/**
 * This type should represent all possible variations of input
 * supported for the different interaction types of step auto-completion.
 *
 * To add variations, compose alternative types like below:
 * ```ts
 * export type StepAutoCompleteInteractionInput = | TypeA | TypeB | TypeC;
 * ```
 */
export type StepAutoCompleteInteraction =
  StepAutoCompleteInteractionOnGuideCompletion;

export interface StepAutoCompleteInteractionOnGuideCompletion {
  /** Interaction type */
  interactionType: AutoCompleteInteractionType.guideCompletion;
  /** Template the should trigger the step auto-completion */
  templateEntityId: string;
}
