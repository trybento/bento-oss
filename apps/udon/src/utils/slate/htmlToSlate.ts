import { NodeHtmlMarkdown } from 'node-html-markdown';
import markdownToSlate from './markdownToSlate';

/**
 * Get an instance of nhm.
 * For bulk operations, getting this ahead of time makes
 *   processing more performant
 */
export const getNodeHtmlMarkdownInstance = () => new NodeHtmlMarkdown();

/**
 * Pre-process an HTML string to MD before using existing Slate tools
 *
 * Due to the async call this should not be thread-blocking
 */
export const htmlToSlate = async <T>(html: string, nhm?: NodeHtmlMarkdown) => {
  const _nhm = nhm ? nhm : getNodeHtmlMarkdownInstance();

  const md = _nhm.translate(html);

  return markdownToSlate<T>(md);
};
