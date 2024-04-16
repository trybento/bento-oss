import React, { useCallback } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { FieldArray } from 'formik';
import { Theme } from 'bento-common/types';

import Module from 'components/GuideForm/Module';
import AddModuleButton from 'components/AddModuleButton';
import {
  EDITOR_LEFT_WIDTH,
  getRootFormKey,
  isGuideBase,
} from 'helpers/constants';
import {
  prepareTemplateModuleData,
  prepareNewGuideBaseModuleData,
} from 'helpers';
import { DroppableType, FormEntityType } from 'components/GuideForm/types';
import { useTemplate } from 'providers/TemplateProvider';
import withTemplateDisabled from 'components/hocs/withTemplateDisabled';
import { ModuleOption } from 'types';
import { isFlowGuide } from 'bento-common/utils/formFactor';
import TemplateDynamicModules from './components/TemplateDynamicModules';

type TemplateModulesProps = Record<string, any> & {
  theme: Theme;
  isCyoa: boolean;
  formEntityType: FormEntityType;
  initialSelectedStepPrototype?: string;
  disabled?: boolean;
  disabledAddStepGroupBtn?: boolean;
  rteRenderKey?: string;
} & BoxProps;

/** TODO: Add typing and rename to something more generic */
const TemplateModules: React.FC<TemplateModulesProps> = ({
  onModuleDuplicate,
  handleCreateModule,
  templateValue,
  allModules,
  allowedModules,
  canDelete,
  disabled,
  formEntityType,
  formFactor,
  formFactorStyle,
  theme,
  isCyoa,
  guideType = null,
  accountGuideSteps = [],
  guideModuleBaseParticipantsCount,
  participantsWhoViewedByGuideModuleBaseEntityId,
  initialSelectedStepPrototype,
  disabledAddStepGroupBtn = false,
  rteRenderKey,
  ...boxProps
}) => {
  const formKey = getRootFormKey(formEntityType);
  const isEditDisabled = disabled;
  const isFlow = isFlowGuide(formFactor);

  const handleDuplicateModule = useCallback(async (pushFn, moduleValue) => {
    const moduleCopy = await onModuleDuplicate({ moduleData: moduleValue });
    if (moduleCopy) {
      pushFn(moduleCopy);
    }
  }, []);

  const { getNumberOfOtherTemplatesUsingModule, template } = useTemplate();

  const { entityId } = template || {};

  return (
    <Box minWidth={EDITOR_LEFT_WIDTH} w="full" {...boxProps}>
      <FieldArray
        name={`${formKey}.modules`}
        render={({ push, remove }) => {
          const handleAddModule = (option: ModuleOption) => {
            const module = allModules.find(
              (module) => module.entityId === option.value
            );

            if (!module) {
              if (!isGuideBase(formEntityType)) handleCreateModule();
              return;
            }

            push(
              isGuideBase(formEntityType)
                ? prepareNewGuideBaseModuleData(module, theme)
                : prepareTemplateModuleData(module, theme)
            );
          };

          return (
            // @ts-ignore
            <Droppable
              droppableId={`${formKey}.modules`}
              isDropDisabled={isEditDisabled}
              type={DroppableType.Module}
            >
              {(provided) => (
                <Box
                  data-test="template-modules-list"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {templateValue.modules.map((moduleValue, idx) => {
                    const moduleFormKey = `${formKey}.modules.[${idx}]`;
                    const shouldAutoFocusModuleName =
                      (!!templateValue?.name && !moduleValue?.name) ||
                      (!moduleValue?.entityId && !moduleValue?.name);

                    return (
                      // @ts-ignore
                      <Draggable
                        key={moduleValue?.entityId || moduleFormKey}
                        draggableId={moduleValue?.entityId || moduleFormKey}
                        index={idx}
                        isDragDisabled={isEditDisabled}
                      >
                        {(provided) => (
                          <Box
                            data-test={`template-module-${idx}`}
                            ref={provided.innerRef}
                            bg="white"
                            {...provided.draggableProps}
                            pb="4"
                          >
                            <Module
                              formKey={moduleFormKey}
                              moduleValue={moduleValue}
                              shouldAutoFocus={shouldAutoFocusModuleName}
                              numberOfTemplatesUsingModule={getNumberOfOtherTemplatesUsingModule(
                                moduleValue?.entityId
                              )}
                              disabled={disabled}
                              handleDuplicate={
                                isGuideBase(formEntityType)
                                  ? null
                                  : () =>
                                      handleDuplicateModule(push, moduleValue)
                              }
                              handleDelete={
                                !isEditDisabled && canDelete
                                  ? () => remove(idx)
                                  : null
                              }
                              theme={theme}
                              isCyoa={isCyoa}
                              formFactor={formFactor}
                              formFactorStyle={formFactorStyle}
                              guideType={guideType}
                              dragHandleProps={provided.dragHandleProps}
                              canDeleteSteps={!isGuideBase(formEntityType)}
                              formEntityType={formEntityType}
                              accountGuideSteps={accountGuideSteps}
                              guideModuleBaseParticipantsCount={
                                guideModuleBaseParticipantsCount
                              }
                              participantsWhoViewedByGuideModuleBaseEntityId={
                                participantsWhoViewedByGuideModuleBaseEntityId
                              }
                              templateEntityId={entityId}
                              initialSelectedStepPrototype={
                                initialSelectedStepPrototype
                              }
                              hideModuleName={isFlow}
                              canAddSteps={
                                !isGuideBase(formEntityType) &&
                                !templateValue.isCyoa
                              }
                              rteRenderKey={rteRenderKey}
                            />
                          </Box>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                  {!isGuideBase(formEntityType) && (
                    <TemplateDynamicModules templateEntityId={entityId} />
                  )}
                  {!isEditDisabled &&
                  !disabledAddStepGroupBtn &&
                  !templateValue.isCyoa ? (
                    <AddModuleButton
                      allowedModules={allowedModules}
                      handleAddModule={handleAddModule}
                    />
                  ) : null}
                </Box>
              )}
            </Droppable>
          );
        }}
      />
    </Box>
  );
};

export default withTemplateDisabled<TemplateModulesProps>(TemplateModules);
