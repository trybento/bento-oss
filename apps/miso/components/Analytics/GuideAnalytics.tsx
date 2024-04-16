import React, { ReactNode, useCallback, useMemo } from 'react';
import QueryRenderer from 'components/QueryRenderer';
import { graphql } from 'react-relay';
import GuideAnalyticsComponent, {
  GuideAnalyticsComponentProps,
} from './GuideAnalyticsComponent';
import { BentoLoadingSpinner } from 'components/TableRenderer';
import useToast from 'hooks/useToast';
import { TABLE_SPINNER_SIZE } from 'helpers/constants';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  BoxProps,
  Flex,
  Link,
} from '@chakra-ui/react';
import { GuideAnalyticsQuery } from 'relay-types/GuideAnalyticsQuery.graphql';
import StepsPerformanceChart from './StepsPerformanceChart';
import {
  areStepDetailsHidden,
  isSingleStepGuide,
} from 'bento-common/utils/formFactor';
import {
  GuideFormFactor,
  GuideTypeEnum,
  SplitTestState,
  StepCtaType,
  StepType,
  Theme,
} from 'bento-common/types';
import TemplateCard from 'components/SplitTest/TemplateCard';
import colors from 'helpers/colors';
import { splitTestNameOrFallback } from 'bento-common/utils/naming';
import TableRendererProvider from 'components/TableRenderer/TableRendererProvider';
import AnalyticsActiveGuidesTable from './AnalyticsActiveGuidesTable';
import H4 from 'system/H4';
import TemplateBranchingPerformance from './TemplateBranchingPerformance';
import PopoverTip from 'system/PopoverTip';
import {
  getGuideThemeFlags,
  getPercentage,
  isInputStep,
  isUrlCta,
} from 'bento-common/data/helpers';
import CSVRequestButton from './CSVRequestButton';
import { useOrganization } from 'providers/LoggedInUserProvider';
import useAccessToken from 'hooks/useAccessToken';
import {
  csvSuccessMsg,
  requestBranchingCsv,
  requestGuideAnswersCsv,
} from './analytics.helpers';
import { dateFormatter } from 'components/Templates/Tabs/templateTabs.helpers';
import Span from 'system/Span';
import { pluralize } from 'bento-common/utils/pluralize';
import Tooltip from 'system/Tooltip';
import { px } from 'bento-common/utils/dom';
import UserActionsChart from './UserActionsChart';
import GuideAnalyticsCallout from './GuideAnalyticsCallout';
import SplitTestStatus from 'components/Library/SplitTestStatus';

export const GUIDE_ANALYTICS_QUERY = graphql`
  query GuideAnalyticsQuery($templateEntityId: EntityId!, $useLocked: Boolean) {
    template: findTemplate(entityId: $templateEntityId) {
      ...GuideAnalytics_main @relay(mask: false)
    }
  }
`;

const noPathId = 'nopath';

export type GuideAnalyticsShow = {
  usersSavedForLater: boolean;
  usersDismissed: boolean;
  usersSeenGuide: boolean;
  ctaStats: boolean;
  accountCards: boolean;
  userCards: boolean;
  singleStepStats: boolean;
  userInputAnswers: boolean;
  splitTestStats: boolean;
  accountProgressForUserGuides: boolean;
  accountProgress: boolean;
  branchingPerformance: boolean;
  stepsPerformanceChart: boolean;
  userActionsChart: boolean;
  actionCtas: boolean;
  branchingCard: boolean;
};

/**
 * These variables define the max width the
 * container will have. Once the designs are updated
 * to scale, this should be removed in favor
 * of Chakra props.
 */
const statCardsGapPx = 24;
const statCardWidthPx = 420;
const maxStatCards = 3;
const containerMaxWidthPx =
  statCardWidthPx * maxStatCards + statCardsGapPx * (maxStatCards - 1);

type CProps = Pick<GuideAnalyticsComponentProps, 'templateEntityId'>;
type Props = GuideAnalyticsComponentProps &
  GuideAnalyticsQuery['response'] &
  CProps;

interface StatCard {
  numerator: ReactNode;
  denominator?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  valueTooltip?: ReactNode;
}

function StatCard({
  numerator,
  denominator,
  title,
  description,
  valueTooltip,
  ...boxProps
}: StatCard & Omit<BoxProps, 'title' | 'as'>) {
  return (
    <Flex
      border="1px solid #E3E8F0"
      borderRadius="lg"
      gap="6"
      p="6"
      flex="none"
      w={px(statCardWidthPx)}
      {...boxProps}
    >
      <Tooltip label={valueTooltip} placement="top">
        <Flex my="auto" gap="2" whiteSpace="nowrap">
          <Box color="bento.bright" fontWeight="bold" fontSize="40px">
            {numerator}
          </Box>
          {!!denominator && (
            <Flex
              fontSize="24px"
              mt="auto"
              mb="2"
              color={colors.text.secondary}
              gap="2"
            >
              <Box>/</Box>
              <Box>{denominator}</Box>
            </Flex>
          )}
        </Flex>
      </Tooltip>
      <Flex flexDir="column" gap="1" my="auto" overflow="hidden">
        <Box
          fontSize="lg"
          fontWeight="bold"
          overflow="hidden"
          whiteSpace="nowrap"
        >
          {title}
        </Box>
        <Box color={colors.text.secondary} fontSize="xs">
          {description}
        </Box>
      </Flex>
    </Flex>
  );
}

function GuideAnalytics(props: Props) {
  const {
    template,
    onRefetch,
    templateEntityId,
    overrideIsSplitTest,
    ...boxProps
  } = props;
  const {
    usersSeenGuide,
    usersClickedCta,
    usersDismissed,
    usersSavedForLater,
    guidesViewed,
    completedAStep,
    guidesWithCompletedStep,
    averageStepsCompletedForEngaged,
    usersAnswered,
  } = template.stats;

  const isAccountGuide = template.type === GuideTypeEnum.account;
  const isUserGuide = template.type === GuideTypeEnum.user;
  const formFactor = template.formFactor as GuideFormFactor;
  const theme = template.theme as Theme;
  const { isCarousel, isVideoGallery } = useMemo(
    () => getGuideThemeFlags(theme),
    [theme]
  );

  const { organization } = useOrganization();
  const toast = useToast();
  const { accessToken } = useAccessToken();

  const isSingleStep = isSingleStepGuide(theme, formFactor);

  const stepDetailsHidden = areStepDetailsHidden(formFactor, theme);
  const splitSource = template.splitSources[0];

  const ctaStats: {
    actionStats?: StatCard;
    hasSaveForLaterCta: boolean;
    hasActionCta: boolean;
  } | null = useMemo(() => {
    if (!isSingleStep || isCarousel || isVideoGallery) return null;
    const ctas = template.modules?.[0].stepPrototypes?.[0].ctas || [];
    let actionCtasCount = 0;
    let actionCta: (typeof ctas)[number];
    let hasSaveForLaterCta = false;
    let hasActionCta = false;

    /**
     * Get the following CTAs:
     * - Save for later.
     * - Other action.
     */
    ctas.forEach((cta) => {
      if (cta.type === StepCtaType.save) {
        hasSaveForLaterCta = true;
      } else if (cta.type !== StepCtaType.skip) {
        actionCta = cta;
        actionCtasCount++;
        hasActionCta = true;
      }
    });

    if (!actionCta) return { hasSaveForLaterCta, hasActionCta };

    const ctaType = actionCta.type as StepCtaType;
    const title =
      actionCtasCount > 1 ? (
        <Box isTruncated>
          {pluralize(usersClickedCta, 'user')} clicked a CTA
        </Box>
      ) : (
        <Flex>
          {pluralize(usersClickedCta, 'user')} clicked "
          <Span title={actionCta.text} isTruncated>
            {actionCta.text}
          </Span>
          "
        </Flex>
      );
    const description = isUrlCta(ctaType) ? (
      <Box isTruncated>
        links to{' '}
        {actionCta.url ? (
          <Link
            href={actionCta.url}
            target="_blank"
            color="bento.bright"
            fontWeight="bold"
            isTruncated
          >
            {actionCta.url}
          </Link>
        ) : (
          '-'
        )}
      </Box>
    ) : ctaType === StepCtaType.launch ? (
      <Flex whiteSpace="nowrap">
        launches{' '}
        {actionCta.destinationGuideObj ? (
          <>
            "
            <Link
              href={`/library/templates/${actionCta.destinationGuideObj.entityId}`}
              target="_blank"
              color="bento.bright"
              fontWeight="bold"
              isTruncated
            >
              {actionCta.destinationGuideObj.name}
            </Link>
            "
          </>
        ) : (
          '-'
        )}
      </Flex>
    ) : ctaType === StepCtaType.event ? (
      <Flex whiteSpace="nowrap">
        fire event{' '}
        {actionCta.settings?.eventName ? (
          <>
            "
            <Span isTruncated fontStyle="italic">
              {actionCta.settings.eventName}
            </Span>
            "
          </>
        ) : (
          '-'
        )}
      </Flex>
    ) : ctaType === StepCtaType.skip || ctaType === StepCtaType.save ? (
      'mark step as complete'
    ) : undefined;

    return {
      hasSaveForLaterCta,
      hasActionCta,
      actionStats: {
        numerator: usersClickedCta,
        title,
        description,
        valueTooltip:
          usersClickedCta && usersSeenGuide
            ? `${getPercentage(
                usersClickedCta,
                usersSeenGuide
              )} of users who viewed`
            : '',
      },
    };
  }, [
    template,
    usersClickedCta,
    usersSeenGuide,
    isSingleStep,
    isCarousel,
    isVideoGallery,
  ]);

  const onRequestCsv = useCallback(
    (type: 'branching' | 'inputs') => async () => {
      try {
        const requestMethod =
          type === 'branching' ? requestBranchingCsv : requestGuideAnswersCsv;

        await requestMethod({
          organizationEntityId: organization.entityId,
          accessToken,
          templateEntityId: template.entityId,
          templateName: template.name,
        });

        toast({
          title: csvSuccessMsg,
          isClosable: true,
          status: 'success',
        });
      } catch (e: any) {
        toast({
          title: e.message || 'Something went wrong',
          isClosable: true,
          status: 'error',
        });
      }
    },
    [template.entityId, accessToken, template.name]
  );

  const {
    stepsCount,
    moduleBranchingStepPrototypes,
    hasInputStep,
    hasBranchingResults,
  } = useMemo(() => {
    const result = {
      stepsCount: 0,
      moduleBranchingStepPrototypes: [],
      hasInputStep: false,
      hasBranchingResults: false,
    };

    result.moduleBranchingStepPrototypes = (template.modules || []).flatMap(
      (m) => {
        const stepPrototypes = m.stepPrototypes || [];
        result.stepsCount += stepPrototypes.length;
        return stepPrototypes.reduce((acc, sp) => {
          const moduleBranch = sp.branchingPerformance?.length;
          if (moduleBranch) {
            result.hasBranchingResults = true;

            /**
             * Do not show the same step group multiple
             * times if it was set as a destination in multiple
             * branches.
             */
            const trackedModuleEntityIds: string[] = [];

            acc.push({
              ...sp,
              branchingPerformance: sp.branchingPerformance.filter((bp) => {
                const identifier: string =
                  bp.createdModule?.entityId || noPathId;
                const tracked = trackedModuleEntityIds.includes(identifier);
                trackedModuleEntityIds.push(identifier);
                return !tracked;
              }),
            });
          }
          if (isInputStep(sp.stepType as StepType)) {
            result.hasInputStep = true;
          }
          return acc;
        }, []);
      }
    );

    return result;
  }, [template]);

  const showBranchingPerformance =
    hasBranchingResults || template.branchingPerformance.length > 0;

  const show: GuideAnalyticsShow = {
    // Single step stats.
    usersSavedForLater: ctaStats?.hasSaveForLaterCta,
    usersDismissed: isSingleStep && !!template.formFactorStyle.canDismiss,
    usersSeenGuide:
      (isAccountGuide && !template.isCyoa) || isUserGuide || isSingleStep,
    ctaStats: !!ctaStats?.actionStats,
    // General stats.
    accountCards: isAccountGuide && !isSingleStep,
    userCards: isUserGuide && !isSingleStep,
    singleStepStats: isSingleStep,
    userInputAnswers: hasInputStep,
    splitTestStats: !!splitSource,
    accountProgressForUserGuides:
      isUserGuide && !isCarousel && !showBranchingPerformance,
    accountProgress: isAccountGuide || isCarousel || showBranchingPerformance,
    branchingPerformance: showBranchingPerformance,
    stepsPerformanceChart:
      !stepDetailsHidden &&
      !(
        template.isCyoa ||
        areStepDetailsHidden(
          template.formFactor as GuideFormFactor,
          template.theme as Theme
        )
      ),
    userActionsChart: isSingleStep && !isCarousel,
    actionCtas: ctaStats?.hasActionCta,
    branchingCard: template.branchedGuidesCount > 0,
  };

  const accountTableTitle =
    isUserGuide || isCarousel ? 'Account performance' : 'Account progress';

  const AccountTableComponent = (
    <TableRendererProvider>
      <AnalyticsActiveGuidesTable
        templateEntityId={template.entityId}
        templateType={template.type}
        formFactor={formFactor}
        theme={theme}
        onRefetch={onRefetch}
      />
    </TableRendererProvider>
  );

  return (
    <Flex flexDir="column" gap="10" {...boxProps}>
      <GuideAnalyticsCallout />
      {(show.accountCards || show.userCards || show.singleStepStats) && (
        <Flex flexDir="column" gap="4">
          <H4 color={colors.text.secondary} display="flex" whiteSpace="nowrap">
            Overview{' '}
            <PopoverTip placement="top" withPortal>
              Analytics data is updated daily
            </PopoverTip>
          </H4>
          <Flex gap={px(statCardsGapPx)} flexWrap="wrap">
            {show.usersSeenGuide &&
              (isAccountGuide ? (
                <StatCard
                  numerator={guidesViewed}
                  valueTooltip={`${usersSeenGuide} ${pluralize(
                    usersSeenGuide,
                    'user'
                  )} viewed`}
                  title={`${pluralize(guidesViewed, 'account')} viewed`}
                />
              ) : (
                <StatCard
                  numerator={usersSeenGuide}
                  title={`${pluralize(usersSeenGuide, 'user')} viewed`}
                />
              ))}
            {show.accountCards && (
              <>
                <StatCard
                  numerator={guidesWithCompletedStep}
                  valueTooltip={
                    guidesWithCompletedStep
                      ? `${getPercentage(
                          guidesWithCompletedStep,
                          guidesViewed
                        )} of accounts that viewed`
                      : ''
                  }
                  title={`${pluralize(
                    guidesWithCompletedStep,
                    'account'
                  )} engaged`}
                  description={`${pluralize(
                    guidesWithCompletedStep,
                    'account'
                  )} completed 1+ steps`}
                />
                <StatCard
                  numerator={averageStepsCompletedForEngaged}
                  denominator={stepsCount}
                  title="avg step progress"
                  valueTooltip="This only includes core guides steps"
                  description="for accounts with 1+ steps completed"
                />
              </>
            )}
            {show.userCards && (
              <>
                <StatCard
                  numerator={completedAStep}
                  valueTooltip={
                    completedAStep
                      ? `${getPercentage(
                          completedAStep,
                          guidesViewed
                        )} of users who viewed`
                      : ''
                  }
                  title={`${pluralize(completedAStep, 'user')} engaged`}
                  description={`${pluralize(
                    completedAStep,
                    'user'
                  )} completed 1+ steps`}
                />
                <StatCard
                  numerator={averageStepsCompletedForEngaged}
                  denominator={stepsCount}
                  title="avg steps completed"
                  valueTooltip="This only includes core guides steps"
                  description="for users with 1+ steps completed"
                />
              </>
            )}
            {show.userInputAnswers && (
              <StatCard
                numerator={usersAnswered}
                title={`user ${pluralize(usersAnswered, 'response')}`}
                description={
                  usersAnswered > 0 && (
                    <CSVRequestButton
                      label={<b>download responses</b>}
                      onRequest={onRequestCsv('inputs')}
                    />
                  )
                }
              />
            )}
            {show.branchingCard && (
              <StatCard
                numerator={template.branchedGuidesCount}
                title={`${pluralize(
                  template.branchedGuidesCount,
                  isAccountGuide ? 'account' : 'user'
                )} picked a branching path`}
                description={
                  template.branchedGuidesCount > 0 && (
                    <CSVRequestButton
                      label={<b>download choices</b>}
                      onRequest={onRequestCsv('branching')}
                    />
                  )
                }
              />
            )}
            {show.ctaStats && <StatCard {...ctaStats.actionStats} />}
            {show.usersSavedForLater && (
              <StatCard
                numerator={usersSavedForLater}
                valueTooltip={
                  usersSavedForLater
                    ? `${getPercentage(
                        usersSavedForLater,
                        usersSeenGuide
                      )} of users who viewed`
                    : ''
                }
                title={`${pluralize(
                  usersSavedForLater,
                  'user'
                )} saved for later`}
              />
            )}
            {show.usersDismissed && (
              <StatCard
                numerator={usersDismissed}
                valueTooltip={
                  usersDismissed
                    ? `${getPercentage(
                        usersDismissed,
                        usersSeenGuide
                      )} of users who viewed`
                    : ''
                }
                title={`${pluralize(usersDismissed, 'user')} dismissed`}
              />
            )}
          </Flex>
        </Flex>
      )}
      {show.splitTestStats && (
        <Accordion allowToggle>
          <AccordionItem border="none">
            <AccordionButton pl="0" border="none" py="2">
              <AccordionIcon mr="4" fontSize="2xl" />
              <H4
                color={colors.text.secondary}
                display="flex"
                whiteSpace="nowrap"
              >
                During the Split Test:{' '}
                {splitTestNameOrFallback(splitSource.name)}{' '}
                {splitSource.lastUsedAt && (
                  <PopoverTip placement="top" withPortal>
                    {splitSource.splitTestState === SplitTestState.stopped
                      ? `Test was from ${dateFormatter.format(
                          new Date(splitSource.lastUsedAt)
                        )} to ${dateFormatter.format(
                          new Date(splitSource.updatedAt)
                        )}`
                      : `Test was launched ${dateFormatter.format(
                          new Date(splitSource.lastUsedAt)
                        )}`}
                  </PopoverTip>
                )}
                <Flex ml="4">
                  <SplitTestStatus
                    state={splitSource.splitTestState as SplitTestState}
                  />
                </Flex>
              </H4>
            </AccordionButton>
            <AccordionPanel p="0" mt="2">
              <Flex
                p="8"
                border="1px solid #E3E8F0"
                borderRadius="lg"
                gap="10"
                flexDir="column"
              >
                {splitSource.splitTargets.map((splitTarget) => {
                  const isSelf = splitTarget?.entityId === template.entityId;
                  return (
                    <TemplateCard
                      template={splitTarget as any}
                      nameOverride={isSelf ? <i>This guide</i> : undefined}
                      descriptionOverride={isSelf ? '' : undefined}
                      minH="92px"
                      maxW="800px"
                      border="none"
                      p="0"
                    >
                      <GuideAnalyticsComponent
                        templateEntityId={splitSource.entityId}
                        template={splitTarget as any}
                        gap={15}
                        flexDir={['column', 'column', 'row', 'row']}
                        flexWrap="wrap"
                        onRefetch={() => {}}
                        overrideIsSplitTest
                      />
                    </TemplateCard>
                  );
                })}
              </Flex>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      )}
      {show.userActionsChart && (
        <UserActionsChart template={props.template} show={show} />
      )}
      {show.stepsPerformanceChart && (
        <StepsPerformanceChart template={props.template} theme={theme} />
      )}
      {show.accountProgressForUserGuides && (
        <Flex flexDir="column" flex="1">
          <H4 color={colors.text.secondary} pb={4}>
            {accountTableTitle}
          </H4>
          {AccountTableComponent}
        </Flex>
      )}
      {(show.accountProgress || show.branchingPerformance) && (
        <Flex
          gap="4"
          flexDir={['column', 'column', 'column', 'row']}
          maxHeight="1000px"
        >
          {show.accountProgress && (
            <Flex flexDir="column" flex="1" maxW="700">
              <H4 color={colors.text.secondary} pb={4}>
                {accountTableTitle}
              </H4>
              {AccountTableComponent}
            </Flex>
          )}
          {show.branchingPerformance && (
            <Flex flexDir="column" flex="1" gap="4" maxW="700">
              <H4 color={colors.text.secondary} display="flex" pb={4}>
                Branching performance{' '}
                {!template.isCyoa && (
                  <PopoverTip placement="top" withPortal>
                    Completion rates include all places where the step group is
                    used
                  </PopoverTip>
                )}
              </H4>
              <TableRendererProvider>
                <TemplateBranchingPerformance
                  moduleBranchingStepPrototypes={moduleBranchingStepPrototypes}
                  detachedBranchingStepPerformance={
                    template.branchingPerformance
                  }
                  guideType={template.type as GuideTypeEnum}
                  isCyoa={template.isCyoa}
                />
              </TableRendererProvider>
            </Flex>
          )}
        </Flex>
      )}
    </Flex>
  );
}

export default function GuideAnalyticsQueryRenderer(cProps: CProps) {
  const { templateEntityId } = cProps;
  return (
    <QueryRenderer<GuideAnalyticsQuery>
      query={GUIDE_ANALYTICS_QUERY}
      variables={{
        templateEntityId,
        useLocked: false,
      }}
      fetchPolicy="store-and-network"
      render={({ props, retry }) => {
        if (props)
          return (
            <GuideAnalytics
              {...cProps}
              {...props}
              minH={['1000px', '720px']}
              maxW={px(containerMaxWidthPx)}
              minW={px(statCardWidthPx)}
              pt="4"
              onRefetch={retry}
            />
          );

        return <BentoLoadingSpinner h="70vh" size={TABLE_SPINNER_SIZE} />;
      }}
    />
  );
}
