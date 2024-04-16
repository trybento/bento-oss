import React, { useState } from 'react';
import { BaseText, Transforms } from 'slate';

import { ReactEditor, useSlate, useSelected, useFocused } from 'slate-react';

import CalloutModal from './CalloutModal';
import { CalloutTypes, ExtendedCalloutTypes } from 'bento-common/types/slate';
import EditableWrapper from '../../components/EditableWrapper';
import colors from '../../../../frontend/colors';
import { Box } from '@chakra-ui/react';

export const TYPE_COLOR = {
  [CalloutTypes.Tip]: '#38A54D',
  [CalloutTypes.Info]: '#3CB8D7',
  [CalloutTypes.Success]: '#276749',
  [CalloutTypes.Warning]: colors.warning.bright,
  [CalloutTypes.Error]: '#DD4949',
  [CalloutTypes.Themeless]: '#7F8891',
  [ExtendedCalloutTypes.Customized]: '#3CB8D7',
};

export const TYPE_BG_COLOR = {
  [CalloutTypes.Tip]: '#F1F7F1',
  [CalloutTypes.Info]: '#DEEAF0',
  [CalloutTypes.Success]: '#F1F7F1',
  [CalloutTypes.Warning]: colors.warning.bg,
  [CalloutTypes.Error]: '#FDF6F6',
  [CalloutTypes.Themeless]: '#F7FAFC',
  [ExtendedCalloutTypes.Customized]: '#EEF9FB',
};

const CALLOUT_MARGINS = '1em 0';
const CALLOUT_PADDING = '1em 3em 1em 1em';

export default function Callout({ children, element }) {
  const editor = useSlate();
  const selected = useSelected();
  const focused = useFocused();
  const [isCalloutModalOpen, setIsCalloutModalOpen] = useState<boolean>(false);
  const nodePath = ReactEditor.findPath(editor as ReactEditor, element);

  const boxShadow = selected && focused ? `0 0 0 1px #cbd5e0` : 'none';
  const { calloutType } = element as { calloutType: CalloutTypes };

  const handleOpenCalloutModal = () => {
    setIsCalloutModalOpen(true);
  };

  const handleCloseCalloutModal = () => {
    setIsCalloutModalOpen(false);

    Transforms.select(editor, nodePath);
    Transforms.move(editor);
  };

  const handleUpdateButton = (calloutType: string) => {
    Transforms.setNodes(
      editor,
      {
        calloutType,
      } as Partial<BaseText>,
      {
        at: nodePath,
      }
    );

    handleCloseCalloutModal();
  };

  return (
    <>
      <EditableWrapper onClick={handleOpenCalloutModal}>
        <Box
          as="blockquote"
          ml={0}
          mr={0}
          margin={CALLOUT_MARGINS}
          padding={CALLOUT_PADDING}
          borderLeft={`4px solid ${TYPE_COLOR[calloutType]}`}
          backgroundColor={TYPE_BG_COLOR[calloutType]}
          boxShadow={boxShadow}
        >
          <Box marginTop="var(--chakra-space-2)">{children}</Box>
        </Box>
      </EditableWrapper>

      <CalloutModal
        isOpen={isCalloutModalOpen}
        onCancel={handleCloseCalloutModal}
        onCallout={handleUpdateButton}
        initialCalloutType={element.calloutType}
      />
    </>
  );
}
