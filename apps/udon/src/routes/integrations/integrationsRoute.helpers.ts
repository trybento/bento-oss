import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { STEP_GPT_USAGE_LIMIT } from 'bento-common/utils/constants';
import { GptErrors, OrgState } from 'bento-common/types';

import { Organization } from 'src/data/models/Organization.model';
import { AuthenticatedRequest } from 'src/graphql/types';
import GptTokenError from 'src/errors/GptTokenError';
import { logger } from 'src/utils/logger';
import InvalidPayloadError from 'src/errors/InvalidPayloadError';
import GptNoOutputError from 'src/errors/GptNoOutput';
import GptMalformedPayloadError from 'src/errors/GptMalformedPayloadError';

/**
 * Check if org is within allowed usage limit.
 *
 * Usage resets on each month.
 */
export const checkGptUsage = (organization: Organization) => {
  const now = new Date();
  const stepGptUsageCount = organization.options.stepGptUsageCount ?? 0;
  const stepGptLimit =
    organization.options.stepGptUsageLimit ?? STEP_GPT_USAGE_LIMIT;
  const lastStepGptUsageAt = organization.lastStepGptUsageAt ?? now;
  const isSameMonth = lastStepGptUsageAt.getMonth() === now.getMonth();

  return {
    allowGpt:
      stepGptUsageCount < stepGptLimit || (!isSameMonth && stepGptLimit !== 0),
    newGptUsageCount: isSameMonth ? stepGptUsageCount + 1 : 1,
  };
};

export const registerGptUsage = async (
  organization: Organization,
  newGptUsageCount
) => {
  await organization.update({
    lastStepGptUsageAt: new Date(),
    options: {
      ...organization.options,
      stepGptUsageCount: newGptUsageCount,
    },
  });
};

/**
 * Sets up GPT route behaviors including rate limiting and checking org state.
 */
export const withGptHelpers = async <T>(
  req: Request,
  res: Response,
  cb: (authenticatedRequest: AuthenticatedRequest) => Promise<T>
) => {
  /* Clear 30s timeout because GPT can take time */
  req.clearTimeout();

  const authRequest = req as unknown as AuthenticatedRequest;
  const organization = authRequest.user?.organization;

  if (!organization || organization?.state === OrgState.Inactive) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: 'Invalid organization auth' });
    return;
  }

  const { allowGpt, newGptUsageCount } = checkGptUsage(organization);

  if (!allowGpt)
    return res
      .status(StatusCodes.TOO_MANY_REQUESTS)
      .send({ error: GptErrors.limitReached });

  await cb(authRequest);

  await registerGptUsage(organization, newGptUsageCount);
};

/**
 * Handle sending a GPT related error back to the client
 */
export const handleGptError = (res: Response, error: any) => {
  if (error instanceof GptTokenError) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: GptErrors.tokenError });
  }

  if (error instanceof InvalidPayloadError) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: GptErrors.noContent });
  }

  if (error instanceof GptNoOutputError) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: GptErrors.malformedJson });
  }

  /** @todo make distinct when we have need to surface in UI */
  if (error instanceof GptMalformedPayloadError) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: GptErrors.malformedJson });
  }

  logger.error(`[guide-gpt] An error occurred: ${error.message}`);

  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send({ error: GptErrors.apiError });
};
