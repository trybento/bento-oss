import React, { useCallback, useMemo } from 'react';
import { graphql } from 'react-relay';
import once from 'lodash/once';
import {
  WysiwygEditorType,
  WysiwygEditorMode,
  WysiwygEditorRecorderType,
  OrgState,
} from 'bento-common/types';

import QueryRenderer from 'components/QueryRenderer';
import WysiwygUrlEntryPage from 'components/WysiwygEditor/UrlEntryPage';
import { loadAutoGuideBuilderEditor } from './editor';
import { NewAiGuideQuery } from 'relay-types/NewAiGuideQuery.graphql';
import { autoGuideBuilderModes } from 'components/AutoGuideBuilder/constants';
import WysiwygErrorPage, {
  WysiwygError,
} from 'components/WysiwygEditor/WysiwygErrorPage';

interface CProps {
  templateEntityId: string;
  visualBuilderSessionEntityId: string;
}

type Props = CProps & NewAiGuideQuery['response'];

const QUERY = graphql`
  query NewAiGuideQuery {
    organization {
      state
      visualBuilderDefaultUrl
    }
  }
`;

function NewAiGuide({
  templateEntityId,
  visualBuilderSessionEntityId,
  organization,
}: React.PropsWithChildren<Props>) {
  const defaultUrl: string | undefined = useMemo(
    () => organization.visualBuilderDefaultUrl || '',
    [organization.visualBuilderDefaultUrl]
  );

  const loadPage = useCallback(
    once(async (url?: string) => {
      if (!url) return;

      await loadAutoGuideBuilderEditor({
        visualBuilderSessionEntityId,
        initialState: {
          data: { templateEntityId },
          url,
          recorderType: WysiwygEditorRecorderType.auto,
          wildcardUrl: url,
          elementSelector: null,
          mode: WysiwygEditorMode.navigate,
          modes: autoGuideBuilderModes,
          type: WysiwygEditorType.autoGuideBuilder,
          recordedActions: [],
        },
      });
    }),
    []
  );

  if (organization.state === OrgState.Inactive) {
    return <WysiwygErrorPage error={WysiwygError.inactiveOrg} />;
  }

  return <WysiwygUrlEntryPage onSelect={loadPage} defaultUrl={defaultUrl} />;
}

export default function NewAiGuideQueryRenderer(cProps: CProps) {
  return (
    <QueryRenderer<NewAiGuideQuery>
      query={QUERY}
      render={({ props }) => {
        if (!props) return null;
        return <NewAiGuide {...props} {...cProps} />;
      }}
    />
  );
}
