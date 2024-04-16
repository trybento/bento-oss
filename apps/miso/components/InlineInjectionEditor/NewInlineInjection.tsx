import React, { useCallback, useMemo } from 'react';
import { graphql } from 'react-relay';
import once from 'lodash/once';
import {
  WysiwygEditorType,
  WysiwygEditorMode,
  InjectionPosition,
  OrgState,
} from 'bento-common/types';
import QueryRenderer from 'components/QueryRenderer';
import WysiwygUrlEntryPage from 'components/WysiwygEditor/UrlEntryPage';
import {
  loadInlineInjectionEditor,
  inlineInjectionEditorModes,
} from './editor';
import { NewInlineInjectionQuery } from 'relay-types/NewInlineInjectionQuery.graphql';
import { getInlineInjectionPreviewGuide } from './utils';
import { TemplateValue } from 'bento-common/types/templateData';
import WysiwygErrorPage, {
  WysiwygError,
} from 'components/WysiwygEditor/WysiwygErrorPage';

type Props = {
  visualBuilderSessionEntityId: string;
  templateData: TemplateValue;
};

const NEW_INLINE_INJECTION_QUERY = graphql`
  query NewInlineInjectionQuery {
    uiSettings {
      theme
    }
    organization {
      state
      visualBuilderDefaultUrl
    }
    onboardingInlineEmbeds: inlineEmbeds {
      entityId
      url
      state
    }
  }
`;

function NewInlineInjection({
  uiSettings,
  organization,
  templateData,
  visualBuilderSessionEntityId,
  onboardingInlineEmbeds: [onboardingInlineEmbed],
}: React.PropsWithChildren<NewInlineInjectionQuery['response'] & Props>) {
  const defaultUrl: string | undefined = useMemo(
    () =>
      onboardingInlineEmbed
        ? onboardingInlineEmbed.url
        : organization.visualBuilderDefaultUrl || '',
    [onboardingInlineEmbed, organization.visualBuilderDefaultUrl]
  );

  const loadPage = useCallback(
    once(async (url?: string) => {
      if (!url) return;
      const guide = getInlineInjectionPreviewGuide(uiSettings, templateData);

      // The absence of `templateEntityId` means that the guide
      // is a placeholder for the injected onboarding inline.
      const isInlineContextual = !!templateData?.entityId;

      await loadInlineInjectionEditor({
        visualBuilderSessionEntityId,
        initialState: {
          data: {
            inlineEmbed: {
              position: InjectionPosition.before,
              url: '',
              wildcardUrl: '',
              elementSelector: '',
              topMargin: 0,
              rightMargin: 0,
              bottomMargin: 0,
              padding: isInlineContextual ? 0 : 4,
              borderRadius: 0,
              leftMargin: 0,
              alignment: null,
              maxWidth: null,
              guide: guide.entityId,
              templateEntityId: templateData?.entityId,
            },
          },
          url,
          wildcardUrl: url,
          elementSelector: null,
          mode: WysiwygEditorMode.navigate,
          modes: inlineInjectionEditorModes,
          type: WysiwygEditorType.inlineInjectionEditor,
        },
        guide,
      });
    }),
    []
  );

  if (organization.state === OrgState.Inactive) {
    return <WysiwygErrorPage error={WysiwygError.inactiveOrg} />;
  }

  return <WysiwygUrlEntryPage onSelect={loadPage} defaultUrl={defaultUrl} />;
}

export default function NewInlineInjectionQueryRenderer(
  cProps: React.PropsWithChildren<Props>
) {
  return (
    <QueryRenderer<NewInlineInjectionQuery>
      query={NEW_INLINE_INJECTION_QUERY}
      render={({ props }) => {
        if (!props) return null;
        return <NewInlineInjection {...props} {...cProps} />;
      }}
    />
  );
}
