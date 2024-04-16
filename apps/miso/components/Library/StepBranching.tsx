import React, { useCallback, useMemo, useState } from 'react';
import get from 'lodash/get';
import { FieldArray, useFormikContext } from 'formik';
import debounce from 'lodash/debounce';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { ChakraProps, FormLabel, useToast } from '@chakra-ui/react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import DragIndicator from '@mui/icons-material/DragIndicator';

import {
  BranchingEntityType,
  BranchingStyle,
  GuideFormFactor,
  Theme,
} from 'bento-common/types';
import {
  formatChoiceKey,
  isBranchingTypeSupported,
} from 'bento-common/data/helpers';
import useRandomKey from 'bento-common/hooks/useRandomKey';
import { BranchingType } from 'bento-common/types/templateData';

import DragAndDropProvider from 'providers/DragAndDropProvider';
import Box from 'system/Box';
import Select, { SelectOptions } from 'system/Select';

import { BranchingFieldByType, BranchingFormFactor } from 'types';

import Input from 'system/Input';

import SimpleCharCount from 'bento-common/components/CharCount/SimpleCharCount';
import { MODULE_ALIAS_SINGULAR } from 'helpers/constants';
import {
  BRANCHING_FORM_FACTOR_OPTIONS,
  BRANCHING_TYPE_OPTIONS,
} from './library.constants';
import { useAllModules } from 'providers/AllModulesProvider';
import { useAllTemplates } from 'providers/AllTemplatesProvider';
import ModuleDetailsModal from './ModuleDetailsModal';
import { useTemplate } from 'providers/TemplateProvider';
import StepBranchingImageControl from './StepBranchingImageControl';
import { TemplateFormValues } from 'components/Templates/Template';
import withTemplateDisabled from 'components/hocs/withTemplateDisabled';
import CreateOrDuplicateTemplateModal from './CreateOrDuplicateTemplateModal';
import RestrictedStepGroupModal from 'components/Templates/RestrictedStepGroupModal';
import SwitchField from 'components/common/InputFields/SwitchField';
import BranchingSelect, {
  NO_MODULE_OPTION,
} from 'components/Branching/BranchingSelect';
import SeparatorBox from 'components/EditorCommon/SeparatorBox';
import { useSerialCyoa } from 'hooks/useFeatureFlag';
import SimpleInfoTooltip from 'system/SimpleInfoTooltip';
import InlineLink from 'components/common/InlineLink';

export type BranchingCreatingState = {
  branchingEntityType: BranchingType;
  pathIdx: number;
} | null;

export interface StepBranchingModule {
  entityId: string;
  displayTitle: string;
  name: string;
  [key: string]: any;
}

export interface StepBranchingTemplate {
  entityId: string;
  name: string;
  [key: string]: any;
}

interface StepBranchingProps {
  selectedStepFormKey: string;
  disabled?: boolean;
}

const StepBranching: React.FC<StepBranchingProps> = (props) => {
  const { selectedStepFormKey, disabled } = props;

  const [branchingCreatingNew, setBranchingCreatingNew] =
    useState<BranchingCreatingState>(null);

  const toast = useToast();
  const enableSerialCyoa = useSerialCyoa();

  /**
   * @todo add type for module form values
   */
  const { setFieldValue, values } = useFormikContext<
    TemplateFormValues | any
  >();
  const { modules, fetchAllModules } = useAllModules();
  const { reusableTemplates, fetchAllTemplates } = useAllTemplates();

  // will only be available in template form
  const { template } = useTemplate();

  const stepValue = get(values, selectedStepFormKey);

  const {
    branchingQuestion,
    branchingMultiple,
    branchingDismissDisabled,
    branchingFormFactor,
    branchingPathData = [],
    branchingEntityType,
  } = stepValue || {};

  const allowedBranchingTypeOptions = useMemo(
    () =>
      BRANCHING_TYPE_OPTIONS.filter((o) =>
        isBranchingTypeSupported({
          entityType: o.value as any as BranchingEntityType,
          theme: template?.theme as Theme,
          isCyoa: template?.isCyoa,
        })
      ),
    [template?.theme as Theme, template?.isCyoa]
  );

  const branchingTypeDisabled =
    disabled || allowedBranchingTypeOptions.length < 2;

  const [branchingCreatingModule, branchingCreatingTemplate] = useMemo(
    () => [
      branchingCreatingNew?.branchingEntityType === BranchingType.module,
      branchingCreatingNew?.branchingEntityType === BranchingType.guide,
    ],
    [branchingCreatingNew]
  );

  const handleCreateNewFromBranching = useCallback(
    (branchingEntityType: BranchingType, pathIdx: number) => {
      setBranchingCreatingNew({
        branchingEntityType,
        pathIdx,
      });
    },
    []
  );

  const resetBranchingCreating = useCallback(
    () => setBranchingCreatingNew(null),
    []
  );

  const onCreateElementFromBranching = useCallback(
    (newElement: { [key: string]: any; entityId: string }) => {
      const stepValue = get(values, selectedStepFormKey);
      const { branchingPathData = [] } = stepValue || {};

      setFieldValue(
        `${selectedStepFormKey}.branchingPathData.[${branchingCreatingNew.pathIdx}]`,
        {
          ...branchingPathData[branchingCreatingNew.pathIdx],
          [BranchingFieldByType[branchingCreatingNew.branchingEntityType]]:
            newElement.entityId,
        }
      );

      if (branchingCreatingNew.branchingEntityType === BranchingType.guide) {
        fetchAllTemplates();
        resetBranchingCreating();
      } else {
        fetchAllModules();

        toast({
          title: `New ${MODULE_ALIAS_SINGULAR} created!`,
          isClosable: true,
          status: 'success',
        });
      }
    },
    [
      setFieldValue,
      branchingCreatingNew,
      values,
      selectedStepFormKey,
      fetchAllModules,
      fetchAllModules,
    ]
  );

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [pathsCount, setPathsCount] = useState<number>(
    branchingPathData?.length || 1
  );

  const [selectedBranchingType, setSelectedBranchingType] = useState(
    allowedBranchingTypeOptions.find((o) => o.value === branchingEntityType) ||
      allowedBranchingTypeOptions[0]
  );

  const [selectedBranchingFormFactor, setSelectedBranchingFormFactor] =
    useState(
      BRANCHING_FORM_FACTOR_OPTIONS.find(
        (o) => o.value === branchingFormFactor
      ) || BRANCHING_FORM_FACTOR_OPTIONS[0]
    );

  const getSelectedBranchingPath = useCallback<
    (path: any) => string | undefined
  >(
    (path) => {
      if (!path) return null;
      return path[BranchingFieldByType[selectedBranchingType.value]];
    },
    [selectedBranchingType]
  );

  const debouncedBranchingQuestionChange = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      setFieldValue(`${selectedStepFormKey}.branchingQuestion`, e.target.value);
    }, 200),
    []
  );

  const debouncedPathLabelChange = useCallback(
    debounce((label: string, idx: number) => {
      const choiceKey = formatChoiceKey(label);
      const pathData = branchingPathData[idx] || {};

      setFieldValue(`${selectedStepFormKey}.branchingPathData.[${idx}]`, {
        ...pathData,
        label,
        choiceKey,
      });
    }, 200),
    [branchingPathData]
  );

  const debouncedPathStyleChange = useCallback(
    debounce((newStyle: BranchingStyle, idx: number) => {
      const pathData = branchingPathData[idx] || {};

      setFieldValue(`${selectedStepFormKey}.branchingPathData.[${idx}]`, {
        ...pathData,
        style: newStyle,
      });
    }, 200),
    [branchingPathData]
  );

  const [isRestrictedModalOpen, setRestrictedModalOpen] =
    useState<boolean>(false);

  const templateStepGroupIds = useMemo<string[]>(
    () =>
      values.templateData?.modules?.map((m) => m.entityId).filter(Boolean) ||
      [],
    [values.templateData?.modules]
  );

  const handleRestrictedModalClosed = useCallback(() => {
    setRestrictedModalOpen(false);
  }, []);

  const handlePathTargetChange = useCallback(
    (selectedOption: SelectOptions, idx: number) => {
      if (
        selectedOption.value ||
        selectedOption.label === NO_MODULE_OPTION.label
      ) {
        // Prevents addint a step group that is currently in use within the template
        if (
          selectedBranchingType.value == BranchingType.module &&
          templateStepGroupIds.includes(selectedOption.value)
        ) {
          setRestrictedModalOpen(true);
          return;
        }

        const pathData = branchingPathData[idx] || {};
        setFieldValue(`${selectedStepFormKey}.branchingPathData.[${idx}]`, {
          ...pathData,
          [BranchingFieldByType[selectedBranchingType.value]]:
            selectedOption.value,
        });
      } else {
        handleCreateNewFromBranching(selectedBranchingType.value, idx);
      }
    },
    [
      selectedBranchingType,
      templateStepGroupIds,
      branchingPathData,
      handleCreateNewFromBranching,
    ]
  );

  const handleBranchingTypeChange = useCallback(
    (selectedOption) => {
      setSelectedBranchingType(selectedOption);
      setFieldValue(`${selectedStepFormKey}.branchingMultiple`, false);
      setFieldValue(`${selectedStepFormKey}.branchingDismissDisabled`, false);
      setFieldValue(
        `${selectedStepFormKey}.branchingEntityType`,
        selectedOption.value
      );

      // Reset path targets.
      for (let i = 0; i < (branchingPathData || []).length; i++) {
        setFieldValue(`${selectedStepFormKey}.branchingPathData.[${i}]`, {
          ...branchingPathData[i],
          [BranchingFieldByType.guide]: undefined,
          [BranchingFieldByType.module]: undefined,
        });
      }
    },
    [selectedStepFormKey, branchingPathData]
  );

  const handleBranchingFormFactorChange = useCallback(
    (selectedOption) => {
      setSelectedBranchingFormFactor(selectedOption);
      setFieldValue(
        `${selectedStepFormKey}.branchingFormFactor`,
        selectedOption.value
      );
    },
    [selectedStepFormKey]
  );

  const handleBranchingMultipleChange = useCallback(() => {
    if (disabled) return;
    const newValue = !branchingMultiple;
    setFieldValue(`${selectedStepFormKey}.branchingMultiple`, newValue);
    if (newValue)
      setFieldValue(`${selectedStepFormKey}.branchingDismissDisabled`, false);
  }, [selectedStepFormKey, disabled, branchingMultiple]);

  const handleBranchingDismissChange = useCallback(() => {
    if (disabled) return;
    setFieldValue(
      `${selectedStepFormKey}.branchingDismissDisabled`,
      !branchingDismissDisabled
    );
  }, [selectedStepFormKey, branchingDismissDisabled, disabled]);

  const pathsContainerKey = useRandomKey([
    pathsCount,
    modules.length,
    reusableTemplates.length,
    branchingEntityType,
  ]);

  const handleBeforeDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const getDraggableKey = useCallback(
    (path, idx: number) =>
      `draggable-${idx}-${path?.label}-${getSelectedBranchingPath(path)}`,
    []
  );

  // Using memoized keys for rows to avoid inputs from losing
  // focus while typing and re-render inputs when dragging finishes.
  const pathRowKeys = useMemo(
    () =>
      [...Array(pathsCount)].map((_, idx) => {
        const path = branchingPathData?.[idx];
        return getDraggableKey(path, idx);
      }),
    [isDragging, pathsCount]
  );

  const showCharCount = useMemo(
    () => selectedBranchingFormFactor.value === BranchingFormFactor.Cards,
    [selectedBranchingFormFactor.value]
  );

  const [pathContainerBoxProps, pathColBoxProps] = useMemo(
    () => [
      { gridGap: '0 24px' } as ChakraProps,
      [
        { flex: 0.8, minWidth: '200px' },
        { flex: 1, minWidth: '200px' },
      ] as ChakraProps[],
    ],
    []
  );

  /**
   * Enable serialCYOA if it's already serial CYOA
   * We use the template instead of form values so that it will display according to
   *   persisted setting, instead of hiding once unchecked.
   */
  const allowSerialCyoa =
    enableSerialCyoa ||
    (template?.isCyoa &&
      template?.modules?.[0].stepPrototypes?.[0].branchingMultiple);

  if (!selectedStepFormKey) return null;

  return (
    <>
      <SeparatorBox flexDir="column" px="6">
        <Box>
          <FormLabel variant="secondary">Branching question</FormLabel>
          <Input
            isDisabled={disabled}
            defaultValue={branchingQuestion}
            onChange={debouncedBranchingQuestionChange}
            fontSize="sm"
          />
          <Box fontSize="xs" color="gray.500">
            This text is shown to the user in the dropdown
          </Box>
        </Box>
        <Box display="flex" flexWrap="wrap" mt={4} {...pathContainerBoxProps}>
          <Box {...pathColBoxProps[0]}>
            <FormLabel variant="secondary">What should happen</FormLabel>
            <Select
              isDisabled={branchingTypeDisabled}
              isSearchable={false}
              value={selectedBranchingType}
              onChange={handleBranchingTypeChange}
              options={allowedBranchingTypeOptions}
            />
          </Box>
          <Box {...pathColBoxProps[1]}>
            <FormLabel variant="secondary">Show options as</FormLabel>
            <Select
              isSearchable={false}
              value={selectedBranchingFormFactor}
              onChange={handleBranchingFormFactorChange}
              options={BRANCHING_FORM_FACTOR_OPTIONS}
              isDisabled={disabled}
            />
          </Box>
        </Box>

        {selectedBranchingType.value === BranchingType.module ||
        allowSerialCyoa ? (
          <SwitchField
            mt="2"
            uncheckedOption={{
              value: false,
              label:
                selectedBranchingType.value === BranchingType.module
                  ? 'Allow selecting multiple'
                  : 'Allow users to choose another guide after completion',
            }}
            disabled={disabled}
            onChange={handleBranchingMultipleChange}
            defaultValue={branchingMultiple}
            checkedOption={{ value: true }}
            as="checkbox"
          />
        ) : null}

        {branchingMultiple &&
        branchingEntityType === BranchingEntityType.Guide ? (
          <SwitchField
            mt="2"
            uncheckedOption={{
              value: false,
              label: 'Allow user to hide/dismiss future paths',
            }}
            disabled={disabled}
            onChange={handleBranchingDismissChange}
            defaultValue={!branchingDismissDisabled}
            checkedOption={{ value: true }}
            as="checkbox"
          />
        ) : null}

        <Box mt={4}>
          <Box key={pathsContainerKey}>
            <Box display="flex" flexDir="row" {...pathContainerBoxProps}>
              <FormLabel variant="secondary" {...pathColBoxProps[0]}>
                If user chooses this
              </FormLabel>
              <FormLabel variant="secondary" {...pathColBoxProps[1]}>
                Add this{' '}
                {selectedBranchingType.value === BranchingType.module
                  ? MODULE_ALIAS_SINGULAR
                  : selectedBranchingType.value}{' '}
                {selectedBranchingType.value === BranchingType.guide && (
                  <>
                    {' '}
                    <SimpleInfoTooltip
                      label={
                        <span>
                          You don’t need to auto-launch or set targeting rules
                          on the linked guide. Read more{' '}
                          <InlineLink
                            href="https://help.trybento.co/en/articles/6476679-launch-guide-cta"
                            target="_blank"
                            color="inherit"
                          >
                            here
                          </InlineLink>
                          .
                        </span>
                      }
                    />
                  </>
                )}
              </FormLabel>
            </Box>
            <FieldArray
              name={`${selectedStepFormKey}.branchingPathData`}
              render={({ push, remove }) => (
                <>
                  <DragAndDropProvider
                    formItemsKey={`${selectedStepFormKey}.branchingPathData`}
                    dragEndCallback={handleDragEnd}
                    onBeforeDragStart={handleBeforeDragStart}
                  >
                    {/* @ts-ignore */}
                    <Droppable
                      droppableId={`${selectedStepFormKey}.branchingPathData`}
                      isDropDisabled={disabled}
                    >
                      {(provided) => (
                        // @ts-ignore
                        <Box
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {[...Array(pathsCount)].map((_, idx) => {
                            const path = branchingPathData?.[idx];
                            const showControls = pathsCount > 1 && !disabled;

                            return (
                              // @ts-ignore
                              <Draggable
                                // Note: keeping 'key' and 'draggableId' separate to avoid
                                // a conflict between input focus and drag logic.
                                key={pathRowKeys[idx]}
                                draggableId={getDraggableKey(path, idx)}
                                index={idx}
                              >
                                {(provided) => (
                                  <Box
                                    ref={provided.innerRef}
                                    className="branching-path-row"
                                    mb={showCharCount ? 1 : 2}
                                    display="flex"
                                    flexWrap="wrap"
                                    {...pathContainerBoxProps}
                                    {...provided.draggableProps}
                                  >
                                    <Box
                                      {...pathColBoxProps[0]}
                                      position="relative"
                                    >
                                      {showControls && (
                                        <Box
                                          className="branching-path-drag-handle"
                                          position="absolute"
                                          left="-22px"
                                          top="7px"
                                          color="gray.600"
                                          w="24px"
                                          {...provided.dragHandleProps}
                                        >
                                          <DragIndicator />
                                        </Box>
                                      )}
                                      <Input
                                        defaultValue={path?.label || ''}
                                        isDisabled={disabled}
                                        onChange={(e) =>
                                          debouncedPathLabelChange(
                                            e.target.value,
                                            idx
                                          )
                                        }
                                        placeholder="i.e. Manual set up"
                                        size="md"
                                        fontSize="sm"
                                      />
                                      {showCharCount && (
                                        <SimpleCharCount
                                          limit={42}
                                          text={path?.label}
                                          textAlign="right"
                                        />
                                      )}
                                    </Box>

                                    <Box {...pathColBoxProps[1]}>
                                      <Box
                                        display="flex"
                                        flexDir="row"
                                        flex="1"
                                        position="relative"
                                      >
                                        <BranchingSelect
                                          type={selectedBranchingType.value}
                                          value={getSelectedBranchingPath(path)}
                                          templateEntityId={template?.entityId}
                                          select={{
                                            isDisabled: disabled,
                                            onChange: (selectedOption) =>
                                              handlePathTargetChange(
                                                selectedOption,
                                                idx
                                              ),
                                          }}
                                          theme={template?.theme as Theme}
                                          isCyoa={template?.isCyoa}
                                        />

                                        {/* Upload image btn, when available */}
                                        {selectedBranchingFormFactor.value ===
                                          BranchingFormFactor.Cards &&
                                          path && (
                                            <StepBranchingImageControl
                                              branchingChoice={{
                                                key: path.choiceKey,
                                                label: path.label,
                                              }}
                                              branchingStyle={path.style}
                                              onSuccess={(newStyle) =>
                                                debouncedPathStyleChange(
                                                  newStyle,
                                                  idx
                                                )
                                              }
                                            />
                                          )}

                                        {showControls && (
                                          <Box
                                            className="row-hoverable-btn-80"
                                            position="absolute"
                                            right="-20px"
                                            top="7px"
                                            color="gray.600"
                                            cursor="pointer"
                                            w="20px"
                                            my="auto"
                                            ml="2"
                                            onClick={() => {
                                              remove(idx);
                                              setPathsCount(pathsCount - 1);
                                            }}
                                          >
                                            <DeleteIcon />
                                          </Box>
                                        )}
                                      </Box>
                                    </Box>
                                  </Box>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </Box>
                      )}
                    </Droppable>
                  </DragAndDropProvider>
                  {!disabled && (
                    <Box
                      display="flex"
                      alignItems="center"
                      color="bento.bright"
                      cursor="pointer"
                      opacity="1"
                      _hover={{ opacity: '0.8' }}
                      mt={2}
                      onClick={() => {
                        push({});
                        setPathsCount(pathsCount + 1);
                      }}
                    >
                      <AddCircleOutlineIcon
                        style={{
                          color: 'inherit',
                          width: '20px',
                        }}
                      />
                      <Box fontSize="xs" ml="2" fontWeight="bold">
                        Add option
                      </Box>
                    </Box>
                  )}
                </>
              )}
            />
          </Box>
        </Box>
      </SeparatorBox>
      {branchingCreatingModule && (
        <ModuleDetailsModal
          minimal
          isOpen={branchingCreatingModule}
          onClose={resetBranchingCreating}
          onCreate={onCreateElementFromBranching}
          theme={template?.theme as Theme}
          guideFormFactor={template?.formFactor as GuideFormFactor}
        />
      )}
      {branchingCreatingTemplate && (
        <CreateOrDuplicateTemplateModal
          template={null}
          isOpen={branchingCreatingTemplate}
          onClose={resetBranchingCreating}
          onCreate={onCreateElementFromBranching}
        />
      )}
      <RestrictedStepGroupModal
        isOpen={isRestrictedModalOpen}
        onClose={handleRestrictedModalClosed}
        onContinue={handleRestrictedModalClosed}
      />
    </>
  );
};

export default withTemplateDisabled<StepBranchingProps>(StepBranching);
