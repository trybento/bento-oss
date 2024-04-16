import React, { ReactNode, useCallback, useMemo } from 'react';
import get from 'lodash/get';

import {
  GuideBaseState,
  Theme,
  GuideDesignType,
  FormFactorStyle,
  GuideFormFactor,
  GuideTypeEnum,
} from 'bento-common/types';

import Box from 'system/Box';
import H2 from 'system/H2';
import DragAndDropProvider from 'providers/DragAndDropProvider';
import { usePersistedGuideBase } from 'providers/PersistedGuideBaseProvider';
import {
  AutoCompletableStepEntityIds,
  GuideModuleBaseParticipantsCount,
  StepBases,
} from './types';
import { ModuleOption, ModuleValue, ComposedComponentsEnum } from 'types';
import { getModuleOptions } from 'helpers';

import { accountUserNameIdentityShort } from 'utils/helpers';
import { stepStatColWidth } from './BranchingInfo';
import Tooltip from 'system/Tooltip';
import TemplateModules from 'components/Templates/TemplateModules';
import SelectedStep from 'components/GuideForm/SelectedStep/SelectedStep';
import { FormEntityType } from 'components/GuideForm/types';
import {
  stepListMaxWidth,
  stepListMinWidth,
} from 'components/GuideForm/StepList';
import { MainFormKeys } from 'helpers/constants';
import { Formik, FormikProps } from 'formik';
import { useAllModules } from 'providers/AllModulesProvider';
import {
  getGuideThemeFlags,
  isGuideInActiveSplitTest,
} from 'bento-common/data/helpers';
import SendFormikDataToParent from 'components/utils/SendFormikDataToParent';
import VideoGalleryForm from 'components/GuideForm/VideoGalleryForm';
import { BoxProps, Flex } from '@chakra-ui/react';
import useActiveStepList from 'hooks/useActiveStepList';
import InlineContentPreview from 'components/EditorCommon/InlineContentPreview';
import { isFlowGuide } from 'bento-common/utils/formFactor';
import { CustomizedBadge } from 'components/Library/TemplateStatus';
import { getCustomizedGuideLabel } from 'components/TableRenderer/tables.helpers';

export interface GuideValue {
  name: string;
  modules: ModuleValue[];
  formFactorStyle: FormFactorStyle;
}

interface Props {
  guideData: GuideValue;
  guideModuleBaseParticipantsCount: GuideModuleBaseParticipantsCount;
  stepBases: StepBases;
  guideBaseState: GuideBaseState;
  autoCompletableStepEntityIds: AutoCompletableStepEntityIds;
  onSave: ({ guideData }: { guideData: GuideValue }) => void;
  bindFormData: (formData: FormikProps<{ guideData: GuideValue }>) => void;
  onLaunch: ({ guideData }: { guideData: GuideValue }) => void;
  bindLaunchGuide: (launchHandler: () => void) => void;
  renderHeaderControls?: ReactNode | undefined;
  theme: Theme;
  isCyoa: boolean;
}

const formEntityType = FormEntityType.guideBase;
const formKey = MainFormKeys.guide;
const firstStepKey = 'modules[0].steps[0]';

// TODO: real types
export function GuideModuleBaseParticipantsCountPill({
  count,
  participants = [],
  ...boxProps
}: {
  count: number;
  participants: any[];
} & BoxProps) {
  if (typeof count !== 'number') return null;

  const maxShown = 3;
  let tooltipLabel = '';

  for (const [participantIdx, participant] of participants.entries()) {
    if (participantIdx === maxShown) {
      const remaining = participants.length - maxShown;
      tooltipLabel += ` + ${remaining} other${remaining > 1 ? 's' : ''}`;
      break;
    }

    tooltipLabel +=
      (participantIdx === 0 ? '' : ', ') +
      accountUserNameIdentityShort(participant);
  }

  return (
    <Tooltip label={tooltipLabel} placement="top">
      <Box
        display="inline-block"
        marginLeft={4}
        p="5px 16px"
        fontSize="sm"
        color="gray.900"
        background="gray.200"
        borderRadius="24px"
        {...boxProps}
      >
        {count} user{count === 1 ? '' : 's'}
      </Box>
    </Tooltip>
  );
}

/**
 * EditUserGuideBaseForm would be a more consistent name
 * pages/user-guide-base, but also seems to be used when viewing user guides in Active Guides
 * @param props
 */
function EditUserGuideBaseForm({
  guideData,
  guideBaseState,
  stepBases,
  guideModuleBaseParticipantsCount,
  renderHeaderControls,
  onSave,
  onLaunch,
  bindFormData,
  bindLaunchGuide,
  theme,
  isCyoa,
}: Props) {
  const { modules } = useAllModules();

  const {
    guideBase: {
      formFactor,
      designType,
      isModifiedFromTemplate,
      createdFromTemplate,
    },
    guideType,
    participantsWhoViewedByGuideModuleBaseEntityId,
    isTargetedForSplitTesting,
  } = usePersistedGuideBase();

  const isAnnouncement = designType === GuideDesignType.announcement;
  const isFlow = isFlowGuide(formFactor);

  const currentStep = useActiveStepList();
  const selectedStep = isFlow ? guideData.modules[0].steps[currentStep] : null;
  const selectedTag = selectedStep?.taggedElements?.[0];

  const isTooltip = formFactor === GuideFormFactor.tooltip;
  const { isCard, isCarousel, isVideoGallery } = getGuideThemeFlags(theme);
  const isArchived = guideBaseState === GuideBaseState.archived;
  const isReadonly =
    isArchived || isGuideInActiveSplitTest(isTargetedForSplitTesting);

  const moduleOptions = useMemo<ModuleOption[]>(
    () => getModuleOptions(modules),
    [modules]
  );

  const filterUnusedModules = useCallback(
    (options: ModuleOption[], guideData: GuideValue) =>
      options.filter(
        (option) =>
          !guideData.modules
            .flat()
            .map((module) => module.createdFromModuleEntityId)
            .filter(Boolean)
            .includes(option.value)
      ),
    []
  );

  // Announcements and tooltips.
  const firstStep =
    isAnnouncement || isTooltip || isCard ? get(guideData, firstStepKey) : null;

  const handleLaunch = useCallback((values) => onLaunch(values), [onLaunch]);

  const showPreviews = isTooltip || isAnnouncement || isCard;

  return (
    <Formik initialValues={{ guideData }} enableReinitialize onSubmit={onSave}>
      {({ values }) => {
        bindLaunchGuide(() => handleLaunch(values));

        const unusedModules = filterUnusedModules(
          moduleOptions,
          values.guideData
        );

        return (
          <DragAndDropProvider>
            <Box px="16">
              <Box
                width="100%"
                marginBottom="8"
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

              {!isAnnouncement && !isTooltip && !isCard && !isVideoGallery && (
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
                          <Tooltip
                            label="Users who completed a step (possibly without viewing details)"
                            placement="top"
                          >
                            <Box w={stepStatColWidth} textAlign="center">
                              Users completed
                            </Box>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Box>
                  )}
                  <TemplateModules
                    templateValue={values.guideData}
                    allModules={modules}
                    disabled={isReadonly}
                    allowedModules={unusedModules}
                    canDelete={!isFlow}
                    formEntityType={formEntityType}
                    guideType={guideType}
                    accountGuideSteps={stepBases}
                    participantsWhoViewedByGuideModuleBaseEntityId={
                      participantsWhoViewedByGuideModuleBaseEntityId
                    }
                    guideModuleBaseParticipantsCount={
                      guideModuleBaseParticipantsCount
                    }
                    theme={theme}
                    isCyoa={isCyoa}
                    formFactor={formFactor}
                    formFactorStyle={guideData.formFactorStyle}
                    disabledAddStepGroupBtn={isCarousel || isFlow}
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
              )}

              {(isAnnouncement || isTooltip || isCard) && firstStep && (
                <Box>
                  <SelectedStep
                    formFactor={formFactor as GuideFormFactor}
                    formEntityType={formEntityType}
                    formKey={`${formKey}.${firstStepKey}`}
                    guideType={GuideTypeEnum.user}
                    stepValue={firstStep}
                    theme={theme}
                    isCyoa={isCyoa}
                    formFactorStyle={guideData.formFactorStyle}
                    showPreviews={showPreviews}
                    disabled={isReadonly}
                    isSelected
                  />
                </Box>
              )}
              {isVideoGallery && (
                <VideoGalleryForm
                  formEntityType={formEntityType}
                  disabled={isReadonly}
                />
              )}
            </Box>
            <SendFormikDataToParent bindFormData={bindFormData} />
          </DragAndDropProvider>
        );
      }}
    </Formik>
  );
}

export default EditUserGuideBaseForm;
