import pick from 'lodash/pick';

import { getDefaultCtaSetting } from 'bento-common/data/helpers';
import {
  StepType,
  StepCtaType,
  StepCtaStyle,
  GuideFormFactor,
  WysiwygEditorRecordedAction,
  DEFAULT_FLOW_TAG_STYLE,
  DEFAULT_FLOW_TAG_TYPE,
  GptErrors,
  GptMethod,
} from 'bento-common/types';
import {
  StepPrototypeValue,
  TemplateModuleValue,
} from 'bento-common/types/templateData';
import {
  getFakeUuidModuleEntityId,
  getFakeUuidStepEntityId,
} from 'bento-common/data/fullGuide';
import { GPTGeneratedGuide } from 'bento-common/types/integrations';

import { getNewTag } from 'components/Tags/helpers';
import { TaggedElement } from 'bento-common/types/globalShoyuState';

/**
 * How we are choosing to generate a new guide with GPT
 */
export enum GenerationMethod {
  transcript = 'transcript',
  links = 'links',
  clickThrough = 'clickThrough',
}

export const transformGeneratedGuideContent = (
  content: GPTGeneratedGuide,
  recordedActions?: WysiwygEditorRecordedAction[]
): TemplateModuleValue => {
  return {
    displayTitle: content.guideTitle,
    name: content.guideTitle,
    entityId: getFakeUuidModuleEntityId(),
    stepPrototypes: content.steps.map<StepPrototypeValue>((step, i) => {
      const recordedAction = recordedActions?.[i];

      return {
        name: step.title,
        entityId: getFakeUuidStepEntityId(),
        eventMappings: [],
        bodySlate: step.body,
        body: '',
        autoCompleteInteractions: [],
        stepType: StepType.optional,
        mediaReferences: [],
        ctas: step.ctaText
          ? [
              {
                text: step.ctaText,
                style: StepCtaStyle.solid,
                settings: getDefaultCtaSetting(GuideFormFactor.legacy),
                ...(step.ctaUrl && !recordedAction
                  ? {
                      type: StepCtaType.urlComplete,
                      url: step.ctaUrl,
                    }
                  : {
                      type: StepCtaType.complete,
                    }),
              },
            ]
          : [],
        taggedElements: recordedAction
          ? [
              getNewTag({
                ...pick(recordedAction, [
                  'elementSelector',
                  'url',
                  'wildcardUrl',
                ]),
                type: DEFAULT_FLOW_TAG_TYPE,
                style: DEFAULT_FLOW_TAG_STYLE,
              }) as TaggedElement & { url: string },
            ]
          : [],
      };
    }),
  };
};

const GPT_ERROR_MESSAGES: Record<string, string> = {
  [GptErrors.malformedJson]: 'GPT returned malformed JSON. Please try again.',
  [GptErrors.limitReached]:
    'GPT usage quota exceeded. Tokens refresh every month.',
  [GptErrors.noContent]:
    'No content was generated. Please try again with different inputs.',
  [GptErrors.responseTimeout]: 'Response timed out. Please try again.',
  [GptErrors.apiError]: 'GPT encountered an error. Please try again.',
  [GptErrors.staticScrapeError]: 'Could not scrape due to dynamic elements',
  [GptErrors.scrapeError]:
    'Could not read provided content. Please try another article.',
  [GptErrors.tokenError]:
    'Page contains too much text. Try copying over the parts you need!',
};

export const getErrorMessage = (err: GptErrors, method: GptMethod) => {
  if (err === GptErrors.tokenError && method === GptMethod.article)
    return 'Try shortening the text!';

  return (
    GPT_ERROR_MESSAGES[err] ?? 'Something went wrong! Please try again later'
  );
};
