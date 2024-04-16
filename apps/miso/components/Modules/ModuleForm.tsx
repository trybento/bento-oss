import React, { useCallback, useMemo, useState } from 'react';
import { GuideFormFactor, Theme } from 'bento-common/types';
import { EditModuleQuery } from 'relay-types/EditModuleQuery.graphql';
import useToast from 'hooks/useToast';
import Box from 'system/Box';
import Button from 'system/Button';
import Module from 'components/GuideForm/Module';
import DragAndDropProvider from 'providers/DragAndDropProvider';
import LastSavedAt from 'components/GuideForm/LastSavedAt';
import { MainFormKeys, MODULE_ALIAS_SINGULAR } from 'helpers/constants';
import { showErrors } from 'utils/helpers';
import { FormEntityType } from 'components/GuideForm/types';
import { prepareModuleData } from 'helpers';
import UnsavedChangesManager from 'components/UnsavedChangesManager';
import ModuleOverflowMenuButton from 'components/Library/LibraryModules/ModuleOverflowMenuButton';
import { Formik, FormikErrors } from 'formik';
import FormsProvider from 'providers/FormsProvider';
import { useAttributes } from 'providers/AttributesProvider';
import { Flex } from '@chakra-ui/react';
import ModuleTargetingTab from './ModuleTargetingTab';
import {
  AccountTarget,
  autoLaunchValidationKeys,
  checkIsAnyRuleIncomplete,
  prepareTargetingData,
} from 'components/GuideAutoLaunchModal/Template/autolaunch.helpers';
import { useDynamicModules } from 'hooks/useFeatureFlag';
import pick from 'lodash/pick';
import {
  BranchingType,
  StepPrototypeValue,
} from 'bento-common/types/templateData';
import Page from 'components/layout/Page';
import { capitalizeFirstLetter } from 'bento-common/utils/strings';
import {
  moduleNameOrFallback,
  MODULE_ALIAS_PLURAL,
} from 'bento-common/utils/naming';

export interface ModuleTargetingDataValues {
  targetTemplate: string;
  autoLaunchContext: ReturnType<typeof prepareTargetingData>;
}
export interface ModuleFormValues {
  updatedAt: string;
  moduleData: ModuleData;
  targetingData: ModuleTargetingDataValues[];
}

export interface ModuleData {
  name?: string;
  displayTitle?: string;
  entityId?: string | undefined;
  stepPrototypes: StepPrototypeValue[];
}

interface Props {
  query: EditModuleQuery['response'];
  onSave: (values: ModuleFormValues) => void;
  handleNewElementFromBranching: (branchingEntityType: BranchingType) => void;
  wasAnyElementSaved: boolean;
  onDeleted?: () => void;
  numberOfTemplatesUsingModule: number;
}

function ModuleForm(props: Props) {
  const {
    query,
    onSave,
    wasAnyElementSaved,
    onDeleted,
    numberOfTemplatesUsingModule,
  } = props;

  const toast = useToast();

  // Keep track and disable reinitilize for external actions if dirty.
  const [reinitilizeEnabled, setReinitilizeEnabled] = useState<boolean>(true);
  const [preventPageChange, setPreventPageChange] =
    React.useState<boolean>(true);
  const stepPrototypeNameInputRef = React.useRef(null);
  const isCreating = !query.module.entityId;
  const dynamicModulesEnabled = useDynamicModules();

  const { attributes } = useAttributes();

  const initialValues: ModuleFormValues = useMemo(
    () => ({
      updatedAt: query.module.lastEdited.timestamp as string,
      moduleData: prepareModuleData(query.module) as ModuleData,
      targetingData: query.module.targetingData.map(
        ({ targetTemplate, autoLaunchRules }) => ({
          targetTemplate,
          autoLaunchContext: prepareTargetingData({
            attributes,
            accountTargets: autoLaunchRules as AccountTarget[],
            accountUserTargets: [],
            branchingQuestions: [],
          }),
        })
      ),
    }),
    [query.module, attributes]
  );

  const handleFormDirty = useCallback(
    (dirty: boolean) => {
      const newValue = !dirty;
      newValue && reinitilizeEnabled && setReinitilizeEnabled(newValue);
    },
    [reinitilizeEnabled]
  );

  const validate = useCallback((values: ModuleFormValues) => {
    const errors: FormikErrors<ModuleFormValues> = {};

    const steps = values.moduleData.stepPrototypes || [];
    if (!steps || steps.length === 0) {
      (errors as Record<string, string>).moduleData =
        'At least one step is required';
    }

    if (
      values.targetingData.length > 0 &&
      values.targetingData.some((td) => {
        return (
          !td.targetTemplate ||
          checkIsAnyRuleIncomplete(
            pick(td.autoLaunchContext, autoLaunchValidationKeys)
          )
        );
      })
    ) {
      errors.targetingData = 'Please update auto launch rules.';
    }

    return errors;
  }, []);

  /**
   * @todo dont clear the step after drag + drop
   */
  return (
    <Box>
      <FormsProvider
        formRankings={{}}
        rootFormDetails={{
          formEntityType: FormEntityType.module,
          entityId: query.module.entityId,
        }}
      >
        <Formik
          initialValues={initialValues}
          enableReinitialize={reinitilizeEnabled}
          validate={validate}
          onSubmit={onSave}
        >
          {(formikProps) => {
            const {
              values,
              dirty,
              submitForm,
              isValid,
              errors,
              setFieldValue,
            } = formikProps;
            const { autoComplete: autoCompleteError, ...otherErrors } =
              errors as FormikErrors<
                ModuleFormValues & { autoComplete?: string }
              >;
            const _isValid = !Object.keys(otherErrors).length;

            const handleSave = () => {
              if (!isValid) {
                showErrors(errors, toast);
                return;
              }
              submitForm();
            };

            handleFormDirty(dirty);

            return (
              <Page
                title={query.module.name || 'Edit step group'}
                breadcrumbs={[
                  { label: 'Library', path: '/library' },
                  {
                    label: capitalizeFirstLetter(MODULE_ALIAS_PLURAL),
                    path: '/library/step-groups',
                  },
                  { label: moduleNameOrFallback(query.module) },
                ]}
                actions={
                  <Flex gap={3} alignItems="center">
                    <Box mr="3" minWidth="120px">
                      <LastSavedAt />
                    </Box>
                    <Button
                      minWidth="fit-content"
                      isDisabled={
                        (!isCreating && !(dirty || wasAnyElementSaved)) ||
                        !_isValid
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave();
                      }}
                    >
                      {isCreating
                        ? `Create ${MODULE_ALIAS_SINGULAR}`
                        : `Save to ${MODULE_ALIAS_SINGULAR}`}
                    </Button>
                    <ModuleOverflowMenuButton
                      module={query.module}
                      onDetailsUpdated={(newModuleData) => {
                        setFieldValue(
                          'displayTitle',
                          newModuleData.displayTitle
                        );
                        setFieldValue('name', newModuleData.name);
                        setFieldValue('description', newModuleData.description);
                      }}
                      onDeleted={onDeleted}
                    />
                  </Flex>
                }
                tabs={[
                  {
                    title: 'Content',
                    component: () => (
                      <DragAndDropProvider>
                        <Module
                          formKey={MainFormKeys.module}
                          moduleValue={values.moduleData as any /* TODO: Fix */}
                          numberOfTemplatesUsingModule={
                            numberOfTemplatesUsingModule
                          }
                          formFactor={GuideFormFactor.legacy}
                          shouldAutoFocus={!values.moduleData.displayTitle}
                          stepPrototypeNameInputRef={stepPrototypeNameInputRef}
                          formEntityType={FormEntityType.module}
                          theme={Theme.nested}
                          isCyoa={false}
                          canAddSteps
                          canEditName
                          canDeleteSteps
                        />
                      </DragAndDropProvider>
                    ),
                  },
                  {
                    title: 'Targeting',
                    component: () => (
                      <ModuleTargetingTab formKey="targetingData" />
                    ),
                    disabled: !dynamicModulesEnabled,
                  },
                ]}
              >
                <UnsavedChangesManager
                  warningEnabled={
                    (wasAnyElementSaved || dirty) && preventPageChange
                  }
                  onContinue={handleSave}
                  onDiscard={() => setPreventPageChange(false)}
                />
              </Page>
            );
          }}
        </Formik>
      </FormsProvider>
    </Box>
  );
}

export default ModuleForm;
