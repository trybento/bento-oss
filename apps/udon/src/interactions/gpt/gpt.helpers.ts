import path from 'path';
import { addDays, subDays } from 'date-fns';
const { loadProjectFromFile, runGraph } = require('@ironclad/rivet-node');

import { GroupTargeting } from 'bento-common/types/targeting';
import { extractNumbers } from 'bento-common/utils/strings';
import { GptErrors } from 'bento-common/types';
import { GPTGeneratedGuide } from 'bento-common/types/integrations';

import detachPromise from 'src/utils/detachPromise';
import { ReportDump } from 'src/data/models/Audit/ReportDump.model';
import { GptEditorNode, sanitizeGptStepBodies } from './slateSanitizer';
import { logger } from 'src/utils/logger';
import GptMalformedPayloadError from 'src/errors/GptMalformedPayloadError';

/**
 * Gets a JSON example guide formatted to GPTGeneratedGuide + SlateJS
 */
export const gptExampleGuide = (withMedia = false) =>
  `
{
  "guideTitle": "Getting started with Chat GPT",
  "steps": [
    {
      "title": "Generate a prompt",
      "body": [
        {
          "type": "paragraph",
          "children": [
            {
              "text": "Prompts are the main way of getting information from all of the GPT models. You should be clear with the expected outcome of a prompt."
            }
          ]
        }
      ],
      "ctaText": "Generate your first prompt",
      "ctaUrl": "https://chat.openai.com/"
    },
    {
      "title": "Workflow designer",
      "body": [
        {
          "type": "paragraph",
          "children": [
            {
              "text": "Let's build one of the most common contract types: NDAs. To start, click Workflow designer. Let's start with using your own document."
            }
          ]
        }
      ],
      "ctaText": "Done"
    },
    {
      "title": "Publish workflow",
      "body": [
        {
          "type": "paragraph",
          "children": [
            {
              "text": "You can publish your workflow after resolving any errors!"
            }
          ]
        },
				${
          withMedia
            ? `
        {
          "type": "youtube-video",
          "videoId": "5yx6BWlEVcY",
          "children": [
            {
              "text": "",
              "type": "text"
            }
          ],
          "playsInline": false
        },
				`
            : ''
        }
        {
          "type": "paragraph",
          "children": [
            {
              "text": "Simply click into each of the errors to be taken directly to the part of the workflow that needs to be ammended."
            }
          ]
        }
      ],
      "ctaText": "Done"
    }
  ]
	}`;

export enum RivetGraphIds {
  generate = '9xqrr-u0XE2mOonIOvrMh',
  flowGenerate = '-qCCLC_LkOZs3SwDgS3D0',
  snazzyStep = 'RvxhZyHngNNvETTXPSHAO',
  createTargeting = 'oaxag9jRTlYJtR66h0nxe',
}

export const loadRivetProject = () =>
  loadProjectFromFile(
    path.resolve(__dirname, '../../../BentoAI/BentoAI.rivet-project')
  );

interface RivetInputsMap {
  [RivetGraphIds.generate]: { contentInput: string; inputTypeLabel: string };
  [RivetGraphIds.flowGenerate]: { contentInput: string; actionsCount: number };
  [RivetGraphIds.snazzyStep]: { stepDescription: string };
  [RivetGraphIds.createTargeting]: {
    availableAccountAttributes: string;
    availableUserAttributes: string;
    availableAccountArrayAttributes: string;
    availableUserArrayAttributes: string;
    userInput: string;
  };
}

interface RivetOutputsMap {
  [RivetGraphIds.generate]: GPTGeneratedGuide;
  [RivetGraphIds.flowGenerate]: GPTGeneratedGuide;
  [RivetGraphIds.snazzyStep]: string;
  [RivetGraphIds.createTargeting]: GroupTargeting | string;
}

export const runRivetGraph = async <T extends RivetGraphIds>(
  graphId: T,
  inputs: RivetInputsMap[T]
): Promise<RivetOutputsMap[T]> => {
  if (!process.env.OPENAI_API_KEY)
    throw new Error('OpenAI not configured. No API key');

  const project = await loadRivetProject();

  if (!project) throw new Error('Failed to load Rivet project');

  // @ts-ignore: "Type instantiation is excessively deep and possibly infinite"
  const result = await runGraph(project, {
    graph: graphId as string,
    openAiKey: process.env.OPENAI_API_KEY!,
    remoteDebugger: undefined,
    inputs,
  });

  return result?.output.value as RivetOutputsMap[T];
};

export enum GptContentType {
  transcript = 'transcript',
  actionsList = 'actions list',
  article = 'article',
  websiteText = 'website',
  /** Generic fallback */
  content = 'content',
}

export const getContentType = (
  transcript?: string,
  contents?: string[],
  pageText?: string
) =>
  pageText
    ? GptContentType.actionsList
    : transcript
    ? GptContentType.transcript
    : contents?.length
    ? GptContentType.article
    : GptContentType.content;

/** Describes what we're passing in */
export const getDescriptor = (contentType: GptContentType) => {
  switch (contentType) {
    case GptContentType.actionsList:
      return 'actions in a website';
    default:
      return contentType;
  }
};

/**
 * Based on OpenAI docs.
 * Number of characters per token.
 * @link https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them
 */
const CONVERSION_RATE = 4;

/**
 * Let's assume that if over half the max is used by the prompt,
 *   we don't have enough tokens for a proper answer.
 *
 * Max tokens, if not configured are:
 * GPT: 4097
 * GPT-16k: 16385
 */
export const isPromptTooLong = (prompt: string) => {
  /**
   * Changes depending on model selected as described above
   * Not making this definition more formal since Rivet will not use this logic
   */
  const MAX_TOKENS = 16385;

  return prompt.length / CONVERSION_RATE > MAX_TOKENS / 2;
};

/**
 * GPT has a chance of returning invalid JSON, or invalid Slate Nodes.
 *
 * As such, we should handle parsing and validating them, and removing any offending content
 */
export const sanitizeGptResults = (
  choices: GPTGeneratedGuide[],
  context: object
): GPTGeneratedGuide[] =>
  choices.reduce((a, c) => {
    try {
      const parsed = c;

      parsed.steps.forEach((s, i) => {
        parsed.steps[i].body = sanitizeGptStepBodies(s.body as GptEditorNode[]);
      });

      a.push(parsed);
    } catch (e: any) {
      logger.error('Sanitization error:', e);
      detachPromise(
        () =>
          ReportDump.create({
            title: 'GPT invalid JSON results',
            content: 'See json',
            json: {
              message: e.message ?? 'Error parsing GPT results',
              ...context,
            },
          }),
        'report bad gpt results'
      );
    }
    return a;
  }, [] as GPTGeneratedGuide[]);

const handleRelative = (value: string, operator: '+' | '-') => {
  const d = new Date();
  const dayDiff = extractNumbers(value)?.[0] ?? 0;

  logger.debug(
    `[gptTargeting:dates] got relative value ${value} ${operator} ${dayDiff}`
  );

  return (
    operator === '-' ? subDays(d, dayDiff) : addDays(d, dayDiff)
  ).toISOString();
};

export const handleGptDateAttribute = (value: string): string => {
  try {
    /**
     * Handle relative date
     */
    if (value.match(/TODAY - (-?\d+)/g)) {
      return handleRelative(value, '-');
    } else if (value.match(/TODAY \+ (-?\d+)/g)) {
      return handleRelative(value, '+');
    }

    /** Validate, but don't return due to TZ diffs */
    new Date(value).toISOString();

    return value;
  } catch (e) {
    logger.warn(
      `[gptTargeting:dates] received bad date, could not parse: ${value}`
    );
    throw new GptMalformedPayloadError(GptErrors.malformedJson);
  }
};
