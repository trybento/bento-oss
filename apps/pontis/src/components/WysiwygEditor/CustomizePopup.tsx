import { Box } from '@chakra-ui/react';
import { WysiwygEditorMode } from 'bento-common/types';
import React, { useMemo } from 'react';

import { useSession } from '~src/providers/VisualBuilderSessionProvider';

import WysiwygEditorPopup from './WysiwygEditorPopup';

type Props = {
  onSave: () => void;
  onCancel: () => void;
  isSubmitEnabled: boolean;
  CustomizeForm: React.FC;
};

export default function CustomizePopup({
  onSave,
  onCancel,
  isSubmitEnabled,
  CustomizeForm,
}: React.PropsWithChildren<Props>) {
  const { progressData } = useSession();

  const canCustomizeContent = useMemo(
    () => progressData.modes.includes(WysiwygEditorMode.customizeContent),
    [progressData.modes],
  );

  return (
    <WysiwygEditorPopup
      submitLabel={canCustomizeContent ? 'Add content' : 'Save'}
      onCancel={onCancel}
      cancelLabel="Select anchor element"
      onSubmit={onSave}
      isSubmitEnabled={isSubmitEnabled}>
      <Box display="flex" flexDirection="column" gridGap={2}>
        <CustomizeForm />
      </Box>
    </WysiwygEditorPopup>
  );
}
