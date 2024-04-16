import React, { useCallback, useMemo } from 'react';
import { graphql } from 'react-relay';
import once from 'lodash/once';
import { StepEntityId } from 'bento-common/types/globalShoyuState';
import {
  WysiwygEditorType,
  WysiwygEditorMode,
  GuidePageTargetingType,
  OrgState,
} from 'bento-common/types';

import QueryRenderer from 'components/QueryRenderer';
import { fullGuidePreviewData } from 'components/ContextTagEditor/constants';
import { loadTagEditor } from 'components/ContextTagEditor/editor';
import { NewTagQuery } from 'relay-types/NewTagQuery.graphql';
import { templateToGuideTransformer } from 'components/Library/LibraryTemplates/LibraryTemplatePreview/preview.helpers';
import WysiwygUrlEntryPage from 'components/WysiwygEditor/UrlEntryPage';
import {
  getAllTaggedElementsForPreview,
  getDefaultFlowGuideUrl,
  getTagEditorModes,
} from './helpers';
import { isFlowGuide } from 'bento-common/utils/formFactor';
import {
  StepPrototypeValue,
  TemplateValue,
} from 'bento-common/types/templateData';
import { createTaggedElement } from 'components/Templates/EditTemplate/wysiwyg.helpers';
import WysiwygErrorPage, {
  WysiwygError,
} from 'components/WysiwygEditor/WysiwygErrorPage';

const NEW_TAG_QUERY = graphql`
  query NewTagQuery {
    organization {
      state
      visualBuilderDefaultUrl
    }
  }
`;

type NewTagProps = NewTagQuery['response'] & NewTagContainerProps;

function NewTag({
  organization,
  stepPrototype,
  templateData,
  visualBuilderSessionEntityId,
}: NewTagProps) {
  const isFlow = isFlowGuide(templateData.formFactor);

  const defaultUrl: string | undefined = useMemo(() => {
    if (isFlow) {
      const defaultFlowUrl = getDefaultFlowGuideUrl(
        templateData,
        stepPrototype?.entityId
      );

      if (defaultFlowUrl) {
        return defaultFlowUrl;
      }
    }

    return organization.visualBuilderDefaultUrl || '';
  }, [
    isFlow,
    templateData,
    stepPrototype?.entityId,
    organization.visualBuilderDefaultUrl,
  ]);

  const loadPage = useCallback(
    once(async (url?: string) => {
      if (!url) return;

      const guide = templateData
        ? templateToGuideTransformer(
            templateData,
            isFlow ? stepPrototype?.entityId : undefined
          )
        : fullGuidePreviewData;

      const { newStep, newTag } = createTaggedElement(guide, {
        context: stepPrototype ? 'step' : 'template',
        stepEntityId: stepPrototype?.entityId as StepEntityId,
        stepName: stepPrototype?.name,
      });

      if (newStep) {
        guide.modules[0].steps.push(newStep);
        guide.steps.push(newStep);
      }

      guide.pageTargetingType = GuidePageTargetingType.visualTag;

      await loadTagEditor({
        visualBuilderSessionEntityId,
        initialState: {
          data: {
            taggedElement: newTag,
            guide,
            allTaggedElements: getAllTaggedElementsForPreview(
              templateData,
              newTag
            ),
          },
          url,
          wildcardUrl: url,
          elementSelector: null,
          mode: WysiwygEditorMode.navigate,
          modes: getTagEditorModes(templateData),
          type: WysiwygEditorType.tagEditor,
        },
      });
    }),
    [isFlow, templateData, stepPrototype]
  );

  if (organization.state === OrgState.Inactive) {
    return <WysiwygErrorPage error={WysiwygError.inactiveOrg} />;
  }

  return <WysiwygUrlEntryPage onSelect={loadPage} defaultUrl={defaultUrl} />;
}

export interface NewTagContainerProps {
  visualBuilderSessionEntityId: string;
  /** The entity id of the step prototype we want to add a tag to */
  stepPrototype: StepPrototypeValue;
  /** The parent template */
  templateData: TemplateValue;
}

export default function NewTagQueryRenderer(cProps: NewTagContainerProps) {
  return (
    <QueryRenderer<NewTagQuery>
      query={NEW_TAG_QUERY}
      render={({ props }) => {
        if (!props) return null;
        return <NewTag {...props} {...cProps} />;
      }}
    />
  );
}
