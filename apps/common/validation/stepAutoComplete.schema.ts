import {
  Describe,
  object,
  string,
  optional,
  literal,
  array,
  union,
} from 'superstruct';
import {
  StepAutoCompleteInteractionInput,
  StepAutoCompleteInteractionType,
} from '../types';
import {
  AutoCompleteInteractionType,
  StepAutoCompleteInteractionOnGuideCompletion,
} from '../types/stepAutoComplete';

export const StepAutoCompleteOnGuideCompletionInputSchema: Describe<StepAutoCompleteInteractionOnGuideCompletion> =
  object({
    interactionType: literal(AutoCompleteInteractionType.guideCompletion),
    templateEntityId: string(),
  });

export const StepAutoCompleteInteractionInputSchema = union([
  StepAutoCompleteOnGuideCompletionInputSchema,
  // add other variations here
]);

export const StepAutoCompleteInteractionsInputSchema = array(
  StepAutoCompleteInteractionInputSchema
);

export const StepAutoCompleteDetailsInputSchema: Describe<StepAutoCompleteInteractionInput> =
  object({
    entityId: optional(string()),
    url: string(),
    wildcardUrl: string(),
    type: literal(StepAutoCompleteInteractionType.click),
    elementSelector: string(),
    elementText: optional(string()),
    elementHtml: optional(string()),
  });
