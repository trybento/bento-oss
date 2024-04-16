import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import DragIndicator from '@mui/icons-material/DragIndicator';
import { commit as SetStepCompletion } from 'mutations/SetStepCompletion';
import { get } from 'lodash';

import Box from 'system/Box';

import { ActiveStepListEvent, DroppableType, FormEntityType } from './types';

import {
  FormFactorStyle,
  GuideFormFactor,
  Theme,
  Timeout,
  StepType,
  GuideTypeEnum,
  CtaInput,
  TagInput,
} from 'bento-common/types';

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  ListItem,
  UnorderedList,
  Flex,
} from '@chakra-ui/react';
import { isBranching } from 'utils/helpers';
import SelectedStep from './SelectedStep/SelectedStep';

import { AccountStepsData } from 'components/AccountGuideBases/EditAccountGuideBase/types';
import Tooltip from 'system/Tooltip';
import { stepStatColWidth } from 'components/UserGuideBases/EditUserGuideBase/BranchingInfo';
import UsersCountCell from 'components/UsersCountCell';
import CircularBadge, { CalloutTypes } from 'system/CircularBadge';
import { ExtendedCalloutTypes } from 'bento-common/types/slate';
import { ACTIVE_STEP_LIST_EVENT, isGuideBase } from 'helpers/constants';
import AddButton from 'components/AddButton';
import { NameInput } from 'components/NameInput';
import { isTemplateBody } from 'bento-common/utils/templates';
import { getEmptyStep } from 'utils/getEmptyStep';
import withTemplateDisabled from 'components/hocs/withTemplateDisabled';
import DeleteButton from 'system/DeleteButton';
import { useUsers } from 'providers/UsersProvider';
import { formatCompletedBy, isEmptyStep } from './guideForm.helpers';
import { isInputStep } from 'bento-common/data/helpers';
import ConfirmDeleteModal from 'components/ConfirmDeleteModal';
import { pluralize } from 'bento-common/utils/pluralize';
import { ModuleUsage } from 'components/Modules/ModuleCountMessage';
import { isFlowGuide } from 'bento-common/utils/formFactor';
import ConflictingFlowCtaWarning from './ConflictingFlowCtaWarning';
import { TemplateFormValues } from 'components/Templates/Template';
import { areFlowCtasCompliant } from 'bento-common/validation/guide';

export const stepListMaxWidth = '1600px';
export const stepListMinWidth = '1000px';

interface StepListProps {
  formKey: string;
  steps: any[];
  deleteDisabled: boolean;
  canAddSteps: boolean;
  formFactor: GuideFormFactor;
  stepReorderDisabled?: boolean;
  formFactorStyle?: FormFactorStyle;
  theme: Theme;
  isCyoa: boolean;
  formEntityType: FormEntityType;
  guideType?: GuideTypeEnum;
  accountGuideSteps?: AccountStepsData;
  moduleUsage?: ModuleUsage;
  templateEntityId?: string;
  initialSelectedStepPrototype?: string;
  /** Disables everything. */
  disabled?: boolean;
  rteRenderKey?: string;
}

function StepList({
  formKey,
  steps = [],
  deleteDisabled,
  stepReorderDisabled,
  formFactor,
  formFactorStyle,
  theme,
  isCyoa,
  formEntityType,
  guideType,
  accountGuideSteps,
  moduleUsage,
  templateEntityId,
  canAddSteps,
  initialSelectedStepPrototype,
  disabled,
  rteRenderKey,
}: StepListProps) {
  const { setFieldValue, dirty, values } =
    useFormikContext<TemplateFormValues>();
  const accordionResetTimeout = useRef<Timeout>();
  const expandStepTimeout = useRef<Timeout>();
  const [accordionDisabled, setAccordionDisabled] = useState<boolean>(false);
  const [stepToDelete, setStepToDelete] = useState<number>(-1);
  const [expandedStepIndex, setStepIndexExpanded] = useState<number>(-1);
  const [recentlyAddedStepIdx, setRecentlyAddedStepIdx] = useState<number>(-1);
  const isFlow = isFlowGuide(formFactor);

  const _stepReorderDisabled =
    stepReorderDisabled || steps.length <= 1 || disabled;
  const _deleteDisabled = deleteDisabled || disabled;
  const _canAddSteps = canAddSteps && !disabled;

  const resetRecentlyAddedStep = useCallback(() => {
    setRecentlyAddedStepIdx(-1);
  }, []);

  const handleCloseAccordion = useCallback(() => {
    clearInterval(expandStepTimeout.current);
    setStepIndexExpanded(-1);
  }, []);

  const collapseOtherStepLists = useCallback(
    (newExpandedStepIndex: number) => {
      document.dispatchEvent(
        new CustomEvent<ActiveStepListEvent>(ACTIVE_STEP_LIST_EVENT, {
          detail: {
            formKey,
            expandedStepIndex: newExpandedStepIndex,
          },
        })
      );
    },
    [formKey, expandedStepIndex]
  );

  const handleListCollapse = useCallback(
    (e: CustomEvent<ActiveStepListEvent>) => {
      if (e.detail.formKey && e.detail.formKey !== formKey)
        handleCloseAccordion();
    },
    [formKey]
  );

  const handleStepNameChange = useCallback(
    (fk: string) => (name: string) => setFieldValue(`${fk}.name`, name),
    [setFieldValue]
  );

  const handleAddStep = useCallback(
    ({ push }: FieldArrayRenderProps) =>
      () => {
        handleCloseAccordion();

        // Track new step to disable empty name warning.
        setRecentlyAddedStepIdx(steps.length);
        push(getEmptyStep(formFactor, theme));
      },
    [formKey, steps.length, theme]
  );

  const handleDeleteStep = useCallback(
    ({ remove }: FieldArrayRenderProps, idx?: number) =>
      _deleteDisabled
        ? null
        : (e?: React.MouseEvent) => {
            e?.stopPropagation();
            remove(idx !== undefined ? idx : stepToDelete);

            // Sync theselected step for other components.
            document.dispatchEvent(
              new CustomEvent<ActiveStepListEvent>(ACTIVE_STEP_LIST_EVENT, {
                detail: {
                  formKey: null,
                  expandedStepIndex: 0,
                },
              })
            );
          },
    [_deleteDisabled, stepToDelete]
  );

  const handleAccordionChange = useCallback(
    (expandedIndex: number) => {
      clearTimeout(expandStepTimeout.current);
      if (!accordionDisabled) {
        setStepIndexExpanded(expandedIndex);
        collapseOtherStepLists(expandedIndex);
      }
    },
    [accordionDisabled, collapseOtherStepLists]
  );

  // This interaction might need to be changed to mouseDown or something else.
  const handleDragIndicatorMouseEnter = useCallback(() => {
    accordionResetTimeout.current = setTimeout(() => {
      handleCloseAccordion();
    }, 300);
  }, []);

  const handleDragIndicatorMouseLeave = useCallback(() => {
    clearTimeout(accordionResetTimeout.current);
  }, []);

  const handleDisableAccordion = useCallback(() => {
    clearTimeout(expandStepTimeout.current);
    setAccordionDisabled(true);
  }, []);

  const handleCloseDeleteConfirmation = useCallback(
    () => setStepToDelete(-1),
    []
  );

  const handleEnableAccordion = useCallback(
    (index: number) => () => {
      setAccordionDisabled(false);
      resetRecentlyAddedStep();
      expandStepTimeout.current = setTimeout(() => {
        setStepIndexExpanded(index);
        collapseOtherStepLists(index);
      }, 300);
    },
    [steps, collapseOtherStepLists]
  );

  const stopPropagation = useCallback(
    (e: React.MouseEvent) => e.stopPropagation(),
    []
  );

  const handleSetStepCompletion = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      stepType?: StepType | null,
      stepEntityId?: string
    ) => {
      e.preventDefault();
      e.stopPropagation();

      const isComplete = e.target.checked;
      if (!stepEntityId || (isBranching(stepType) && isComplete)) return;

      return SetStepCompletion({ stepEntityId, isComplete });
    },
    []
  );

  useEffect(() => {
    if (initialSelectedStepPrototype) {
      const index = steps.findIndex(
        (step) => step.entityId === initialSelectedStepPrototype
      );
      if (index >= 0) {
        setStepIndexExpanded(index);
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener(ACTIVE_STEP_LIST_EVENT, handleListCollapse);
    return () =>
      document.removeEventListener(ACTIVE_STEP_LIST_EVENT, handleListCollapse);
  }, [handleListCollapse]);

  const { users } = useUsers() || {};

  const usersDict = useMemo(() => {
    return users.reduce((a, v) => {
      a[v.email] = v;
      return a;
    }, {});
  }, [users]);

  const computeFlowCtasCompliance = useCallback(
    (stepIndex: number) => {
      const nextStep = steps[stepIndex + 1];

      if (!isFlowGuide(formFactor) || !nextStep)
        return {
          compliant: true,
          nextUrlOfFlow: undefined,
        };

      const ctas: CtaInput[] =
        get<TemplateFormValues, string>(values, `${formKey}[${stepIndex}]`)
          ?.ctas || [];

      const nextUrlOfFlow: TagInput['wildcardUrl'] | undefined = get<
        TemplateFormValues,
        string
      >(values, `${formKey}[${stepIndex + 1}]`)?.taggedElements?.[0]
        ?.wildcardUrl;

      return {
        compliant: areFlowCtasCompliant(ctas, nextUrlOfFlow),
        nextUrlOfFlow,
      };
    },
    [formKey, values, formFactor, steps]
  );

  return (
    <FieldArray
      name={formKey}
      render={(fieldArrayProps) => {
        return (
          <>
            {/* @ts-ignore */}
            <Droppable
              droppableId={formKey}
              type={`${DroppableType.Step}-${formKey}`}
              isDropDisabled={_stepReorderDisabled}
            >
              {(provided, _snapshot) => (
                // @ts-ignore
                <Accordion
                  allowToggle
                  ref={provided.innerRef}
                  onChange={handleAccordionChange}
                  index={expandedStepIndex}
                  {...provided.droppableProps}
                >
                  {steps.map((stepValue, idx) => {
                    const stepValueFormKey = `${formKey}[${idx}]`;
                    const showEmptyNameWarning =
                      !stepValue?.name &&
                      recentlyAddedStepIdx !== idx &&
                      !isEmptyStep(stepValue, formFactor, theme) &&
                      !isTemplateBody(stepValue.bodySlate);
                    const showConfirmDelete =
                      stepToDelete !== -1 && stepToDelete === idx;

                    const guideBaseStep = isGuideBase(formEntityType)
                      ? guideType === GuideTypeEnum.account
                        ? accountGuideSteps?.[
                            stepValue.createdFromStepPrototypeEntityId || ''
                          ]
                        : accountGuideSteps?.[stepValue.entityId || '']
                      : null;

                    const flowCtasComplianceInfo =
                      computeFlowCtasCompliance(idx);

                    return (
                      // @ts-ignore
                      <Draggable
                        key={stepValue.entityId || stepValueFormKey}
                        draggableId={stepValue.entityId || stepValueFormKey}
                        index={idx}
                        isDragDisabled={_stepReorderDisabled}
                      >
                        {(provided, _snapshot) => (
                          <AccordionItem
                            data-test={`template-step-${idx}`}
                            className={_stepReorderDisabled ? '' : 'step-row'}
                            border="none"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <AccordionButton
                              data-test={`template-step-${idx}-accordion-btn`}
                              py="6"
                              px="7"
                              borderBottom="1px solid #EDF2F7"
                              bg="white"
                              _focus={{ outline: 'none' }}
                            >
                              <Box
                                w="full"
                                maxW={stepListMaxWidth}
                                display="flex"
                              >
                                {!isGuideBase(formEntityType) && (
                                  <Box
                                    className="step-drag-indicator"
                                    w="20px"
                                    h="20px"
                                    my="auto"
                                    {...provided.dragHandleProps}
                                    onMouseEnter={handleDragIndicatorMouseEnter}
                                    onMouseLeave={handleDragIndicatorMouseLeave}
                                  >
                                    <DragIndicator
                                      style={{
                                        height: 'inherit',
                                        width: 'inherit',
                                      }}
                                    />
                                  </Box>
                                )}

                                <AccordionIcon
                                  my="auto"
                                  className={
                                    isGuideBase(formEntityType)
                                      ? ''
                                      : 'step-accordion-indicator'
                                  }
                                />
                                <Box display="flex" alignItems="center">
                                  <Flex className="flex-row gap-1 ml-5 items-center">
                                    <NameInput
                                      tooltipLabel="Edit step name"
                                      placeholder="Name your step"
                                      defaultValue={stepValue.name}
                                      onChange={handleStepNameChange(
                                        stepValueFormKey
                                      )}
                                      canEdit={!disabled}
                                      shouldAutoFocus={
                                        !stepValue.entityId &&
                                        !isGuideBase(formEntityType) &&
                                        recentlyAddedStepIdx === idx
                                      }
                                      onEditStart={handleDisableAccordion}
                                      onEditEnd={handleEnableAccordion(idx)}
                                      inputWidth="500px"
                                    />
                                    {!flowCtasComplianceInfo.compliant && (
                                      <ConflictingFlowCtaWarning
                                        label={
                                          'A CTA in this step redirects to a URL that’s different from the next step, which will disrupt the flow.'
                                        }
                                      />
                                    )}
                                  </Flex>
                                  {isBranching(stepValue?.stepType) && (
                                    <Box ml={2} my="auto">
                                      <CircularBadge
                                        calloutType={
                                          ExtendedCalloutTypes.Branching
                                        }
                                        tooltip="Branching step"
                                        tooltipPlacement="top"
                                      />
                                    </Box>
                                  )}
                                  {isInputStep(stepValue?.stepType) && (
                                    <Box ml={2} my="auto">
                                      <CircularBadge
                                        calloutType={
                                          ExtendedCalloutTypes.Inputs
                                        }
                                        tooltip="Input step"
                                        tooltipPlacement="top"
                                      />
                                    </Box>
                                  )}
                                  {showEmptyNameWarning && (
                                    <Box ml={2} my="auto">
                                      <CircularBadge
                                        calloutType={CalloutTypes.Warning}
                                        tooltip="This step doesn't have a name"
                                        tooltipPlacement="top"
                                      />
                                    </Box>
                                  )}
                                </Box>

                                {/** Delete step */}
                                {!_deleteDisabled && (
                                  <>
                                    <DeleteButton
                                      className="step-row-icon"
                                      ml="auto"
                                      my="auto"
                                      tooltip="Delete step"
                                      tooltipPlacement="top"
                                      height="20px"
                                      onClick={
                                        moduleUsage
                                          ? (e: React.MouseEvent) => {
                                              e.stopPropagation();
                                              setStepToDelete(idx);
                                            }
                                          : handleDeleteStep(
                                              fieldArrayProps,
                                              idx
                                            )
                                      }
                                    />
                                    {showConfirmDelete && (
                                      <ConfirmDeleteModal
                                        isOpen
                                        onDelete={handleDeleteStep(
                                          fieldArrayProps
                                        )}
                                        onClose={handleCloseDeleteConfirmation}
                                        entityName={null}
                                        confirmButtomLabel="Delete step"
                                        header="Delete step from step group"
                                        modalSize="md"
                                      >
                                        This step group is used in{' '}
                                        {moduleUsage.count} other{' '}
                                        {pluralize(moduleUsage.count, 'guide')}:
                                        <UnorderedList pl="2" py="2">
                                          {moduleUsage.list.map((item) => {
                                            return (
                                              <ListItem>{item.label}</ListItem>
                                            );
                                          })}
                                        </UnorderedList>
                                        Deleting this step will remove it from{' '}
                                        {pluralize(
                                          moduleUsage.count,
                                          'this other guide',
                                          'these other guides'
                                        )}
                                        .
                                      </ConfirmDeleteModal>
                                    )}
                                  </>
                                )}

                                {/** Guide-base related UI */}
                                {isGuideBase(formEntityType) && !isFlow && (
                                  <Box display="flex" ml="auto">
                                    <Box w={stepStatColWidth} fontSize="sm">
                                      <UsersCountCell
                                        users={guideBaseStep?.usersViewed}
                                      />
                                    </Box>
                                    <Box w={stepStatColWidth}>
                                      {guideType === GuideTypeEnum.account ? (
                                        <Box ml="auto" display="flex">
                                          <Tooltip
                                            label="You must save before you can complete this step"
                                            placement="top"
                                            isDisabled={
                                              stepValue.entityId && !dirty
                                            }
                                          >
                                            <Box
                                              m="auto"
                                              display="flex"
                                              h="28px"
                                            >
                                              <Tooltip
                                                label={`Mark step as ${
                                                  guideBaseStep?.completedAt
                                                    ? 'incomplete'
                                                    : 'complete'
                                                }`}
                                                placement="top"
                                              >
                                                <input
                                                  key={stepValue.entityId}
                                                  checked={
                                                    !!guideBaseStep?.completedAt
                                                  }
                                                  disabled={
                                                    disabled ||
                                                    !stepValue.entityId ||
                                                    dirty
                                                  }
                                                  type="checkbox"
                                                  onClick={stopPropagation}
                                                  onChange={(event) => {
                                                    handleSetStepCompletion(
                                                      event,
                                                      stepValue?.stepType,
                                                      guideBaseStep?.entityId
                                                    );
                                                  }}
                                                  style={{
                                                    margin: 'auto 0',
                                                    width: '18px',
                                                    height: '18px',
                                                    border: '1px solid #CBD5E0',
                                                    borderRadius: '2px',
                                                  }}
                                                />
                                              </Tooltip>
                                              <Box ml="1">
                                                {formatCompletedBy(
                                                  guideBaseStep,
                                                  usersDict
                                                )}
                                              </Box>
                                            </Box>
                                          </Tooltip>
                                        </Box>
                                      ) : (
                                        <Box>
                                          <UsersCountCell
                                            users={
                                              // @ts-ignore
                                              guideBaseStep?.usersCompleted
                                            }
                                            count={
                                              // @ts-ignore
                                              guideBaseStep?.countUsersCompleted
                                            }
                                          />
                                        </Box>
                                      )}
                                    </Box>
                                  </Box>
                                )}
                                {/** End of guide-base related UI */}
                              </Box>
                            </AccordionButton>
                            <AccordionPanel px="7" bg="gray.50">
                              <Box
                                w="full"
                                maxW={isFlow ? undefined : stepListMaxWidth}
                                minW={isFlow ? undefined : stepListMinWidth}
                              >
                                <SelectedStep
                                  isSelected={expandedStepIndex === idx}
                                  formFactor={formFactor as GuideFormFactor}
                                  formKey={stepValueFormKey}
                                  stepValue={stepValue}
                                  theme={theme}
                                  isCyoa={isCyoa}
                                  recentlyAdded={recentlyAddedStepIdx === idx}
                                  formFactorStyle={formFactorStyle}
                                  guideType={guideType}
                                  formEntityType={formEntityType}
                                  moduleUsage={moduleUsage}
                                  templateEntityId={templateEntityId}
                                  disabled={disabled}
                                  rteRenderKey={rteRenderKey}
                                  flowCtasComplianceInfo={
                                    flowCtasComplianceInfo
                                  }
                                />
                              </Box>
                            </AccordionPanel>
                          </AccordionItem>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </Accordion>
              )}
            </Droppable>
            {_canAddSteps && (
              <AddButton my="4" mx="7" onClick={handleAddStep(fieldArrayProps)}>
                Add step
              </AddButton>
            )}
          </>
        );
      }}
    />
  );
}

export default withTemplateDisabled<StepListProps>(StepList);
