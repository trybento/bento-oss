import React, { useCallback, useEffect, useState } from 'react';

import composeComponent from 'bento-common/hocs/composeComponent';
import { KbArticle } from 'bento-common/types/integrations';

import withMainStoreData from '../../../stores/mainStore/withMainStore';
import { FormFactorContextValue } from '../../../providers/FormFactorProvider';
import { selectedArticleForFormFactorSelector } from '../../../stores/mainStore/helpers/selectors';
import withFormFactor from '../../../hocs/withFormFactor';
import OpenInNewIcon from '../../../icons/openInNew.svg';
import withCustomUIContext from '../../../hocs/withCustomUIContext';
import { CustomUIProviderValue } from '../../../providers/CustomUIProvider';
import SlateContentRenderer from '../../../system/RichTextEditor/SlateContentRenderer';
import { px } from 'bento-common/utils/dom';

type MainStoreData = {
  article?: KbArticle;
};

type OuterProps = {};

type Props = OuterProps &
  MainStoreData &
  Pick<FormFactorContextValue, 'formFactor'> &
  Pick<
    CustomUIProviderValue,
    'primaryColorHex' | 'paragraphFontSize' | 'paragraphLineHeight'
  >;

const HelpCenterArticle: React.FC<Props> = ({
  article,
  primaryColorHex,
  paragraphFontSize,
  paragraphLineHeight,
}) => {
  const [opacity, setOpacity] = useState(0);
  const handleOpenArticle = useCallback(() => {
    if (!article?.articleUrl) return;

    window.open(article.articleUrl, '_blank');
  }, [article?.articleUrl]);

  useEffect(() => {
    /* Fade-in transition */
    setTimeout(() => setOpacity(1), 0);
  }, []);

  if (!article?.body)
    return <div>🙈 We couldn't find any content for this article!</div>;

  return (
    <div>
      <section className="flex justify-start mb-4 py-2">
        <button
          onClick={handleOpenArticle}
          className="font-semibold flex flex-row my-2"
        >
          <span
            className="mr-1"
            style={{
              color: primaryColorHex,
            }}
          >
            View article
          </span>
          <OpenInNewIcon
            style={{
              color: primaryColorHex,
              height: '1em',
            }}
          />
        </button>
      </section>
      <section
        className="bento-step-content-wrapper"
        style={{
          whiteSpace: 'pre-line',
          fontSize: 'inherit',
          transition: 'opacity 500ms ease-in-out',
          opacity,
        }}
      >
        {typeof article.body === 'string' ? (
          article?.body
        ) : (
          <div
            className="bento-step-content"
            style={{
              fontSize: px(paragraphFontSize),
              lineHeight: px(paragraphLineHeight),
            }}
          >
            <SlateContentRenderer className="w-full" body={article.body} />
          </div>
        )}
      </section>
    </div>
  );
};

export default composeComponent<OuterProps>([
  withFormFactor,
  withCustomUIContext,
  withMainStoreData<Props, MainStoreData>((state, { formFactor }) => {
    const article = selectedArticleForFormFactorSelector(state, formFactor);
    return {
      article,
    };
  }),
])(HelpCenterArticle);
