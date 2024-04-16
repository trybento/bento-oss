import { Box } from '@chakra-ui/react';
import React from 'react';

import WysiwygEditorPopup from './WysiwygEditorPopup';

type Props = {
  onSave: () => void;
  onCancel: () => void;
  isSubmitEnabled?: boolean;
  StepContentForm: React.FC;
};

export default function StepContentPopup({
  onSave,
  onCancel,
  isSubmitEnabled,
  StepContentForm,
}: React.PropsWithChildren<Props>) {
  return (
    <WysiwygEditorPopup
      submitLabel="Save"
      onCancel={onCancel}
      cancelLabel="Customize style"
      onSubmit={onSave}
      isSubmitEnabled={isSubmitEnabled}>
      <Box display="flex" flexDirection="column" gridGap={2}>
        <StepContentForm />
      </Box>
    </WysiwygEditorPopup>
  );
}
