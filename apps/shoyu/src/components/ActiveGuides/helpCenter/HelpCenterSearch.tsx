import React, { useCallback, useEffect, useState } from 'react';

import { HelpCenter, HelpCenterSource } from 'bento-common/types';
import TextInput from 'bento-common/components/TextInput';

import SearchIcon from '../../../icons/search.svg';
import CloseIcon from '../../../icons/close.svg';
import { searchKbArticles } from '../../../api';
import sessionStore from '../../../stores/sessionStore';
import { KbArticle } from 'bento-common/types/integrations';
import HelpCenterArticleResults from './HelpCenterArticleResults';

type Props = {
  helpCenter?: HelpCenter;
  /** If deeper search integration is enabled */
  kbSearchEnabled?: boolean;
};

function getSearchUrl(helpCenter: HelpCenter, query: string) {
  const baseUrl = helpCenter.url.replace(/\/$/, '');
  switch (helpCenter.source) {
    case HelpCenterSource.helpscout:
      return `${baseUrl}/search?query=${query}`;
    case HelpCenterSource.intercom:
      return `${baseUrl}/?q=${query}`;
    case HelpCenterSource.salesforce:
      return `${baseUrl}/s/global-search/${query}`;
    case HelpCenterSource.zendesk:
      return `${baseUrl}/search?query=${query}`;
  }
}

export default function HelpCenterSearch({
  helpCenter,
  kbSearchEnabled,
}: Props) {
  const [query, setQuery] = useState<string>('');
  const [articleResults, setArticleResults] = useState<KbArticle[] | null>(
    null
  );

  const updateQuery = useCallback((q: string) => setQuery(q), []);

  const search = useCallback(async () => {
    if (!helpCenter?.kbSearch && !kbSearchEnabled) return;

    if (query.trim()) {
      if (kbSearchEnabled) {
        const articles = await searchKbArticles(query);
        setArticleResults(articles);
      } else if (helpCenter?.kbSearch)
        window.open(getSearchUrl(helpCenter, query), '_blank');
    } else if (!query.trim() && kbSearchEnabled) {
      setArticleResults(null);
    }
  }, [helpCenter, query, kbSearchEnabled]);

  const handleKeyDown = useCallback(
    (ev: React.KeyboardEvent) => {
      if (ev.key === 'Enter') {
        search();
      }
    },
    [search]
  );

  const onArticleSelected = useCallback(() => {
    if (articleResults)
      sessionStore.getState().setKbSessionData({
        query,
        results: articleResults,
      });
  }, [query, articleResults]);

  const handleClearResults = useCallback(() => {
    setQuery('');
    setArticleResults(null);
  }, []);

  useEffect(() => {
    /* Reinstate the help center search if needed */
    const ssState = sessionStore.getState();
    const lastSearch = ssState.kbSessionData;

    if (lastSearch) {
      setArticleResults(lastSearch.results);
      setQuery(lastSearch.query);

      ssState.removeKbSessionData();
    }
  }, []);

  return helpCenter?.kbSearch || kbSearchEnabled ? (
    <div className="mb-10">
      <TextInput
        name="helpCenterSearch"
        onKeyDown={handleKeyDown}
        value={query}
        onChange={updateQuery}
        placeholder="Search for help articles"
        className="mb-2"
        inputClassName="rounded"
        icon={<SearchIcon />}
        rightIcon={
          articleResults !== null ? (
            <CloseIcon
              onClick={handleClearResults}
              className="cursor-pointer"
            />
          ) : undefined
        }
      />
      <div className="text-gray-500" style={{ fontSize: '10px' }}>
        Press Enter to search
      </div>
      {articleResults && (
        <HelpCenterArticleResults
          articleResults={articleResults}
          onArticleSelected={onArticleSelected}
        />
      )}
    </div>
  ) : null;
}
