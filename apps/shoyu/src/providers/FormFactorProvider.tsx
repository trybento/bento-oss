import React from 'react';
import composeComponent from 'bento-common/hocs/composeComponent';
import { EmbedFormFactor } from 'bento-common/types';
import { FormFactorStateKey } from 'bento-common/types/globalShoyuState';

import { FormFactorFlags } from '../../types/global';
import { getEmbedFormFactorFlags } from '../lib/formFactors';
import { formFactorSelector } from '../stores/mainStore/helpers/selectors';
import withMainStoreData from '../stores/mainStore/withMainStore';
import { View } from 'bento-common/types/shoyuUIState';

export type FormFactorContextValue = {
  formFactor: FormFactorStateKey;
  embedFormFactor: EmbedFormFactor | undefined;
  renderedFormFactor: EmbedFormFactor | undefined;
  isPreviewFormFactor: boolean;
  embedFormFactorFlags: FormFactorFlags;
  renderedFormFactorFlags: FormFactorFlags;
  forcedView?: View;
};

export const FormFactorContext = React.createContext<FormFactorContextValue>({
  formFactor: '',
  embedFormFactor: undefined,
  renderedFormFactor: undefined,
  isPreviewFormFactor: false,
  embedFormFactorFlags: {
    isInline: false,
    isSidebar: false,
    isBanner: false,
    isModal: false,
    isTooltip: false,
    isFlow: false,
  },
  renderedFormFactorFlags: {
    isInline: false,
    isSidebar: false,
    isBanner: false,
    isModal: false,
    isTooltip: false,
    isFlow: false,
  },
  forcedView: undefined,
});

type OuterProps = {
  formFactor: FormFactorStateKey;
  forcedView?: View;
};

type MainStoreData = {
  isPreviewFormFactor: boolean;
  embedFormFactor: EmbedFormFactor | undefined;
  renderedFormFactor: EmbedFormFactor | undefined;
};

const FormFactorProvider: React.FC<OuterProps & MainStoreData> = ({
  formFactor,
  isPreviewFormFactor,
  embedFormFactor,
  renderedFormFactor,
  children,
  forcedView,
}) => (
  <FormFactorContext.Provider
    value={{
      formFactor,
      embedFormFactor,
      renderedFormFactor,
      isPreviewFormFactor,
      embedFormFactorFlags: getEmbedFormFactorFlags(embedFormFactor!),
      renderedFormFactorFlags: getEmbedFormFactorFlags(renderedFormFactor!),
      forcedView,
    }}
  >
    {children}
  </FormFactorContext.Provider>
);
export default composeComponent<React.PropsWithChildren<OuterProps>>([
  withMainStoreData<OuterProps, MainStoreData>((state, { formFactor }) => {
    const formFactorState = formFactorSelector(state, formFactor);
    return {
      isPreviewFormFactor: !!formFactorState?.isPreview,
      embedFormFactor: formFactorState?.formFactor,
      renderedFormFactor: formFactorState?.renderedFormFactor,
    };
  }),
])(FormFactorProvider);
