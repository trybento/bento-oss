import * as Sentry from '@sentry/node';
import { logger } from 'src/utils/logger';
import { RivetGraphIds, runRivetGraph } from './gpt.helpers';

/**
 * "Snazzy GPT" step content condenser
 */
export default async function gptConcise(
  stepDescription: string
): Promise<string[] | null> {
  if (!stepDescription) return [];

  try {
    const outputs = await runRivetGraph(RivetGraphIds.snazzyStep, {
      stepDescription,
    });

    return [outputs];
  } catch (e: any) {
    logger.error(e);
    Sentry.captureException(e);
    return null;
  }
}
