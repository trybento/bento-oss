import { Box } from '@chakra-ui/react';
import {
  VisualBuilderSessionState,
  VisualBuilderSessionType,
} from 'bento-common/types';
import React from 'react';

import { EDITOR_WRAPPER_ID, MAX_Z_INDEX } from '~src/constants';
import ElementSelectorProvider from '~src/providers/ElementSelectorProvider';
import VisualBuilderSessionProvider from '~src/providers/VisualBuilderSessionProvider';
import { Session } from '~types';

import AutocompleteElementEditor from './AutocompleteElementEditor';
import AutoGuideBuilder from './AutoGuideBuilder';
import Highlighter from './Highlighter';
import InlineInjectionEditor from './InlineInjectionEditor';
import TagEditor from './TagEditor';

const editorMap: Record<VisualBuilderSessionType, React.FC> = {
  [VisualBuilderSessionType.Tag]: TagEditor,
  [VisualBuilderSessionType.Inline]: InlineInjectionEditor,
  [VisualBuilderSessionType.Autocomplete]: AutocompleteElementEditor,
  [VisualBuilderSessionType.AutoGuideBuilder]: AutoGuideBuilder,
};

interface Props {
  session: Session;
}

const EditorWrapper: React.FC<Props> = ({ session }) => {
  if (
    session.visualBuilderSession.state !== VisualBuilderSessionState.InProgress
  ) {
    return null;
  }

  const Editor = editorMap[session.visualBuilderSession.type];

  return (
    <VisualBuilderSessionProvider session={session}>
      <ElementSelectorProvider>
        <Highlighter />
        <Box
          id={EDITOR_WRAPPER_ID}
          display="block"
          position="fixed"
          bottom="0"
          left="0"
          width="100vw"
          height="0"
          zIndex={MAX_Z_INDEX}>
          <Editor />
        </Box>
      </ElementSelectorProvider>
    </VisualBuilderSessionProvider>
  );
};

export default EditorWrapper;
