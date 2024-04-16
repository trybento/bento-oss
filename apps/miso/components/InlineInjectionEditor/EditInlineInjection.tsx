import React, { useEffect } from 'react';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import { WysiwygEditorType, WysiwygEditorMode } from 'bento-common/types';
import { InlineEmbed } from 'bento-common/types/globalShoyuState';

import {
  loadInlineInjectionEditor,
  inlineInjectionEditorModes,
} from './editor';
import { getInlineInjectionPreviewGuide } from './utils';
import { useUISettings } from 'queries/OrganizationUISettingsQuery';
import { TemplateValue } from 'bento-common/types/templateData';

type EditInlineProps = {
  visualBuilderSessionEntityId: string;
  mode?: WysiwygEditorMode;
  templateData: TemplateValue;
  inlineEmbed: any;
};

export default function EditInlineInjection({
  visualBuilderSessionEntityId,
  mode,
  inlineEmbed,
  templateData,
}: React.PropsWithChildren<EditInlineProps>) {
  const { theme } = useUISettings('store-or-network') || {};
  const template = templateData || (inlineEmbed.template as TemplateValue);

  useEffect(() => {
    if (!inlineEmbed || !theme) return;

    const guide = getInlineInjectionPreviewGuide({ theme }, template);

    loadInlineInjectionEditor({
      visualBuilderSessionEntityId,
      initialState: {
        data: {
          inlineEmbed: {
            ...omit(inlineEmbed, ['template']),
            guide: guide.entityId,
            templateEntityId: template?.entityId,
          } as unknown as InlineEmbed,
        },
        ...pick(inlineEmbed, ['url', 'wildcardUrl', 'elementSelector']),
        mode: mode || WysiwygEditorMode.customize,
        modes: inlineInjectionEditorModes,
        type: WysiwygEditorType.inlineInjectionEditor,
      },
      guide,
    });
  }, [inlineEmbed, theme]);

  return null;
}
