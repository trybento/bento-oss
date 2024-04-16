/**
 * Determines if the given extension version is a "v2" or later.
 *
 * If yes, it then means the extension supports the following:
 *
 * 1. Manual/auto-injection of the Bento script in case missing on the page;
 * 2. Uses the new (built-in) WYSIWYG editor.
 *
 * NOTE: All of the above was added in version 0.0.6, and we follow semver.
 */
export const isChromeExtensionV2 = (
  extensionVersion: string | null | undefined
) => {
  return (
    extensionVersion &&
    !['0.0.0', '0.0.1', '0.0.2', '0.0.3', '0.0.4', '0.0.5'].includes(
      extensionVersion
    )
  );
};
