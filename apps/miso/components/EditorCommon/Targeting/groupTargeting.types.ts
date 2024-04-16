import { GroupTargeting } from 'bento-common/types/targeting';
import { InitState } from 'hooks/useInitialState';

/**
 * Allows pre-loading a certain state into the editor
 * Ephemeral state to be reset when applied.
 */
export type GroupEditorInitialState = {
  /** Preload some values */
  suggestedValues?: GroupTargeting;
  /** Set straight to edit mode */
  setToEdit?: boolean;
  /** Allow saving without edits */
  setDirty?: boolean;
  /** Callback once we applied the settings */
  onApplied?: () => void;
  /** Behavior when cancelling out of edit mode */
  cancelCallback?: () => void;
};

export interface GroupTargetingEditorProps {
  targeting: GroupTargeting;
  formKey: string;
  initialEditorState?: InitState<GroupEditorInitialState>;
  /** Controls to show in view mode */
  viewControls?: React.ReactNode;
  /** Forces editor to show one mode only, outsourcing controls to parent component */
  lockMode?: EditorMode;
  /** Enables use of audiences, etc. */
  launchingContext?: boolean;
  /** Allow group editor form to re-init when values change */
  enableReinitialize?: boolean;
}

export enum EditorMode {
  View,
  Edit,
}
