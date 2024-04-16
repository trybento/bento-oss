import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Button, Flex, useBoolean, Text } from '@chakra-ui/react';
import { Formik, useFormikContext } from 'formik';

import { GroupTargeting } from 'bento-common/types/targeting';

import { sanitizeTargeting } from 'components/EditorCommon/targeting.helpers';
import {
  setFormToAudience,
  TargetingForm,
} from './GroupTargetingEditor.helpers';
import LoadingState from 'components/system/LoadingState';
import { useFormsProvider } from 'providers/FormsProvider';
import { useTargetingEditorContext } from 'components/Templates/Tabs/Targeting/TargetingEditorProvider';
import TargetingAudienceProvider from './Audiences/TargetingAudiencesProvider';
import BranchingQuestionsQuery from 'queries/BranchingQuestionsQuery';
import {
  GroupEditorInitialState,
  GroupTargetingEditorProps,
  EditorMode,
} from './Targeting/groupTargeting.types';
import ViewRules from './Targeting/ViewRules';
import EditRules from './Targeting/EditRules';
import LaunchModal from 'components/Templates/LaunchModal';
import { FormKeys } from 'helpers/constants';
import { useTemplate } from 'providers/TemplateProvider';
import useToast from 'hooks/useToast';
import {
  audienceRuleToAudience,
  isTargetingIncomplete,
} from 'bento-common/utils/targeting';
import OptionGroupBox from 'system/OptionGroupBox';
import H6 from 'system/H6';
import Radio from 'system/Radio';
import RadioGroup from 'system/RadioGroup';
import { useQueryAsHook } from 'hooks/useQueryAsHook';
import { useBranchingSelectionTargeting } from 'hooks/useFeatureFlag';
import AudienceSelectionDropdown from './Audiences/AudienceSelectionDropdown';
import BasicConfirmationModal from 'system/BasicConfirmationModal';
import { isAllTargeting } from 'components/Templates/Tabs/templateTabs.helpers';

type TargetingFormProps = {
  editorMode: EditorMode;
  onCommit: (values?: GroupTargeting) => void;
  setEditorMode: (mode: EditorMode) => void;
  setRuleMode: (mode: RuleMode) => void;
} & GroupTargetingEditorProps;

export { EditorMode } from './Targeting/groupTargeting.types';

const TargetingForm: React.FC<TargetingFormProps> = (props) => {
  const { editorMode, setEditorMode, onCommit } = props;
  const cancelHook = useRef<GroupEditorInitialState['cancelCallback']>();
  const isBranchingSelectionTargetingEnabled = useBranchingSelectionTargeting();
  const { loading, data } = useQueryAsHook(
    BranchingQuestionsQuery,
    {},
    { disable: !isBranchingSelectionTargetingEnabled }
  );
  const { resetAiCache, setFeedbackState, onTargetingChange } =
    useTargetingEditorContext();
  const { setTargetingDirtyHook } = useTemplate();
  const { setFieldValue, isValid, resetForm, dirty, submitForm, values } =
    useFormikContext<TargetingForm>();
  const { setForms } = useFormsProvider();
  const toast = useToast();

  /**
   * Handle initial settings for the editor
   */
  useEffect(() => {
    const invoked = props.initialEditorState?.invoke();

    if (!invoked) return;

    if (invoked.suggestedValues) {
      /** Handles loading in suggested from top state into the form */
      setFieldValue('targeting', invoked.suggestedValues);
    }

    /**
     * setFieldTouched was not producing the proper result.
     * When submitting, "touch" should be discarded
     */
    if (invoked.setDirty) setFieldValue('touch', true);

    if (invoked.setToEdit) setEditorMode(EditorMode.Edit);

    if (invoked.cancelCallback) cancelHook.current = invoked.cancelCallback;

    invoked.onApplied?.();
  }, [props.initialEditorState]);

  const handleCancel = useCallback(() => {
    setTargetingDirtyHook?.(null);
    if (cancelHook.current) cancelHook.current();
    setEditorMode(EditorMode.View);
    setFeedbackState(false);
  }, [cancelHook.current]);

  const handleEdit = useCallback(() => {
    resetAiCache();
    setEditorMode(EditorMode.Edit);
  }, []);

  const handleCommit = useCallback(() => {
    /** Only tell provider it's dirty when we commit, so it won't submit if we haven't */
    setForms?.([
      {
        formKey: FormKeys.targeting,
        dirty: true,
        submitForm,
        isValid,
        resetForm,
      },
    ]);

    /* Reset audiences */
    if (values.targeting.audiences) setFieldValue('targeting.audiences', null);

    setTargetingDirtyHook?.(null);
    onCommit?.(values.targeting);
  }, [dirty, submitForm, isValid, setTargetingDirtyHook, onCommit, values]);

  /** behavior only for clicking the Done button */
  const handleCommitWithToast = useCallback(() => {
    if (setForms)
      toast({
        title: 'Save this guide for changes to take effect',
        status: 'info',
      });

    handleCommit();
  }, [handleCommit, setForms]);

  /** Apply a behavior for unsaved changes handler */
  useEffect(() => {
    setTargetingDirtyHook?.(dirty ? handleCommit : null);
  }, [dirty, handleCommit, setTargetingDirtyHook]);

  useEffect(() => {
    onTargetingChange?.(values.targeting);
  }, [values.targeting]);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <Flex flexDirection="column" gap="4">
      {editorMode === EditorMode.View && (
        <ViewRules {...props} onEditClicked={handleEdit} />
      )}
      {editorMode === EditorMode.Edit && (
        <EditRules
          {...props}
          onCommit={handleCommitWithToast}
          branchingQuestions={data?.organization?.branchingQuestions ?? []}
          onCancelClicked={handleCancel}
        />
      )}
    </Flex>
  );
};

const AudienceForm: React.FC<TargetingFormProps> = ({ onCommit }) => {
  const { setFieldValue, values, resetForm, submitForm, isValid } =
    useFormikContext<TargetingForm>();
  const currentlySelected = useMemo(
    () => audienceRuleToAudience(values.targeting?.audiences),
    [values.targeting?.audiences]
  );
  const { setTargetingDirtyHook } = useTemplate();
  const [selectedAudience, setSelectedAudience] =
    useState<string>(currentlySelected);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const toast = useToast();

  const { setForms } = useFormsProvider();

  const handleAudienceSelected = useCallback((audienceEntityId: string) => {
    setSelectedAudience(audienceEntityId);
  }, []);

  const handleCommit = useCallback(() => {
    setFormToAudience(setFieldValue, selectedAudience);

    /**
     * Only tell provider it's dirty when we commit, so it won't submit if we haven't
     */
    setForms?.([
      {
        formKey: FormKeys.targeting,
        dirty: true,
        submitForm,
        isValid,
        resetForm,
      },
    ]);

    if (setForms)
      toast({
        title: 'Save this guide for changes to take effect',
        status: 'info',
      });

    onCommit();
  }, [selectedAudience, submitForm, isValid]);

  const handleCloseConfirmationModal = useCallback(() => {
    setConfirmationModalOpen(false);
  }, []);

  const handleCommitButton = useCallback(() => {
    const shouldConfirm = !isAllTargeting(values.targeting);

    if (shouldConfirm) setConfirmationModalOpen(true);
    else handleCommit();
  }, [values, handleCommit]);

  const dirtySelection = currentlySelected !== selectedAudience;

  useEffect(() => {
    setTargetingDirtyHook(dirtySelection ? handleCommit : null);
  }, [dirtySelection, handleCommit]);

  return (
    <OptionGroupBox>
      <Flex justifyContent="space-between">
        <Flex flexDir="column" gap="2">
          <H6>Select audience</H6>
          <AudienceSelectionDropdown
            value={selectedAudience}
            onChange={handleAudienceSelected}
          />
        </Flex>
        <Button
          onClick={handleCommitButton}
          isDisabled={!selectedAudience || !dirtySelection}
          size="sm"
          variant="secondary"
        >
          Save
        </Button>
      </Flex>
      <BasicConfirmationModal
        isOpen={confirmationModalOpen}
        onCancel={handleCloseConfirmationModal}
        handleConfirm={handleCommit}
        title="Override one-off rules with saved audience"
        confirmButtonText="Yes, override"
        size="lg"
      >
        <Text>
          This template is using one-off rules. Using a saved audience will
          override and clear these rules.
        </Text>
        <br />
        <Text>
          Are you sure you want to use a saved audience and override the one-off
          rules?
        </Text>
      </BasicConfirmationModal>
    </OptionGroupBox>
  );
};

enum RuleMode {
  custom = 'custom',
  audiences = 'audiences',
}

const GroupTargetingEditor: React.FC<GroupTargetingEditorProps> = (props) => {
  const {
    targeting,
    formKey,
    launchingContext,
    initialEditorState,
    enableReinitialize = true,
  } = props;
  const [ruleMode, setRuleMode] = useState(
    targeting?.audiences && !initialEditorState?.current()
      ? RuleMode.audiences
      : RuleMode.custom
  );
  const {
    resetAiCache,
    requestId,
    template,
    onEditingDone,
    onTargetingSubmit,
  } = useTargetingEditorContext();
  const { setEditingTargetingForm } = useTemplate();
  const [confirmModalOpen, setConfirmModalOpen] = useBoolean(false);
  const [editorMode, setEditorMode] = useState(
    props.lockMode ?? EditorMode.View
  );
  const { setForms, updateFormDirty } = useFormsProvider();

  const initialValues = useMemo<{ targeting: GroupTargeting }>(
    () => ({ targeting }),
    [targeting]
  );

  const validate = useCallback(
    (values: { targeting: GroupTargeting }) => {
      const { targeting } = values;
      const errors: { [key: string]: string } = {};

      if (isTargetingIncomplete(targeting)) {
        errors[formKey] = 'Please update audience targeting rules.';
      }

      return errors;
    },
    [formKey]
  );

  useEffect(() => {
    setEditingTargetingForm(editorMode === EditorMode.Edit);
  }, [editorMode]);

  /** Commit local changes. Behavior of local save button */
  const onCommit = useCallback(
    (_targetingValues?: GroupTargeting) => {
      resetAiCache();
      if (!props.lockMode) setEditorMode(EditorMode.View);
      onEditingDone?.();
    },
    [requestId.value]
  );

  const onSubmit = useCallback(
    async (values: { targeting: GroupTargeting }) => {
      /**
       * @todo a lot of this is template-specific submission logic. Move out to form
       */
      if (!template?.isAutoLaunchEnabled || confirmModalOpen) {
        // Depending on rule mode, wipe the non-selected rule mode
        await onTargetingSubmit?.(
          sanitizeTargeting(values.targeting, ruleMode === RuleMode.audiences)
        );

        updateFormDirty?.(FormKeys.targeting, false);
        onCommit();
        setConfirmModalOpen.off();
      } else {
        setConfirmModalOpen.on();
      }
    },
    [template?.isAutoLaunchEnabled, confirmModalOpen, ruleMode, updateFormDirty]
  );

  const handleRuleModeChange = useCallback(
    (usingAudiences: boolean) => (val) => {
      setRuleMode(val);

      if (val === RuleMode.custom && usingAudiences) {
        /* If audiences were saved before, drop into edit */
        setEditorMode(EditorMode.Edit);
      } else {
        /** Otherwise enforce view as it has implications on parent form state */
        setEditorMode(EditorMode.View);
      }
    },
    [targeting]
  );

  const onNewAudience = useCallback(
    (
        setFieldValue: (field: string, value: any) => void,
        { submitForm, isValid, resetForm }
      ) =>
      (audienceEntityId: string) => {
        setFormToAudience(setFieldValue, audienceEntityId);

        setForms?.([
          {
            formKey: FormKeys.targeting,
            dirty: true,
            submitForm,
            isValid,
            resetForm,
          },
        ]);

        setEditorMode(EditorMode.View);
        setRuleMode(RuleMode.audiences);
      },
    [setForms]
  );

  if (!targeting) {
    return null;
  }

  return (
    <Formik
      key={formKey}
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize={enableReinitialize}
      validate={validate}
    >
      {({ values, submitForm, setFieldValue, isValid, resetForm }) => {
        return (
          <TargetingAudienceProvider
            onSaveComplete={onNewAudience(setFieldValue, {
              submitForm,
              resetForm,
              isValid,
            })}
            targeting={values.targeting}
          >
            {launchingContext && (
              <Flex flexDir="column" mt="2">
                <H6>How would you like to define your audience?</H6>
                <RadioGroup
                  defaultValue={ruleMode}
                  value={ruleMode}
                  onChange={handleRuleModeChange(!!values.targeting.audiences)}
                >
                  <Radio value={RuleMode.custom} label="Create one-off rules" />
                  <Radio
                    value={RuleMode.audiences}
                    label="Use saved audience"
                  />
                </RadioGroup>
              </Flex>
            )}
            {ruleMode === RuleMode.custom ? (
              <TargetingForm
                editorMode={editorMode}
                setEditorMode={setEditorMode}
                setRuleMode={setRuleMode}
                onCommit={onCommit}
                {...props}
              />
            ) : (
              <AudienceForm
                editorMode={editorMode}
                setEditorMode={setEditorMode}
                setRuleMode={setRuleMode}
                onCommit={onCommit}
                {...props}
              />
            )}
            {/* Even when we submit form from top-level, we trigger this launch modal */}
            {template && (
              <LaunchModal
                isOpen={confirmModalOpen}
                onClose={setConfirmModalOpen.off}
                onConfirm={submitForm}
                targeting={values.targeting}
                template={template}
                editor
              />
            )}
          </TargetingAudienceProvider>
        );
      }}
    </Formik>
  );
};

export default GroupTargetingEditor;
