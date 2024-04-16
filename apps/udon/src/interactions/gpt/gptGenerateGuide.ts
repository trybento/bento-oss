import * as Sentry from '@sentry/node';

import { GptErrors } from 'bento-common/types';
import {
  GPTGeneratedGuide,
  GptGuideRequest,
} from 'bento-common/types/integrations';

import { logger } from 'src/utils/logger';
import {
  getContentType,
  getDescriptor,
  GptContentType,
  RivetGraphIds,
  runRivetGraph,
  isPromptTooLong,
  sanitizeGptResults,
} from './gpt.helpers';
import { gatherLinkContents } from './scraper';

/**
 * Wrap potential input blocks for content in some markup so it
 *   is easier for GPT to identify start/stop
 */
const getContentBlock = (type: GptContentType, content?: string) =>
  !content
    ? ''
    : `
	Here is the ${type}:
	BEGIN ${type.toUpperCase()}
	${content}
	END ${type.toUpperCase()}
`;

const getContentInput = (
  transcript: string | undefined,
  contents: string[] | undefined,
  pageText: string | undefined
) => {
  const useActions = !!pageText;

  return `
		${
      useActions
        ? `
  ${getContentBlock(GptContentType.transcript, transcript)}

	${getContentBlock(GptContentType.websiteText, pageText)}
  `
        : `
  ${getContentBlock(GptContentType.transcript, transcript)}

	${getContentBlock(GptContentType.article, contents?.join('\n'))}
  `
    }`;
};

type PromptHelperArgs = Omit<Args, 'links'> & { content?: string[] };

const getGptChoices = async ({
  transcript,
  content,
  pageText,
}: PromptHelperArgs): Promise<GPTGeneratedGuide[]> => {
  const contentType = getContentType(transcript, content, pageText);
  const contentInput = getContentInput(transcript, content, pageText);

  if (!process.env.OPENAI_API_KEY) throw new Error('OpenAI API not configured');

  let outputs: GPTGeneratedGuide;
  if (contentType === GptContentType.actionsList) {
    /** @todo consider having the count submitted from the wysiwyg, so we can possibly support more actions. */
    const actionsCount = (contentInput?.match(/Clicked/g) || []).length;

    outputs = await runRivetGraph(RivetGraphIds.flowGenerate, {
      contentInput,
      actionsCount,
    });
  } else {
    outputs = await runRivetGraph(RivetGraphIds.generate, {
      contentInput,
      inputTypeLabel: getDescriptor(contentType),
    });
  }

  return [outputs];
};

type Args = Omit<GptGuideRequest, 'templateEntityId'>;

export default async function gptGenerateGuide({
  transcript,
  testPrompt,
  links = [],
  articleText,
  pageText,
  method,
}: Args): Promise<GPTGeneratedGuide[]> {
  /** Fetch article link content */
  const content = articleText
    ? [articleText]
    : links.length
    ? await gatherLinkContents(links, method)
    : [];

  if (testPrompt)
    console.debug(`[gptGenerateGuide] Using prompt: ${testPrompt}`);

  let choices: GPTGeneratedGuide[] = [];

  try {
    choices = await getGptChoices({
      testPrompt,
      transcript,
      content,
      pageText,
    });

    return sanitizeGptResults(choices, {
      articleText,
      pageText,
      content,
      transcript,
    });
  } catch (e: any) {
    /* Promise.any will return an error array */
    const _e = Array.isArray(e) ? e[0] : e;

    logger.error(
      `[gptGenerateGuide] Generation error ${_e.name ?? _e.message}`,
      _e
    );

    if (_e.config?.data && isPromptTooLong(_e.config.data as string))
      throw new Error(GptErrors.tokenError);

    Sentry.captureException(e);

    /* Make generic for user facing handlers */
    throw new Error(GptErrors.apiError);
  }
}
