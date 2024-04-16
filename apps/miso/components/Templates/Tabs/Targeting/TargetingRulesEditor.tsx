import React, { useCallback, useMemo, useState } from 'react';
import { Button, ButtonGroup } from '@chakra-ui/react';

import { GroupTargeting } from 'bento-common/types/targeting';
import GroupTargetingEditor, {
  EditorMode,
} from 'components/EditorCommon/GroupTargetingEditor';
import { FormKeys } from 'helpers/constants';
import TargetingAIGenerator from './TargetingAIGenerator';
import { useTargetingGpt } from 'hooks/useFeatureFlag';
import { useTargetingEditorContext } from './TargetingEditorProvider';
import useInitialState from 'hooks/useInitialState';
import { GroupEditorInitialState } from 'components/EditorCommon/Targeting/groupTargeting.types';

enum Views {
  rules,
  ai,
}

type Props = {
  targeting: GroupTargeting;
  /** Use as editor only and let parent handle controls */
  lockMode?: EditorMode;
  /** Indicates we are editing in a context to launch content */
  launchingContext?: boolean;
  /** Allow group editor form to re-init when values change */
  enableReinitialize?: boolean;
};

const TargetingRulesEditor: React.FC<Props> = ({
  targeting,
  lockMode,
  launchingContext,
  enableReinitialize,
}) => {
  const targetingGptEnabled = useTargetingGpt();
  const { requestId, resetAiCache } = useTargetingEditorContext();

  const [view, setView] = useState(Views.rules);
  const initialEditorState = useInitialState<GroupEditorInitialState>();

  const handleSetView = useCallback(
    (targetView: Views) => () => {
      setView(targetView);
    },
    []
  );

  /**
   * Start the state as dirty to allow if users actually want all/all rules
   */
  const handleUseManual = useCallback(() => {
    initialEditorState.set({
      setToEdit: true,
      setDirty: true,
    });

    /** Clear any potential persisted prompts. */
    resetAiCache();
    handleSetView(Views.rules)();
  }, []);

  const handleReset = useCallback(() => {
    initialEditorState.clear();
    setView(Views.rules);
    requestId.clear();
  }, []);

  /**
   * Confirm AI suggested rules and display in editor
   */
  const handleConfirmSuggestion = useCallback(() => {
    setView(Views.rules);
  }, []);

  /**
   * Set an initial state for editor when we use a suggestion
   */
  const setEditorStateSuggestion = useCallback((targeting: GroupTargeting) => {
    initialEditorState.set({
      suggestedValues: targeting,
      setToEdit: true,
    });
  }, []);

  /**
   * Return to AI prompter from editor
   */
  const handleUseAI = useCallback(() => {
    setView(Views.ai);
  }, []);

  const viewCtas = useMemo(
    () => (
      <ButtonGroup mt="8" spacing="6">
        {targetingGptEnabled && (
          <Button variant="secondary" size="sm" onClick={handleUseAI}>
            ✨ Use AI to write rules!
          </Button>
        )}
      </ButtonGroup>
    ),
    [targetingGptEnabled]
  );

  return view === Views.ai ? (
    <TargetingAIGenerator
      onRulesGenerated={setEditorStateSuggestion}
      loadedTargeting={initialEditorState.current()?.suggestedValues}
      onReset={handleReset}
      onConfirm={handleConfirmSuggestion}
      onUseManual={handleUseManual}
    />
  ) : (
    <GroupTargetingEditor
      formKey={FormKeys.autoLaunch}
      targeting={targeting}
      key={initialEditorState.key}
      initialEditorState={initialEditorState}
      viewControls={viewCtas}
      lockMode={lockMode}
      launchingContext={launchingContext}
      enableReinitialize={enableReinitialize}
    />
  );
};

export default TargetingRulesEditor;
