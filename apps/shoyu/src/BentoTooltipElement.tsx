import React from 'react';
import { EmbedFormFactor } from 'bento-common/types';
import CommonComponentProviders, {
  WebComponentProps,
} from './components/CommonComponentProviders';

import Tooltip from './components/Tooltip';

type TooltipComponentProps = WebComponentProps;

const BentoTooltipElement: React.FC<TooltipComponentProps> = ({
  uipreviewid,
}) => {
  return (
    <CommonComponentProviders
      formFactor={EmbedFormFactor.tooltip}
      uipreviewid={uipreviewid}
      isSideQuest
    >
      <Tooltip />
    </CommonComponentProviders>
  );
};

export default BentoTooltipElement;
