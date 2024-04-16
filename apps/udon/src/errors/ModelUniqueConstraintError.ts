import BaseError from './baseError';

import { logger } from 'src/utils/logger';

export default class ModelUniqueConstraintError extends BaseError {
  constructor(
    resourceName: string,
    model: string,
    conflicting: Record<string, string | number | boolean | null | undefined>
  ) {
    // logs out additional details to help with debugging
    logger.error(
      `[ModelUniqueConstraintError] Insert or update on model ${model} violates unique constraint check for (${Object.keys(
        conflicting
      ).join(',')}) columns with (${Object.values(conflicting).join(
        ','
      )}) values.`
    );

    super(
      `Cannot create ${resourceName || 'resource'} since one already exists`
    );

    this.flag = true;
  }
}
