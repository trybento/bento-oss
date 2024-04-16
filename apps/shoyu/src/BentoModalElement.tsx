import React from 'react';
import { EmbedFormFactor } from 'bento-common/types';

import CommonComponentProviders, {
  WebComponentProps,
} from './components/CommonComponentProviders';
import Modal from './components/Modal';

const BentoModalElement: React.FC<WebComponentProps> = ({ uipreviewid }) => {
  return (
    <CommonComponentProviders
      formFactor={EmbedFormFactor.modal}
      isSideQuest
      uipreviewid={uipreviewid}
    >
      <Modal />
    </CommonComponentProviders>
  );
};

export default BentoModalElement;
