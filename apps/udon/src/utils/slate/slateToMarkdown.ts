import unified from 'unified';
import stringify from 'remark-stringify';
import { slateToRemark } from 'remark-slate-transformer';

export default function slateToMarkdown(slateContent: any) {
  const processor = unified().use(slateToRemark).use(stringify);

  const tree = processor.runSync({
    type: 'root',
    // @ts-ignore
    children: slateContent,
  });

  return processor.stringify(tree);
}
