import React, { useCallback, useMemo } from 'react';
import { graphql } from 'react-relay';
import once from 'lodash/once';
import {
  WysiwygEditorType,
  WysiwygEditorMode,
  StepAutoCompleteInteractionType,
  OrgState,
} from 'bento-common/types';

import QueryRenderer from 'components/QueryRenderer';
import WysiwygUrlEntryPage from 'components/WysiwygEditor/UrlEntryPage';
import { loadAutocompleteElementEditor } from './editor';
import { NewAutocompleteElementQuery } from 'relay-types/NewAutocompleteElementQuery.graphql';
import { autocompleteElementEditorModes } from './editor';
import WysiwygErrorPage, {
  WysiwygError,
} from 'components/WysiwygEditor/WysiwygErrorPage';

const NEW_AUTOCOMPLETE_ELEMENT_QUERY = graphql`
  query NewAutocompleteElementQuery {
    organization {
      state
      visualBuilderDefaultUrl
    }
  }
`;

interface CProps {
  defaultUrl?: string;
  visualBuilderSessionEntityId: string;
}

function NewAutocompleteElement({
  defaultUrl,
  organization,
  visualBuilderSessionEntityId,
}: React.PropsWithChildren<CProps & NewAutocompleteElementQuery['response']>) {
  const _defaultUrl: string | undefined = useMemo(
    () =>
      defaultUrl ? defaultUrl : organization.visualBuilderDefaultUrl || '',
    [defaultUrl, organization.visualBuilderDefaultUrl]
  );

  const loadPage = useCallback(
    once(async (url?: string) => {
      if (!url) return;

      await loadAutocompleteElementEditor({
        visualBuilderSessionEntityId,
        initialState: {
          data: {
            type: StepAutoCompleteInteractionType.click,
          },
          url,
          wildcardUrl: url,
          elementSelector: null,
          mode: WysiwygEditorMode.navigate,
          modes: autocompleteElementEditorModes,
          type: WysiwygEditorType.autocompleteElementEditor,
        },
      });
    }),
    []
  );

  if (organization.state === OrgState.Inactive) {
    return <WysiwygErrorPage error={WysiwygError.inactiveOrg} />;
  }

  return <WysiwygUrlEntryPage onSelect={loadPage} defaultUrl={_defaultUrl} />;
}

export default function NewAutocompleteElementQueryRenderer(cProps: CProps) {
  return (
    <QueryRenderer<NewAutocompleteElementQuery>
      query={NEW_AUTOCOMPLETE_ELEMENT_QUERY}
      render={({ props }) => {
        if (!props) return null;
        return <NewAutocompleteElement {...cProps} {...props} />;
      }}
    />
  );
}
