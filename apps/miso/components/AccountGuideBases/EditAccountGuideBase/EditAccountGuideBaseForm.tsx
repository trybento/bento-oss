import React, { useCallback, useEffect, useRef } from 'react';
import Box from 'system/Box';
import H2 from 'system/H2';
import Tooltip from 'system/Tooltip';
import DragAndDropProvider from 'providers/DragAndDropProvider';
import { ComposedComponentsEnum, GuideValue, ModuleOption } from 'types';
import { AccountStepsData } from './types';
import { getModuleOptions } from 'helpers';
import { CustomizedBadge } from '../../Library/TemplateStatus';
import { stepStatColWidth } from 'components/UserGuideBases/EditUserGuideBase/BranchingInfo';
import { GuideBaseState, GuideTypeEnum, Theme } from 'bento-common/types';
import TemplateModules from 'components/Templates/TemplateModules';
import { FormEntityType } from 'components/GuideForm/types';
import {
  stepListMaxWidth,
  stepListMinWidth,
} from 'components/GuideForm/StepList';
import { Formik, FormikProps } from 'formik';
import { usePersistedGuideBase } from 'providers/PersistedGuideBaseProvider';
import { useAllModules } from 'providers/AllModulesProvider';
import { getCustomizedGuideLabel } from 'components/TableRenderer/tables.helpers';
import usePrevious from 'bento-common/hooks/usePrevious';
import SendFormikDataToParent from 'components/utils/SendFormikDataToParent';
import { isGuideInActiveSplitTest } from 'bento-common/data/helpers';
import { Flex } from '@chakra-ui/react';
import InlineContentPreview from 'components/EditorCommon/InlineContentPreview';
import useActiveStepList from 'hooks/useActiveStepList';
import { isFlowGuide } from 'bento-common/utils/formFactor';

interface Props {
  guideData: GuideValue;
  guideBaseState: GuideBaseState;
  accountGuideSteps: AccountStepsData;
  onSave: ({ guideData }: { guideData: GuideValue }) => void;
  bindFormData: (formData: FormikProps<{ guideData: GuideValue }>) => void;
  renderHeaderControls?: React.ReactNode | undefined;
  theme: Theme;
  isCyoa: boolean;
}

function EditAccountGuideBaseForm({
  guideData,
  guideBaseState,
  accountGuideSteps,
  renderHeaderControls,
  onSave,
  bindFormData,
  theme,
  isCyoa,
}: Props) {
  const { modules } = useAllModules();
  const resetFormRef = useRef(null);
  const prevGuideData = usePrevious(guideData);

  const {
    guideBase: { isModifiedFromTemplate, createdFromTemplate, formFactor },
    isTargetedForSplitTesting,
  } = usePersistedGuideBase();
  const isFlow = isFlowGuide(formFactor);

  const currentStep = useActiveStepList();
  const selectedStep = isFlow
    ? guideData.modules[0]?.steps?.[currentStep]
    : null;
  const selectedTag = selectedStep?.taggedElements?.[0];

  const moduleOptions: ModuleOption[] = getModuleOptions(modules);

  const filterUnusedModules = useCallback(
    (options: ModuleOption[], guideData: GuideValue) => {
      return options.filter(
        (option) =>
          !guideData.modules
            .map((module) => module.createdFromModuleEntityId)
            .filter(Boolean)
            .includes(option.value)
      );
    },
    []
  );

  useEffect(() => {
    if (prevGuideData) {
      resetFormRef.current?.({ values: { guideData } });
    }
  }, [guideData]);

  const isArchived = guideBaseState === GuideBaseState.archived;
  const isReadonly =
    isArchived || isGuideInActiveSplitTest(isTargetedForSplitTesting);

  return (
    <Formik initialValues={{ guideData }} onSubmit={onSave}>
      {({ values, resetForm }) => {
        resetFormRef.current = resetForm;
        const unusedModules = filterUnusedModules(
          moduleOptions,
          values.guideData
        );

        return (
          <DragAndDropProvider>
            <Box px="64px" display="grid">
              <Box
                width="100%"
                marginBottom="32px"
                display="flex"
                justifyContent="space-between"
              >
                <Box>
                  <H2>{values.guideData.name}</H2>
                </Box>
                {isModifiedFromTemplate && (
                  <Box display="flex" gap="2" m="auto" ml="4">
                    <CustomizedBadge
                      tooltipLabel={getCustomizedGuideLabel(
                        createdFromTemplate?.entityId
                      )}
                    />
                  </Box>
                )}
                <Box>{renderHeaderControls}</Box>
              </Box>

              <Flex
                flexDir={isFlow ? 'row' : 'column'}
                gridGap={isFlow ? '10' : undefined}
                mt={isFlow ? '4' : undefined}
                pb="10"
              >
                {!isFlow && (
                  <Box w="full" px="7">
                    <Box
                      w="full"
                      maxW={stepListMaxWidth}
                      minW={stepListMinWidth}
                      display="flex"
                    >
                      <Box
                        ml="auto"
                        display="flex"
                        fontWeight="bold"
                        color="gray.600"
                      >
                        <Tooltip
                          label="Users who have viewed step details"
                          placement="top"
                        >
                          <Box w={stepStatColWidth} textAlign="center">
                            Users viewed
                          </Box>
                        </Tooltip>
                        <Box w={stepStatColWidth} textAlign="center">
                          Completed By
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                )}

                <TemplateModules
                  templateValue={values.guideData}
                  allModules={modules}
                  allowedModules={unusedModules}
                  canDelete={!isFlow}
                  theme={theme}
                  formFactor={formFactor}
                  formFactorStyle={guideData.formFactorStyle}
                  disabledAddStepGroupBtn={isFlow}
                  formEntityType={FormEntityType.guideBase}
                  guideType={GuideTypeEnum.account}
                  accountGuideSteps={accountGuideSteps}
                  disabled={isReadonly}
                  isCyoa={isCyoa}
                  {...(isFlow && { w: '580px', flex: 'none' })}
                />
                {isFlow && (
                  <InlineContentPreview
                    component={ComposedComponentsEnum.flow}
                    tagType={selectedTag?.type}
                    tagStyle={selectedTag?.style}
                    selectedStep={selectedStep}
                    formFactorStyle={guideData.formFactorStyle}
                    previewBoxProps={{ py: 0 }}
                    contextual
                  />
                )}
              </Flex>
            </Box>
            <SendFormikDataToParent bindFormData={bindFormData} />
          </DragAndDropProvider>
        );
      }}
    </Formik>
  );
}

export default EditAccountGuideBaseForm;
