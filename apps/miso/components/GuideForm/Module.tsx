import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormikContext } from 'formik';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import Box from 'system/Box';
import TemplateModuleOverflowMenuButton from 'components/Library/LibraryTemplates/TemplateModuleOverflowMenuButton';
import { StepValue } from 'types';
import {
  FormFactorStyle,
  GuideFormFactor,
  GuideTypeEnum,
  NewTemplateFlag,
  StepType,
  Theme,
} from 'bento-common/types';
import StepList from './StepList';
import { AccountStepsData } from 'components/AccountGuideBases/EditAccountGuideBase/types';
import { GuideModuleBaseParticipantsCountPill } from 'components/UserGuideBases/EditUserGuideBase/EditUserGuideBaseForm';
import { GuideModuleBaseParticipantsCount } from 'components/UserGuideBases/EditUserGuideBase/types';
import { FormEntityType } from './types';
import {
  isGuideBase,
  isModule,
  NEW_TEMPLATE_CREATED_KEY,
} from 'helpers/constants';
import { NameInput, NameInputProps } from 'components/NameInput';
import withTemplateDisabled from 'components/hocs/withTemplateDisabled';
import {
  ClientStorage,
  readFromClientStorage,
  removeFromClientStorage,
} from 'bento-common/utils/clientStorage';
import Badge from 'system/Badge';
import colors from 'helpers/colors';
import { pluralize } from 'bento-common/utils/pluralize';
import { useModuleUsage } from 'components/Modules/ModuleCountMessage';

interface ModuleValue {
  displayTitle?: string;
  name?: string;
  entityId?: string | undefined;
  isCyoa: boolean | undefined;
  stepPrototypes: StepValue[];
}

interface ModuleProps {
  moduleValue: ModuleValue;
  formKey: string;
  shouldAutoFocus: boolean;
  numberOfTemplatesUsingModule: number;
  handleDuplicate?: () => void;
  /** Step group deletion handler. */
  handleDelete?: () => void;
  stepPrototypeNameInputRef?: React.MutableRefObject<any>;
  canAddSteps: boolean;
  /** Wether the step group can delete steps. */
  canDeleteSteps: boolean;
  canEditName?: boolean;
  formFactor: GuideFormFactor;
  stepReorderDisabled?: boolean;
  formFactorStyle?: FormFactorStyle;
  theme: Theme;
  isCyoa: boolean;
  guideType?: GuideTypeEnum;
  defaultStepType?: StepType;
  dragHandleProps?: DraggableProvidedDragHandleProps;
  formEntityType: FormEntityType;
  accountGuideSteps?: AccountStepsData;
  guideModuleBaseParticipantsCount?: GuideModuleBaseParticipantsCount;
  participantsWhoViewedByGuideModuleBaseEntityId?: object;
  templateEntityId?: string;
  hideModuleName?: boolean;
  initialSelectedStepPrototype?: string;
  /** Disables everything. */
  disabled?: boolean;
  rteRenderKey?: string;
}

const ModuleNameInput: React.FC<
  { handleDelete?: () => void; handleDuplicate?: () => void } & NameInputProps
> = ({
  handleDelete,
  handleDuplicate,
  tooltipLabel = 'Edit group name',
  disabled,
  ...restProps
}) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
    >
      {handleDelete && (
        <Box>
          <TemplateModuleOverflowMenuButton
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
          />
        </Box>
      )}
      <NameInput
        tooltipLabel={tooltipLabel}
        placeholder="Step group name"
        fontSize="lg"
        fontWeight="bold"
        my="2"
        canEdit={!disabled}
        {...restProps}
      />
    </Box>
  );
};

function Module({
  formKey,
  moduleValue,
  handleDuplicate,
  handleDelete,
  hideModuleName,
  canEditName = true,
  canAddSteps,
  canDeleteSteps,
  disabled,
  dragHandleProps,
  numberOfTemplatesUsingModule,
  guideType,
  formFactor,
  formFactorStyle,
  /** Pass Nested if module is out of the guide context. */
  theme,
  isCyoa,
  formEntityType,
  accountGuideSteps,
  guideModuleBaseParticipantsCount,
  participantsWhoViewedByGuideModuleBaseEntityId,
  templateEntityId,
  initialSelectedStepPrototype,
  rteRenderKey,
}: ModuleProps) {
  const [isNewTemplate, setIsNewTemplate] = useState<boolean>(
    !!readFromClientStorage<NewTemplateFlag>(
      ClientStorage.localStorage,
      NEW_TEMPLATE_CREATED_KEY
    )?.templateEntityId
  );
  const stepsKey = isGuideBase(formEntityType) ? 'steps' : 'stepPrototypes';
  const { setFieldValue } = useFormikContext();
  const handleNameChange = useCallback(
    (name: string) => setFieldValue(`${formKey}.name`, name),
    [formKey, setFieldValue]
  );

  const moduleUsage = useModuleUsage(
    numberOfTemplatesUsingModule,
    moduleValue?.entityId,
    templateEntityId,
    disabled
  );

  useEffect(() => {
    if (isNewTemplate) {
      removeFromClientStorage(
        ClientStorage.localStorage,
        NEW_TEMPLATE_CREATED_KEY
      );
      setIsNewTemplate(false);
    }
  }, []);

  const _canAddSteps = canAddSteps && !disabled;
  const _canDeleteSteps = canDeleteSteps && !disabled;
  const _canEditName = canEditName && !disabled;

  const initialModuleName = useMemo(() => {
    const name = isGuideBase(formEntityType)
      ? moduleValue?.name
      : moduleValue?.displayTitle || moduleValue.name;

    return !_canEditName && !name ? '(no name)' : name;
  }, [
    moduleValue.name,
    moduleValue.displayTitle,
    formEntityType,
    _canEditName,
  ]);

  const autoFocusModuleInput =
    _canEditName &&
    (isModule(formEntityType) ? !initialModuleName : isNewTemplate);

  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <Box>
      {!hideModuleName && (
        <Box className="module-row" {...dragHandleProps}>
          <ModuleNameInput
            defaultValue={initialModuleName}
            onChange={handleNameChange}
            shouldAutoFocus={autoFocusModuleInput}
            handleDuplicate={handleDuplicate}
            handleDelete={moduleValue.isCyoa ? undefined : handleDelete}
            canEdit={_canEditName}
            inputWidth="500px"
            siblingComponent={
              <>
                {isGuideBase(formEntityType) &&
                guideType === GuideTypeEnum.user ? (
                  <GuideModuleBaseParticipantsCountPill
                    count={
                      guideModuleBaseParticipantsCount[moduleValue.entityId]
                    }
                    participants={
                      participantsWhoViewedByGuideModuleBaseEntityId[
                        moduleValue.entityId
                      ] || []
                    }
                    my="auto"
                  />
                ) : null}
                {!isGuideBase(formEntityType) && moduleUsage && (
                  <Badge
                    minWidth="75px"
                    ml="3"
                    px="3"
                    py="1"
                    my="auto"
                    color={colors.text.primary}
                    label={
                      <Box display="flex" flexWrap="wrap" flexDirection="row">
                        <Box mr="1">Used in </Box>
                        {/* @ts-ignore */}
                        <moduleUsage.Popover>
                          <Box fontWeight="semibold" textDecoration="underline">
                            {moduleUsage.count} other{' '}
                            {pluralize(moduleUsage.count, 'guide')}
                          </Box>
                        </moduleUsage.Popover>
                      </Box>
                    }
                    onClick={stopPropagation}
                    disableHoverStyle
                  />
                )}
              </>
            }
          />
        </Box>
      )}

      <StepList
        steps={moduleValue?.[stepsKey]}
        formKey={`${formKey}.${stepsKey}`}
        formFactor={formFactor}
        deleteDisabled={
          !_canDeleteSteps || moduleValue?.[stepsKey]?.length === 1
        }
        formFactorStyle={formFactorStyle}
        theme={theme}
        isCyoa={isCyoa}
        canAddSteps={_canAddSteps}
        stepReorderDisabled={isGuideBase(formEntityType)}
        formEntityType={formEntityType}
        guideType={guideType}
        accountGuideSteps={accountGuideSteps}
        moduleUsage={moduleUsage}
        templateEntityId={templateEntityId}
        initialSelectedStepPrototype={initialSelectedStepPrototype}
        disabled={disabled}
        rteRenderKey={rteRenderKey}
      />
    </Box>
  );
}

export default withTemplateDisabled<ModuleProps>(Module);
