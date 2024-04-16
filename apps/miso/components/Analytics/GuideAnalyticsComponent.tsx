import React, { useCallback, useMemo } from 'react';
import { BoxProps, Flex, HStack, Text } from '@chakra-ui/react';
import Box from 'system/Box';
import {
  GuideDesignType,
  GuideFormFactor,
  GuideTypeEnum,
  StepCtaType,
} from 'bento-common/types';
import ActiveGuidesTable from '../ActiveGuides/ActiveGuidesTable';
import { GuideAnalyticsQuery } from 'relay-types/GuideAnalyticsQuery.graphql';
import TableRendererProvider from 'components/TableRenderer/TableRendererProvider';
import AttributesProvider from 'providers/AttributesProvider';
import colors from 'helpers/colors';
import LaunchModal from 'components/Templates/LaunchModal';
import { useTemplate } from '../../providers/TemplateProvider';
import {
  isCtaCompletionAction,
  isSplitTestGuide,
} from 'bento-common/data/helpers';
import SimpleInfoTooltip from 'system/SimpleInfoTooltip';

export interface GuideAnalyticsComponentProps extends BoxProps {
  templateEntityId: string;
  onRefetch: () => void;
  overrideIsSplitTest?: boolean;
}

type Props = GuideAnalyticsComponentProps & GuideAnalyticsQuery['response'];

interface GuideStatDisplayProps extends Pick<BoxProps, 'color'> {
  title: string;
  value: string | number | null;
  afterValueText?: string;
  subText?: string;
  tooltip?: string;
  allowZero?: boolean;
}

export function GuideStatDisplay({
  title,
  value,
  afterValueText = '',
  subText,
  allowZero,
  color = colors.tip.bright,
  tooltip,
  ...wrapperProps
}: GuideStatDisplayProps & BoxProps) {
  return (
    <Box display="flex" flexDir="column" {...wrapperProps}>
      <Box fontSize="sm" fontWeight="bold" color="gray.600">
        {title}
        {tooltip && <SimpleInfoTooltip label={tooltip} />}
      </Box>
      <HStack alignItems="flex-end">
        <Box fontWeight="semibold" fontSize="3xl" color={color} my="auto">
          {allowZero ? value ?? '-' : value || '-'}
          {value ? afterValueText : ''}
        </Box>
        {subText && (
          <Text color={colors.text.secondary} fontSize="xs" lineHeight="2.5">
            {subText}
          </Text>
        )}
      </HStack>
    </Box>
  );
}

export default function GuideAnalytics(props: Props) {
  const {
    templateEntityId,
    template,
    onRefetch,
    minH,
    flexDir = 'row',
    flexWrap,
    gap = 6,
    overrideIsSplitTest,
  } = props;
  const {
    isLaunchModalOpen,
    setIsLaunchModalOpen,
    handleLaunchOrPause,
    template: providerTemplate,
  } = useTemplate();

  const isSplitTest =
    overrideIsSplitTest || isSplitTestGuide(providerTemplate.type as any);
  const statColor = colors.bento.bright;

  const closeLaunchModal = useCallback(
    () => setIsLaunchModalOpen(false),
    [setIsLaunchModalOpen]
  );

  const isAnnouncementStyle =
    template?.designType === GuideDesignType.announcement ||
    template?.formFactor === GuideFormFactor.tooltip;

  const isInlineContextual =
    template?.isSideQuest && template?.formFactor === GuideFormFactor.inline;

  const ctaLabel = useMemo(() => {
    if (!isAnnouncementStyle || !template) return undefined;
    const ctas = template.modules?.[0].stepPrototypes?.[0].ctas || [];
    const cta = ctas.find((cta) =>
      isCtaCompletionAction(
        cta.type as StepCtaType,
        template.formFactor as GuideFormFactor
      )
    );

    return cta?.text;
  }, [template]);

  const isAccountGuide = template?.type === GuideTypeEnum.account;

  const {
    usersSeenGuide,
    completedAStep,
    percentCompleted,
    usersClickedCta,
    usersDismissed,
    usersSavedForLater,
    percentGuidesCompleted,
    guidesWithCompletedStep,
    averageStepsCompleted,
    usersAnswered,
    accountsSeen,
  } = template?.stats || {};

  const show = useMemo(
    () => ({
      usersViewed: !isSplitTest,
      accountsCount: isSplitTest,
      averageStepsCompleted: !isAnnouncementStyle && isAccountGuide,
      completedAStep: !isAnnouncementStyle && !isInlineContextual,
      activeGuides: isInlineContextual,
      downloadStepProgress: !isAnnouncementStyle && !isSplitTest,
      usersDismissed: isAnnouncementStyle || isInlineContextual,
      usersClicked: isAnnouncementStyle || isInlineContextual,
      usersSaved: isAnnouncementStyle,
      usersCompletedGuide:
        !isAnnouncementStyle && !isAccountGuide && !isInlineContextual,
      accountsCompletedGuide: !isAnnouncementStyle && isAccountGuide,
      answersSubmitted: template?.inputsCount > 0,
      downloadSubmittedAnswers: usersAnswered > 0,
    }),
    [
      isSplitTest,
      isAnnouncementStyle,
      isInlineContextual,
      isAccountGuide,
      template?.inputsCount,
      usersAnswered,
    ]
  );

  if (!template) return null;

  return (
    <Box overflow="hidden" minH={minH}>
      <Box display="Flex" flexDirection="row">
        <Box
          display="flex"
          flexDirection="row"
          w={flexDir === 'column' ? 'sm' : undefined}
        >
          <Flex
            gap={gap}
            flexDir={flexDir}
            flexWrap={flexWrap}
            alignItems="flex-start"
            mt="4"
          >
            {show.usersViewed && (
              <GuideStatDisplay
                title="Users viewed"
                value={usersSeenGuide}
                color={statColor}
              />
            )}
            {show.accountsCount && (
              <GuideStatDisplay
                title="Accounts"
                value={accountsSeen}
                color={statColor}
              />
            )}
            {show.completedAStep && (
              <GuideStatDisplay
                title="Accounts engaged"
                value={
                  isAccountGuide ? guidesWithCompletedStep : completedAStep
                }
                tooltip={`Number of ${
                  isAccountGuide ? 'accounts that' : 'users who'
                } completed at least 1 step`}
                color={statColor}
              />
            )}
            {show.averageStepsCompleted && (
              <GuideStatDisplay
                title="Average steps completed"
                value={averageStepsCompleted}
                tooltip="Average steps completed across accounts that have viewed the guide"
                color={statColor}
              />
            )}
            {show.usersDismissed && (
              <GuideStatDisplay
                title="Users dismissed"
                value={usersDismissed}
                color={statColor}
              />
            )}
            {show.usersClicked && (
              <GuideStatDisplay
                title={
                  ctaLabel ? `Users clicked "${ctaLabel}"` : 'Users clicked CTA'
                }
                value={usersClickedCta}
                color={statColor}
              />
            )}
            {show.usersSaved && (
              <GuideStatDisplay
                title="Users saved for later"
                value={usersSavedForLater}
                color={statColor}
              />
            )}
            {show.usersCompletedGuide && (
              <GuideStatDisplay
                title="Users completed guide"
                value={percentCompleted.toFixed(1)}
                afterValueText="%"
                color={statColor}
              />
            )}
            {show.accountsCompletedGuide && (
              <GuideStatDisplay
                title="Accounts completed guide"
                value={percentGuidesCompleted.toFixed(1)}
                tooltip="This includes all accounts with at least one step viewed"
                afterValueText="%"
                color={statColor}
              />
            )}
            {show.answersSubmitted && (
              <GuideStatDisplay
                title="Answers submitted"
                value={usersAnswered}
                color={statColor}
              />
            )}
          </Flex>
        </Box>
        {show.activeGuides && (
          <Box
            flex="auto"
            display="flex"
            flexDirection="column"
            mt="4"
            w="full"
            h="full"
            overflow="hidden"
          >
            <Box h="full" overflow="hidden">
              <Box px="0" h="full">
                <Text fontSize="sm" fontWeight="bold" color="gray.600">
                  Performance by account
                </Text>
                <Box h="full" display="flex" flexDirection="column" pt={4}>
                  <AttributesProvider>
                    <TableRendererProvider>
                      <ActiveGuidesTable
                        templateEntityId={templateEntityId}
                        isAnnouncement={isAnnouncementStyle}
                        isInlineContextual={isInlineContextual}
                        templateType={template.type}
                        onRefetch={onRefetch}
                      />
                    </TableRendererProvider>
                  </AttributesProvider>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      <LaunchModal
        isOpen={isLaunchModalOpen}
        onClose={closeLaunchModal}
        onConfirm={handleLaunchOrPause}
        template={providerTemplate as any}
      />
    </Box>
  );
}
