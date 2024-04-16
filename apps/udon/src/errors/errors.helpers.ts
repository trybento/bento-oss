import BaseError from './baseError';

/**
 * If it is a custom, known error, or a content error vs. a systems error
 *   we may want to know and only flag to the user
 */
export const isCustomError = (err: any) => err instanceof BaseError;

/**
 * Determine if the custom error should be thrown as a system error
 */
export const isUserError = (err: any) => err instanceof BaseError && !err.flag;
