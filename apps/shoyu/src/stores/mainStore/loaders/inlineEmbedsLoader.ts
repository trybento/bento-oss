import loaderFactory from '../../loaderFactory';
import {
  InlineEmbedsQuery,
  InlineEmbedsQueryDocument,
  InlineEmbedsQueryVariables,
} from '../../../graphql/queries/generated/InlineEmbeds';

const inlineEmbedsLoader = loaderFactory<
  InlineEmbedsQueryVariables,
  InlineEmbedsQuery
>('inlineEmbeds', InlineEmbedsQueryDocument);

export default inlineEmbedsLoader;
