import React from 'react';
import { EmbedFormFactor } from 'bento-common/types';
import { InlineEmbedEntityId } from 'bento-common/types/globalShoyuState';

import CommonComponentProviders from './components/CommonComponentProviders';
import GuideThemeSelector from './components/GuideThemeSelector';
import BentoBacklinkElement from './BentoBacklinkElement';

type WebComponentProps = {
  uipreviewid?: string;
  embedid?: InlineEmbedEntityId;
};

export default function BentoInlineElement({
  uipreviewid,
  embedid,
}: React.PropsWithChildren<WebComponentProps>) {
  return (
    <CommonComponentProviders
      uipreviewid={uipreviewid}
      formFactor={EmbedFormFactor.inline}
      embedId={embedid}
    >
      <BentoBacklinkElement />
      <GuideThemeSelector inlineEmbedId={embedid} />
    </CommonComponentProviders>
  );
}
