import React, { useCallback, useEffect, useState } from 'react';
import cx from 'classnames';

import composeComponent from 'bento-common/hocs/composeComponent';
import { KbArticle } from 'bento-common/types/integrations';
import { chunk } from 'bento-common/utils/lodash';

import ArrowIcon from '../../../icons/downArrow.svg';

import { UIStateContextValue } from '../../../providers/UIStateProvider';
import withUIState from '../../../hocs/withUIState';
import {
  withMainStoreDispatch,
  WithMainStoreDispatchData,
} from '../../../stores/mainStore/withMainStore';
import withFormFactor from '../../../hocs/withFormFactor';
import { FormFactorContextValue } from '../../../providers/FormFactorProvider';
import withCustomUIContext from '../../../hocs/withCustomUIContext';
import { CustomUIProviderValue } from '../../../providers/CustomUIProvider';

const PAGE_SIZE = 5;

type OuterProps = {
  articleResults: KbArticle[];
  onArticleSelected?: () => void;
};

type Props = OuterProps &
  Pick<UIStateContextValue, 'view' | 'uiActions'> &
  Pick<FormFactorContextValue, 'formFactor'> &
  Pick<CustomUIProviderValue, 'primaryColorHex'> &
  WithMainStoreDispatchData;

const HelpCenterArticleResults: React.FC<Props> = ({
  articleResults,
  dispatch,
  uiActions,
  formFactor,
  onArticleSelected,
  primaryColorHex,
}) => {
  const [paginatedArticles, setPaginatedArticles] = useState<KbArticle[][]>([]);
  const [selectedPage, setSelectedPage] = useState(0);

  useEffect(() => {
    /**
     * The query isn't paginated, so we'll manually break it apart as a UI consideration
     */
    if (articleResults.length)
      setPaginatedArticles(chunk(articleResults, PAGE_SIZE));
    else setPaginatedArticles([]);
  }, [articleResults]);

  const handleArticleSelect = useCallback(
    (article: KbArticle) => () => {
      onArticleSelected?.();
      dispatch({
        type: 'articleSelected',
        formFactor,
        article,
      });

      uiActions.handleShowKbArticle();
    },
    [onArticleSelected, formFactor]
  );

  const handleSelectPage = useCallback(
    (page: number) => () => setSelectedPage(page),
    []
  );

  const handleAdvancePage = useCallback(
    (move: number) => () => {
      const targetPage = selectedPage + move;

      if (!paginatedArticles[targetPage]) return;
      setSelectedPage(targetPage);
    },
    [selectedPage, paginatedArticles]
  );

  return (
    <div className="flex flex-col mt-4">
      <div className="inline-grid gap-4">
        {articleResults.length === 0 && (
          <div className="gray-500 font-semibold text-sm">No results</div>
        )}
        {paginatedArticles?.[selectedPage]?.map((r) => (
          <button
            key={r.articleId}
            className="font-semibold underline truncate text-sm"
            style={{
              color: primaryColorHex,
              textAlign: 'left',
            }}
            onClick={handleArticleSelect(r)}
          >
            {r.title}
          </button>
        ))}
      </div>
      {paginatedArticles.length > 1 && (
        <div
          className="flex flex-row mt-4 justify-center"
          style={{ alignItems: 'center' }}
        >
          <ArrowIcon
            className="rotate-90 mr-4 w-5"
            onClick={handleAdvancePage(-1)}
          />
          <div className="flex flex-row gap-4">
            {paginatedArticles.map((_, i) => (
              <span
                key={`paginas-${i}`}
                className={cx([
                  'font-semibold',
                  {
                    'cursor-pointer': selectedPage !== i,
                  },
                ])}
                style={{
                  color: selectedPage === i ? undefined : primaryColorHex,
                }}
                onClick={handleSelectPage(i)}
              >
                {i + 1}
              </span>
            ))}
          </div>
          <ArrowIcon
            className="-rotate-90 ml-4 w-5"
            onClick={handleAdvancePage(1)}
          />
        </div>
      )}
    </div>
  );
};

export default composeComponent<OuterProps>([
  withUIState,
  withCustomUIContext,
  withFormFactor,
  withMainStoreDispatch,
])(HelpCenterArticleResults);
