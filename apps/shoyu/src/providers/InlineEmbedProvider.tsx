import React from 'react';
import { Guide, InlineEmbed } from 'bento-common/types/globalShoyuState';
import composeComponent from 'bento-common/hocs/composeComponent';

import withMainStoreData from '../stores/mainStore/withMainStore';
import { selectedGuideForFormFactorSelector } from '../stores/mainStore/helpers/selectors';
import withFormFactor from '../hocs/withFormFactor';
import { FormFactorContextValue } from './FormFactorProvider';
import { isSidebarInjectedAsInline } from 'bento-common/utils/formFactor';

export type InlineEmbedContextValue = {
  inlineEmbed: InlineEmbed | undefined;
  isEverboardingInline: boolean;
};

type OuterProps = {
  inlineEmbed: InlineEmbed | undefined;
};

type Props = React.PropsWithChildren<OuterProps> &
  Pick<
    FormFactorContextValue,
    'formFactor' | 'embedFormFactorFlags' | 'isPreviewFormFactor'
  >;

type MainStoreData = {
  guide: Guide | undefined;
};

export const InlineEmbedContext = React.createContext<InlineEmbedContextValue>({
  inlineEmbed: undefined,
  isEverboardingInline: false,
});

const InlineEmbedProvider: React.FC<Props & MainStoreData> = ({
  inlineEmbed,
  children,
  guide,
  embedFormFactorFlags: { isInline: isInlineEmbed },
  isPreviewFormFactor,
}) => (
  <InlineEmbedContext.Provider
    value={{
      inlineEmbed,
      isEverboardingInline:
        // previews don't use an auto-injected inline embed so it needs to
        // fall back to checking if the selected guide is contextual and the
        // current embed being rendered is inline
        (!!inlineEmbed?.guide || isPreviewFormFactor) &&
        !!(guide?.isSideQuest && isInlineEmbed) &&
        !isSidebarInjectedAsInline(
          guide?.theme,
          guide?.isSideQuest,
          guide?.formFactor
        ),
    }}
  >
    {children}
  </InlineEmbedContext.Provider>
);

export default composeComponent<React.PropsWithChildren<OuterProps>>([
  withFormFactor,
  withMainStoreData<Props, MainStoreData>((state, { formFactor }) => ({
    guide: selectedGuideForFormFactorSelector(state, formFactor),
  })),
])(InlineEmbedProvider);
