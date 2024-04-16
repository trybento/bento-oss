/**
 * Sentry-specific code got removed, therefore this is now just a dummy wrapper.
 * @deprecated should be fully removed soon
 */
export default async function withSentrySpan<T>(
  cb: () => Promise<T>,
  _sentryContext?: any // was previously Sentry's TransactionContext
) {
  return cb();
}
