import unified from 'unified';
import directive from 'remark-directive';
import markdown from 'remark-parse';

import markdownToSlatePlugin from './unified/markdownToSlatePlugin';

export default function markdownToSlate<T>(text: string): Promise<T> {
  return new Promise((resolve, reject) => {
    unified()
      .use(markdown)
      .use(directive)
      .use(markdownToSlatePlugin)
      .process(text, (err, file) => {
        if (err) {
          reject(err);
        }

        const slateContents = file?.result;
        if (slateContents) {
          resolve(slateContents as T);
        }
      });
  });
}
