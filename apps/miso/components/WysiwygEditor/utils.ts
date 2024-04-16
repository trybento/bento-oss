export function prefixUrl(url: string) {
  if (!url.startsWith('http')) {
    if (url.startsWith('localhost')) {
      return `http://${url}`;
    } else {
      return `https://${url}`;
    }
  }
  return url;
}

/**
 * Remove regex escape characters from query strings.
 */
export function sanitizeUrl(url: string | null | undefined) {
  if (url) {
    return url?.replace(/\w[^\\]+\\{1}\?/g, (match) =>
      match.replace(/\\\?/, '?')
    );
  }
  return url;
}

export enum WysiwygEditorAction {
  create = 'new',
  edit = 'edit',
}
